import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import { Link } from "react-router-dom";
import axios from "axios";



const AdminHistory = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  // Fetch bookings data
  useEffect(() => {
    const fetchBookingsOverview = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/bookings");
        setBookings(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch bookings data");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookingsOverview();
  }, []); // Empty dependency array to run only once on mount

  // Fetch users data
  useEffect(() => {
    const fetchUsersOverview = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/users/overview");
        setUsers(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch users data");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsersOverview();
  }, []); // Empty dependency array to run only once on mount

  // Handle loading states and errors
  if (loadingBookings || loadingUsers) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filtered = bookings.filter((b) =>
    [b.user, b.vehicle, b.location].some((val) =>
      val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <AdminNavbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-4 border-r bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">🧍‍♂️ Users Overview</h2>
          {users.map((user, idx) => (
            <div key={idx} className="mb-4 border p-3 rounded shadow-sm bg-white">
              <h3 className="font-medium">{user.name}</h3>
              <p>Total Bookings: {user.total_bookings}</p>
              <p>Current Bookings: {user.current_bookings}</p>
              <Link
               to={ `/admin/user/${user.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View History
              </Link>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">📋 All Past Bookings</h1>

          {/* Search Bar
          <input
            type="text"
            placeholder="Search by user, vehicle, or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-4 border rounded shadow-sm"
          /> */}

          {/* Scrollable Table */}
          <div className="overflow-auto max-h-[400px] border rounded shadow">
            <table className="min-w-full text-sm table-auto">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Slot</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Start Time</th>
                  <th className="p-2 text-left">End Time</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Vehicle No.</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((b, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{b.location}</td>
                      <td className="p-2">{b.slot}</td>
                      <td className="p-2">{b.user}</td>
                      <td className="p-2">{b.start}</td>
                      <td className="p-2">{b.end}</td>
                      <td className="p-2">{b.status}</td>
                      <td className="p-2">{b.vehicle}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center" colSpan="7">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;
