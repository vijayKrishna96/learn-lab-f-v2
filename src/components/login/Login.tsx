// pages/components/Login.tsx
import React, { useState, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import Loader from "../loader/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { userLogin } from "@/services/userApi";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();
  
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
  
    const data = {
      email: email,
      password: password,
    };
  
    try {
      // userLogin returns the user object (from your API service)
      const user = await userLogin(data);
      
      // The token is already stored in localStorage by userLogin function
      const token = localStorage.getItem("token");
      const userId = user.id;
      const role = user.role;

      if (token && userId) {
        // Navigate based on user role
        switch(role) {
          case 'student':
            router.push(`/student/${userId}`);
            break;
          case 'instructor':
            router.push(`/instructor/${userId}`);
            break;
          case 'admin':
            router.push(`/admin/${userId}`);
            break;
          default:
            toast.error("Unknown user role");
            setLoading(false);
            return;
        }
        onClose();
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err.response);
      if (err.response?.data?.message === 'User not found') {
        toast.error("User not Found, Check the email!");
      } else if (err.response?.data?.message === "Invalid password") {
        toast.error("Invalid password, please try again!");
      } else if (err.response?.data?.message === 'User is not active') {
        toast.error("User is not active!");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/20">
      <div className="p-4 rounded-md max-w-md h-[60%] relative mt-16 mr-10">
        <IoCloseCircle
          className="absolute top-2 right-2 text-4xl cursor-pointer text-red-400"
          onClick={onClose}
        />
        <form
          onSubmit={handleLogin}
          className="bg-white border border-sky-500 p-4 shadow-md rounded-md"
        >
          <h3 className="text-3xl text-center uppercase text-black font-semibold">
            Sign In
          </h3>
          <div className="flex flex-col p-6 mt-3">
            <label className="text-2xl my-2">Email</label>
            <input
              type="email"
              className="box my-5 border rounded p-2"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label className="text-2xl my-2">Password</label>
            <input
              type="password"
              className="box my-5 border rounded p-2"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="check-box flex items-center gap-2 px-8">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button
            type="submit"
            className="btn text-center w-full my-5 bg-primarybtn p-2 text-lg"
            disabled={loading}
          >
            {loading ? <Loader /> : "Sign In"}
          </button>
          <p>
            Forgot password?{" "}
            <a href="#" className="text-sky-500">
              Click here
            </a>
          </p>
          <p>
            Don't have an account?{" "}
            <a href="#" className="text-sky-500">
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;