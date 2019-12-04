import axios from "axios";

import * as redditAuth from './redditAuth';

/**
 * @param {string} path
 * @param {{token: string, expires: number}} token
 */
export async function get(path, token) {
    console.log('token', token);
    if (token.expires <= Date.now()) await redditAuth.refreshToken(token);
    const response = await axios.get(`https://oauth.reddit.com/${path}`, {
      headers: { Authorization: `bearer ${token.token}` }
    });

    return response.data.data;
}

export function getEmbedType(data) {
  if (data.post_hint === 'image') return 'image';
  else if (data.post_hint === 'link') return 'link';
  else if (data.selftext) return 'self';
  else if (data.post_hint === 'hosted:video') return 'video';
}

/**
 * @param {string} subreddit
 * @param {string} id
 */
export async function getComments(subreddit, id) {
  const response = await axios.get(`https://www.reddit.com/r/${subreddit}/comments/${id}/.json`);
  return { article: response.data[0].data.children[0].data, comments: response.data[1].data.children };
}