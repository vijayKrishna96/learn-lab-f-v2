
// import authReducer from './slices/authSlice';
// import cartReducer from './slices/cartSlice';
// import wishlistReducer from './slices/wishlistSlice';
import themeReducer from './slices/themeSlice'; // Add this

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // cart: cartReducer,
    // wishlist: wishlistReducer,
    theme: themeReducer, // Add this
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;