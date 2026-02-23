import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Добавили useNavigate
import ReactMarkdown from 'react-markdown';
import { getSingleArticle, deleteArticle } from '../services/api'; // Добавили deleteArticle

const SingleArticlePage = ({ user }) => {
  // Принимаем залогиненного пользователя
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deleteArticle(slug);
      navigate('/articles');
    } catch {
      alert('Не удалось удалить статью');
    }
  };

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
          <div className="title-section">
            <h1 className="main-title">{article.title}</h1>
            <div className="tag-list">
              {article.tagList.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* КНОПКИ УПРАВЛЕНИЯ: Показываем только если user — автор */}
            {user && user.username === article.author.username && (
              <div className="article-actions">
                <button
                  className="delete-btn"
                  onClick={() => setShowModal(true)}
                >
                  Delete
                </button>
                <Link to={`/articles/${slug}/edit`} className="edit-btn">
                  Edit
                </Link>
              </div>
            )}
          </div>

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

      {/* МОДАЛЬНОЕ ОКНО: Вынесли в конец контейнера */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete this article?</p>
            <div className="modal-buttons">
              <button className="btn-no" onClick={() => setShowModal(false)}>
                No
              </button>
              <button className="btn-yes" onClick={handleDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleArticlePage;
