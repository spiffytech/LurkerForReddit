<script>
  import unescape from 'lodash/unescape';
  import { onMount } from "svelte";

  import CommentPreview from './CommentPreview.svelte';
  import VisibilityGuard from './VisibilityGuard.svelte';

  import * as libreddit from "../lib/reddit";

  export let article;

  let comments = [];
  let commentsLoaded = false;

  async function loadComments() {
    if (comments.length > 0) return;

    const loadedComments = await libreddit.getComments(
      article.subreddit,
      article.id
    );
    comments = loadedComments.comments;
    commentsLoaded = true;
  }

  function getPreview() {
    if (!article.preview || !article.preview.enabled || !article.preview.images.length) return;
    const resolutions = article.preview.images[0].resolutions;
    if (resolutions.length === 0) return article.preview.images[0].source.url;
    return resolutions[resolutions.length - 1].url;
  }
</script>

<style>
  article img {
    width: 100%;
    height: auto;
  }
</style>

<VisibilityGuard let:hasBeenVisible onVisible={() => { loadComments(); localStorage.setItem(`read:${article.id}`, JSON.stringify(true))}}>
  <article
    class="flex-100 flex flex-col justify-end mb-3" style='min-height: 200px;'>
    <header class="border rounded-lg p-2 bg-white">
      <p class="flex justify-between">
        <span>{article.title}</span>
        <span class="whitespace-no-wrap ml-5">
          &udarr; {article.score} / 🗩 {article.num_comments}
        </span>
      </p>
      <p class="text-gray-500 text-xs">({article.domain})</p>
      <div class="mt-2">
        {#if getPreview()}
          <img
            class="rounded-lg"
            src={unescape(getPreview())}
            alt={article.title} />
        {:else if article.thumbnail !== 'self'}
          <img src={article.thumbnail} alt={article.title} />
        {/if}
      </div>
      <p>{article.subreddit_name_prefixed}</p>
    </header>
    <section class="mx-3 bg-gray-300 rounded-b-lg">
      {#each comments.slice(0, 2) as comment, i (comment.data.id)}
        <CommentPreview {comment} last={i === 1} />
      {/each}
    </section>
  </article>
</VisibilityGuard>
