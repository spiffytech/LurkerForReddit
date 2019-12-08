<script>
  import unescape from "lodash/unescape";
  import { getContext, onMount } from "svelte";

  import CommentPreview from "./CommentPreview.svelte";
  import VisibilityGuard from "./VisibilityGuard.svelte";

  import * as libreddit from "../lib/reddit";

  export let article;

  const accessToken = getContext('accessToken');

  let articleIsRead = localStorage.getItem(`read:${article.id}`) !== null;

  let comments = [];
  let commentsLoaded = false;

  async function loadComments() {
    if (comments.length > 0) return;

    const loadedComments = await libreddit.getComments(
      accessToken,
      article.subreddit,
      article.id
    );
    comments = loadedComments.comments;
    commentsLoaded = true;
  }

  function getPreview() {
    if (
      !article.preview ||
      !article.preview.enabled ||
      !article.preview.images.length
    )
      return;
    const resolutions = article.preview.images[0].resolutions;
    if (resolutions.length === 0) return article.preview.images[0].source.url;
    return resolutions[resolutions.length - 1].url;
  }

  function markRead(article) {
    localStorage.setItem(`read:${article.id}`, JSON.stringify(true));
    articleIsRead = true;
  }

  let loadedImages = {};
</script>

<VisibilityGuard
  let:hasBeenVisible
  onVisible={() => {
    loadComments();
    markRead(article);
  }}>
  <article
    class="flex-100 flex flex-col justify-end mb-3">
    <header
      class="border rounded-lg p-2"
      class:bg-white={!articleIsRead}
      class:bg-gray-200={articleIsRead}
    >
      <p>
        <span class="whitespace-no-wrap ml-5 float-right">
          &udarr; {article.score} / 🗩 {article.num_comments}
        </span>
        <span>{article.title}</span>
      </p>
      <p class="text-gray-500 text-xs">({article.domain})</p>
      <div class="mt-2">
        {#if getPreview()}
          <img
            class="rounded-lg w-full h-auto"
            on:load={() => (loadedImages = { ...loadedImages, [getPreview()]: true })}
            src={hasBeenVisible ? unescape(getPreview()) : null}
            style={loadedImages[getPreview()] ? '' : 'padding-bottom: 100%'}
            alt={article.title} />
        {:else if article.thumbnail !== 'self'}
          <img
            src={hasBeenVisible ? article.thumbnail : null}
            class="rounded-lg w-full h-auto"
            alt={article.title}
            on:load={() => (loadedImages = { ...loadedImages, [article.thumbnail]: true })}
            style={loadedImages[article.thumbnail] ? '' : 'padding-bottom: 100%'} />
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
