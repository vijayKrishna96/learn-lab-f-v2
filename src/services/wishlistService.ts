import axiosInstance from "@/utils/axiosInstance";


export const addToWishlistAPI = async (courseId: string) => {
  const res = await axiosInstance.post(`/wishlist/add/${courseId}`);
  return res.data;
};

export const removeFromWishlistAPI = async (courseId: string) => {
  const res = await axiosInstance.delete(`/wishlist/remove/${courseId}`);
  return res.data;
};
