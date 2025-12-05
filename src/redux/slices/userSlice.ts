import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// ============================================================================
// INTERFACES - Aligned with Mongoose Schema
// ============================================================================

interface SocialLinks {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface PurchasedCourse {
  course: string; // ObjectId as string
  purchasedAt: string; // ISO date string
}

interface CourseProgress {
  course: string; // ObjectId as string
  progress: number; // 0-100
  lastViewed?: string; // ISO date string
}

// Base User Interface (shared across all roles)
export interface BaseUserData {
  _id?: string;
  name?: string;
  email?: string;
  verified?: boolean;
  bio?: string;
  phone?: string;
  profilePicture?: string;
  headline?: string;
  active?: boolean;
  role?: "student" | "instructor" | "admin";
  socialLinks?: SocialLinks;
  cart?: string[]; // Course ObjectIds as strings
  wishlist?: string[]; // Course ObjectIds as strings
  createdAt?: string;
  updatedAt?: string;
}

// Student-specific fields
export interface StudentData extends BaseUserData {
  role: "student";
  purchasedCourses?: PurchasedCourse[];
  courseProgress?: CourseProgress[];
}

// Instructor-specific fields
export interface InstructorData extends BaseUserData {
  role: "instructor";
  expertise?: string;
  rating?: number;
  courses?: string[]; // Course ObjectIds
  totalIncome?: number;
  studentsTaughtCount?: number;
}

// Admin-specific fields
export interface AdminData extends BaseUserData {
  role: "admin";
}

// Union type for all user roles
export type UserData = StudentData | InstructorData | AdminData | BaseUserData;

// ============================================================================
// SLICE STATE
// ============================================================================
interface UserState {
  userData: UserData;
  isLoading?: boolean;
  error?: string | null;
}

// ============================================================================
// INITIAL STATE
// ============================================================================
const initialState: UserState = {
  userData: {},
  isLoading: false,
  error: null,
};

// ============================================================================
// SLICE
// ============================================================================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set/Update user data (merge)
    setUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.error = null;
    },

    // Clear user data (logout)
    clearUserData: (state) => {
      state.userData = {};
      state.error = null;
      state.isLoading = false;
    },

    // Update specific nested fields
    updateSocialLinks: (state, action: PayloadAction<Partial<SocialLinks>>) => {
      state.userData.socialLinks = {
        ...state.userData.socialLinks,
        ...action.payload,
      };
    },

    // Cart operations
    addToCart: (state, action: PayloadAction<string>) => {
      if (!state.userData.cart) {
        state.userData.cart = [];
      }
      if (!state.userData.cart.includes(action.payload)) {
        state.userData.cart.push(action.payload);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      if (state.userData.cart) {
        state.userData.cart = state.userData.cart.filter(
          (id) => id !== action.payload
        );
      }
    },

    clearCart: (state) => {
      state.userData.cart = [];
    },

    // Wishlist operations
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.userData.wishlist) {
        state.userData.wishlist = [];
      }
      if (!state.userData.wishlist.includes(action.payload)) {
        state.userData.wishlist.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      if (state.userData.wishlist) {
        state.userData.wishlist = state.userData.wishlist.filter(
          (id) => id !== action.payload
        );
      }
    },

    // Student-specific: Update course progress
    updateCourseProgress: (
      state,
      action: PayloadAction<{ courseId: string; progress: number }>
    ) => {
      if (state.userData.role === "student") {
        const studentData = state.userData as StudentData;
        if (!studentData.courseProgress) {
          studentData.courseProgress = [];
        }
        
        const existingProgress = studentData.courseProgress.find(
          (cp) => cp.course === action.payload.courseId
        );
        
        if (existingProgress) {
          existingProgress.progress = action.payload.progress;
          existingProgress.lastViewed = new Date().toISOString();
        } else {
          studentData.courseProgress.push({
            course: action.payload.courseId,
            progress: action.payload.progress,
            lastViewed: new Date().toISOString(),
          });
        }
      }
    },

    // Student-specific: Add purchased course
    addPurchasedCourse: (state, action: PayloadAction<string>) => {
      if (state.userData.role === "student") {
        const studentData = state.userData as StudentData;
        if (!studentData.purchasedCourses) {
          studentData.purchasedCourses = [];
        }
        
        const alreadyPurchased = studentData.purchasedCourses.some(
          (pc) => pc.course === action.payload
        );
        
        if (!alreadyPurchased) {
          studentData.purchasedCourses.push({
            course: action.payload,
            purchasedAt: new Date().toISOString(),
          });
        }
      }
    },

    // Instructor-specific: Add course
    addInstructorCourse: (state, action: PayloadAction<string>) => {
      if (state.userData.role === "instructor") {
        const instructorData = state.userData as InstructorData;
        if (!instructorData.courses) {
          instructorData.courses = [];
        }
        if (!instructorData.courses.includes(action.payload)) {
          instructorData.courses.push(action.payload);
        }
      }
    },

    // Instructor-specific: Update income
    updateTotalIncome: (state, action: PayloadAction<number>) => {
      if (state.userData.role === "instructor") {
        (state.userData as InstructorData).totalIncome = action.payload;
      }
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// ============================================================================
// EXPORT ACTIONS
// ============================================================================
export const {
  setUserData,
  clearUserData,
  updateSocialLinks,
  addToCart,
  removeFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  updateCourseProgress,
  addPurchasedCourse,
  addInstructorCourse,
  updateTotalIncome,
  setLoading,
  setError,
} = userSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================
export const selectUserData = (state: RootState) => state.user.userData;
export const selectUserId = (state: RootState) => state.user.userData._id;
export const selectUserRole = (state: RootState) => state.user.userData.role;
export const selectUserEmail = (state: RootState) => state.user.userData.email;
export const selectIsVerified = (state: RootState) => state.user.userData.verified;

// Cart & Wishlist
export const selectUserCart = (state: RootState) => 
  state.user.userData.cart ?? [];
export const selectUserWishlist = (state: RootState) => 
  state.user.userData.wishlist ?? [];
export const selectCartCount = (state: RootState) => 
  state.user.userData.cart?.length ?? 0;
export const selectWishlistCount = (state: RootState) => 
  state.user.userData.wishlist?.length ?? 0;

// Student-specific selectors
export const selectPurchasedCourses = (state: RootState) => 
  state.user.userData.role === "student" 
    ? (state.user.userData as StudentData).purchasedCourses ?? []
    : [];
export const selectCourseProgress = (state: RootState) => 
  state.user.userData.role === "student" 
    ? (state.user.userData as StudentData).courseProgress ?? []
    : [];

// Instructor-specific selectors
export const selectInstructorCourses = (state: RootState) => 
  state.user.userData.role === "instructor"
    ? (state.user.userData as InstructorData).courses ?? []
    : [];
export const selectInstructorRating = (state: RootState) => 
  state.user.userData.role === "instructor"
    ? (state.user.userData as InstructorData).rating
    : undefined;
export const selectTotalIncome = (state: RootState) => 
  state.user.userData.role === "instructor"
    ? (state.user.userData as InstructorData).totalIncome ?? 0
    : 0;
export const selectStudentsTaughtCount = (state: RootState) => 
  state.user.userData.role === "instructor"
    ? (state.user.userData as InstructorData).studentsTaughtCount ?? 0
    : 0;

// Social links
export const selectSocialLinks = (state: RootState) => 
  state.user.userData.socialLinks;

// Loading & Error
export const selectUserLoading = (state: RootState) => 
  state.user.isLoading ?? false;
export const selectUserError = (state: RootState) => 
  state.user.error;

// ============================================================================
// EXPORT REDUCER
// ============================================================================
export default userSlice.reducer;