import axios from 'axios';
import fromPairs from "lodash/fromPairs";
import map from 'lodash/map';

/**
 * @param {string} url
 */
export function isAuthUrl(url) {
  return url.includes("code") && url.includes('state');
}

/**
 * @param {string} url
 */
export async function handleAuthUrl(url) {
  const query = url.split("?")[1];
  const authResponse = fromPairs(query.split("&").map(kv => {
    const [k, v] = kv.split("=");
    return [k, v.split('#')[0]];
  }));

  console.log('authresponse', authResponse);
  const response = await axios.post('https://www.reddit.com/api/v1/access_token', `grant_type=authorization_code&code=${authResponse.code}&redirect_uri=https://websnoo.spiffy.tech`, {auth: {username: 'yswjAIdT1IQwmA', password: ''}})
  console.log(response.data)
  if (response.data.error) throw new Error(response.data.error);
  localStorage.setItem("accessToken", response.data.access_token);
  localStorage.setItem('refreshToken', response.data.refresh_token);
  localStorage.setItem(
    "accessTokenExpires",
    (Date.now() + parseInt(response.data.expires_in) * 1000).toString()
  );
}

export function retrieveAccessToken() {
  return {
    token: localStorage.getItem("accessToken"),
    expires: parseInt(
      /** @type {string!} */ (localStorage.getItem("accessTokenExpires"))
    ),
    refreshToken: localStorage.getItem('refreshToken')
  };
}

/**
 * @param {{token: string; expires: number; refreshToken: string}} token
 */
export async function refreshToken(token) {
  const response = await axios.post('https://www.reddit.com/api/v1/access_token', `grant_type=refresh_token&refresh_token=${token.refreshToken}`, {auth: {username: 'yswjAIdT1IQwmA', password: ''}})
  console.log('Refreshed data:', response.data);
  token.token = response.data.access_token;
  token.expires = Date.now() + response.data.expires_in * 1000;
  localStorage.setItem("accessToken", token.token);
  localStorage.setItem("accessTokenExpires", token.expires.toString());
}