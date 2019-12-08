<script>
  import unescape from "lodash/unescape";
  import { onMount } from 'svelte';

  export let comment;

  let commentRef = null;

  onMount(() => {
    const ps = commentRef.querySelectorAll('p');
    ps.forEach(p => p.className += 'break-words');

    const as = commentRef.querySelectorAll('a');
    as.forEach(a => a.className += 'underline');
  });
</script>

<div class="pl-3">
  <article class="mb-5">
    <header class="flex justify-between text-gray-700 italic">
      <span>{comment.data.author}</span>
      <span>&udarr; {comment.data.score}</span>
    </header>

    <div style="display: contents;" bind:this={commentRef}>
      {@html unescape(comment.data.body_html)}
    </div>
  </article>

  {#if comment.data.replies}
    {#each comment.data.replies.data.children.filter(c => c.kind !== 'more') as subcomment (subcomment.id)}
      <svelte:self comment={subcomment} />
    {/each}
  {/if}
</div>
