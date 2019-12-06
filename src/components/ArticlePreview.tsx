import unescape from "lodash/unescape";
import * as React from "react";

import * as libreddit from "../lib/reddit";

interface ArticlePreviewProps {
  article: libreddit.Article;
  reddit: ReturnType<typeof libreddit.mkReddit>;
}

function getPreview(article: libreddit.Article) {
  if (
    !article.preview ||
    !article.preview.enabled ||
    !article.preview.images.length
  )
    return;
  const resolutions = article.preview.images[0].resolutions;
  if (resolutions.length === 0) return article.preview.images[0].source.url;
  return resolutions[resolutions.length - 1].url;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article, reddit }) => {
  const [comments, setComments] = React.useState<libreddit.Comment[]>([]);

  React.useEffect(() => {
    async function loadComments() {
      const newComments = await reddit.getComments(
        article.subreddit,
        article.id
      );

      setComments(newComments.comments);
    }

    loadComments();
  }, [article.id, article.subreddit, reddit]);

  return (
    <article>
      <div className="bg-white rounded-lg p-2">
        <span className="whitespace-no-wrap float-right ml-3">
          {article.score} / {article.num_comments}
        </span>
        <header className="text-xl">{unescape(article.title)}</header>

        <div>
          {getPreview(article) ? (
            <img
              className="rounded-lg w-full h-auto"
              src={unescape(getPreview(article))}
            />
          ) : article.thumbnail === "self" && article.selftext ? (
            <p
              dangerouslySetInnerHTML={{
                __html: unescape(article.selftext).slice(0, 140).trim() + (unescape(article.selftext).length > 140 ? '...' : '')
              }}
            />
          ) : (
            <img className="w-full h-auto" src={article.thumbnail} />
          )}
        </div>

        <p className="text-gray-500 text-xs flex justify-between">
          <a
            href={article.url || article.permalink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.domain}
          </a>

          <span>{article.subreddit_name_prefixed}</span>
        </p>
      </div>

      <section className="mx-3 bg-gray-300 rounded-b-lg">
        {comments.slice(0, 2).map(comment => (
          <article className="p-3" key={comment.id}>
            <header className="flex justify-between text-gray-700 italic">
              <span>{comment.author}</span>
              <span>{comment.score}</span>
            </header>

            <p
              dangerouslySetInnerHTML={{ __html: unescape(comment.body_html) }}
            />
          </article>
        ))}
      </section>
    </article>
  );
};
export default ArticlePreview;
