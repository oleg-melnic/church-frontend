import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3003',
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(`[Axios Request] URL: ${config.url}, Токен: ${token}`);
  if (token) {
    // Инициализируем headers, если undefined
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`; // Восстанавливаем динамический токен
  } else {
    console.log('[Axios Request] Токен отсутствует');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response] URL: ${response.config.url}, Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(`[Axios Response] Ошибка 401 для URL: ${originalRequest.url}, Пытаемся обновить токен`);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("adminRefreshToken");
        if (!refreshToken) {
          console.log('[Axios Response] Refresh token отсутствует');
          processQueue(new Error('Refresh token отсутствует'));
          localStorage.removeItem("adminAccessToken");
          localStorage.removeItem("adminRefreshToken");
          console.log('[Axios Response] Токены удалены из localStorage из-за отсутствия refresh token');
          window.location.href = "/admin/login";
          return Promise.reject(error);
        }

        console.log('[Axios Response] Отправляем запрос на обновление токена с refreshToken:', refreshToken);
        const refreshResponse = await axios.post<{ accessToken: string }>(
          "http://localhost:3003/api/auth/refresh",
          { refreshToken }
        );
        const newAccessToken = refreshResponse.data.accessToken;
        console.log('[Axios Response] Новый access token:', newAccessToken);
        localStorage.setItem("adminAccessToken", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.log('[Axios Response] Ошибка обновления токена:', refreshErr);
        processQueue(refreshErr);
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        console.log('[Axios Response] Токены удалены из localStorage из-за ошибки обновления токена');
        window.location.href = "/admin/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    console.log(`[Axios Response] Ошибка для URL: ${originalRequest.url}, Status: ${error.response?.status}`);
    return Promise.reject(error);
  }
);

export default api;