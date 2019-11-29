import fromPairs from "lodash/fromPairs";

/**
 * @param {string} url
 */
export function isAuthUrl(url) {
  return url.includes("access_token");
}

/**
 * @param {string} url
 */
export function handleAuthUrl(url) {
  const anchor = url.split("#")[1];
  const authResponse = fromPairs(anchor.split("&").map(kv => kv.split("=")));
  localStorage.setItem("accessToken", authResponse.access_token);
  localStorage.setItem(
    "accessTokenExpires",
    (Date.now() + parseInt(authResponse.expires_in) * 1000).toString()
  );
}

export function retrieveAccessToken() {
  return {
    token: localStorage.getItem("accessToken"),
    expires: parseInt(
      /** @type {string!} */ (localStorage.getItem("accessTokenExpires"))
    )
  };
}
