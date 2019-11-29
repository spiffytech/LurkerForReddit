<script>
  import page from "page";
  import { setContext } from "svelte";

  import Home from "./views/Home.svelte";
  import FourOhFour from './views/404.svelte';

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
  page('*', setRoute(FourOhFour));
  page();

  const url = document.URL;
  if (redditAuth.isAuthUrl(url)) {
	  redditAuth.handleAuthUrl(url);
	  page('/');
  }
  const accessToken = redditAuth.retrieveAccessToken();

  setContext("accessToken", accessToken);
</script>

{#if component}
  <svelte:component this={component} {params} />
{:else} 
  <p>Loading the app...</p>
{/if}