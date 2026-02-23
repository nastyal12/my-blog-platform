import axios from 'axios';

const api = axios.create({
  baseURL: 'https://realworld.habsida.net/api',
});

api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getArticles = async (page = 1) => {
  const limit = 5;
  const offset = (page - 1) * limit;
  const response = await api.get(`/articles`, {
    params: { limit, offset },
  });
  return response.data;
};

export const getSingleArticle = async (slug) => {
  const response = await api.get(`/articles/${slug}`);
  return response.data;
};

export const createArticle = async (data) => {
  const response = await api.post('/articles', { article: data });
  return response.data;
};

export const updateArticle = async (slug, data) => {
  const response = await api.put(`/articles/${slug}`, { article: data });
  return response.data;
};

export const deleteArticle = async (slug) => {
  await api.delete(`/articles/${slug}`);
};
// Поставить лайк
export const favoriteArticle = async (slug) => {
  const response = await api.post(`/articles/${slug}/favorite`);
  return response.data;
};

// Убрать лайк
export const unfavoriteArticle = async (slug) => {
  const response = await api.delete(`/articles/${slug}/favorite`);
  return response.data;
};
export default api;
