<script>
  import * as libreddit from "../lib/reddit";

  export let article;

  $: embedType = libreddit.getEmbedType(article);
</script>

{#if embedType === 'image'}
  <img src={article.url} alt={article.title} />
{:else if embedType === 'self'}
  <p>{article.selftext}</p>
{:else if embedType === 'link'}
  <a href={article.url}>{article.title}</a>
{/if}