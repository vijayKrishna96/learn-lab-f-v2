"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styles from "./cart.module.scss";
import { RootState } from "@/redux/store";
import { selectUserCart, setUserData } from "@/redux/slices/userSlice";
import { removeCartItem, setCartItems, clearCart } from "@/redux/slices/cartSlice";
import { 
  createCheckoutSessionAPI, 
  fetchCartCoursesAPI, 
  removeFromCartAPI, 
  verifyPaymentAPI,
  pollPaymentStatusAPI 
} from "@/services/cartService";

interface Course {
  _id: string;
  title: string;
  image?: { url: string };
  modules?: Array<{ 
    _id?: string;
    title?: string;
    lessons?: Array<{ 
      _id?: string; 
      title?: string; 
      duration?: string | number 
    }> 
  }>;
  price: number;
  averageRating: number;
  instructorDetails?: { name: string };
}

interface UserData {
  _id: string;
  name: string;
  cart: string[];
  courses?: string[];
}

const calculateCourseDuration = (course: Course): number => {
  if (!course.modules || !Array.isArray(course.modules)) return 0;
  
  let totalMinutes = 0;
  course.modules.forEach(module => {
    if (module.lessons && Array.isArray(module.lessons)) {
      module.lessons.forEach(lesson => {
        if (lesson.duration) {
          const durationNum = typeof lesson.duration === 'string' 
            ? parseInt(lesson.duration, 10) 
            : lesson.duration;
          totalMinutes += isNaN(durationNum) ? 0 : durationNum;
        }
      });
    }
  });
  
  return totalMinutes / 60;
};

