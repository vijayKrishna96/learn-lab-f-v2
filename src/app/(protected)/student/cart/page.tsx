"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import styles from "./cart.module.scss";
import { RootState } from "@/redux/store";
import { selectUserCart, setUserData } from "@/redux/slices/userSlice";
import { removeCartItem, setCartItems } from "@/redux/slices/cartSlice";
import { removeFromCartAPI } from "@/services/cartService";

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

interface InstructorDetails {
  name: string;
}

interface Course {
  _id: string;
  userId: string;
  title: string;
  image?: { url: string };
  modules: Module[];
  price: number;
  averageRating: number;
  instructorDetails?: InstructorDetails;
}

interface DecodedToken {
  items: string[];
  instructorIds: string[];
}

export default function Page() {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData) as UserData | null;
  const userCart = useSelector(selectUserCart);
  const cartItems = useSelector((state: RootState) => state.cart.items) as Course[];

  // Reusable fetch function
  const fetchAndPopulateCart = async () => {
    if (!userData?.cart || userData.cart.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:4500/courses/cart", {
        ids: userData.cart,
      });

      console.log(response.data, "Fetched courses");
      dispatch(setCartItems(response.data.courses || []));
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching cart courses:", err);
      setError(err.message || "Failed to load cart");
      setLoading(false);
    }
  };

  // Fetch and populate on mount if empty (handles refresh)
  useEffect(() => {
    if (cartItems.length > 0) {
      setLoading(false);
      return;
    }

    fetchAndPopulateCart();
  }, []); // Only on mount

  // Optional: Sync if userCart changes externally
  useEffect(() => {
    if (userCart.length !== cartItems.length) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0 && userCart.length > 0) {
          fetchAndPopulateCart();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userCart.length, cartItems.length]);

  // Handle Remove
  const handleRemoveFromCart = async (courseId: string) => {
    try {
      // TODO: Call backend API
      await removeFromCartAPI(courseId)

      // Optimistically update Redux cart
      dispatch(removeCartItem(courseId));

      // Optimistically update userData.cart
      if (userData) {
        const updatedCart = userCart.filter(id => id !== courseId);
        dispatch(setUserData({ ...userData, cart: updatedCart }));
      }
    } catch (error: any) {
      console.error("Remove from cart error:", error.response?.data || error.message);
      setError("Failed to remove item from cart");
    }
  };

  // Handle Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsProcessingPayment(true);
    try {
      // TODO: Implement checkout logic
      console.log("Processing checkout...");
      // await processPayment();
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError("Failed to process checkout");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingWrapper}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorWrapper}>Error: {error}</div>;
  }

  const totalPrice = cartItems.reduce((sum, course) => sum + course.price, 0);

  return (
    <div className={styles.cartDashboard}>
      <div className={styles.cartContainer}>
        <h2 className={styles.heading}>Shopping Cart</h2>
        <p className={styles.subHeading}>
          {cartItems.length} Course{cartItems.length !== 1 ? "s" : ""} in cart
        </p>

        <div className={styles.gridContainer}>
          {/* CART ITEMS */}
          <div className={styles.cartItems}>
            {cartItems.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              cartItems.map((course: Course) => (
                <div className={styles.cartItem} key={course._id}>
                  <img
                    src={course.image?.url || "/placeholder.jpg"}
                    alt={course.title}
                  />

                  <div className={styles.details}>
                    <h3>{course.title}</h3>

                    <p>
                      By <strong>{course.instructorDetails?.name || "Unknown Instructor"}</strong>
                    </p>

                    <button onClick={() => handleRemoveFromCart(course._id)}>
                      Remove from cart
                    </button>
                  </div>

                  <p className={styles.price}>₹ {course.price}</p>
                </div>
              ))
            )}
          </div>

          {/* CHECKOUT SECTION */}
          <div className={styles.checkoutSection}>
            <div className={styles.card}>
              <h3>Total:</h3>
              <p>₹ {totalPrice}</p>
              <button 
                onClick={handleCheckout}
                disabled={isProcessingPayment || cartItems.length === 0}
              >
                {isProcessingPayment ? "Processing..." : "Checkout"}
              </button>
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