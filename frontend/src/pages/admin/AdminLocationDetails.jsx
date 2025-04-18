import React, { useEffect, useState, } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import backgroundImage from "../../assets/bus.png";

const AdminLocationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [slotId, setSlotId] = useState(null);
  const [isOccupied, setIsOccupied] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotDetails, setSlotDetails] = useState({
    booking_id: "",
    booking_time: "",
    end_time: "",
    status: "",
    vehicle_number: "",
    vehicle_type: "",
    user_name: "",
    email: "",
    phone_number: "",
  });

  const fetchLocationDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/getSlots/${id}`);
      setLocation(res.data.location);
    } catch (error) {
      console.error("Error fetching location details:", error);
      toast.error("Failed to fetch location details. Please try again.");
    }
  };

  useEffect(() => {
    fetchLocationDetails();
  }, [id]);

  const handleSlotClick = (type, index) => {
    const slot = location?.slots?.[type]?.[index];
    if (!slot) return;

    setIsOccupied(!slot.is_empty);
    setIsReserved(slot.reserved);
    setSlotId(slot.slot_id);
    setSelectedSlot(slot);

    if (!slot.is_empty) {
      getSlotDetails(slot.slot_id);
    }

    setShowModal(true);
  };

  const getSlotDetails = async (slotId) => {
    try {
      const res = await axios.post("http://localhost:5000/admin/getDetails", {
        slotId,
      });
      if (res.status === 200) {
        setSlotDetails(res.data.slotDetails);
      }
    } catch (error) {
      console.error("Error fetching slot details:", error);
      toast.error("Failed to fetch slot details.");
    }
  };

  const handleReleaseVehicle = async () => {
    try {
      const res = await axios.post("http://localhost:5000/admin/releaseSlot", {
        slotId,
      });
      if (res.status === 200) {
        toast.success("Slot released successfully!");
        setShowModal(false);
        fetchLocationDetails();
      }
    } catch (error) {
      console.error("Error releasing slot:", error);
      toast.error("Failed to release slot. Try again.");
    }
  };

  const handleReserve = async () => {
    if (!vehicleNumber.trim() || !slotId) {
      toast.warn("Please provide valid vehicle details.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/admin/reserveSlot", {
        slot_id: slotId,
        vehicle_number: vehicleNumber,
      });
      if (res.status === 200) {
        toast.success("Slot reserved successfully!");
        setShowModal(false);
        setVehicleNumber("");
        fetchLocationDetails();
      }
    } catch (error) {
      console.error("Error reserving slot:", error);
      toast.error("Reservation failed. Try again.");
    }
  };

  const handleUnreserve = async () => {
    try {
      const res = await axios.post("http://localhost:5000/admin/unreserveSlot", {
        slot_id: slotId,
      });
      if (res.status === 200) {
        toast.success("Slot unreserved successfully!");
        setShowModal(false);
        fetchLocationDetails();
      }
    } catch (error) {
      console.error("Error unreserving slot:", error);
      toast.error("Failed to unreserve slot.");
    }
  };

  if (!location) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>{" "}
              {/* Black overlay ONLY on the background */}
            </div>
      <AdminNavbar />
      <div className="relative z-10 flex flex-col items-center w-full px-4 py-14">
      <button
        onClick={() => navigate("/admin/home")}
        className="absolute top-10 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
      >
        🔙 Back to Home
      </button>
        <h1 className="text-4xl font-bold mt-10 mb-14 text-white">
          {location.name} - Parking Slots
        </h1>

        <div className="w-full max-w-6xl bg-gray-900 p-8 rounded-lg shadow-xl grid justify-center">
          <div className="grid grid-cols-3 gap-12">
            {["twoWheeler", "fourWheeler", "bus"].map((type, i) => (
              <div className="flex flex-col items-center text-center" key={i}>
                <h2 className="text-xl font-semibold mb-4 text-white">
                  {type === "twoWheeler"
                    ? "🛵 2-Wheeler"
                    : type === "fourWheeler"
                    ? "🚗 4-Wheeler"
                    : "🚌 Bus"}
                </h2>
                <div
                  className={`grid ${
                    type === "bus"
                      ? "grid-cols-3"
                      : type === "fourWheeler"
                      ? "grid-cols-4"
                      : "grid-cols-5"
                  } gap-3`}
                >
                  {location.slots[type]?.map((slot, index) => (
                    <div
                      key={index}
                      onClick={() => handleSlotClick(type, index)}
                      className={`${
                        type === "bus"
                          ? "w-20 h-[115px]"
                          : type === "fourWheeler"
                          ? "w-12 h-[65px]"
                          : "w-9 h-14"
                      } flex items-center justify-center rounded-md text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
                        !slot.is_empty
                          ? "bg-red-300 hover:bg-red-400"
                          : slot.reserved
                          ? "bg-yellow-300 hover:bg-yellow-400"
                          : "bg-green-600 hover:bg-green-400"
                      }`}
                    >
                      {!slot.is_empty ? "O" : slot.reserved ? "R" : "UO"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[350px] text-black space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {isOccupied ? "Vehicle Details" : isReserved ? "Reserved Slot" : "Reserve Slot"}
              </h2>
              <button
                className="ml-auto bg-gray-200 text-gray-700 text-xl rounded-md w-8 h-8 flex items-center justify-center"
                onClick={() => setShowModal(false)}
              >
                X
              </button>
            </div>

            {isOccupied ? (
              <>
                <p><strong>Vehicle Number:</strong> {slotDetails.vehicle_number}</p>
                <p><strong>Vehicle Type:</strong> {slotDetails.vehicle_type}</p>
                <p><strong>Booking Time:</strong> {new Date(slotDetails.booking_time).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(slotDetails.end_time).toLocaleString()}</p>
                <p><strong>Status:</strong> {slotDetails.status}</p>
                <p><strong>User:</strong> {slotDetails.user_name}</p>
                <p><strong>Email:</strong> {slotDetails.email}</p>
                <p><strong>Phone:</strong> {slotDetails.phone_number}</p>
                <button
                  onClick={handleReleaseVehicle}
                  className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Release Vehicle
                </button>
              </>
            ) : isReserved ? (
              <>
                <p className="mb-4"><strong>This slot is currently reserved.</strong></p>
                <button
                  onClick={handleUnreserve}
                  className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Unreserve Slot
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter Vehicle Number"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-4"
                />
                <button
                  onClick={handleReserve}
                  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Reserve Slot
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminLocationDetails;
