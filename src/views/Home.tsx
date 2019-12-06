import * as React from "react";

import { Article, mkReddit } from "../lib/reddit";

import ArticlePreview from '../components/ArticlePreview';

interface HomeProps {
  reddit: ReturnType<typeof mkReddit>;
}

const Home: React.FC<HomeProps> = ({ reddit }) => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [lastSeenId, setLastSeenId] = React.useState<string | null>(null);
  const footerRef = React.useRef<HTMLParagraphElement | null>(null);

  React.useEffect(() => {
    async function updateFeed() {
      const newArticles = await reddit.getFeed(null, lastSeenId);
      setArticles([...articles, ...newArticles.articles]);
      setLastSeenId(newArticles.lastSeenId);
    }

    if (!footerRef.current) return;
    const footerEl = footerRef.current;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        updateFeed();
      }
    });
    observer.observe(footerEl);
    return () => observer.unobserve(footerEl);
  }, [reddit, articles, lastSeenId, footerRef]);

  return (
    <div className="flex flex-col items-center">
      {articles.length === 0 ? <p>Loading feed...</p> : null}

      {articles.map(article => (
        <div key={article.id} className="w-6/12 mb-5">
          <ArticlePreview key={article.id} article={article} reddit={reddit} />
        </div>
      ))}

      <p ref={footerRef}>Loading more items...</p>
    </div>
  );
};
export default Home;
