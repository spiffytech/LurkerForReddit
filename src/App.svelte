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
  page("*", setRoute(FourOhFour));
  page();

  const url = document.URL;
  let accessToken = null;
  if (redditAuth.isAuthUrl(url)) {
    redditAuth.handleAuthUrl(url).then(() => {
		const access_token = redditAuth.retrieveAccessToken();
		console.log('Received', access_token)
      accessToken = access_token;
      page("/");
    });
  } else {
	  accessToken = redditAuth.retrieveAccessToken();
  }

$: setContext("accessToken", accessToken);
</script>

{#if accessToken && component}
  <svelte:component this={component} {params} />
{:else}
  <p>Loading the app...</p>
{/if}
