import axiosInstance from "@/utils/axiosInstance";


export const addToCartAPI = async (courseId: string) => {
  const res = await axiosInstance.post(`/cart/add/${courseId}`);
  return res.data;
};

export const removeFromCartAPI = async (courseId: string) => {
  const res = await axiosInstance.delete(`/cart/remove/${courseId}`);
  return res.data;
};
