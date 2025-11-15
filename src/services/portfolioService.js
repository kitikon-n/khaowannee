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

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor - handle 401 errors and auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // No refresh token available - logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Call refresh token API
        const response = await axios.post('http://localhost:8000/user/refresh', {
          refresh_token: refreshToken
        });

        const { access_token } = response.data;

        // Update tokens
        localStorage.setItem('access_token', access_token);

        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process queued requests
        processQueue(null, access_token);
        isRefreshing = false;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - logout
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const portfolioService = {
  // Create new portfolio
  async createPortfolio(portfolioData) {
    try {
      const response = await api.post('/portfolios', {
        name: portfolioData.name,
        description: portfolioData.description,
        asset: portfolioData.asset
      });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 422) {
        throw new Error(error.response.data.detail || 'ข้อมูลไม่ถูกต้อง');
      }
      throw new Error(error.response?.data?.detail || 'เกิดข้อผิดพลาดในการสร้าง Portfolio');
    }
  },

  // Get all portfolios
  async getPortfolios() {
    try {
      const response = await api.get('/portfolios');
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูล Portfolio ได้');
    }
  },

  // Get portfolio by ID
  async getPortfolioById(id) {
    try {
      const response = await api.get(`/portfolios/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูล Portfolio ได้');
    }
  },

  // Get portfolio detail (with holdings, transactions, analysis)
  async getPortfolioDetail(id) {
    try {
      const response = await api.get(`/portfolios/${id}/detail`);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูล Portfolio Detail ได้');
    }
  },

  // Update portfolio
  async updatePortfolio(id, portfolioData) {
    try {
      const response = await api.put(`/portfolios/${id}`, portfolioData);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('ไม่สามารถอัพเดท Portfolio ได้');
    }
  },

  // Delete portfolio
  async deletePortfolio(id) {
    try {
      await api.delete(`/portfolios/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error('ไม่สามารถลบ Portfolio ได้');
    }
  },

  // Get cryptocurrencies by asset type
  async getCryptocurrencies(assetType) {
    try {
      const response = await api.get(`/cryptocurrencies/`, {
        params: { asset_type: assetType }
      });
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูล Cryptocurrencies ได้');
    }
  },

  // Get cryptocurrency price by ID
  async getCryptocurrencyPrice(cryptocurrencyId) {
    try {
      const response = await api.get(`/cryptocurrencies/${cryptocurrencyId}/price`);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูลราคาได้');
    }
  },

  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/transactions/', {
        portfolio_id: transactionData.portfolio_id,
        cryptocurrency_id: transactionData.cryptocurrency_id,
        transaction_type: transactionData.transaction_type,
        quantity: transactionData.quantity,
        price_per_unit: transactionData.price_per_unit,
        total_amount: transactionData.total_amount,
        fee: transactionData.fee,
        transaction_date: transactionData.transaction_date,
        notes: transactionData.notes
      });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 422) {
        throw new Error(error.response.data.detail || 'ข้อมูลไม่ถูกต้อง');
      }
      throw new Error(error.response?.data?.detail || 'เกิดข้อผิดพลาดในการสร้าง Transaction');
    }
  },

  // Update transaction
  async updateTransaction(transactionData) {
    try {
      const response = await api.put(`/transactions/${transactionData.transaction_id}`, {
        quantity: transactionData.quantity,
        price_per_unit: transactionData.price_per_unit,
        total_amount: transactionData.total_amount,
        fee: transactionData.fee,
        transaction_date: transactionData.transaction_date,
        notes: transactionData.notes
      });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 422) {
        throw new Error(error.response.data.detail || 'ข้อมูลไม่ถูกต้อง');
      }
      throw new Error(error.response?.data?.detail || 'เกิดข้อผิดพลาดในการแก้ไข Transaction');
    }
  },

  // Delete transaction
  async deleteTransaction(transactionId) {
    try {
      await api.delete(`/transactions/${transactionId}`);
      return { success: true };
    } catch (error) {
      throw new Error('ไม่สามารถลบ Transaction ได้');
    }
  },

  // Get investment recommendation by cryptocurrency ID
  async getInvestmentRecommendation(cryptocurrencyId) {
    try {
      const response = await api.get(`/investment-recommendations/${cryptocurrencyId}`);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('ไม่สามารถดึงข้อมูลคำแนะนำการลงทุนได้');
    }
  }
};
