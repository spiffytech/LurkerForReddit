<script>
  import unescape from "lodash/unescape";

  export let comment;
  export let last;
</script>

<article
  class="m-2"
  class:border-dashed={!last}
  class:border-black={!last}
  class:border-b={!last}
  class:pb-3={!last}>
  <p class="flex justify-between">
    <span class="text-gray-700 italic">/u/{comment.data.author}</span>
    <span class="text-gray-700 italic">&udarr; {comment.data.score}</span>
  </p>
  <p>
    {@html unescape(comment.data.body_html)}
  </p>
</article>
