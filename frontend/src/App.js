import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/common/Profile";
import AddLocation from "./pages/admin/AddLocation";
import AdminLocationDetails from "./pages/admin/AdminLocationDetails";
import EditLocation from "./pages/admin/EditLocation";
import AdminHome from "./pages/admin/AdminHome";
import UserLocationDetails from "./pages/user/UserLocationDetails";
import ProtectedRoute from "./components/common/ProtectedRoute"; // Import the new component

import UserHome from "./pages/user/UserHome";
import GetUser from "./pages/user/GetUser";

function App() {
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
            // <ProtectedRoute>
            <Profile />
            //  </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addlocation"
          element={
            // <ProtectedRoute>
            <AddLocation />
            //  </ProtectedRoute>
          }
        />
        <Route
          path="admin/location/:id"
          element={
            // <ProtectedRoute>
            <AdminLocationDetails />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/location/:id/edit"
          element={
            // <ProtectedRoute>
            <EditLocation />
            // </ProtectedRoute>
          }
        />
        <Route
          path="admin/home"
          element={
            // <ProtectedRoute>
            <AdminHome />
            // </ProtectedRoute>
          }
        />

        <Route
          path="user/home"
          element={
            // <ProtectedRoute>
            <UserHome />
            // </ProtectedRoute>
          }
        />
        <Route
          path="user/getUser"
          element={
            // <ProtectedRoute>
            <GetUser />
            // </ProtectedRoute>
          }
        />
        <Route
          path="user/location/:id"
          element={
            // <ProtectedRoute>
            <UserLocationDetails />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
