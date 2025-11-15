

import themeReducer from './slices/themeSlice'; // Add this
import userReducer from './slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // cart: cartReducer,
    // wishlist: wishlistReducer,
    user: userReducer,
    theme: themeReducer, // Add this
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;