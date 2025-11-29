
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [] as any[],
  },
  reducers: {
    setWishlistItems: (state, action) => {
      state.items = action.payload;
    },
    addWishlistItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeWishlistItem: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
  },
});

export const { addWishlistItem, removeWishlistItem, setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;
