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
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import SettingsPage from './pages/SettingsPage'; // Страница с формой (Edit Profile)
import ProfilePage from './pages/ProfilePage';
import ArticleFormPage from './pages/ArticleFormPage';

function App() {
  const [user, setUser] = useState(() => {
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
              Realworld Blog
            </Link>

            <nav className="auth-nav">
              <div
                className="nav-container"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {/* 1. Home всегда крайний слева */}
                <Link to="/" className="nav-link">
                  Home
                </Link>

                {user ? (
                  // МЕНЮ ДЛЯ АВТОРИЗОВАННОГО
                  <div
                    className="user-menu"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Link to="/new-article" className="nav-link">
                      <span style={{ color: '#5cb85c', marginRight: '4px' }}>
                        ✎
                      </span>{' '}
                      New Post
                    </Link>
                    {/* Settings — это страница обновления профиля (PUT) */}
                    <Link to="/settings" className="nav-link">
                      <span style={{ color: '#5cb85c', marginRight: '4px' }}>
                        ⚙
                      </span>{' '}
                      Settings
                    </Link>
                    <Link to="/profile" className="nav-link">
                      <span style={{ color: '#5cb85c', marginRight: '4px' }}>
                        👤
                      </span>{' '}
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                      Log Out
                    </button>
                  </div>
                ) : (
                  // МЕНЮ ДЛЯ ГОСТЯ
                  <div className="guest-menu" style={{ display: 'flex' }}>
                    <Link to="/sign-in" className="nav-link">
                      Sign In
                    </Link>
                    <Link to="/sign-up" className="nav-link">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
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

            <Route path="/sign-up" element={<SignUpPage setUser={setUser} />} />
            <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />

            {/* Настройки (Settings) и Профиль (Profile) */}
            <Route
              path="/settings"
              element={
                user ? (
                  <SettingsPage
                    user={user}
                    setUser={setUser}
                    isSettings={true}
                  />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
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
