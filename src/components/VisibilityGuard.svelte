<script>
  import { onMount } from "svelte";

  export let onVisible = null;
  export let onVisibleDelay = 1000;

  let el = null;

  let visible = false;
  let hasBeenVisible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        visible = entries[0].isIntersecting;
        hasBeenVisible = hasBeenVisible || visible;

        // Only run onVisible() if we're still visible after a delay. Prevents
        // calling onVisible for a bunch of empty, contentless, collapsed divs
        // while content is loading just because they're all on-screen.
        if (visible && onVisible)
          setTimeout(() => {
            if (visible) onVisible();
          }, onVisibleDelay);
      },
      { root: null, rootMargin: "500px 0px 500px 0px" }
    );
    observer.observe(el);
  });
</script>

<div bind:this={el}>
  <slot {visible} {hasBeenVisible} />
</div>
