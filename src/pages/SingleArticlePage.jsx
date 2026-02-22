import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getSingleArticle } from '../services/api';

const SingleArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getSingleArticle(slug);
        setArticle(data.article);
      } catch {
        setError('Не удалось загрузить статью.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="status">Download...</div>;
  if (error) return <div className="status error">{error}</div>;
  if (!article) return null;

  return (
    <div className="container">
      <Link to="/articles" className="back-link">
        ← Back to list
      </Link>

      <article className="full-article">
        <header className="article-header">
          {/* Левая часть: заголовок и теги */}
          <div className="title-section">
            <h1 className="main-title">{article.title}</h1>
            <div className="tag-list">
              {article.tagList.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Правая часть: автор и лайки */}
          <div className="article-meta-large">
            <div className="author-block">
              <div className="author-details">
                <span className="author-name">{article.author.username}</span>
                <span className="date">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
              <img
                src={
                  article.author.image ||
                  'https://static.productionready.io/images/smiley-cyrus.jpg'
                }
                alt="avatar"
                className="author-avatar-large"
                onError={(e) => {
                  e.target.src =
                    'https://static.productionready.io/images/smiley-cyrus.jpg';
                }}
              />
            </div>
            <div className="likes-badge">❤️ {article.favoritesCount}</div>
          </div>
        </header>

        <div className="article-body">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default SingleArticlePage;
