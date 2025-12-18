"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./signup.module.scss";
import { SIGNUP_API } from "@/utils/constants/api";
import { TicketCheckIcon } from "lucide-react";

interface SignupProps {
  isOpenn: boolean;
  onClosee: () => void;
  onSignupSuccess: () => void;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userRole?: "student" | "instructor";
}

const Signup: React.FC<SignupProps> = ({ isOpenn, onClosee, onSignupSuccess }) => {
  const [error, setError] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [isToggled, setToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRole: "student",
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      userRole: isToggled ? "instructor" : "student",
    }));
  }, [isToggled]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (name === "password") {
      setPasswordLengthError(value.length > 0 && value.length < 8);
    }
    if (name === "confirmPassword" || name === "password") {
      setError("");
    }
  };

  const validateForm = (): boolean => {
    const { name, email, password, confirmPassword } = formData;
    
    // Basic validation
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (!password) {
      toast.error("Please enter a password");
      return false;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    
    if (!confirmPassword) {
      toast.error("Please confirm your password");
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userRole: "student",
    });
    setError("");
    setPasswordLengthError(false);
    setToggled(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { name, email, password, userRole } = formData;
      
      // Show loading toast
      const loadingToastId = toast.loading("Creating your account...");
      
      const res = await axios.post(SIGNUP_API, {
        name,
        email,
        password,
        role: userRole,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      if (res.data.success) {
        toast.success(
          <div>
            <div className="font-bold">🎉 Welcome aboard!</div>
            <div className="text-sm">
              Account created successfully as a {userRole}
            </div>
          </div>,
          {
            autoClose: 3000,
            icon: <TicketCheckIcon/>,
          }
        );
        
        // Reset form and close modal after success
        resetForm();
        
        // Delay closing to show success message
        setTimeout(() => {
          onSignupSuccess();
          onClosee();
        }, 1000);
        
      } else {
        toast.error(res.data.message || "Signup failed. Please try again.");
      }
      
    } catch (err: any) {
      // Dismiss any loading toast if exists
      toast.dismiss();
      
      let errorMessage = "Signup failed. Please try again.";
      
      if (err.response) {
        // Server responded with error
        const { data, status } = err.response;
        
        if (status === 400) {
          errorMessage = data.message || "Invalid request. Please check your information.";
        } else if (status === 409) {
          errorMessage = "Email already registered. Please login or use a different email.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        console.error("Signup error response:", data);
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Network error. Please check your connection.";
        console.error("No response received:", err.request);
      } else {
        // Something else
        console.error("Error:", err.message);
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClosee();
  };

  if (!isOpenn) return null;

  return (
    <>
      {/* Toast Container - placed at root level */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <IoCloseCircle 
            className={styles.modalClose} 
            onClick={handleClose}
            title="Close"
          />

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Create Account</h1>

            {/* Role Toggle Switch */}
            <div className={styles.roleToggle}>
              <span className={styles.roleToggleLabel}>
                {isToggled ? "Instructor" : "Student"}
              </span>
              <input
                type="checkbox"
                id="roleToggle"
                checked={isToggled}
                onChange={(e) => setToggled(e.target.checked)}
                className={styles.roleToggleBtn}
                disabled={isLoading}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                name="name"
                placeholder="Full Name"
                className={styles.modalInput}
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className={styles.modalInput}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password (min 8 characters)"
                className={styles.modalInput}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              {passwordLengthError && (
                <p className={styles.passwordError}>
                  Password must be at least 8 characters
                </p>
              )}
            </div>
            
            <div>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className={styles.modalInput}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className={`${styles.modalBtn} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
              By signing up, you agree to our Terms and Privacy Policy
            </div>
            
            <div className="text-center text-sm mt-2">
              <span className="text-gray-600">Already have an account? </span>
              <button 
                type="button"
                className="text-primary-600 font-medium hover:underline"
                onClick={onClosee}
                disabled={isLoading}
              >
                Login here
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;