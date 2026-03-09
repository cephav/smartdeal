import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid, auto-logout
      localStorage.removeItem('token');
      // We could trigger a redirect here, but we will handle it in the UI/App state
    }
    return Promise.reject(error);
  }
);
export const salesAPI = {
  getSales: () => api.get("/sales")
};
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const dealsAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/deals?page=${page}&limit=${limit}`),
  getTop: () => api.get('/deals/top'),
  getBest: () => api.get('/deals/best'),
  search: (keyword, page = 1, limit = 10) => api.get(`/deals/search?q=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`),
  compare: (title) => api.get(`/deals/compare/${encodeURIComponent(title)}`),
  recommendations: () => api.get('/deals/recommendations'),
  addDeal: (data) => api.post('/deals', data),
};

export const alertsAPI = {
  create: (data) => api.post('/alerts', data),
  getAll: () => api.get('/alerts'),
  check: () => api.get('/alerts/check'),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export default api;
