import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUserHistory = () => {
    const { userId } = useParams();  
    console.log(userId)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState({
    currentBookings: [],
    reservedBookings: [],
    pastBookings: [],
  });

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/admin/users/${userId}`);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching user booking history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, [userId]);

  const BookingCard = ({ booking }) => (
    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-black mb-3">
      <p><strong>Location:</strong> {booking.location_name}</p>
      <p><strong>Slot:</strong> {booking.slot_id}</p>
      <p><strong>Booking Time:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
      <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <p><strong>Vehicle Number:</strong> {booking.vehicle_number}</p>
    </div>
  );

  if (loading) {
    return <div className="p-8">Loading user booking history...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <button
        onClick={() => navigate(-1)}
        className="bg-purple-600 text-white px-4 py-2 rounded mb-6 hover:bg-purple-700"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-6">📋 Booking History (User ID: {userId})</h2>

      {[
        { title: "Current Bookings", color: "text-blue-600", data: bookings.currentBookings },
        { title: "Reserved Visitor Slots", color: "text-yellow-600", data: bookings.reservedBookings },
        { title: "Past Bookings", color: "text-black", data: bookings.pastBookings },
      ].map((section, idx) => (
        <div className="mb-6" key={idx}>
          <p className={`${section.color} font-medium`}>{section.title}</p>
          {section.data.length ? (
            section.data.map((booking, i) => <BookingCard key={i} booking={booking} />)
          ) : (
            <p className="text-sm text-gray-600">No {section.title.toLowerCase()}.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUserHistory;
