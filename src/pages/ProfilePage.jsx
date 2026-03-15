import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/api';

const ProfilePage = ({ user }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my');

  useEffect(() => {
    const fetchArticles = async () => {
      if (!user?.username) return;

      setLoading(true);
      try {
        console.log(
          `Загрузка статей для: ${user.username}, вкладка: ${activeTab}`,
        );

        const queryParams =
          activeTab === 'my'
            ? { author: user.username }
            : { favorited: user.username };

        const data = await getArticles(1, queryParams);

        setArticles(data.articles || []);
      } catch (err) {
        console.error('Ошибка загрузки статей профиля:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user?.username, activeTab]);

  if (!user) return <div className="container">Loading user...</div>;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={
                  user.image ||
                  'https://static.productionready.io/images/smiley-cyrus.jpg'
                }
                className="user-img"
                alt={user.username}
              />
              <h4>{user.username}</h4>
              <p>{user.bio}</p>
              <Link
                to="/settings"
                className="btn btn-sm btn-outline-secondary action-btn edit-btn"
              >
                <i className="ion-gear-a"></i> Edit Profile Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul
                className="nav nav-pills outline-active"
                style={{ listStyle: 'none', padding: 0, display: 'flex' }}
              >
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'my' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my')}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'fav' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fav')}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            {loading ? (
              <div className="article-preview">Loading articles...</div>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article.slug}
                  className="article-preview article-card"
                >
                  <div className="article-meta">
                    <Link to={`/profile/${article.author.username}`}>
                      <img
                        className="author-avatar"
                        src={
                          article.author.image ||
                          'https://static.productionready.io/images/smiley-cyrus.jpg'
                        }
                        alt={article.author.username}
                      />
                    </Link>
                    <div className="info">
                      <Link
                        to={`/profile/${article.author.username}`}
                        className="author author-name"
                      >
                        {article.author.username}
                      </Link>
                      <span className="date">
                        {new Date(article.createdAt).toDateString()}
                      </span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm pull-xs-right">
                      <i className="ion-heart"></i> {article.favoritesCount}
                    </button>
                  </div>

                  <Link
                    to={`/article/${article.slug}`}
                    className="preview-link"
                  >
                    <h1 className="article-title">{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    <ul
                      className="tag-list"
                      style={{ listStyle: 'none', padding: 0 }}
                    >
                      {article.tagList?.map((tag) => (
                        <li
                          key={tag}
                          className="tag-default tag-pill tag-outline"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </Link>
                </div>
              ))
            ) : (
              <div className="article-preview">
                No articles are here... yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
