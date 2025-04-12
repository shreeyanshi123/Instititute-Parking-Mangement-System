import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";


const Profile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
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
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => setError("Error fetching user",err));
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

  const handleSaveChanges = () => {
    setUser({ ...user, name: newUsername, email: newEmail });
    toast.success("Profile updated successfully!");
    setShowEditModal(false);
  };

  const handleChangePassword = () => {
    toast.success("Password changed successfully!");
    setShowChangePassword(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-1/4 bg-white shadow-md p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
          {user.name.charAt(0)}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.role}</p>

        <nav className="mt-6 space-y-2 w-full text-center">
          <Link to={user.role === "admin" ? "/admin/home" : "/user/home"}   className="block py-2 text-gray-600 hover:text-blue-600">Home</Link>
          <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">Parking Logs</a>
          <button onClick={() => setShowChangePassword(true)} className="block w-full py-2 text-gray-600 hover:text-blue-600">Change Password</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="mt-6 space-y-4">
          <p className="text-lg"><strong>Name:</strong> {user.name} </p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg"><strong>Role:</strong> {user.role}</p>
          <p className="text-lg"><strong>Phone:</strong> {user.phone_number}</p>
        </div>

        <div className="mt-6 space-x-4">
          <button onClick={() => setShowEditModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            ✏️ Edit Profile
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            🚪 Logout
          </button>
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
    </div>
  );
};

export default Profile;