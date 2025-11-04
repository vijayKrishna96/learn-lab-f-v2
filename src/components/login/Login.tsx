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
      const response = await userLogin({ email, password }); 
      // expected response => { user: { role: "student" }, token: "...." }

      const role = response.user.role;

      // Redirection based on role
      if (role === "student") router.push("/student/dashboard");
      else if (role === "instructor") router.push("/instructor/dashboard");
      else if (role === "admin") router.push("/admin");
      else toast.error("Unknown user role");

      onClose();

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

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? <Loader /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
