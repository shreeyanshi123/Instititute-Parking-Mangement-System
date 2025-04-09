import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const UserHistory = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/bookings", { withCredentials: true })
      .then((res) => {
        const current = res.data.currentBookings;
        const past = res.data.pastBookings;

        // Convert to arrays if not already arrays
        setCurrentBookings(Array.isArray(current) ? current : current ? [current] : []);
        setPastBookings(Array.isArray(past) ? past : past ? [past] : []);
      })
      .catch((err) => {
        toast.error("Failed to fetch booking history.");
        console.error(err);
      });
  }, []);

  const handleRelease = async (SlotId) => {
    console.log(SlotId,"bookingId");
    try {
      await axios.post(
        "http://localhost:5000/admin/releaseSlot",
        { slotId: SlotId },
        { withCredentials: true }
      );
      toast.success("Booking released successfully!");
      setCurrentBookings(currentBookings.filter(b => b.slot_id !== SlotId));
    } catch (err) {
      toast.error("Failed to release booking.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 pt-20 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6 text-center">📋 Booking History</h2>

      {/* Current Bookings */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">🔵 Current Bookings</h3>
        {currentBookings.length === 0 ? (
          <p className="text-gray-600">No current bookings found.</p>
        ) : (
          currentBookings.map((booking) => (
            <div
              key={booking.booking_id}
              className={`p-4 mb-4 rounded-md flex justify-between items-center shadow-md ${
                booking.status === "Expired" ? "bg-yellow-100 border border-yellow-400" : "bg-white"
              }`}
            >
              <div>
                <p><strong>Location:</strong> {booking.location_name}</p>
                <p><strong>Slot:</strong> {booking.slot_id}</p>
                <p><strong>Start:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
                {booking.status === "Expired" && (
                  <p className="text-yellow-600 font-semibold">⚠️ Booking Expired</p>
                )}
                <p><strong>Vehicle:</strong> {booking.vehicle_number}</p>
              </div>
              <button
                onClick={() => handleRelease(booking.slot_id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Release
              </button>
            </div>
          ))
        )}
      </section>

      {/* Past Bookings */}
      <section>
        <h3 className="text-xl font-semibold mb-4">⚫ Past Bookings</h3>
        {pastBookings.length === 0 ? (
          <p className="text-gray-600">No past bookings found.</p>
        ) : (
          pastBookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-gray-200 shadow-inner p-4 mb-4 rounded-md"
            >
              <p><strong>Location:</strong> {booking.location_name}</p>
              <p><strong>Slot:</strong> {booking.slot_id}</p>
              <p><strong>Start:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Vehicle:</strong> {booking.vehicle_number}</p>
            </div>
          ))
        )}
      </section>
      <ToastContainer style={{ zIndex: 9999 }} />
    </div>
  );
};

export default UserHistory;
