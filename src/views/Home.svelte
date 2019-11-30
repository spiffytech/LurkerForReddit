<script>
  import { getContext, onMount } from "svelte";

  import Embed from "./Embed.svelte";

  import * as libreddit from "../lib/reddit";

  const accessToken = getContext("accessToken");

  let homepage = [];
  let after = null;

  let activeArticle = null;

  let footerParent = null;
  let footerObserver = null;

  async function getHomepage() {
    const response = await libreddit.get(
      `?limit=2${after ? `&after=${after}` : ""}`,
      accessToken
    );
    homepage = [...homepage, ...response.children];
    after = response.after;
    console.log("homepage", homepage);
  }
  getHomepage();

  onMount(() => {
    footerObserver = new IntersectionObserver(entries => {
      getHomepage();
    });
    console.log("Observing", footerParent);
    footerObserver.observe(footerParent);
  });
</script>

<style>
  article img {
    width: 100%;
    height: auto;
  }
</style>

<div class="flex bg-gray-500">
  <div class="p-3 h-screen overflow-auto" style="flex: 1 0 0;">
    {#if homepage.length === 0}
      <p>Loading homepage...</p>
    {:else}
      {#each homepage as child (child.data.id)}
        <article
          class="flex-100 flex flex-col justify-end mb-3"
          on:click={() => {
            activeArticle = child;
            console.log(child);
          }}>
          <header class="border rounded-lg p-2 bg-white">
            <p>{child.data.id} {after}</p>
            <p class="flex justify-between">
              <span>{child.data.title}</span>
              <span class="whitespace-no-wrap ml-5">
                {child.data.score} / {child.data.num_comments}
              </span>
            </p>
            <p class="text-gray-500 text-xs">({child.data.domain})</p>
            <div class="mt-2">
              {#if child.data.preview && child.data.preview.enabled && child.data.preview.images.length}
                <img
                  class="rounded-lg"
                  src={child.data.preview.images[0].source.url.replace('&amp;', '&')}
                  alt={child.data.title} />
              {:else if child.data.thumbnail !== 'self'}
                <img src={child.data.thumbnail} alt={child.data.title} />
              {/if}
            </div>
            <p>{child.data.subreddit_name_prefixed}</p>
          </header>
        </article>
      {/each}
    {/if}
    <div bind:this={footerParent}>
      <div class="italic text-grey-500">Loading more content...</div>
    </div>
  </div>

  <div style="flex: 2 0 0;" class="h-screen overflow-auto">
    {#if activeArticle}
      <Embed article={activeArticle.data} />
    {/if}
  </div>
</div>
