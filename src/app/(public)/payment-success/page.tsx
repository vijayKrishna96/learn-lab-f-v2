"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/slices/cartSlice";
import { setUserData } from "@/redux/slices/userSlice";
import { verifyPaymentAPI, pollPaymentStatusAPI } from "@/services/cartService";
import styles from "./payment-success.module.scss"; // Create this CSS module

interface UserData {
  _id: string;
  name: string;
  cart: string[];
  courses?: string[];
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const userData = useSelector((state: RootState) => state.user.userData) as UserData | null;

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      setStatus("error");
      setMessage("No session ID found. Please check your purchase history.");
      return;
    }

    if (!userData) {
      setStatus("error");
      setMessage("Please log in to verify your purchase.");
      return;
    }

    handlePaymentVerification(sessionId);
  }, []);

  // Countdown timer for redirect
  useEffect(() => {
    if (status === "success" && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && redirectCountdown === 0) {
      router.push("/student/mylearnings");
    }
  }, [status, redirectCountdown, router]);

  const handlePaymentVerification = async (sessionId: string) => {
    if (!userData) return;

    let attempts = 0;
    const maxAttempts = 5;
    const retryDelay = 2000;

    const attemptVerification = async (): Promise<boolean> => {
      try {
        const result = await verifyPaymentAPI(sessionId);

        if (result.success) {
          // Update Redux state
          dispatch(clearCart());
          const updatedUserData = {
            ...userData,
            cart: [],
            courses: [...(userData.courses || []), ...(result.courseIds || [])]
          };
          dispatch(setUserData(updatedUserData));

          setPurchasedCourses(result.courseIds || []);
          setStatus("success");
          setMessage("Payment successful! Redirecting to your courses...");
          return true;
        }
        
        return false;
      } catch (err) {
        console.error(`Verification attempt ${attempts + 1} failed:`, err);
        return false;
      }
    };

    // Try verification with retries
    while (attempts < maxAttempts) {
      attempts++;
      setMessage(`Verifying payment... (attempt ${attempts}/${maxAttempts})`);
      
      const success = await attemptVerification();
      if (success) {
        return;
      }

      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    // If all attempts fail, try polling payment status
    setMessage("Checking payment status with server...");
    
    try {
      const statusResult = await pollPaymentStatusAPI(sessionId);
      
      if (statusResult.status === "completed") {
        // Update Redux state
        dispatch(clearCart());
        const updatedUserData = {
          ...userData,
          cart: [],
          courses: [...(userData.courses || []), ...statusResult.courseIds]
        };
        dispatch(setUserData(updatedUserData));

        setPurchasedCourses(statusResult.courseIds);
        setStatus("success");
        setMessage("Payment confirmed! Redirecting to your courses...");
      } else if (statusResult.status === "pending") {
        setStatus("pending");
        setMessage("Payment is still processing. You'll receive an email when it's complete.");
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (err) {
      console.error("Payment verification failed completely:", err);
      setStatus("error");
      setMessage(
        "Unable to verify payment. Your payment may still be processing. " +
        "Please check your email and dashboard. If you were charged but don't see your courses, contact support."
      );
    }
  };

  const handleManualRedirect = () => {
    if (status === "success") {
      router.push("/student/mylearnings");
    } else {
      router.push("/student/cart");
    }
  };

  const handleGoToDashboard = () => {
    router.push("/student/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {status === "loading" && (
          <>
            <div className={styles.spinner}></div>
            <h1>Processing Your Payment</h1>
            <p>{message}</p>
            <p className={styles.note}>Please don't close this window...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h1>Payment Successful!</h1>
            <p>Congratulations! You've successfully enrolled in {purchasedCourses.length} course{purchasedCourses.length !== 1 ? 's' : ''}.</p>
            
            <div className={styles.successDetails}>
              <p>Your courses have been added to "My Learnings".</p>
              <p>Redirecting in {redirectCountdown} seconds...</p>
            </div>

            <div className={styles.buttonGroup}>
              <button 
                className={styles.primaryButton}
                onClick={handleManualRedirect}
              >
                Go to My Learnings Now
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <div className={styles.pendingIcon}>⏳</div>
            <h1>Payment Processing</h1>
            <p>{message}</p>
            <div className={styles.pendingInfo}>
              <p>What to expect:</p>
              <ul>
                <li>You'll receive a confirmation email once payment is complete</li>
                <li>Your courses will appear in "My Learnings" automatically</li>
                <li>This usually takes 1-5 minutes</li>
              </ul>
            </div>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.secondaryButton}
                onClick={() => router.push("/student/dashboard")}
              >
                Go to Dashboard
              </button>
              <button 
                className={styles.outlineButton}
                onClick={() => router.push("/courses")}
              >
                Browse More Courses
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className={styles.errorIcon}>!</div>
            <h1>Verification Issue</h1>
            <p>{message}</p>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.primaryButton}
                onClick={() => router.push("/student/cart")}
              >
                Return to Cart
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => router.push("/student/mylearnings")}
              >
                Check My Learnings
              </button>
              <button 
                className={styles.outlineButton}
                onClick={() => router.push("/support")}
              >
                Contact Support
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}