import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [] as any[],
  },
  reducers: {
    setCartItems: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    addCartItem: (state, action: PayloadAction<any>) => {
      // NEW: Prevent duplicates
      if (!state.items.some(item => item._id === action.payload._id)) {
        state.items.push(action.payload);
      }
    },
    // NEW: Remove by ID
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    // Optional: Clear all
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCartItems, addCartItem, removeCartItem, clearCart } = cartSlice.actions; // Export new ones
export default cartSlice.reducer;