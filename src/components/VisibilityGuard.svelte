<script>
  import { onMount } from "svelte";

  export let onVisible = new Map();

  let el = null;

  let visible = false;
  let hasBeenVisible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        visible = entries[0].isIntersecting;

        // Only run onVisible() if we're still visible after a delay. Prevents
        // calling onVisible for a bunch of empty, contentless, collapsed divs
        // while content is loading just because they're all on-screen.
        if (visible && !hasBeenVisible) {
          console.log('setting a timeout')
          Array.from(onVisible.entries()).map(([time, fn]) => {
            setTimeout(() => {
              if (visible) fn();
            }, time);
          });
        }

        hasBeenVisible = hasBeenVisible || visible;
      },
      { root: null, rootMargin: "0px 0px 500px 0px" }
    );
    observer.observe(el);
  });
</script>

<div bind:this={el}>
  <slot {visible} {hasBeenVisible} />
</div>
