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

  const accessToken = getContext("accessToken");

  let footerParent = null;

  async function getHomepage(after=$scrollEnd) {
    const response = (await libreddit.get(
      `?limit=25${after ? `&after=${after}` : ""}`,
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
  }

  onMount(() => {
    const footerObserver = new IntersectionObserver(entries => {
      console.log(entries[0]);
      if (entries[0].isIntersecting) getHomepage();
    });
    footerObserver.observe(footerParent);
  });
</script>

<div class="flex">
<div class="bg-gray-500 flex-1 h-screen overflow-scroll p-3">
  {#if $feed.length === 0}
    <p>Loading homepage...</p>
  {:else}
    {#each $feed as child (child.data.id)}
      <a href={`#!r/${child.data.subreddit}/${child.data.id}`}>
        <Article article={child.data} />
      </a>
    {/each}
  {/if}
  <div bind:this={footerParent}>
    <div class="italic text-grey-500">Loading more content...</div>
  </div>
</div>

<div class="flex-1 h-screen overflow-scroll p-3 bg-gray-500">
  {#if params.params.id}
    <FullArticle articleId={params.params.id} subreddit={params.params.subreddit} />
  {/if}
</div>
</div>