import axios from 'axios';

const api = axios.create({
  baseURL: 'https://realworld.habsida.net/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Token ${user.token}`;
  }
  return config;
});

export const registerUser = async (data) => {
  const response = await api.post('/users', { user: data });
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/users/login', { user: data });
  return response.data;
};

export const updateUser = async (data) => {
  const response = await api.post('/user', { user: data }); // Метод Update User обычно требует PUT, проверь документацию, часто это PUT /user
  return response.data;
};
