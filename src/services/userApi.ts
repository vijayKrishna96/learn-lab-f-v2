import axios, { AxiosResponse } from "axios";


import { LOGIN_API, LOGOUT_API, USER_DETAILS_API, VERIFY_API } from "@/utils/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie"; // install with `npm i js-cookie`


// Define payload & response types
interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  id: string;
  role: string;
}

interface LoginResponse {
  user: User;
  token: string;
  message: string;
  success: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// services/userApi.ts


export const userLogin = async (credentials: { email: string; password: string }) => {
  const response = await fetch("http://localhost:4500/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ Important for CORS
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};


// export const userLogin = async (data: LoginPayload): Promise<User> => {
//   try {
//     const response = await axios.post<LoginResponse>(
//       LOGIN_API,
//       data,
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       }
//     );

//     console.log(response.data, "userLogin response data");

//     if (response.data.success && response.data.user && response.data.token) {
//       const { token, user } = response.data;

//       // Store token & role
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);

//       Cookies.set("token", token, { expires: 7 });
//       Cookies.set("role", user.role, { expires: 7 });

//       return user;
//     } else {
//       throw new Error(response.data.message || "Login failed");
//     }
//   } catch (error: any) {
//     console.error("Login error:", error.response?.data || error.message);
//     throw error;
//   }
// };



// -----------------------------
// 🔹 USER LOGOUT
// -----------------------------


export const userLogout = async (): Promise<AxiosResponse<ApiResponse<null>> | undefined> => {
  try {
    const response = await axios.post<ApiResponse<null>>(LOGOUT_API, {}, { method: "POST" });
    return response;
  } catch (error: any) {
    console.error("Logout error:", error.message);
  }
};

// -----------------------------
// 🔹 CHECK IF USER IS LOGGED IN
// -----------------------------
export const userCheck = async (): Promise<ApiResponse<User> | undefined> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>("/user/checkUser");
    return response.data;
  } catch (error: any) {
    console.error("User check error:", error.message);
  }
};

// -----------------------------
// 🔹 GET USER DETAILS BY ID
// -----------------------------
export const userDetails = async (userId: string): Promise<User | null> => {
  try {
    const response = await axios.get<ApiResponse<User>>(USER_DETAILS_API, {
      params: { id: userId },
    });
    return response.data.data || null;
  } catch (error: any) {
    console.error("Error fetching user details:", error.message);
    return null;
  }
};
