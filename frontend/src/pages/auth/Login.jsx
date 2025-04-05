import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import backgroundImage from "../../assets/iiita_parking.png";
import axios from "axios";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [userdetails, setUserDetails] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        identifier,
        password,
      }, {
        withCredentials: true
      });
  
      if (response.data.success) {
        setUserDetails(response.data.user); // Store user details in state
        if(response.data.user.role === "admin") {
        navigate("/admin/home");
        } else if(response.data.user.role === "faculty_student" || response.data.user.role === "visitor") {
          navigate("/user/home");
        }
      } else {
        toast.error(response.data.message || "Login failed. Please try again.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "An error occurred during login.", { position: "top-right" });
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay for visibility */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-gray-800/90 p-10 rounded-lg shadow-xl backdrop-blur-md w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-6 flex items-center justify-center">
          🚗 <span className="ml-2">Parking Management Login</span>
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
        {/* <ToastContainer style={{ zIndex: 9999 }} /> */}
      </div>
        <ToastContainer style={{ zIndex: 9999 }} />
    </div>
  );
};

export default Login;
