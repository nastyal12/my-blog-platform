import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getArticles,
  favoriteArticle,
  unfavoriteArticle,
} from '../services/api';

const ArticleListPage = ({ user }) => {
  // Добавили user из пропсов
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const limit = 5;
  const navigate = useNavigate();

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

  // ФУНКЦИЯ ЛАЙКА
  const handleToggleLike = async (slug, favorited) => {
    console.log('Клик по лайку:', slug, 'Статус:', favorited);

    if (!user) {
      console.log('Юзер не найден, редирект на вход');
      navigate('/sign-in');
      return;
    }

    try {
      let response;
      if (favorited) {
        console.log('Отправляем DELETE запрос (unfavorite)');
        response = await unfavoriteArticle(slug);
      } else {
        console.log('Отправляем POST запрос (favorite)');
        response = await favoriteArticle(slug);
      }

      // ВАЖНО: сервер возвращает объект { article: ... }
      const updatedArticle = response.article;

      setArticles((prev) =>
        prev.map((article) =>
          article.slug === slug ? updatedArticle : article,
        ),
      );
    } catch (err) {
      console.error('Ошибка при лайке:', err.response?.data || err.message);
      alert('Не удалось поставить лайк. Проверь консоль (F12)');
    }
  };

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
                src={
                  article.author.image ||
                  'https://static.productionready.io/images/smiley-cyrus.jpg'
                }
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
            <button
              className={`like-btn ${article.favorited ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault(); // На случай, если кнопка внутри Link
                handleToggleLike(article.slug, article.favorited);
              }}
            >
              {article.favorited ? '❤️' : '🤍'} {article.favoritesCount}
            </button>
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
