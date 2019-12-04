<script>
  import { getContext } from "svelte";

  import * as libreddit from "../lib/reddit";

  import Comment from "../components/Comment.svelte";
  import Embed from "./Embed.svelte";

  export let articleId = null;
  export let subreddit = null;

  const accessToken = getContext("accessToken");

  $: articleP = libreddit.getComments(subreddit, articleId);

  $: articleP.then(article => console.log("a", article.article));
</script>

{#await articleP}
  <p>Loading</p>
{:then article}
  <a href={`https://reddit.com${article.article.permalink}`} target="_blank">
    <header class="text-lg">{article.article.title}</header>
  </a>

  <button
    class="bg-white rounded-full text-3xl px-3 text-center align-middle"
    on:click|preventDefault={() => libreddit.vote(accessToken, article.article.name, 1)}>
    <span>&uparrow;</span>
  </button>

  <button
    class="bg-white rounded-full text-3xl px-3 text-center align-middle"
    on:click|preventDefault={() => libreddit.vote(accessToken, article.article.name, -1)}>
    <span>&downarrow;</span>
  </button>

  <Embed article={article.article} />

  {#each article.comments as comment (comment.data.id)}
    <Comment {comment} />
  {/each}
{:catch ex}
  <p>{ex.message}</p>
{/await}
