<script>
  import unescape from "lodash/unescape";
  import { afterUpdate } from "svelte";

  export let comment;
  export let isPreview = false;

  let commentRef = null;

  function addClassToEls(ref, selector, classes) {
    const els = ref.querySelectorAll(selector);
    els.forEach(el => (el.className += " " + classes));
  }

  afterUpdate(() => {
    addClassToEls(commentRef, "p", "break-words mb-3");
    addClassToEls(commentRef, "a", "underline");
    addClassToEls(
      commentRef,
      "blockquote",
      "pl-2 border-l-2 border-gray-500 border-dashed"
    );
  });
</script>

<div
  class:pl-3={!isPreview}
  class:border-l={!isPreview && comment.data.depth !== 0}
  class:border-black={!isPreview}>
  <article
    class="mb-5"
    on:click|preventDefault={() => console.log(comment.data)}>
    <header class="flex justify-between text-gray-700 italic">
      <span class:font-bold={comment.data.is_submitter}>{comment.data.author}</span>
      <span>&udarr; {comment.data.score}</span>
    </header>

    <div style="display: contents;" class:text-gray-500={comment.data.score < -4} bind:this={commentRef}>
      {@html unescape(comment.data.body_html)}
    </div>
  </article>

  {#if comment.data.replies && !isPreview}
    {#each comment.data.replies.data.children.filter(c => c.kind !== 'more') as subcomment (subcomment.data.id)}
      <svelte:self comment={subcomment} />
    {/each}
  {/if}
</div>
