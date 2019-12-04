<script>
  import { onMount } from 'svelte';

  export let onVisible = null;

  let el = null;

  let visible = false;
  let hasBeenVisible = false;

  onMount(() => {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      hasBeenVisible = hasBeenVisible || visible;
      if (visible && onVisible) onVisible();
    },
    { root: null, rootMargin: "500px 0px 500px 0px" }
    );
    observer.observe(el);
  });
</script>

<div bind:this={el}>
  <slot {visible} {hasBeenVisible} />
</div>