const getSafeRating = (course: Course): number => {
  return course.averageRating && !isNaN(course.averageRating) 
    ? course.averageRating 
    : 0;
};

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  
  const initialLoadRef = useRef(false);
  const verificationAttemptedRef = useRef(false);

  const userData = useSelector((state: RootState) => state.user.userData) as UserData | null;
  const userCart = useSelector(selectUserCart);
  const cartItems = useSelector((state: RootState) => state.cart.items) as Course[];

  // Fetch cart courses
  const fetchCartCourses = useCallback(async () => {
    if (!userData?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (userData.cart && userData.cart.length > 0) {
        const courses = await fetchCartCoursesAPI(userData.cart);
        dispatch(setCartItems(courses || []));
      } else {
        dispatch(setCartItems([]));
      }
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [userData, dispatch]);

  // Initial cart load
  useEffect(() => {
    if (!initialLoadRef.current && userData) {
      initialLoadRef.current = true;
      
      if (cartItems.length === 0) {
        fetchCartCourses();
      } else {
        setLoading(false);
      }
    }
    
    if (!userData) {
      setLoading(false);
    }
  }, [userData, cartItems.length, fetchCartCourses]);

  // Handle payment verification with retry logic
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const paymentSuccess = searchParams.get("payment_success");
    const canceled = searchParams.get("canceled");
    
    if (canceled === "true") {
      setError("Payment was canceled");
      setLoading(false);
      // Clear URL params
      router.replace("/cart");
      return;
    }
    
    if (sessionId && paymentSuccess === "true" && !verificationAttemptedRef.current) {
      verificationAttemptedRef.current = true;
      handlePaymentVerification(sessionId);
    }
  }, [searchParams]);

  // Handle payment verification with polling fallback
  const handlePaymentVerification = async (sessionId: string) => {
    if (!userData) {
      setError("User not authenticated");
      return;
    }
    
    setLoading(true);
    setVerificationStatus("Verifying your payment...");
    setError(null);

    let attempts = 0;
    const maxAttempts = 5;
    const retryDelay = 2000;

    const attemptVerification = async (): Promise<boolean> => {
      try {
        const result = await verifyPaymentAPI(sessionId);

        if (result.success) {
          setVerificationStatus("Payment successful! Redirecting...");
          
          // Update Redux state
          dispatch(clearCart());
          const updatedUserData = {
            ...userData,
            cart: [],
            courses: [...(userData.courses || []), ...(result.courseIds || [])]
          };
          dispatch(setUserData(updatedUserData));

          // Redirect to dashboard
          setTimeout(() => {
            router.push(`/dashboard?payment=success&courses=${result.courseIds?.join(",") || ""}`);
          }, 1500);

          return true;
        }
        
        return false;
      } catch (err: any) {
        console.error(`Verification attempt ${attempts + 1} failed:`, err);
        return false;
      }
    };

    // Try verification with retries
    while (attempts < maxAttempts) {
      attempts++;
      setVerificationStatus(`Verifying payment... (attempt ${attempts}/${maxAttempts})`);
      
      const success = await attemptVerification();
      if (success) {
        setLoading(false);
        return;
      }

      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    // If all attempts fail, try polling payment status
    setVerificationStatus("Checking payment status with server...");
    
    try {
      const status = await pollPaymentStatusAPI(sessionId);
      
      if (status.status === "completed") {
        setVerificationStatus("Payment confirmed! Redirecting...");
        
        dispatch(clearCart());
        const updatedUserData = {
          ...userData,
          cart: [],
          courses: [...(userData.courses || []), ...status.courseIds]
        };
        dispatch(setUserData(updatedUserData));

        setTimeout(() => {
          router.push(`/dashboard?payment=success&courses=${status.courseIds.join(",")}`);
        }, 1500);
      } else if (status.status === "pending") {
        setError("Payment is still processing. Please check your dashboard in a few minutes.");
        setTimeout(() => router.push("/dashboard"), 3000);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (err: any) {
      console.error("Payment verification failed completely:", err);
      setError(
        "Unable to verify payment. Your payment may still be processing. " +
        "Please check your email and dashboard. If you were charged but don't see your courses, contact support."
      );
      setTimeout(() => router.push("/dashboard"), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (courseId: string) => {
    if (!userData) return;

    try {
      setError(null);
      
      dispatch(removeCartItem(courseId));
      const updatedCart = userCart.filter(id => id !== courseId);
      dispatch(setUserData({ ...userData, cart: updatedCart }));

      await removeFromCartAPI(courseId);
    } catch (err: any) {
      console.error("Remove from cart error:", err);
      await fetchCartCourses();
      setError("Failed to remove item. Please try again.");
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0 || !userData) {
      setError("Cart is empty or user not logged in");
      return;
    }

    setIsProcessingCheckout(true);
    setError(null);

    try {
      const { sessionId, url } = await createCheckoutSessionAPI({
        courseIds: cartItems.map(c => c._id),
        userId: userData._id
      });

      if (sessionId) {
        localStorage.setItem("lastCheckoutSessionId", sessionId);
        localStorage.setItem("checkoutTimestamp", Date.now().toString());
      }

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to process checkout. Please try again.");
      setIsProcessingCheckout(false);
    }
  };

  // Calculate totals
  const totalPrice = cartItems.reduce((sum, course) => {
    const price = course.price && !isNaN(course.price) ? course.price : 0;
    return sum + price;
  }, 0);
  
  const totalHours = cartItems.reduce((sum, course) => {
    return sum + calculateCourseDuration(course);
  }, 0);

  const handleRetry = () => {
    setError(null);
    fetchCartCourses();
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>{verificationStatus || "Loading your cart..."}</p>
      </div>
    );
  }

  return (
    <div className={styles.cartDashboard}>
      <div className={styles.cartContainer}>
        <h2 className={styles.heading}>Shopping Cart</h2>
        
        {error && (
          <div className={styles.errorBanner}>
            <p>{error}</p>
            {!error.includes("contact support") && (
              <button onClick={handleRetry}>Retry</button>
            )}
          </div>
        )}

        <p className={styles.subHeading}>
          {cartItems.length} Course{cartItems.length !== 1 ? "s" : ""} in cart
        </p>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <button 
              onClick={() => router.push("/courses")}
              className={styles.browseBtn}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className={styles.gridContainer}>
            {/* CART ITEMS */}
            <div className={styles.cartItems}>
              {cartItems.map((course) => {
                const courseHours = calculateCourseDuration(course);
                const safeRating = getSafeRating(course);
                const moduleCount = course.modules?.length || 0;
                const instructorName = course.instructorDetails?.name || "Unknown Instructor";
                const imageUrl = course.image?.url || "/placeholder-course.jpg";
                const coursePrice = course.price && !isNaN(course.price) ? course.price : 0;

                return (
                  <div className={styles.cartItem} key={course._id}>
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className={styles.courseImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-course.jpg";
                      }}
                    />

                    <div className={styles.details}>
                      <h3>{course.title || "Untitled Course"}</h3>
                      <p className={styles.instructor}>By {instructorName}</p>
                      <p className={styles.metadata}>
                        {safeRating.toFixed(1)} ⭐ • {moduleCount} Modules • {courseHours.toFixed(1)} Hours
                      </p>
                      <button 
                        className={styles.removeBtn}
                        onClick={() => handleRemoveFromCart(course._id)}
                        disabled={isProcessingCheckout}
                      >
                        Remove from cart
                      </button>
                    </div>

                    <p className={styles.price}>₹ {coursePrice.toLocaleString("en-IN")}</p>
                  </div>
                );
              })}
            </div>

            {/* CHECKOUT SECTION */}
            <div className={styles.checkoutSection}>
              <div className={styles.card}>
                <h3>Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>₹ {totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Total Hours:</span>
                  <span>{totalHours.toFixed(1)} hours</span>
                </div>
                <hr />
                <div className={styles.totalRow}>
                  <span>Total:</span>
                  <span className={styles.totalPrice}>₹ {totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <button 
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout || cartItems.length === 0}
                >
                  {isProcessingCheckout ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>

              <div className={styles.promotions}>
                <h3>Promotions</h3>
                <div className={styles.couponInput}>
                  <input 
                    placeholder="Enter Coupon Code" 
                    disabled={isProcessingCheckout}
                  />
                  <button disabled={isProcessingCheckout}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}