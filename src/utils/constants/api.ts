// Ensure you're using the correct types for environment variables.
const BaseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || ''; 

// Auth endpoints
const loginEndpoint: string = process.env.NEXT_PUBLIC_LOGIN_USER || '';
const verifyEndpoint: string = process.env.NEXT_PUBLIC_VERIFY_USER || '';
const signupEndpoint: string = process.env.NEXT_PUBLIC_REGISTER_USER || '';
const logoutEndpoint: string = process.env.NEXT_PUBLIC_LOGOUT_USER || '';

// All Courses
const allCourseEndpoint: string = process.env.NEXT_PUBLIC_ALL_COURSE || '';
const allCourseByUserId: string = process.env.NEXT_PUBLIC_GET_COURSEBY_USERID || '';
const singleCourseById : string = process.env.NEXT_PUBLIC_GET_COURSE || '';

// User
const userDetailsEndpoint: string = process.env.NEXT_PUBLIC_USER_DETAILS || '';
const updateUserDetails: string = process.env.NEXT_PUBLIC_UPDATE_USER || '';
const updateInstructor: string = process.env.NEXT_PUBLIC_UPDATE_INSTRUCTOR || '';
const allUsersEndpoint: string = process.env.NEXT_PUBLIC_ALL_USERS || '';

// Category
const AllCategoryEndpoint: string = process.env.NEXT_PUBLIC_ALL_CATEGORY || '';

// Cart
const cartApi: string = process.env.NEXT_PUBLIC_CARTITEMS || '';

// Wishlist
const wishlistApi: string = process.env.NEXT_PUBLIC_WISHLIST || '';

// Stripe Payment
const StripePaymentApi: string = process.env.NEXT_PUBLIC_STRIPE_PAYMENT || '';

export const BASE_URL_API: string = BaseUrl;

// Auth
export const SIGNUP_API: string = `${BaseUrl}${signupEndpoint}`;
export const LOGIN_API: string = `${BaseUrl}${loginEndpoint}`;
export const VERIFY_API: string = `${BaseUrl}${verifyEndpoint}`;
export const LOGOUT_API: string = `${BaseUrl}${logoutEndpoint}`;

// Category
export const ALL_CATEGORY_API: string = `${BaseUrl}${AllCategoryEndpoint}`;

// User
export const USER_DETAILS_API: string = `${BaseUrl}${userDetailsEndpoint}`;
export const UPDATE_USER_DETAILS: string = `${BaseUrl}${updateUserDetails}`;
export const UPDATE_INSTRUCTOR: string = `${BaseUrl}${updateInstructor}`;
export const ALL_USERS_API: string = `${BaseUrl}${allUsersEndpoint}`;

// Course
export const ALL_COURSE_API: string = `${BaseUrl}${allCourseEndpoint}`;
export const COURSE_BY_ID_API: string = `${BaseUrl}${singleCourseById}`; // Ensure this is correct; otherwise, modify.
export const CART_ITEMS_API: string = `${BaseUrl}${cartApi}`;
export const WISHLIST_API: string = `${BaseUrl}${wishlistApi}`;
export const ALL_COURSE_BY_USERID: string = `${BaseUrl}${allCourseByUserId}`;
export const UPDATE_COURSE_API: string = `${BaseUrl}${allCourseEndpoint}`;
export const ADD_NEW_COURSE: string = `${BaseUrl}${allCourseEndpoint}`;

// Stripe Payment
export const STRIPE_PAYMENT_API: string = `${BaseUrl}${StripePaymentApi}`;
