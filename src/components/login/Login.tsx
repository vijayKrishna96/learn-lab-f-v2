"use client";

import React, { useState, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import Loader from "../loader/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { userLogin } from "@/services/userApi";
import "../styles/theme.css";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await userLogin({ email, password });
      const token = localStorage.getItem("token");
      const userId = user.id;
      const role = user.role;

      if (token && userId) {
        switch (role) {
          case "student":
            router.push(`/student/${userId}`);
            break;
          case "instructor":
            router.push(`/instructor/${userId}`);
            break;
          case "admin":
            router.push(`/admin/${userId}`);
            break;
          default:
            toast.error("Unknown user role");
        }
        onClose();
      } else {
        toast.error("Authentication failed.");
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      if (message === "User not found") toast.error("User not found!");
      else if (message === "Invalid password") toast.error("Invalid password!");
      else if (message === "User is not active") toast.error("User is not active!");
      else toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? <Loader /> : "Sign In"}
          </button>

          <p className="text-sm text-center">
            Forgot password?{" "}
            <a href="#" style={{ color: "var(--modal-primary)" }}>
              Click here
            </a>
          </p>
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <a href="#" style={{ color: "var(--modal-primary)" }}>
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
