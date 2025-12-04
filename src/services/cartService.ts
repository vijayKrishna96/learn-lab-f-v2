// services/cartService.ts
import axiosInstance from "@/utils/axiosInstance";



interface Course {
  _id: string;
  title: string;
  image?: { url: string };
  modules: any[];
  price: number;
  averageRating: number;
  instructorDetails?: { name: string };
}

interface CheckoutSessionRequest {
  courseIds: string[];
  userId: string;
}

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  success: boolean;
}

interface PaymentVerificationResponse {
  success: boolean;
  courseIds: string[];
  message: string;
  alreadyProcessed?: boolean;
}

interface PaymentStatusResponse {
  status: "pending" | "completed" | "failed" | "expired";
  courseIds: string[];
  amount: number;
  completedAt?: string;
}

/**
 * Fetch cart courses by IDs
 */
export const fetchCartCoursesAPI = async (courseIds: string[]): Promise<Course[]> => {
  try {
    const response = await axiosInstance.post("/courses/cart", { ids: courseIds });
    
    const courses = response.data.courses || [];
    
    return courses.map((course: any) => ({
      _id: course._id || "",
      title: course.title || "Untitled Course",
      image: course.image || { url: "" },
      modules: course.modules || [],
      price: course.price || 0,
      averageRating: course.averageRating || 0,
      instructorDetails: course.instructorDetails || { name: "Unknown Instructor" }
    }));
  } catch (error: any) {
    console.error("Fetch cart courses error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch cart courses");
  }
};

/**
 * Add item to cart
 */
export const addToCartAPI = async (courseId: string): Promise<void> => {
  try {
    const res = await axiosInstance.post(`/cart/add/${courseId}`);
    return res.data;
  } catch (error: any) {
    console.error("Add to cart error:", error);
    throw new Error(error.response?.data?.message || "Failed to add item to cart");
  }
};

/**
 * Remove item from cart
 */
export const removeFromCartAPI = async (courseId: string): Promise<void> => {
  try {
    const res = await axiosInstance.delete(`/cart/remove/${courseId}`);
    return res.data;
  } catch (error: any) {
    console.error("Remove from cart error:", error);
    throw new Error(error.response?.data?.message || "Failed to remove item from cart");
  }
};

/**
 * Create Stripe checkout session
 */
export const createCheckoutSessionAPI = async (
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await axiosInstance.post("/payment/create-checkout", data);
    
    if (!response.data.sessionId || !response.data.url) {
      throw new Error("Invalid checkout session response");
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    throw new Error(
      error.response?.data?.message || 
      "Failed to create checkout session. Please try again."
    );
  }
};

/**
 * Verify payment and complete purchase
 * This is called after Stripe redirects back to the site
 */

export const verifyPaymentPublicAPI = async (sessionId: string) => {
  try {
    const response = await fetch(`http://localhost:4500/payment/verify-public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header needed for this endpoint
      },
      body: JSON.stringify({ sessionId }),
      credentials: 'include', // Important: include cookies
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Payment verification failed');
    }

    return data;
  } catch (error: any) {
    console.error('Public verification error:', error);
    throw error;
  }
};

// Keep your existing verifyPaymentAPI for authenticated calls
export const verifyPaymentAPI = async (sessionId: string) => {
  try {
    const response = await fetch(`http://localhost:4500/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization header will be added by your auth interceptors
      },
      body: JSON.stringify({ sessionId }),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Payment verification failed');
    }

    return data;
  } catch (error: any) {
    console.error('Verification error:', error);
    throw error;
  }
};

/**
 * Poll payment status
 * Used as a fallback when direct verification fails
 */
export const pollPaymentStatusAPI = async (
  sessionId: string
): Promise<PaymentStatusResponse> => {
  try {
    const response = await axiosInstance.get(`/payment/status/${sessionId}`);
    return response.data;
  } catch (error: any) {
    console.error("Poll payment status error:", error);
    throw new Error(
      error.response?.data?.error || 
      "Failed to check payment status"
    );
  }
};

/**
 * Get user's cart
 */
export const getUserCartAPI = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get("/cart");
    return response.data.cart || [];
  } catch (error: any) {
    console.error("Get user cart error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user cart");
  }
};