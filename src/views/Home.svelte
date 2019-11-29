<script>
  import { getContext } from "svelte";

  import * as libreddit from "../lib/reddit";

  const accessToken = getContext("accessToken");

  let homepage = null;

  async function getHomepage() {
    homepage = await libreddit.get("", accessToken);
    console.log("homepage", homepage);
  }
  getHomepage();
</script>

<style>
  .mason {
    display: flex;
    flex-wrap: wrap;
  }

  article {
    flex: 1 1 200px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  article img {
    width: 100%;
    height: auto;
  }
</style>

{#if !homepage}
  <p>Loading homepage...</p>
{:else}
  <div class="mason">
    {#each homepage.children as child}
      <article
        style="border: 1px solid black;">
        <div style="overflow: hidden; height: 300px">
          {#if child.data.preview && child.data.preview.enabled && child.data.preview.images.length}
            <img
              src={child.data.preview.images[0].source.url.replace('&amp;', '&')}
              alt={child.data.title} />
          {:else if child.data.thumbnail !== 'self'}
            <img src={child.data.thumbnail} alt={child.data.title} />
          {:else}
            <img
              src="https://placekitten.com/150/300"
              alt="Placeholder image" />
          {/if}
        </div>
        <p>{child.data.title}</p>
        <p>{child.data.subreddit} {child.data.ups} {child.data.num_comments}</p>
      </article>
    {/each}
  </div>
{/if}
