import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const UserHistory = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [reservedBookings, setReservedBookings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/bookings", { withCredentials: true })
      .then((res) => {
        const current = res.data.currentBookings;
        const past = res.data.pastBookings;
        const reserved = res.data.reservedBookings;
        setReservedBookings(
          Array.isArray(reserved) ? reserved : reserved ? [reserved] : []
        );
        setCurrentBookings(
          Array.isArray(current) ? current : current ? [current] : []
        );
        setPastBookings(Array.isArray(past) ? past : past ? [past] : []);
      })
      .catch((err) => {
        toast.error("Failed to fetch booking history.");
        console.error(err);
      });
  }, []);

  const handleRelease = async (SlotId) => {
    try {
      await axios.post(
        "http://localhost:5000/admin/releaseSlot",
        { slotId: SlotId },
        { withCredentials: true }
      );
      toast.success("Booking released successfully!");
      const releasedBooking = currentBookings.find(
        (b) => b.slot_id === SlotId
      );

      setCurrentBookings(
        currentBookings.filter((b) => b.slot_id !== SlotId)
      );

      if (releasedBooking) {
        const updatedBooking = {
          ...releasedBooking,
          released: 1,
          status: "Completed",
          end_time: new Date().toISOString(),
        };
        setPastBookings([updatedBooking, ...pastBookings]);
      }
    } catch (err) {
      toast.error("Failed to release booking.");
      console.error(err);
    }
  };

  const handleUnreserve = async (slotId) => {
    try {
      await axios.post(
        "http://localhost:5000/visitor/unreserveSlot",
        { slotId },
        { withCredentials: true }
      );
      toast.success("Slot unreserved successfully!");

      const releasedBooking = reservedBookings.find(
        (b) => b.slot_id === slotId
      );
      setReservedBookings(
        reservedBookings.filter((b) => b.slot_id !== slotId)
      );

      if (releasedBooking) {
        const updatedBooking = {
          ...releasedBooking,
          released: 1,
          status: "Cancelled",
          end_time: new Date().toISOString(),
        };
        setPastBookings([updatedBooking, ...pastBookings]);
      }
    } catch (err) {
      toast.error("Failed to unreserve slot.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 pt-20 min-h-screen bg-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
      >
       🔙 Back
      </button>

      <h2 className="text-3xl font-semibold mb-6 text-center">
        📋 Booking History
      </h2>

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
                booking.status === "Expired"
                  ? "bg-yellow-100 border border-yellow-400"
                  : "bg-white"
              }`}
            >
              <div>
                <p>
                  <strong>Location:</strong> {booking.location_name}
                </p>
                <p>
                  <strong>Slot:</strong> {booking.slot_id}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(booking.booking_time).toLocaleString()}
                </p>
                {booking.status === "Expired" && (
                  <p className="text-yellow-600 font-semibold">
                    ⚠️ Booking Expired
                  </p>
                )}
                <p>
                  <strong>Vehicle:</strong> {booking.vehicle_number}
                </p>
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

      {/* Reserved Visitor Slots */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">🟡 Reserved Visitor Slots</h3>
        {reservedBookings.length === 0 ? (
          <p className="text-gray-600">No reserved visitor slots.</p>
        ) : (
          reservedBookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-yellow-50 border border-yellow-300 p-4 mb-4 rounded-md flex justify-between items-center"
            >
              <div>
                <p><strong>Location:</strong> {booking.location_name}</p>
                <p><strong>Slot:</strong> {booking.slot_id}</p>
                <p><strong>Vehicle:</strong> {booking.vehicle_number}</p>
                <p><strong>Start:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
                <p className="text-yellow-700 font-semibold">Status: Reserved</p>
              </div>
              <button
                onClick={() => handleUnreserve(booking.slot_id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              >
                Unreserve
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
              <p>
                <strong>Location:</strong> {booking.location_name}
              </p>
              <p>
                <strong>Slot:</strong> {booking.slot_id}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(booking.booking_time).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(booking.end_time).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Vehicle:</strong> {booking.vehicle_number}
              </p>
            </div>
          ))
        )}
      </section>

      <ToastContainer style={{ zIndex: 9999 }} />
    </div>
  );
};

export default UserHistory;
