import axiosInstance from "@/lib/axios";


export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  role: string;
  email: string;
  name?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface VerifyResponse {
  loggedIn: boolean;
  user?: User;
}

// 🔐 Login
export const login = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  if (!data.success || !data.user) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// ✅ Verify
export const verify = async (): Promise<VerifyResponse> => {
  try {
    const { data } =
      await axiosInstance.get<VerifyResponse>("/auth/verify");
    return data;
  } catch {
    return { loggedIn: false };
  }
};

// 🚪 Logout
export const logout = async () => {
  await axiosInstance.post("/auth/logout");

  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};
