import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle standard format
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      if (!response.data.success) {
        throw new Error(response.data.message || 'API Error');
      }
      return response.data.data; // MỚI: Trả về field database chính trực tiếp
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authorAPI = {
  getAll: () => api.get('/authors').then(res => res.data || res),
  getById: (id) => api.get(`/authors/${id}`).then(res => res.data || res),
  create: (data) => api.post('/authors', data).then(res => res.data || res),
  update: (id, data) => api.put(`/authors/${id}`, data).then(res => res.data || res),
  delete: (id) => api.delete(`/authors/${id}`).then(res => res.data || res),
};

export const bookAPI = {
  getAll: () => api.get('/books').then(res => res.data || res),
  getById: (id) => api.get(`/books/${id}`).then(res => res.data || res),
  create: (data) => api.post('/books', data).then(res => res.data || res),
  update: (id, data) => api.put(`/books/${id}`, data).then(res => res.data || res),
  delete: (id) => api.delete(`/books/${id}`).then(res => res.data || res),
};

export const borrowingAPI = {
  getAll: () => api.get('/borrowings').then(res => res.data || res),
  getById: (id) => api.get(`/borrowings/${id}`).then(res => res.data || res),
  create: (data) => api.post('/borrowings', data).then(res => res.data || res),
  return: (id) => api.put(`/borrowings/${id}/return`).then(res => res.data || res),
};


export const statsAPI = {
  getOverview: () => api.get('/stats/overview').then(res => res.data || res),
  getTopBooks: () => api.get('/stats/top-books').then(res => res.data || res),
  getBorrowStatus: () => api.get('/stats/borrow-status').then(res => res.data || res),
};

export default api;
