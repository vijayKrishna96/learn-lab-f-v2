import themeReducer from './slices/themeSlice';
import userReducer, { UserData } from './slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';

let preloadedUser: UserData = {};

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('user');
  if (stored) preloadedUser = JSON.parse(stored);
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
  preloadedState: {
    user: {
      userData: preloadedUser,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
