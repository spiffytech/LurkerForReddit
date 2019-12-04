<script>
  import unescape from 'lodash/unescape';
  import { onMount } from "svelte";

  import CommentPreview from './CommentPreview.svelte';

  import * as libreddit from "../lib/reddit";

  export let article;

  let articleParent = null;
  let hasLoaded = false;

  let comments = [];
  let commentsLoaded = false;

  async function loadComments() {
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

  onMount(() => {
    const observer = new IntersectionObserver(entries => {
      hasLoaded = hasLoaded || entries[0].isIntersecting;
      if (entries[0].isIntersecting && !commentsLoaded) {
        localStorage.setItem(`read:${article.id}`, JSON.stringify(true));
      }
    }, {root: null, rootMargin: "500px 0px 500px 0px"});
    observer.observe(articleParent);
  });

  loadComments();

  $: console.log("comments", comments);

  if (article.preview && !article.preview.images[0].resolutions.length)
    console.log(article.preview.images[0]);

  if (!getPreview()) console.log('thumbnail', article.thumbnail);
</script>

<style>
  article img {
    width: 100%;
    height: auto;
  }
</style>

<article
  class="flex-100 flex flex-col justify-end mb-3"
  bind:this={articleParent}>
  <header class="border rounded-lg p-2 bg-white">
    <p class="flex justify-between">
      <span>{article.title}</span>
      <span class="whitespace-no-wrap ml-5">
        {article.score} / {article.num_comments}
      </span>
    </p>
    <p class="text-gray-500 text-xs">({article.domain})</p>
    <div class="mt-2">
      {#if hasLoaded}
        {#if getPreview()}
          <img
            class="rounded-lg"
            src={unescape(getPreview())}
            alt={article.title} />
        {:else if article.thumbnail !== 'self'}
          <img src={article.thumbnail} alt={article.title} />
        {/if}
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
