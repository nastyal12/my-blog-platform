import axios from 'axios';

const api = axios.create({
  baseURL: 'https://realworld.habsida.net/api',
});

export const getArticles = async (page = 1) => {
  const limit = 5;
  const offset = (page - 1) * limit; // Если стр 1: (1-1)*5 = 0. Если стр 2: (2-1)*5 = 5.
  const response = await api.get(`/articles`, {
    params: { limit, offset },
  });
  return response.data;
};

export const getSingleArticle = async (slug) => {
  const response = await api.get(`/articles/${slug}`);
  return response.data;
};
