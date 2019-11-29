import axios from "axios";

/**
 * @param {string} path
 * @param {{token: string, expires: number}} token
 */
export async function get(path, token) {
    console.log('token', token);
    if (token.expires <= Date.now()) throw new Error('Token has expired');
    const response = await axios.get(`https://oauth.reddit.com/${path}`, {
      headers: { Authorization: `bearer ${token.token}` }
    });

    return response.data.data;
}