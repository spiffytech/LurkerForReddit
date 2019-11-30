<script>
  import { onMount } from "svelte";

  import CommentPreview from './CommentPreview.svelte';

  import * as libreddit from "../lib/reddit";

  export let article;
  export let onClick;

  let articleParent = null;
  let visible = false;

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

  onMount(() => {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (entries[0].isIntersecting && !commentsLoaded) loadComments();
    }, {root: null, rootMargin: "500px 0px 500px 0px"});
    observer.observe(articleParent);
  });

  $: console.log("comments", comments);
</script>

<style>
  article img {
    width: 100%;
    height: auto;
  }
</style>

<article
  class="flex-100 flex flex-col justify-end mb-3"
  on:click={() => onClick(comments)}
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
      {#if article.preview && article.preview.enabled && article.preview.images.length}
        <img
          class="rounded-lg"
          src={visible ? article.preview.images[0].resolutions[article.preview.images[0].resolutions.length- 1].url.replace('&amp;', '&') : null}
          alt={article.title} />
      {:else if article.thumbnail !== 'self'}
        <img src={visible ? article.thumbnail : null} alt={article.title} />
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
