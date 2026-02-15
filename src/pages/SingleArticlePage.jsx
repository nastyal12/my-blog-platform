import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getSingleArticle } from '../services/api';

const SingleArticlePage = () => {
  const { slug } = useParams(); // Достаем slug из URL (/articles/:slug)
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

  if (loading) return <div>Загрузка содержимого...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!article) return null;

  return (
    <article style={{ padding: '20px', lineHeight: '1.6' }}>
      <Link to="/articles">← Назад к списку</Link>

      <header style={{ marginTop: '20px' }}>
        <h1>{article.title}</h1>
        <div style={{ color: '#666', marginBottom: '20px' }}>
          <strong>{article.author.username}</strong> —{' '}
          {new Date(article.createdAt).toLocaleDateString()}
        </div>
        <p style={{ fontStyle: 'italic', color: '#555' }}>
          {article.description}
        </p>
      </header>

      <hr />

      {/* Рендерим Markdown */}
      <div className="article-content">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>
    </article>
  );
};

export default SingleArticlePage;
