"use client";

import { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
// import jwtDecode from "jwt-decode";

// import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// import { clearCart, removeItem } from "@/redux/features/cartSlice";
// import { addUserCourse, selectUserCourses } from "@/redux/features/userSlice";

import styles from "./Cart.module.scss";
// import { STRIPE_PAYMENT_API, UPDATE_COURSE_API, UPDATE_USER_DETAILS } from "@/utils/constants/api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ALL_COURSE_API } from "@/utils/constants/api";

interface Lesson {
  duration: string;
}

interface Module {
  lessons: Lesson[];
}

interface UserData {
  _id: string;
  name: string;
  cart: string[];
}

interface Course {
  _id: string;
  userId: string;
  title: string;
  image?: { url: string };
  modules: Module[];
  price: number;
  averageRating: number;
}

interface DecodedToken {
  items: string[];
  instructorIds: string[];
}

export default function Page() {
  // const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [courses, setCourses] = useState([]); // To store fetched courses
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const userData = useSelector(
    (state: RootState) => state.user.userData
  ) as UserData;

  console.log(userData, "userDatataata");

  useEffect(() => {
    const fetchCourses = async () => {
      if (userData && userData.cart && userData.cart.length > 0) {
        setLoading(true); // Set loading to true before the request starts
        try {
          // Send a POST request with the array of course IDs in the body
          const response = await axios.post(
            "http://localhost:4500/courses/cart",
            {
              ids: userData.cart,
            }
          );

          console.log(response.data, "this is res");

          setCourses(response?.data?.courses); // Assuming the response is an array of courses
        } catch (err) {
          console.error("Error fetching courses:", err);
          setError(err.message || "Something went wrong!");
        } finally {
          setLoading(false); // Set loading to false when the request finishes
        }
      } else {
        // If no courses in the cart, stop loading and show an empty state
        setCourses([]);
        setLoading(false);
      }
    };

    fetchCourses(); // Fetch courses when component mounts or when `userData.cart` changes
  }, [userData.cart]);
  // const cartItems = useSelector((state) => state.cart.cartItems);
  // const userCourses = useSelector(selectUserCourses);

  /** -----------------------------------------------
   *  ✔ Get userId from Redux Persist (preferred)
   *  ✔ fallback to localStorage if needed
   ----------------------------------------------- */
  // const userId =
  //   useSelector((state) => state.user.userData?._id) ||
  //   (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  // const userRole = useSelector((state) => state.user.userData.role);

  // const filteredItems =
  //   cartItems
  //     ?.filter((course: Course) => course.userId === userId)
  //     ?.filter((course: Course) => !userCourses.includes(course._id)) || [];

  //const PK = process.env.NEXT_PUBLIC_STRIPE_PK as string;

  // const makePayment = async () => {
  //   setIsLoading(true);
  //   try {
  //     const stripe = await loadStripe(PK);
  //     const returnUrl = `${window.location.origin}/cart`;

  //     const response = await fetch(STRIPE_PAYMENT_API, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ product: filteredItems, returnUrl }),
  //     });

  //     if (!response.ok) throw new Error("Checkout session creation failed");

  //     const session = await response.json();
  //     if (!session?.id) throw new Error("Invalid session response");

  //     const result = await stripe?.redirectToCheckout({ sessionId: session.id });
  //     if (result?.error) throw new Error(result.error.message);
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  /** -----------------------------------------------
   *  ✔ Handle Stripe Redirect Success
   ----------------------------------------------- */
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const isSuccess = params.get("success") === "true";
  //   const token = params.get("token");

  //   if (!isSuccess || !token || isProcessingPayment) return;

  //   const handleSuccess = async () => {
  //     setIsProcessingPayment(true);

  //     try {
  //       const decoded: DecodedToken = jwtDecode(token);
  //       const itemIds = decoded.items || [];
  //       const instructorIds = decoded.instructorIds || [];

  //       dispatch(addUserCourse(itemIds));
  //       dispatch(clearCart());

  //       await axios.patch(`${UPDATE_USER_DETAILS}/${userId}`, { courses: itemIds });

  //       for (const courseId of itemIds) {
  //         await axios.patch(`${UPDATE_COURSE_API}/${courseId}`, { students: userId });
  //       }

  //       await Promise.all(
  //         instructorIds.map((id) =>
  //           axios.patch(`${UPDATE_USER_DETAILS}/${id}`, { students: [userId] })
  //         )
  //       );

  //       window.location.href = `/${userRole}/${userId}`;
  //     } catch (err) {
  //       console.error("Payment processing error:", err);
  //     } finally {
  //       setIsProcessingPayment(false);
  //     }
  //   };

  //   handleSuccess();
  // }, [isProcessingPayment, userId, userRole, dispatch]);

  if (loading) {
    return <div className={styles.loadingWrapper}>Loading...</div>;
  }

  console.log(courses, "successs");

  return (
    <div className={styles.cartDashboard}>
      <div className={styles.cartContainer}>
      <h2 className={styles.heading}>Shopping Cart</h2>
      <p className={styles.subHeading}>
        Course{courses.count > 1 ? "s" : ""} in cart
      </p>

      <div className={styles.gridContainer}>
        {/* ---------------------------- */}
        {/* CART ITEMS */}
        {/* ---------------------------- */}
        <div className={styles.cartItems}>
          {courses.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            courses.map((course: Course) => {
              return (
                <div className={styles.cartItem} key={course._id}>
                  <img
                    src={course.image?.url || "/placeholder.jpg"}
                    alt={course.title}
                  />

                  <div className={styles.details}>
                    <h3>{course.title}</h3>

                    <p>
                      By <strong>{course.instructorDetails?.name}</strong>
                    </p>

                    <button >
                      Remove from cart
                    </button>
                  </div>

                  <p className={styles.price}>₹ {course.price}</p>
                </div>
              );
            })
          )}
        </div>

        {/* ---------------------------- */}
        {/* CHECKOUT SECTION */}
        {/* ---------------------------- */}
        <div className={styles.checkoutSection}>
          <div className={styles.card}>
            <h3>Total:</h3>
            <p>₹ {courses.reduce((sum, c) => sum + c.price, 0)}</p>
            <button >Checkout</button>
          </div>

          <div className={styles.promotions}>
            <h3>Promotions</h3>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <input placeholder="Enter Coupon" />
              <button>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
