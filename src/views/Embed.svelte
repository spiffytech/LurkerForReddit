<script>
  import unescape from 'lodash/unescape';

  import * as libreddit from "../lib/reddit";

  export let article;

  $: embedType = libreddit.getEmbedType(article);
</script>

{#if embedType === 'image'}
  <img src={article.url} alt={article.title} />
{:else if embedType === 'self'}
  <p class="bg-white rounded-lg p-3">{@html unescape(article.selftext_html)}</p>
{:else if embedType === 'link'}
  <a href={article.url} target="blank">🌎{article.title}</a>
{:else if embedType === 'video'}
  <video src={article.media.reddit_video.fallback_url} autoplay loop controls />
{/if}