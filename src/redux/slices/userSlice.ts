// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1️⃣ Define a TypeScript interface for user data
export interface UserData {
  profilePicture?: string;
  _id: string;
  name?: string;
  email: string;
  role: string;
  bio?: string;
  headline?: string;
  expertise?: string;
  phone?: string;
  rating?: string;
  courses?: string[]; // Assuming courses are strings, change if they are objects
}

// 2️⃣ Define the slice state type
interface UserState {
  userData: UserData;
}

// 3️⃣ Initial state
const initialState: UserState = {
  userData: {
    profilePicture: "",
    _id: "",
    name: "",
    email: "",
    role: "",
    bio: "",
    headline: "",
    expertise: "",
    phone: "",
    rating: "",
    courses: [],
  },
};

// 4️⃣ Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    addUserCourse: (state, action: PayloadAction<string>) => {
      state.userData.courses.push(action.payload);
    },
  },
});

// 5️⃣ Export actions
export const { setUserData, addUserCourse } = userSlice.actions;

// 6️⃣ Selector with typed state
import { RootState } from "../store"; // adjust path to your store file

export const selectUserCourses = (state: RootState) =>
  state.user.userData?.courses || [];

// 7️⃣ Export reducer
export default userSlice.reducer;
