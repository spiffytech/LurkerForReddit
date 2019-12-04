<script>
  import 'dialog-polyfill/dist/dialog-polyfill.css';
  import dialogPolyfill from 'dialog-polyfill';
  import { onMount } from 'svelte';

  let el = null;

  onMount(() => {
    dialogPolyfill.registerDialog(el);
    el.showModal();
  });
</script>

<dialog bind:this={el}><slot /></dialog>
