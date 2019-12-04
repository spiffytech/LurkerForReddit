<script>
  import { onMount } from 'svelte';

  let el = null;

  let visible = false;
  let hasBeenVisible = false;

  onMount(() => {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      hasBeenVisible = hasBeenVisible || visible;
    },
    { root: null, rootMargin: "500px 0px 500px 0px" }
    );
    observer.observe(el);
  });
</script>

<div style="display: contents;" bind:this={el}>
  <slot {visible} {hasBeenVisible} />
</div>