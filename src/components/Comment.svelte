<script>
  import unescape from "lodash/unescape";

  export let comment;
</script>

<article class="bg-gray-300 m-3 p-3 rounded-lg">
  <header class="flex justify-between text-gray-700 italic">
    <span>{comment.data.author}</span>
    <span>&udarr; {comment.data.score}</span>
  </header>

  {@html unescape(comment.data.body_html)}

  {#if comment.data.replies}
    {#each comment.data.replies.data.children as subcomment (subcomment.id)}
      <svelte:self comment={subcomment} />
    {/each}
  {/if}
</article>
