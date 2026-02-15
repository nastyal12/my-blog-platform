import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/api';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние для текущей страницы
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const limit = 5; // Количество статей на одной странице

  useEffect(() => {
    const fetchDate = async () => {
      try {
        setLoading(true);
        setError(null);
        // Передаем текущую страницу в наш API сервис
        const data = await getArticles(currentPage);
        setArticles(data.articles);
        setTotalArticles(data.articlesCount); // Сохраняем общее кол-во для расчета страниц
      } catch (err) {
        setError(
          err.response?.status === 429
            ? 'Too many requests. Please wait a minute.'
            : 'Error loading articles.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDate();
  }, [currentPage]); // Эффект срабатывает каждый раз, когда меняется currentPage

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Расчет общего количества страниц
  const totalPages = Math.ceil(totalArticles / limit);

  return (
    <div>
      {articles.map((article) => (
        <div
          key={article.slug}
          style={{
            padding: '15px',
            borderBottom: '1px solid #eee',
            marginBottom: '10px',
          }}
        >
          <Link to={`/articles/${article.slug}`}>
            <h2 style={{ margin: '0 0 10px 0', color: '#1890ff' }}>
              {article.title}
            </h2>
          </Link>
          <p>{article.description}</p>
        </div>
      ))}

      {/* Блок пагинации */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Назад
        </button>

        <span>
          Страница {currentPage} из {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ArticleListPage;
