import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import SingleArticlePage from './pages/SingleArticlePage';
import SignUpPage from './pages/SignUpPage'; // Создадим сейчас
import SignInPage from './pages/SignInPage'; // Создадим сейчас
import ProfilePage from './pages/ProfilePage'; // Создадим сейчас
import ArticleFormPage from './pages/ArticleFormPage';
function App() {
  const [user, setUser] = useState(() => {
    // Эта функция выполнится только один раз при самом первом запуске приложения
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <header className="main-header">
          <div className="container header-content">
            <Link to="/" className="logo">
              My Blog Platform
            </Link>

            <nav className="auth-nav">
              {user ? (
                // Если пользователь вошел: имя + аватар + кнопка выхода
                <div className="user-menu">
                  <Link to="/new-article" className="create-article-btn">
                    Create Article
                  </Link>
                  <Link to="/profile" className="user-profile-link">
                    <span>{user.username}</span>
                    <img
                      src={
                        user.image ||
                        'https://static.productionready.io/images/smiley-cyrus.jpg'
                      }
                      alt="avatar"
                      className="header-avatar"
                    />
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Log Out
                  </button>
                </div>
              ) : (
                // Если не вошел: ссылки на вход и регистрацию
                <div className="guest-menu">
                  <Link to="/sign-in">Sign In</Link>
                  <Link to="/sign-up" className="sign-up-link">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/articles" />} />
            <Route path="/articles" element={<ArticleListPage user={user} />} />
            <Route
              path="/articles/:slug"
              element={<SingleArticlePage user={user} />}
            />
            {/* Новые маршруты */}
            <Route path="/sign-up" element={<SignUpPage setUser={setUser} />} />
            <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />
            <Route
              path="/profile"
              element={
                user ? (
                  <ProfilePage user={user} setUser={setUser} />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
            <Route
              path="/new-article"
              element={
                user ? (
                  <ArticleFormPage isEdit={false} />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
            <Route
              path="/articles/:slug/edit"
              element={
                user ? (
                  <ArticleFormPage isEdit={true} />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
