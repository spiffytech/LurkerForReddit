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
}