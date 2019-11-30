<script>
  import { getContext, onMount } from "svelte";

  import Article from "../components/Article.svelte";
  import Comment from '../components/Comment.svelte';
  import Embed from "./Embed.svelte";

  import * as libreddit from "../lib/reddit";

  const accessToken = getContext("accessToken");

  let homepage = [];
  let after = null;
  let articleParent = null;
  let visibleChildren = {};

  let activeArticle = null;
  let comments = [];

  let footerParent = null;

  async function getHomepage() {
    const response = await libreddit.get(
      `?limit=25${after ? `&after=${after}` : ""}`,
      accessToken
    );
    homepage = [...homepage, ...response.children];
    after = response.after;
    console.log("homepage", homepage);
  }

  function handleArticleClick(article, comments_) {
    activeArticle = article;
    comments = comments_;
    console.log(article);
  }

  onMount(() => {
    const footerObserver = new IntersectionObserver(entries => {
      console.log(entries[0]);
      if (entries[0].isIntersecting) getHomepage();
    });
    footerObserver.observe(footerParent);

    const articleObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        console.log('entry', entry);
        visibleChildren = {
          ...visibleChildren,
          [entry.target.getAttribute("data-id")]: entry.isIntersecting
        };
      });
    }, {root: null, rootMargin: '500px 0px 500px 0px'});
    articleObserver.observe(articleParent);
  });
</script>

<div class="flex bg-gray-500">
  <div class="p-3 h-screen overflow-auto" style="flex: 1 0 0;" bind:this={articleParent}>
    {#if homepage.length === 0}
      <p>Loading homepage...</p>
    {:else}
        {#each homepage as child (child.data.id)}
          <div data-id={child.data.id}>
            <Article
              article={child.data}
              onClick={(comments_) => handleArticleClick(child, comments_)}
              visible={visibleChildren[child.data.id]} />
          </div>
        {/each}
    {/if}
    <div bind:this={footerParent}>
      <div class="italic text-grey-500">Loading more content...</div>
    </div>
  </div>

  <div style="flex: 2 0 0;" class="h-screen overflow-auto m-3">
    {#if activeArticle}
      <a href={`https://reddit.com${activeArticle.data.permalink}`} target="blank"><header class="text-lg">{activeArticle.data.title}</header></a>
      <Embed article={activeArticle.data} />
      
      {#each comments as comment (comment.data.id)}
        <Comment {comment} />
      {/each}
    {/if}
  </div>
</div>
