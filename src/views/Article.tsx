import * as React from 'react';

interface ArticleProps {
  subreddit: string;
  id: string;
}

const Article: React.FC<ArticleProps> = () => {
  return <p>An Article</p>;
};
export default Article;