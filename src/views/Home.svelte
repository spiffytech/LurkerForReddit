<script>
  import page from "page";
  import { getContext, onMount } from "svelte";

  import FullArticle from "./FullArticle.svelte";
  import Article from "../components/Article.svelte";
  import Dialog from "../components/Dialog.svelte";
  import VisibilityGuard from "../components/VisibilityGuard.svelte";

  import * as libreddit from "../lib/reddit";
  import { feed, scrollEnd } from "../lib/stores";

  export let params;
  export let queryString;

  const accessToken = getContext("accessToken");

  let mySubscriptions = [];
  let loadedSubreddit = null;

  let footerParent = null;

  function makeUrlBase() {
      return params.subreddit
        ? `r/${params.subreddit}`
        : "";
  }

  async function getHomepage(after = $scrollEnd) {
    const response = (await libreddit.get(
      `${makeUrlBase()}?limit=25${after ? `&after=${after}` : ""}`,
      accessToken
    )).data;
    const unreadEntries = response.children.filter(
      article => localStorage.getItem(`read:${article.data.id}`) === null
    );
    if (unreadEntries.length === 0) {
      return getHomepage(response.after);
    }
    $feed = [...$feed, ...unreadEntries];
    $scrollEnd = response.after;
    loadedSubreddit = params.subreddit;
  }

  onMount(async () => {
    const footerObserver = new IntersectionObserver(entries => {
      console.log(entries[0]);
      if (entries[0].isIntersecting) getHomepage();
    });
    footerObserver.observe(footerParent);

    const subs = await libreddit.getMySubscriptions(accessToken);
    mySubscriptions = subs.data.children.map(child => ({title: child.data.title, url: child.data.url}));
  });

  $: {
    if (params.subreddit !== loadedSubreddit) {
      $feed = [];
      $scrollEnd = null;
      getHomepage();
    }
  }
</script>

<nav>
  <select value={params.subreddit ? '/r/' + params.subreddit : null} on:change={event => event.target.value === 'null' ? page('/') : page(event.target.value)} class="border">
    <option value={null}>Home</option>
    {#each mySubscriptions as subscription (subscription.url)}
      <option value={subscription.url} selected={subscription.url === '/r/' + params.subreddit + '/'}>{subscription.url} - {subscription.title}</option>
    {/each}
  </select>
</nav>
<div class="flex">
  <div class="bg-gray-500 flex-1 h-screen overflow-scroll p-3">
      {#each $feed as child (child.data.id)}
        <a href={`#!${makeUrlBase()}?subreddit=${child.data.subreddit}&id=${child.data.id}`}>
          <Article article={child.data} />
        </a>
      {:else}
      <p>Loading homepage...</p>
      {/each}
    <div bind:this={footerParent}>
      <div class="italic text-grey-500">Loading more content...</div>
    </div>
  </div>

  <div class="flex-1 h-screen overflow-scroll p-3 bg-gray-500">
    {#if queryString.subreddit && queryString.id}
      <FullArticle
        articleId={queryString.id}
        subreddit={queryString.subreddit} />
    {/if}
  </div>
</div>
