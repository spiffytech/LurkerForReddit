import * as React from "react";

import { Article, mkReddit } from "../lib/reddit";

import ArticlePreview from '../components/ArticlePreview';
import ArticleComponent from './Article';

interface HomeProps {
  reddit: ReturnType<typeof mkReddit>;
  params: {[key: string]: string};
}

const Home: React.FC<HomeProps> = ({ reddit, params }) => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [lastSeenId, setLastSeenId] = React.useState<string | null>(null);
  const footerRef = React.useRef<HTMLParagraphElement | null>(null);

  console.log('params', params);

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
    <>
    <div className="flex flex-col items-center">
      {articles.length === 0 ? <p>Loading feed...</p> : null}

      {articles.map(article => (
        <div key={article.id} className="w-6/12 mb-5">
          <ArticlePreview key={article.id} article={article} reddit={reddit} />
        </div>
      ))}

      <p ref={footerRef}>Loading more items...</p>
    </div>


      {params.subreddit && params.id ? 
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-300 flex items-center justify-center overflow-auto">
          <ArticleComponent subreddit={params.subreddit} id={params.id} />
        </div>
      : null}
    </>
  );
};
export default Home;
