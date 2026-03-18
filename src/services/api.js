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

// Добавь params в скобки функции!
export const getArticles = async (page = 1, params = {}) => {
  const limit = 10; // Сделаем 10 для соответствия макету
  const offset = (page - 1) * limit;

  const response = await api.get(`/articles`, {
    // Теперь передаем и лимит, и пришедшие фильтры (author или favorited)
    params: {
      limit,
      offset,
      ...params,
    },
  });
  return response.data;
};

export const getSingleArticle = async (slug) => {
  const response = await api.get(`/articles/${slug}`);
  return response.data;
};

export const createArticle = async (data) => {
  // Убираем { article: data }, так как data уже содержит эту обертку из компонента
  const response = await api.post('/articles', data);
  return response.data;
};

export const updateArticle = async (slug, data) => {
  // То же самое здесь — передаем data напрямую
  const response = await api.put(`/articles/${slug}`, data);
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

// убирание лайка
export const unfavoriteArticle = async (slug) => {
  const response = await api.delete(`/articles/${slug}/favorite`);
  return response.data;
};
// В файле services/api.js (добавь эти функции к остальным)

export const registerUser = async (data) => {
  const response = await api.post('/users', { user: data });
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/users/login', { user: data });
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/user', { user: userData });
  return response.data;
};
export default api;
