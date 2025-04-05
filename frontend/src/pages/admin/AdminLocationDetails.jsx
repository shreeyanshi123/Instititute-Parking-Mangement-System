import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import backgroundImage from "../../assets/cc3.png";
import axios from "axios";

const AdminLocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/getSlots/${id}`);
        // Check the response structure
        console.log(response.data.location); // ✅ Check actual response
        setLocation(response.data.location); // Ensure you're setting the location correctly
      } catch (error) {
        console.error("Error fetching location details:", error);
        toast.error("❌ Failed to fetch location details. Please try again.");
      }
    }
    fetchLocationDetails();
  }, [id]);

  const handleReleaseVehicle = async (slotType, index) => {
    if (!location || !location.slots[slotType]) return;
  
    const slot = location.slots[slotType][index]; // Get the slot details
    try {
      // Send API request to update slot status in DB
      const response = await axios.post("http://localhost:5000/admin/releaseSlot", {
        slotId: slot.slot_id,
      });
  
      if (response.status === 200) {
        // Update local state only after successful DB update
        setLocation((prev) => {
          const updatedSlots = { ...prev.slots };
          updatedSlots[slotType][index] = { ...updatedSlots[slotType][index], is_empty: true };
          return { ...prev, slots: updatedSlots };
        });
  
        toast.success(`🚗 Slot ${slot.slot_id} released successfully!`);
      }
    } catch (error) {
      console.error("Error releasing slot:", error);
      toast.error("❌ Failed to release slot. Try again.");
    }
  };
  

  if (!location) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Wrapper (Ensures Everything Appears on Top) */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/home")}
          className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all z-20"
        >
          🔙 Back
        </button>

        {/* Location Header */}
        <h1 className="text-3xl font-bold mt-16 mb-6 text-white">{location.name}</h1>
{/* Slots Section */}
<div className="w-full max-w-3xl space-y-8">
          {["twoWheeler", "fourWheeler", "bus"].map((slotType) => (
            <div key={slotType} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
              <h2 className="text-2xl font-semibold mb-4">
                {slotType === "twoWheeler" ? " 2-Wheeler Slots" : slotType === "fourWheeler" ? " 4-Wheeler Slots" : "🚌 Bus Slots"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {location.slots[slotType].map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center font-semibold ${
                      slot.is_empty ? "bg-green-500" : "bg-red-500"
                    } text-white shadow-md`}
                  >
                    {slot.slot_id} <br/>
                    {slot.is_empty ? "Empty" : "Occupied"}
                    {!slot.is_empty && (
                      <button
                        onClick={() => handleReleaseVehicle(slotType, index)}
                        className="block mt-2 px-3 py-1 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-300"
                      >
                        Release Vehicle
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLocationDetails;