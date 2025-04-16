import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineHome } from "react-icons/ai";
import { BsCalendarCheck } from "react-icons/bs";
import { MdAddLocationAlt } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiLogOut } from 'react-icons/fi';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const Profile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [id, setId] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/getUser", { withCredentials: true })
      .then((response) => {
        console.log(response.data); // Debugging
        if (response.data.success) {
          setUser(response.data.user); // Save only the user data
          setNewUsername(response.data.user.name);
          setNewEmail(response.data.user.email);
          setId(response.data.user.user_id);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => setError("Error fetching user", err));
  }, []);



  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }


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

  const handleSaveChanges = async () => {
    const updates = {};

    // Check if there's any change in username or email
    updates.name = newUsername;
    updates.email = newEmail;

    // If no changes were made, show a toast and return early
    if (Object.keys(updates).length === 0) {
      toast.info("No changes made.");
      return;
    }

    try {
      // Update the user profile
      const response = await axios.put(
        `http://localhost:5000/profile/update/${id}`,
        updates,  // Send name and email directly
        { withCredentials: true }
      );

      // Update the user state with the new values
      setUser((prev) => ({ ...prev, ...updates }));

      toast.success("Profile updated successfully!");
      setShowEditModal(false);  // Close the modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };


  const handleChangePassword = async () => {
    try {
      const updatePasswordResponse = await axios.put('http://localhost:5000/profile/updatePassword', {
        id,
        oldPassword,
        newPassword,
      });

      const { success, message } = updatePasswordResponse.data;

      if (success) {
        toast.success("Password changed successfully!");
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(message || "Failed to change password.");
      }

    } catch (error) {
      console.error(error);

      // Backend might return error messages in the response
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error("An error occurred while changing the password.");
      }
    }
  };


  return (
    <div className="min-h-screen flex bg-gray-190">
      {/* Left Sidebar */}
      <aside className="w-1/4 bg-gray-100 text-gray-300 shadow-md p-6 flex flex-col items-center side-bar">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
          {user.name.charAt(0)}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.role}</p>

        {/* className="block py-2 text-gray-600 hover:text-blue-600"  w-full */}

        <nav className="mt-10 space-y-2 w-full flex flex-col items-center">
          <Link to={user.role === "admin" ? "/admin/home" : "/user/home"} 
          className="w-4/5 flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-800 hover:text-blue-400 transition-all duration-200">
            <AiOutlineHome className="text-lg" />
            Home
          </Link>

          <Link
            to={user.role === "admin" ? "/admin/history" : "/user/history"}
            className="w-4/5 flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-800 hover:text-blue-400 transition-all duration-200"
          >
            <BsCalendarCheck className="text-lg" />
            {user.role === "admin" ? "Bookings History" : "Past Bookings"}
          </Link>
          
          {user.role === "admin" && (
            <Link to="/admin/addlocation" 
             className="w-4/5 flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-800 hover:text-blue-400 transition-all duration-200">
              <MdAddLocationAlt className="text-lg" />
              Add Location
            </Link>
          )}

          <button onClick={() => setShowChangePassword(true)}
           className="w-4/5 flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-800 hover:text-blue-400 transition-all duration-200">
            <RiLockPasswordLine className="text-lg" />
            Change Password
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* <h1 className="text-3xl font-bold">Profile</h1> */}

        <nav className="navbar">
          <div className="navbar-left">
            <h2 className="profile-heading">Profile</h2>
          </div>
          <div className="navbar-right">
            <button className="nav-bar-role">{user.role}</button>
            <div className="relative">
              <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <span className="hidden md:inline profile-initial profile-circle">{user.name.charAt(0)}</span>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className=" dot absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red flex items-center"
                  >
                   <FiLogOut className="ml-3 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
        <div className="profile-card">
          <div className="profile-details">
            <h2 className="user-name">{user.name}</h2>
            <div className="info-box">
              <span className="info-title">Email</span>
              <p className="info-value">{user.email}</p>
            </div>
            <div className="info-box">
              <span className="info-title">Role</span>
              <p className="info-value">{user.role}</p>
            </div>
            <div className="info-box">
              <span className="info-title">Phone</span>
              <p className="info-value">{user.phone_number}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-button" onClick={() => setShowEditModal(true)}>Edit Profile</button>
            {/* <button className="logout-button" onClick={handleLogout}>Logout</button> */}
          </div>
        </div>  
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <label className="block mb-2">Username</label>
            <input type="text" className="w-full border p-2 rounded" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <label className="block mt-4 mb-2">Email</label>
            <input type="email" className="w-full border p-2 rounded" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <label className="block mb-2">Old Password</label>
            <input type="password" className="w-full border p-2 rounded" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <label className="block mt-4 mb-2">New Password</label>
            <input type="password" className="w-full border p-2 rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowChangePassword(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleChangePassword} className="bg-green-500 text-white px-4 py-2 rounded">Change</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Profile;