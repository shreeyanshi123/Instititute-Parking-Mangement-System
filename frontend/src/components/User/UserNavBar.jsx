import { use, useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Bell } from "lucide-react";

const UserNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [role,setRole] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!", { position: "top-right" });
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to logout. Please try again.", { position: "top-right" });
    }
  };
  const getUserDetails = async ()=>{
    try{
      const response = await axios.get("http://localhost:5000/auth/getUser" ,{ withCredentials: true });
      if (response.data.success) {
       
        setRole(response.data.user.role);
        console.log(response.data.user.role,"res.data.user.role")
    } 
  } catch(err) {
    console.error("Failed to fetch notification count", err);
  }
}

  const fetchReservedCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/visitor/getCount", { withCredentials: true });
      if (res.data.success) {
       
        setNotificationCount(res.data.count);
        console.log(res.data.count,"notificationcnt")
      }
    } catch (error) {
      console.error("Failed to fetch notification count", error);
    }
  };
  useEffect(()=>{
    getUserDetails();
  })
  useEffect(() => {
    if (role === "visitor") {
      fetchReservedCount();
    }
  }, [role]);
    return (
        <nav className="bg-gray-900 text-white shadow-md fixed top-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Brand Logo */}
              <p className="text-2xl font-bold text-blue-400">
                 IIITA Parking
              </p>
    
              {/* Right Section (Profile & Add Slots) */}
              <div className="flex space-x-6 items-center">
              

               {role === "visitor" && (
              <div className="relative cursor-pointer">
                <Link to="/visitor/notifications">
                  <Bell className="w-6 h-6 text-white" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
                <Link to="/user/history" className="hidden sm:inline-flex text-white-300 hover:text-white">
                  Bookings
                </Link>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                    👤 <span className="hidden md:inline">Profile</span>
                  </button>
    
                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 View Profile</Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
}

export default UserNavBar
