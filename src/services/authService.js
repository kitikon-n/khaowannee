import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - auto-attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if 401 error is NOT from login endpoint
    const isLoginEndpoint = error.config?.url?.includes('/user/login');

    if (error.response?.status === 401 && !isLoginEndpoint) {
      // Token expired or invalid - clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register new user
  async register(user_name, email, password) {
    try {
      const response = await api.post('/user/register', {
        user_name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        throw new Error(error.response.data.detail || 'ข้อมูลไม่ถูกต้อง');
      }
      throw new Error(error.response?.data?.detail || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  },

  // Login user
  async login(username, password) {
    try {
      const response = await api.post('/user/login', {
        username,
        password
      });

      const { access_token, refresh_token } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
      if (error.response?.status === 403) {
        throw new Error('บัญชีของคุณถูกระงับ');
      }
      throw new Error(error.response?.data?.detail || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};