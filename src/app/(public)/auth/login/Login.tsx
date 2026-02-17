"use client";

import React, { useState, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import Loader from "../../../../components/spinner/Spinner";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "../styles/theme.css";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/services/userApi";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Call login API - this sets httpOnly cookies automatically
      const response = await login({ email, password });
      console.log("Login response:", response);

      if (!response?.success || !response?.user) {
        throw new Error("Invalid login response");
      }

      const { user } = response;

      // Show success message
      toast.success(response.message || "Login successful");

      // Close modal
      onClose();

      // Determine redirect path based on role BEFORE refreshing
      const roleLower = user.role.toLowerCase();
      let redirectPath = "/";

      switch (roleLower) {
        case "student":
          redirectPath = "/student/dashboard";
          break;
        case "instructor":
          redirectPath = "/instructor/dashboard";
          break;
        case "admin":
          redirectPath = "/admin";
          break;
        default:
          toast.error("Unknown user role");
          console.error("Unknown role:", user.role);
          setLoading(false);
          return;
      }

      console.log("Redirecting to:", redirectPath);

     
      // console.log("User refreshed, now navigating...");

      // // Give the browser time to persist the cookie before navigating
      // await new Promise((resolve) => setTimeout(resolve, 100));


      window.location.href = redirectPath;
    } catch (err: any) {
      console.error("Login error:", err);

      // Extract error message from various possible error formats
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";

      toast.error(message);
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setEmail("");
    setPassword("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <IoCloseCircle className="modal-close" onClick={handleClose} />

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold text-center">Sign In</h3>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="modal-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="modal-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? <Loader /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
