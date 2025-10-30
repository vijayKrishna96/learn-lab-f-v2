import axios, { AxiosResponse } from "axios";


import { LOGIN_API, LOGOUT_API, USER_DETAILS_API } from "@/utils/constants/api";
import axiosInstance from "@/lib/axiosInstance";

// ✅ Define a reusable type for the API response shape (customize as needed)
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ✅ Define login payload and user types
interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: UserDetails;
  token: string;
}


interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor";
}

// -----------------------------
// 🔹 USER LOGIN
// -----------------------------
export const userLogin = async (
  data: LoginPayload
): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(LOGIN_API, data);
    return response;
  } catch (error: any) {
    console.error("Login error:", error.response || error.message);
    throw error;
  }
};


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
export const userCheck = async (): Promise<ApiResponse<UserDetails> | undefined> => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserDetails>>("/user/checkUser");
    return response.data;
  } catch (error: any) {
    console.error("User check error:", error.message);
  }
};

// -----------------------------
// 🔹 GET USER DETAILS BY ID
// -----------------------------
export const userDetails = async (userId: string): Promise<UserDetails | null> => {
  try {
    const response = await axios.get<ApiResponse<UserDetails>>(USER_DETAILS_API, {
      params: { id: userId },
    });
    return response.data.data || null;
  } catch (error: any) {
    console.error("Error fetching user details:", error.message);
    return null;
  }
};
