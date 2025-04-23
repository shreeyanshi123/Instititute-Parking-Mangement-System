import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../assets/cc3.png";
import axios from "axios";
import VisitorBookingForm from "../../components/User/VisitorBookingForm";

const VisitorLocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    vehicle_number: "",
    vehicle_type: "twoWheeler",
  });

  const fetchLocationDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/getSlots/${id}`
      );
      setLocation(response.data.location);
    } catch (error) {
      console.error("Error fetching location details:", error);
      toast.error("Failed to fetch location details. Please try again.");
    }
  };

  useEffect(() => {
    fetchLocationDetails();
  }, [id]);

  useEffect(() => {
    if (shouldRefetch) {
      const timer = setTimeout(() => {
        fetchLocationDetails();
        setShouldRefetch(false);
      }, 300); // wait for 300ms to ensure backend update reflects
  
      return () => clearTimeout(timer);
    }
  }, [shouldRefetch]);
  

  const handleSlotClick = (slot) => {
    if (!slot.is_empty || slot.reserved) {
      toast.warn("Slot is already occupied or reserved!");
      return;
    }

    let slotType = slot.vehicle_type;

    if (slotType.toLowerCase().includes("bus")) {
      slotType = "Other";
    } else if (slotType.toLowerCase().includes("four")) {
      slotType = "FourWheeler";
    } else if (slotType.toLowerCase().includes("two")) {
      slotType = "twoWheeler";
    }

    setSelectedSlot({ ...slot, slot_type: slotType });
  };

  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      toast.warn("Please select a slot first.");
      return;
    }
    console.log("selectedSlot", selectedSlot);
    const expectedType = selectedSlot?.slot_type;
    const selectedType = bookingForm?.vehicle_type;

    if (expectedType !== selectedType) {
      toast.warning("Selected slot type doesn't match your vehicle type.");

      setTimeout(() => {
        setSelectedSlot(null);
        setBookingForm({
          vehicle_number: "",
          vehicle_type: "twoWheeler",
          booking_time: "",
          end_time: "",
        });
      }, 100);

      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/visitor/bookSlot",
        {
          slotId: selectedSlot.slot_id,
          vehicleNumber: bookingForm.vehicle_number,
          vehicleType: bookingForm.vehicle_type,
        }
      );

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data.success
      ) {
        toast.success("Visitor slot booked successfully!");
        setBookingForm({
          vehicle_number: "",
          vehicle_type: "twoWheeler",
        });
        setSelectedSlot(null);
        setShouldRefetch(true);
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.warn("This slot is already reserved by another visitor.");
      } else {
        toast.error("Something went wrong while booking the slot.");
      }
      console.error("Visitor booking error:", err);
    }
  };

  if (!location) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        Loading location details...
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
                  ? "2-Wheeler Slots"
                  : slotType === "fourWheeler"
                  ? "4-Wheeler Slots"
                  : "Bus Slots"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {location.slots?.[slotType]?.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center font-semibold cursor-pointer transition-colors duration-300 ${
                        slot.reserved
                        ? "bg-yellow-500 hover:bg-yellow-400"
                        : slot.is_empty
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-red-500 hover:bg-red-400"
                      
                    } text-white shadow-md`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    {slot.slot_id} <br />
                    {!slot.is_empty || slot.reserved ? "Occupied" : "Empty"}
                  </div>
                )) || <p>No slots available</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form Modal */}
        {selectedSlot && (
          <VisitorBookingForm
            selectedSlot={selectedSlot}
            bookingForm={bookingForm}
            handleFormChange={handleFormChange}
            handleBookingSubmit={handleBookingSubmit}
            closeModal={() => setSelectedSlot(null)}
          />
        )}
      </div>
      <ToastContainer style={{ zIndex: 9999 }} />
    </div>
  );
};

export default VisitorLocationDetails;
