import axios, { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axiosInstance";

// API URL - adjust to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4500";

// Define types
interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  id: string;
  role: string;
  email: string;
  name?: string; // Optional, as per login response
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface VerifyResponse {
  loggedIn: boolean;
  user?: User;
}

interface RefreshResponse {
  success: boolean;
}

// -----------------------------
// 🔹 USER LOGIN
// -----------------------------
export const userLogin = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ Critical: sends/receives cookies
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  if (!data.success || !data.user) {
    throw new Error(data.message || "Invalid login response");
  }

  return data;
};

// -----------------------------
// 🔹 VERIFY LOGIN (Check Auth Status)
// -----------------------------
// In verifyLogin:
export const verifyLogin = async (): Promise<VerifyResponse> => {
  try {
    console.log("🔍 VerifyLogin: Sending request with credentials");
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "GET",
      credentials: "include",
    });

    console.log("🔍 VerifyLogin: Response status:", response.status); // Temp log

    if (!response.ok) {
      console.log("🔍 VerifyLogin: Not OK, returning false");
      return { loggedIn: false };
    }

    const data = await response.json();
    console.log("🔍 VerifyLogin: Decoded data:", data); // Temp log
    if (data.loggedIn && data.user) {
      return data;
    }

    return { loggedIn: false };
  } catch (error) {
    console.error("Verify login error:", error);
    return { loggedIn: false };
  }
};

// -----------------------------
// 🔹 REFRESH TOKEN (New: For token rotation)
// -----------------------------
export const refreshToken = async (): Promise<RefreshResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // ✅ Uses refreshToken cookie
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Token refresh failed");
  }

  return await response.json(); // ✅ Added await
};

// -----------------------------
// 🔹 USER LOGOUT
// -----------------------------
export const userLogout = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // ✅ Sends cookies to be cleared
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    const data = await response.json();
    // Clear local storage on success
    localStorage.removeItem("user");
    localStorage.removeItem("userFull"); // ✅ Also clear full user data
    return data;
  } catch (error) {
    // Even on error, clear local state for safety
    localStorage.removeItem("user");
    localStorage.removeItem("userFull");
    throw error;
  }
};

// -----------------------------
// 🔹 AXIOS INTERCEPTOR (For Protected Routes)
// -----------------------------
// Add this to your axiosInstance configuration
// This ensures all API calls include credentials
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.baseURL = API_BASE_URL;

// Enhanced response interceptor to handle 401 errors with refresh (cookie-based)
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      // For cookie-based: no token to pass, just resolve to retry
      resolve(true);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry original request (new cookies will be sent automatically)
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token (backend sets new httpOnly cookies)
        const refreshResponse = await refreshToken();
        if (refreshResponse.success) {
          processQueue(null);
          // No header update needed for cookies; retry will use new cookies
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError);
        // Clear state and redirect to login
        localStorage.removeItem("user");
        localStorage.removeItem("userFull");
        // Optional: Trigger logout or redirect
        if (typeof window !== "undefined") {
          window.location.href = "/"; // Or your login path
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Export axiosInstance for use in other services
export default axiosInstance;