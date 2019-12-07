<script>
  import unescape from "lodash/unescape";

  export let comment;
</script>

<div class="pl-3">
  <article class="mb-5">
    <header class="flex justify-between text-gray-700 italic">
      <span>{comment.data.author}</span>
      <span>&udarr; {comment.data.score}</span>
    </header>

    {@html unescape(comment.data.body_html)}
  </article>

  {#if comment.data.replies}
    {#each comment.data.replies.data.children.filter(c => c.kind !== 'more') as subcomment (subcomment.id)}
      <svelte:self comment={subcomment} />
    {/each}
  {/if}
</div>
