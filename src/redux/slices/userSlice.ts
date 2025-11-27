import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// 1️⃣ User Data Interface (all optional)
export interface UserData {
  profilePicture?: { url: string } | null;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  bio?: string;
  headline?: string;
  expertise?: string;
  phone?: string;
  rating?: string;
  courses?: string[];
  cart?:string[];
  wishlist?:string[];
}

// 2️⃣ Slice State Type
interface UserState {
  userData: UserData;
}

// 3️⃣ Initial State - clean & minimal
const initialState: UserState = {
  userData: {},
};

// 4️⃣ Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      state.userData = {
        ...state.userData,
        ...action.payload, // merge, do NOT replace
      };
    },
    clearUserData: (state) => {
      state.userData = {}; // ✅ Add this for logout
    },
  },
});

// 5️⃣ Export actions
export const { setUserData, clearUserData } = userSlice.actions;

// 6️⃣ Selector
export const selectUserCourses = (state: RootState) =>
  state.user.userData.courses ?? [];

// 7️⃣ Export reducer
export default userSlice.reducer;