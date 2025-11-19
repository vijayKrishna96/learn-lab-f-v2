import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import { persistReducer, persistStore } from 'redux-persist';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'theme'], // Persist both user and theme
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;