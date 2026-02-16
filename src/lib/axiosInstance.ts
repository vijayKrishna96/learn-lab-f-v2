// import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Use NEXT_PUBLIC_ prefix for frontend env vars
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Needed if using cookies for auth
// });

// // Request interceptor to attach token (only in browser)
// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
