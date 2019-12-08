<script>
  import unescape from 'lodash/unescape';
  import { onMount } from 'svelte';

  import * as libreddit from "../lib/reddit";

  export let article;

  $: embedType = libreddit.getEmbedType(article);

  let selftextRef;

  onMount(() => {
    if (!selftextRef) return;

    const uls = selftextRef.querySelectorAll('ul');
    uls.forEach(ul => ul.className += 'list-disc list-inside');

    const ps = selftextRef.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
    ps.forEach(p => p.className += 'mt-3');
  });

</script>

{#if embedType === 'image'}
  <img src={article.url} alt={article.title} class="rounded-lg" />
{:else if embedType === 'imgurImage'}
  <!-- the png suffix is arbitrary, any extension seems to work. -->
  <img src={article.url + '.png'} alt={article.title} class="rounded-lg" />
{:else if embedType === 'self'}
  <p class="bg-white rounded-lg p-3" bind:this={selftextRef}>{@html unescape(article.selftext_html)}</p>
{:else if embedType === 'link'}
  <a href={article.url} target="blank">🌎{article.title}</a>
{:else if embedType === 'video'}
  <video src={article.media.reddit_video.fallback_url} autoplay loop controls />
{:else if embedType === 'imgurVideo'}
  <video src={article.url.replace(/\.gifv$/, '.mp4')} autoplay loop controls />
{/if}