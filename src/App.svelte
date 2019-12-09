<script>
  import page from "page";
  import queryString from 'query-string';
  import { setContext } from "svelte";

  import Home from "./views/Home.svelte";
  import FourOhFour from "./views/404.svelte";

  import * as redditAuth from "./lib/redditAuth";

  let component = null;
  let params = null;
  let query = null;

  function setRoute(component_) {
    return function(params_) {
      component = component_;
      params = params_;
      query = queryString.parse(params.querystring);
      console.log('params', params_);
    };
  }

  page("/", setRoute(Home));
  page("/r/:subreddit", setRoute(Home));
  page("*", setRoute(FourOhFour));
  page({hashbang: true});

  const url = document.URL;
  let accessToken = null;
  let error = null;

  async function handleAuthUrl(url) {
    try {
      await redditAuth.handleAuthUrl(url);
    } catch (ex) {
      if (ex.message === 'Network Error') {
        error = 'Call to Reddit was blocked. Do you have tracking protection on?'
      } else {
        error = ex.message;
      }
      return;
    }
		const access_token = redditAuth.retrieveAccessToken();
		console.log('Received', access_token);
    accessToken = access_token;
    page("/");
  }

  if (redditAuth.isAuthUrl(url)) {
    handleAuthUrl(url);
  } else {
    accessToken = redditAuth.retrieveAccessToken();
  }

$: setContext("accessToken", accessToken);

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', process.env.GOOGLE_ANALYTICS_TRACKING_ID);
</script>

{#if error}
  <p>{error}</p>
{:else}
  {#if accessToken && component}
    <svelte:component this={component} params={params.params} queryString={query} />
  {:else}
    <p>Loading the app...</p>
  {/if}
{/if}

<footer>
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TRACKING_ID}`}></script>
</footer>