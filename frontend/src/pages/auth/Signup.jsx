import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import backgroundImage from "../../assets/iiita_parking.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        formData
      );

      if (response.data.success) {
        setShowOTPModal(true);
        toast.info("OTP sent successfully. Please verify.");
      } else {
        toast.error(response.data.message || "Error during registration.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  const handleOTPVerification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/verify-otp",
        { email: formData.email, otp }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        setTimeout(() => {
          setShowOTPModal(false);
          if(formData.role === "faculty_student"){
            navigate("/user/home");
          } else if(formData.role === "admin"){
            navigate("/admin/home");
          }
        }, 3000);

        // Clear form data only on successful registration
        setFormData({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          role: "",
        });
      } else {
        toast.error(response.data.message || "Invalid OTP.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error("Error:", error.response?.data || error.message);
    if (error.response) {
      toast.error(error.response.data.message || "Server Error!");
    } else if (error.request) {
      toast.error("No response from server. Please try again.");
    } else {
      toast.error("Failed to connect to the server.");
    }
  };

  return (
    <>
    
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-gray-800/90 p-8 rounded-lg shadow-xl backdrop-blur-md w-full max-w-md border border-white/20 overflow-hidden">
        <h2 className="text-3xl font-bold text-center text-white mb-6 flex items-center justify-center">
          <span className="ml-2">Create Parking Account</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select User Type</option>
            <option value="faculty_student">Faculty/Student</option>
            <option value="visitor">Visitor</option>
          </select>

          {["name", "email", "phone_number", "password"].map((field, index) => (
            <input
              key={index}
              type={field === "password" ? "password" : "text"}
              placeholder={
                field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")
              }
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          ))}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        {/* OTP Modal */}
        {showOTPModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
              <h3 className="text-white text-2xl mb-4">OTP Verification</h3>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleOTPVerification}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                >
                  Verify OTP
                </button>

                <button
                  onClick={() => setShowOTPModal(false)}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
        <ToastContainer style={{ zIndex: 9999 }} />
    </div>
    </>
  );
};

export default Signup;
