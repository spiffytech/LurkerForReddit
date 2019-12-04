<script>
  import * as libreddit from "../lib/reddit";

  import Comment from "../components/Comment.svelte";
  import Embed from "./Embed.svelte";

  export let articleId = null;
  export let subreddit = null;

  $: articleP = libreddit.getComments(subreddit, articleId);
</script>

{#await articleP}
  <p>Loading</p>
{:then article}
  <a href={`https://reddit.com${article.article.permalink}`} target="_blank">
    <header class="text-lg">{article.article.title}</header>
  </a>

  <Embed article={article.article} />

  {#each article.comments as comment (comment.data.id)}
    <Comment {comment} />
  {/each}
{:catch ex}
  <p>{ex.message}</p>
{/await}
