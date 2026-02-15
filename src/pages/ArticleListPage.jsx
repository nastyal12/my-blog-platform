import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/api';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchDate = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getArticles(currentPage);
        setArticles(data.articles);
        setTotalArticles(data.articlesCount);
      } catch {
        setError('Error loading articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDate();
  }, [currentPage]);

  if (loading) return <div className="status">Loading articles...</div>;
  if (error) return <div className="status error">{error}</div>;

  const totalPages = Math.ceil(totalArticles / limit);

  return (
    <div className="container">
      {articles.map((article) => (
        <div key={article.slug} className="article-card">
          <div className="article-header">
            <div className="article-info">
              <Link to={`/articles/${article.slug}`} className="article-title">
                {article.title}
              </Link>
              <div className="tag-list">
                {article.tagList.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="article-author">
              <div className="author-text">
                <span className="author-name">{article.author.username}</span>
                <span className="article-date">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
              <img
                src={article.author.image}
                alt="avatar"
                className="author-avatar"
                onError={(e) => {
                  e.target.src =
                    'https://static.productionready.io/images/smiley-cyrus.jpg';
                }}
              />
            </div>
          </div>

          <p className="article-description">{article.description}</p>

          <div className="article-footer">
            <span className="likes">❤️ {article.favoritesCount} likes</span>
          </div>
        </div>
      ))}

      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          &larr; prev
        </button>

        <span className="page-info">
          Page <strong>{currentPage}</strong> of {totalPages}
        </span>

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default ArticleListPage;
