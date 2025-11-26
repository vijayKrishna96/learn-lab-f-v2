"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import jwtDecode from "jwt-decode";

// import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// import { clearCart, removeItem } from "@/redux/features/cartSlice";
// import { addUserCourse, selectUserCourses } from "@/redux/features/userSlice";

import styles from "./Cart.module.scss";
import { STRIPE_PAYMENT_API, UPDATE_COURSE_API, UPDATE_USER_DETAILS } from "@/utils/constants/api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

interface Lesson {
  duration: string;
}

interface Module {
  lessons: Lesson[];
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
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const userCourses = useSelector(selectUserCourses);

  /** -----------------------------------------------
   *  ✔ Get userId from Redux Persist (preferred)
   *  ✔ fallback to localStorage if needed
   ----------------------------------------------- */
  const userId =
    useSelector((state) => state.user.userData?._id) ||
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  const userRole = useSelector((state) => state.user.userData.role);

  const filteredItems =
    cartItems
      ?.filter((course: Course) => course.userId === userId)
      ?.filter((course: Course) => !userCourses.includes(course._id)) || [];

  const PK = process.env.NEXT_PUBLIC_STRIPE_PK as string;

  const makePayment = async () => {
    setIsLoading(true);
    try {
      const stripe = await loadStripe(PK);
      const returnUrl = `${window.location.origin}/cart`;

      const response = await fetch(STRIPE_PAYMENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: filteredItems, returnUrl }),
      });

      if (!response.ok) throw new Error("Checkout session creation failed");

      const session = await response.json();
      if (!session?.id) throw new Error("Invalid session response");

      const result = await stripe?.redirectToCheckout({ sessionId: session.id });
      if (result?.error) throw new Error(result.error.message);
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /** -----------------------------------------------
   *  ✔ Handle Stripe Redirect Success
   ----------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get("success") === "true";
    const token = params.get("token");

    if (!isSuccess || !token || isProcessingPayment) return;

    const handleSuccess = async () => {
      setIsProcessingPayment(true);

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const itemIds = decoded.items || [];
        const instructorIds = decoded.instructorIds || [];

        dispatch(addUserCourse(itemIds));
        dispatch(clearCart());

        await axios.patch(`${UPDATE_USER_DETAILS}/${userId}`, { courses: itemIds });

        for (const courseId of itemIds) {
          await axios.patch(`${UPDATE_COURSE_API}/${courseId}`, { students: userId });
        }

        await Promise.all(
          instructorIds.map((id) =>
            axios.patch(`${UPDATE_USER_DETAILS}/${id}`, { students: [userId] })
          )
        );

        window.location.href = `/${userRole}/${userId}`;
      } catch (err) {
        console.error("Payment processing error:", err);
      } finally {
        setIsProcessingPayment(false);
      }
    };

    handleSuccess();
  }, [isProcessingPayment, userId, userRole, dispatch]);

  if (isLoading) {
    return <div className={styles.loadingWrapper}>Loading...</div>;
  }

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.heading}>Shopping Cart</h2>
      <p className={styles.subHeading}>
        {filteredItems.length} Course{filteredItems.length > 1 ? "s" : ""} in cart
      </p>

      <div className={styles.gridContainer}>
        {/* ---------------------------- */}
        {/* CART ITEMS */}
        {/* ---------------------------- */}
        <div className={styles.cartItems}>
          {filteredItems.map((course: Course) => {
            const totalMinutes = course.modules
              ?.flatMap((m) => m.lessons)
              ?.reduce((sum, l) => sum + parseInt(l.duration, 10), 0);

            const totalHours = (totalMinutes / 60).toFixed(2);

            return (
              <div className={styles.cartItem} key={course._id}>
                <img src={course.image?.url || "/placeholder.jpg"} alt={course.title} />

                <div className={styles.details}>
                  <h3>{course.title}</h3>
                  <p>
                    {course.averageRating} ⭐️ • {course.modules.length} Modules • {totalHours} Hours
                  </p>

                  <button onClick={() => dispatch(removeItem(course._id))}>
                    Remove from cart
                  </button>
                </div>

                <p className={styles.price}>₹ {course.price}</p>
              </div>
            );
          })}
        </div>

        {/* ---------------------------- */}
        {/* CHECKOUT SECTION */}
        {/* ---------------------------- */}
        <div className={styles.checkoutSection}>
          <div className={styles.card}>
            <h3>Total:</h3>
            <p>₹ {filteredItems.reduce((sum, c) => sum + c.price, 0)}</p>
            <button onClick={makePayment}>Checkout</button>
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
  );
}
