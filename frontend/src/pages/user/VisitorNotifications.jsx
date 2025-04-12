import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import axios from "axios";
import { toast } from "react-toastify";

const VisitorNotifications = () => {
  const [reservedSlots, setReservedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();

  const fetchReservedSlots = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/visitor/getReservedSlots",
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log(res.data.reservedSlots, "reservedSlots");
        setReservedSlots(res.data.reservedSlots);
      }
    } catch (error) {
      console.error("Error fetching reserved slots", error);
    }
  };

  const openConfirmModal = (slot) => {
    setSelectedSlot(slot);
    setEndTime("");
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!endTime) {
      toast.warning("Please enter an end time.");
      return;
    }
  
    const formattedEndTime = new Date(endTime).toISOString().slice(0, 19).replace("T", " ");
  
    try {
      const res = await axios.post(
        "http://localhost:5000/visitor/confirmSlot",
        {
          slotId: selectedSlot.slot_id,
          end_time: formattedEndTime,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Slot confirmed!");
        setShowModal(false);
        fetchReservedSlots();
      } else {
        toast.error("Failed to confirm slot.");
      }
      
    } catch (error) {
      console.error("Confirm error:", error);
      toast.error("Failed to confirm slot.");
    }
  };
  

  useEffect(() => {
    fetchReservedSlots();
  }, []);

  return (
    <div className="p-6 mt-20 max-w-4xl mx-auto">
    {/* ✅ Back Button */}
    <button
      onClick={() => navigate("/user/home")}
      className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
    >
       🔙 Back
    </button>

    <h2 className="text-2xl font-bold mb-4">🔔 Reserved Slots</h2>
      {reservedSlots.length === 0 ? (
        <p>No reserved slots.</p>
      ) : (
        <ul className="space-y-4">
          {reservedSlots.map((slot) => (
            <li
              key={slot.booking_id}
              className="bg-white p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Booking ID:</strong> {slot.booking_id}
                </p>
                <p>
                  <strong>Slot ID:</strong> {slot.slot_id}
                </p>
                <p>
                  <strong>Vehicle Number:</strong> {slot.vehicle_number}
                </p>
                <p>
                  <strong>Vehicle Type:</strong> {slot.vehicle_type}
                </p>
                <p>
                  <strong>Location:</strong> {slot.location_name}
                </p>
                <p>
                  <strong>Booking Time:</strong>{" "}
                  {new Date(slot.booking_time).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => openConfirmModal(slot)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Confirm Slot</h3>
            <p className="mb-2">Enter End Time (YYYY-MM-DD HH:mm:ss):</p>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorNotifications;
