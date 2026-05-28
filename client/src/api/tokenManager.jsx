import { jwtDecode } from "jwt-decode";

let currentAccessToken = null;
let currentUser = null;

export const tokenManager = {
  getToken: () => currentAccessToken,
  setToken: (token) => {
    currentAccessToken = token;
    if (token) {
      try {
        currentUser = jwtDecode(token);
      } catch {
        currentUser = null;
      }
    } else {
      currentUser = null;
    }
  },
  getUser: () => currentUser,
  clearToken: () => {
    currentAccessToken = null;
    currentUser = null;
  },
};
