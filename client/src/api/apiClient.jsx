import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

const refreshToken = async () => {
  try {
    await apiClient.post("/auth/refresh");

    if (res?.data?.status === "success") {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        const success = await refreshToken();

        if (success) {
          processQueue(null);
          resolve(apiClient(originalRequest));
        } else {
          processQueue(error);
          reject(error);
        }

        isRefreshing = false;
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
