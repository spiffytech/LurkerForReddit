<script>
  import page from "page";
  import { setContext } from "svelte";

  import Home from "./views/Home.svelte";
  import FourOhFour from "./views/404.svelte";

  import * as redditAuth from "./lib/redditAuth";

  let component = null;
  let params = null;

  function setRoute(component_) {
    return function(params_) {
      component = component_;
      params = params_;
    };
  }

  page("/", setRoute(Home));
  page("/r/:subreddit/:id", setRoute(Home));
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
    if (!accessToken.token) {
      window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_APP_ID}&state=0.24722490017302334&redirect_uri=${process.env.APP_URL}&response_type=code&scope=identity history mysubreddits read save submit subscribe vote&duration=permanent`
    }
  }

$: setContext("accessToken", accessToken);
</script>

{#if error}
  <p>{error}</p>
{:else}
  {#if accessToken && component}
    <svelte:component this={component} {params} />
  {:else}
    <p>Loading the app...</p>
  {/if}
{/if}
