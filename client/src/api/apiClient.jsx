import axios from "axios";
import { tokenManager } from "./tokenManager";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Request interceptor – attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    console.log(`🚀 [Request] ${config.method.toUpperCase()} ${config.url}`, {
      token: token ? "present" : "none",
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ [Request Error]", error);
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      console.log("⏳ [Queue] Rejecting queued request with error");
      promise.reject(error);
    } else {
      console.log("⏳ [Queue] Resolving queued request with token");
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [Response] ${response.config.method.toUpperCase()} ${response.config.url}`,
      response.status,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(
      `❌ [Response Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
      {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      },
    );

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 🔥 NEW: Only attempt refresh if the request had an Authorization header (i.e., it was authenticated)
    if (!originalRequest.headers?.Authorization) {
      console.log("⏭️ 401 on public endpoint – not attempting refresh");
      return Promise.reject(error);
    }

    // Don't refresh if the failed request is itself the refresh endpoint
    if (originalRequest.url === "/auth/refresh-token") {
      console.warn(
        "⚠️ [Refresh] Refresh endpoint itself returned 401 – stopping",
      );
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      console.log("⏳ [Refresh] Already refreshing – queueing request");
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;
    console.log("🔄 [Refresh] Attempting token refresh...");

    try {
      const refreshResponse = await axios.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true, baseURL: "http://localhost:5000" },
      );
      console.log("🔄 [Refresh] Response:", refreshResponse.data);

      if (refreshResponse.data?.success) {
        const newAccessToken = refreshResponse.data.accessToken;
        tokenManager.setToken(newAccessToken);
        console.log("✅ [Refresh] New access token stored");

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("🔄 [Refresh] Retrying original request");
        return apiClient(originalRequest);
      } else {
        console.error("❌ [Refresh] Failed – no success flag");
        tokenManager.clearToken();
        processQueue(new Error("Refresh failed"), null);
        return Promise.reject(error);
      }
    } catch (refreshError) {
      console.error(
        "❌ [Refresh] Error during refresh:",
        refreshError.response?.data || refreshError.message,
      );
      tokenManager.clearToken();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
