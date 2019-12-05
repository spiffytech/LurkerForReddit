import axios from "axios";
import Debug from 'debug';
import fromPairs from "lodash/fromPairs";
import * as React from "react";

import { mkReddit } from './reddit';

const debug = Debug('WebSnoo:redditAuth');

export interface AuthToken {
  token: string;
  expires: number;
  refreshToken: string;
}

export function isAuthUrl(url: string) {
  return url.includes("code") && url.includes("state");
}

export async function handleAuthUrl(url: string, onAuth: () => void) {
  const query = url.split("?")[1];
  const authResponse = fromPairs(
    query.split("&").map(kv => {
      const [k, v] = kv.split("=");
      return [k, v.split("#")[0]];
    })
  );

  debug("Parsed auth code: %o", authResponse);
  const response = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    `grant_type=authorization_code&code=${authResponse.code}&redirect_uri=${process.env.REACT_APP_APP_URL}`,
    { auth: { username: process.env.REACT_APP_REDDIT_APP_ID || "", password: "" } }
  );
  debug('Reponse from submitting the auth code: %o', response.data);
  if (response.data.error) throw new Error(response.data.error);
  localStorage.setItem("accessToken", response.data.access_token);
  localStorage.setItem("refreshToken", response.data.refresh_token);
  localStorage.setItem(
    "accessTokenExpires",
    (Date.now() + parseInt(response.data.expires_in) * 1000).toString()
  );

  onAuth();
}

export function retrieveAccessToken(): AuthToken | null {
  debug('Looking up access token from LocalStorage');
  const values = {
    token: localStorage.getItem("accessToken"),
    expires: parseInt(localStorage.getItem("accessTokenExpires") || ""),
    refreshToken: localStorage.getItem("refreshToken")
  };

  if (!values.token || !values.expires || !values.refreshToken) return null;
  return values as AuthToken;
}

export async function refreshToken(token: AuthToken) {
  const response = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    `grant_type=refresh_token&refresh_token=${token.refreshToken}`,
    { auth: { username: process.env.REACT_APP_REDDIT_APP_ID!, password: "" } }
  );
  token.token = response.data.access_token;
  token.expires = Date.now() + response.data.expires_in * 1000;
  localStorage.setItem("accessToken", token.token);
  localStorage.setItem("accessTokenExpires", token.expires.toString());
}

function checkTokenExpired(authToken: AuthToken | null) {
  if (authToken === null) return true;
  return authToken.expires <= Date.now();
}

export function useRedditAuth(onAuth: () => void) {
  const [authToken, setAuthToken] = React.useState<AuthToken | null>(null);
  const [reddit, setReddit] = React.useState<ReturnType<typeof mkReddit> | null>(null);
  const [redditError, setRedditError] = React.useState<string | null>(null);

  const isTokenExpired = checkTokenExpired(authToken);

  React.useEffect(() => {
    async function effectFn() {
      if (isTokenExpired) debug('Token is expired or null');

      if (isAuthUrl(window.location.href)) {
        debug('Handling auth URL');
        try {
          await handleAuthUrl(window.location.href, onAuth);
        } catch (ex) {
          if (ex.message === 'Network Error') {
            setRedditError('Call to Reddit was blocked. Do you have tracking protection on?');
          } else {
            debug('Error handling auth URL: %o', ex);
            setRedditError(ex.message);
          }
          return;
        }
      }

      if (authToken) {
        debug('No need to retrieve auth token');
        return;
      }
      const token = retrieveAccessToken();
      if (!token) {
        debug('Redirecting to Reddit to authenticate');
        window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REACT_APP_REDDIT_APP_ID}&state=0.24722490017302334&redirect_uri=${process.env.REACT_APP_APP_URL}&response_type=code&scope=identity history mysubreddits read save submit subscribe vote&duration=permanent`;
        return;
      }
      debug('Retrieved auth token from LocalStorage');

      if (isTokenExpired) {
        debug('Refreshing token');
        await refreshToken(token);
      }

      setAuthToken(token);
      setReddit(mkReddit(token, setAuthToken));
    }

    effectFn();
  }, [isTokenExpired, onAuth, authToken]);

  return { reddit, redditError };
}
