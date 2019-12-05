import axios from "axios";
import * as querystring from "querystring";

import * as redditAuth from "./redditAuth";

interface Article {
  post_hint: string | null;
  selftext: string | null;
}

export async function get(path: string, token: redditAuth.AuthToken) {
  console.log("token", token);
  if (token.expires <= Date.now()) await redditAuth.refreshToken(token);
  const response = await axios.get(`https://oauth.reddit.com/${path}`, {
    headers: { Authorization: `bearer ${token.token}` }
  });

  return response.data.data;
}

export async function post(
  path: string,
  token: redditAuth.AuthToken,
  body: any
) {
  console.log("token", token);
  if (token.expires <= Date.now()) await redditAuth.refreshToken(token);
  const response = await axios.post(
    `https://oauth.reddit.com/${path}`,
    querystring.stringify(body),
    {
      headers: { Authorization: `bearer ${token.token}` }
    }
  );

  return response.data;
}

export function getEmbedType(data: Article) {
  if (data.post_hint === "image") return "image";
  else if (data.post_hint === "link") return "link";
  else if (data.selftext) return "self";
  else if (data.post_hint === "hosted:video") return "video";
}

export async function getComments(subreddit: string, id: string) {
  const response = await axios.get(
    `https://www.reddit.com/r/${subreddit}/comments/${id}/.json`
  );
  return {
    article: response.data[0].data.children[0].data,
    comments: response.data[1].data.children
  };
}

export async function vote(
  token: redditAuth.AuthToken,
  fullName: string,
  dir: -1 | 0 | 1
) {
  return post("api/vote", token, { dir, id: fullName });
}

export function mkReddit(
  authToken: redditAuth.AuthToken,
  setAuthToken: (token: redditAuth.AuthToken) => void
) {
  return {
    async getFeed(
      subreddit = null,
      lastSeenId: string | null = null
    ): Promise<{ articles: Article[]; lastSeenId: string }> {
      const response = await get(
        `${subreddit ? `/r/${subreddit}` : ''}.json?limit=25${lastSeenId ? `&after=${lastSeenId}` : ""}`,
        authToken
      );

      return { articles: response.children, lastSeenId: response.after };
    },

    vote(fullName: string, dir: -1 | 0 | 1) {
      return vote(authToken, fullName, dir);
    }
  };
}
