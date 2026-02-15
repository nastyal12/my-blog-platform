import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import SingleArticlePage from './pages/SingleArticlePage';
function App() {
  return (
    <Router>
      <div
        className="container"
        style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}
      >
        <header>
          <h1>My Blog Platform</h1>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/articles" />} />
          <Route path="/articles" element={<ArticleListPage />} />
          <Route path="/articles/:slug" element={<SingleArticlePage />} />{' '}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
