import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/common/Profile";
import AddLocation from "./pages/admin/AddLocation";
import AdminLocationDetails from "./pages/admin/AdminLocationDetails";
import EditLocation from "./pages/admin/EditLocation";
import AdminHome from "./pages/admin/AdminHome";
import UserLocationDetails from "./pages/user/UserLocationDetails";


import UserHome from "./pages/user/UserHome";
import GetUser from "./pages/user/GetUser";
import UserHistory from "./pages/user/UserHistory";
import VisitorLocationDetails from "./pages/user/VisitorLocationDetails"
import VisitorNotifications from "./pages/user/VisitorNotifications";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminUserHistory from "./pages/admin/AdminUserHistory";
import CheckAuth from "./components/common/check-auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/getUser", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />

        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            
            <Profile />
            
          }
        />
        <Route
          path="/admin/addlocation"
          element={
            
            <AddLocation />
            
          }
        />
        <Route
          path="admin/location/:id"
          element={
            
            <AdminLocationDetails />
            
          }
        />
        <Route
          path="/admin/location/:id/edit"
          element={
            
            <EditLocation />
            
          }
        />
        <Route
          path="admin/home"
          element={
            
            <AdminHome />
            
          }
        />
         <Route
          path="admin/history"
          element={
            
            <AdminHistory />
            
          }
        />
         <Route
          path="admin/user/:userId"
          element={
            
            <AdminUserHistory />
            
          }
        />

        <Route
          path="user/home"
          element={
            
            <UserHome />
            
          }
        />
        <Route
          path="user/getUser"
          element={
            
            <GetUser />
            
          }
        />
        <Route
          path="user/history"
          element={
            
            <UserHistory />
            
          }
        />
        <Route
          path="user/location/:id"
          element={
            
            <UserLocationDetails />
            
          }
        />
        <Route
          path="visitor/location/:id"
          element={
            
            <VisitorLocationDetails />
            
          }
        />
        <Route path="/visitor/notifications" 
        element={<VisitorNotifications />} 
        />

      </Routes>
    </Router>
  );
}

export default App;
