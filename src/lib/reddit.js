import axios from "axios";
import * as querystring from "querystring";

import * as redditAuth from "./redditAuth";

/**
 * @param {string} path
 * @param {{token: string, expires: number}} token
 */
export async function get(path, token) {
  console.log("token", token);
  if (token.expires <= Date.now()) await redditAuth.refreshToken(token);
  const response = await axios.get(`https://oauth.reddit.com/${path}`, {
    headers: { Authorization: `bearer ${token.token}` }
  });

  return response.data.data;
}

/**
 * @param {string} path
 * @param {{token: string, expires: number}} token
 * @param {any} body
 */
export async function post(path, token, body) {
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

export function getEmbedType(data) {
  if (data.post_hint === "image") return "image";
  else if (data.post_hint === "link") return "link";
  else if (data.selftext) return "self";
  else if (data.post_hint === "hosted:video") return "video";
}

/**
 * @param {string} subreddit
 * @param {string} id
 */
export async function getComments(subreddit, id) {
  const response = await axios.get(
    `https://www.reddit.com/r/${subreddit}/comments/${id}/.json`
  );
  return {
    article: response.data[0].data.children[0].data,
    comments: response.data[1].data.children
  };
}

/**
 * @param {string} fullName
 * @param {0 | 1 | -1} dir
 */
export async function vote(token, fullName, dir) {
  return post("api/vote", token, { dir, id: fullName });
}
