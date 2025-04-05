import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import backgroundImage from "../../assets/cc3.png";
import axios from "axios";
import UserBookingForm from "../../components/User/UserBookingForm";

const UserLocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [user, setUser] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    vehicle_number: "",
    vehicle_type: "TwoWheeler",
    booking_time: "",
    end_time: "",
  });

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/getUser", {
        withCredentials: true,
      });
      console.log("Fetched user:", res.data);
      if (res.data.success) setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin/getSlots/${id}`
        );
        setLocation(response.data.location);
      } catch (error) {
        console.error("Error fetching location details:", error);
        toast.error("❌ Failed to fetch location details. Please try again.");
      }
    };
    fetchLocationDetails();
    fetchUser();
  }, [id]);

  const handleSlotClick = (slot) => {
    if (!slot.is_empty) {
      toast.warn("⚠️ Slot is already occupied!");
      return;
    }
    setSelectedSlot(slot);
  };

  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/user/bookSlot", {
        user_id: user.user_id,
        slot_id: selectedSlot.slot_id,
        vehicle_number: bookingForm.vehicle_number,
        vehicle_type: bookingForm.vehicle_type,
        booking_time: bookingForm.booking_time,
        end_time: bookingForm.end_time,
      });
  
      console.log("Booking response:", response.data);
  
      if (response.status === 200 || response.status === 201 || response.data.success) {
        toast.success("✅ Booking Successful!");
  
        const updatedLocation = { ...location };
  
        const slotKeyMap = {
          TwoWheeler: "twoWheeler",
          FourWheeler: "fourWheeler",
          Bus: "bus",
        };
  
        const slotType = slotKeyMap[bookingForm.vehicle_type];
  
        const targetSlots = updatedLocation.slots[slotType];
  
        const updatedSlots = targetSlots.map(slot =>
          slot.slot_id === selectedSlot.slot_id
            ? { ...slot, is_empty: false }
            : slot
        );
  
        updatedLocation.slots[slotType] = updatedSlots;
        setLocation(updatedLocation); // ✅ instantly update slot color
  
        setBookingForm({
          vehicle_number: "",
          vehicle_type: "TwoWheeler",
          booking_time: "",
          end_time: "",
        });
        setSelectedSlot(null); // ✅ close modal
      } else {
        toast.error("❌ Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("❌ Booking Failed. Try again.");
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center w-full px-4 py-10">
        <button
          onClick={() => navigate("/user/home")}
          className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all z-20"
        >
          🔙 Back
        </button>
        <h1 className="text-3xl font-bold mt-16 mb-6 text-white">
          {location.name}
        </h1>
        <div className="w-full max-w-3xl space-y-8">
          {["twoWheeler", "fourWheeler", "bus"].map((slotType) => (
            <div
              key={slotType}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
            >
              <h2 className="text-2xl font-semibold mb-4">
                {slotType === "twoWheeler"
                  ? " 2-Wheeler Slots"
                  : slotType === "fourWheeler"
                  ? " 4-Wheeler Slots"
                  : "🚌 Bus Slots"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {location.slots[slotType].map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center font-semibold cursor-pointer ${
                      !slot.is_empty
                        ? "bg-red-500"
                        : "bg-green-500 hover:bg-green-400"
                    } text-white shadow-md transition-all`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    {slot.slot_id} <br />
                    {!slot.is_empty ? "Occupied" : "Empty"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Booking Form Modal */}
        {selectedSlot && (
          <UserBookingForm
            selectedSlot={selectedSlot}
            bookingForm={bookingForm}
            handleFormChange={handleFormChange}
            handleBookingSubmit={handleBookingSubmit}
            closeModal={() => setSelectedSlot(null)}
          />
        )}{" "}
      </div>
    </div>
  );
};

export default UserLocationDetails;
