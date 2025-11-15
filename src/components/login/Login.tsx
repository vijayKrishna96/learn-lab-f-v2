"use client";

import React, { useState, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import Loader from "../loader/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { userLogin } from "@/services/userApi";
import "../styles/theme.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setUserData } from "@/redux/slices/userSlice";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  // Handle login
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await userLogin({ email, password });
      console.log("Login response:", response);

      // Validate response
      if (!response || !response.token || !response.user) {
        toast.error("Invalid login response");
        return;
      }

      const { token, user } = response;

      // Store token with proper path
      document.cookie = `accessToken=${token}; path=/; SameSite=Strict; Secure; Max-Age=86400`;

      const userStore = {
        _id: user.id,
        email: user.email,
        role: user.role,
      };

      localStorage.setItem("user", JSON.stringify(userStore));

      // Redirect based on user role
      switch (user.role) {
        case "student":
          router.push("/student/dashboard");
          break;
        case "instructor":
          router.push("/instructor/dashboard");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          toast.error("Unknown user role");
      }
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Don't render modal if it's closed
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <IoCloseCircle className="modal-close" onClick={onClose} />

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold text-center">Sign In</h3>

          <label>Email</label>
          <input
            type="email"
            className="modal-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            className="modal-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
