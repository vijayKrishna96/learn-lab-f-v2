import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
}

// ✅ Remove localStorage logic - Redux Persist handles it now
const initialState: ThemeState = {
  theme: 'system', // Simple default
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeState['theme']>) => {
      state.theme = action.payload;
      // ✅ Remove localStorage.setItem - Redux Persist handles it
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;