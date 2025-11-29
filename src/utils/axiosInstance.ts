import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4500",
  withCredentials: true, // required to send cookies
});

export default axiosInstance;
