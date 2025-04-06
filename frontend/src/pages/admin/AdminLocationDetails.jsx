import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import backgroundImage from "../../assets/cc3.png";
import axios from "axios";

const AdminLocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState({}); // ⏳ Slot loading state

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/getSlots/${id}`);
        setLocation(response.data.location);
      } catch (error) {
        console.error("Error fetching location details:", error);
        toast.error("❌ Failed to fetch location details. Please try again.");
      }
    };
    fetchLocationDetails();
  }, [id]);

  const handleReleaseVehicle = async (slotType, index) => {
    if (!location || !location.slots[slotType]) return;
    
    const slot = location.slots[slotType][index];
    const slotKey = `${slotType}-${index}`;

    setLoadingSlots((prev) => ({ ...prev, [slotKey]: true })); // ⏳ Start loading

    try {
      const response = await axios.post("http://localhost:5000/admin/releaseSlot", {
        slotId: slot.slot_id,
      });

      if (response.status === 200) {
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
    } finally {
      setLoadingSlots((prev) => ({ ...prev, [slotKey]: false })); // ✅ Stop loading
    }
  };

  if (!location) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
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
          onClick={() => navigate("/admin/home")}
          className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all z-20"
        >
          🔙 Back
        </button>

        <h1 className="text-3xl font-bold mt-16 mb-6 text-white">{location.name}</h1>

        <div className="w-full max-w-3xl space-y-8">
          {["twoWheeler", "fourWheeler", "bus"].map((slotType) => (
            <div key={slotType} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
              <h2 className="text-2xl font-semibold mb-4">
                {slotType === "twoWheeler"
                  ? "2-Wheeler Slots"
                  : slotType === "fourWheeler"
                  ? "4-Wheeler Slots"
                  : "🚌 Bus Slots"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {location.slots[slotType].map((slot, index) => {
                  const slotKey = `${slotType}-${index}`;
                  const isLoading = loadingSlots[slotKey];

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg text-center font-semibold ${
                        slot.is_empty ? "bg-green-500" : "bg-red-500"
                      } text-white shadow-md`}
                    >
                      {slot.slot_id} <br />
                      {slot.is_empty ? "Empty" : "Occupied"}
                      {!slot.is_empty && (
                        <button
                          onClick={() => handleReleaseVehicle(slotType, index)}
                          className={`block mt-2 px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                            isLoading
                              ? "bg-gray-300 text-gray-600 cursor-wait"
                              : "bg-white text-gray-900 hover:bg-gray-300"
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-1">
                              <svg
                                className="animate-spin h-4 w-4 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                              </svg>
                              Releasing...
                            </span>
                          ) : (
                            "Release Vehicle"
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLocationDetails;
