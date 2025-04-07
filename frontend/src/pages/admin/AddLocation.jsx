import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import backgroundImage from "../../assets/road.png";
import LocationImageUpload from "../../components/Admin/LocationImageUpload";

const AddLocation = () => {
  const [locationName, setLocationName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isLoadingState, setImageLoadingState] = useState(false);

  // ✅ Updated slot state to match backend keys
  const [slots, setSlots] = useState({
    two_wheeler_slots: 0,
    four_wheeler_slots: 0,
    bus_parking_slots: 0,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { two_wheeler_slots, four_wheeler_slots, bus_parking_slots } = slots;
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/addlocation",
        {
          location_name: locationName,
          image_url: uploadedImageUrl,
          two_wheeler_slots,
          four_wheeler_slots,
          bus_parking_slots,
        }
      );

      toast.success(`🚀 Location "${locationName}" added successfully!`);

      // Store in local storage (optional)
      const newLocation = response.data;
      localStorage.setItem("newLocation", JSON.stringify(newLocation));

      // Reset state
      setLocationName("");
      setSlots({
        two_wheeler_slots: 0,
        four_wheeler_slots: 0,
        bus_parking_slots: 0,
      });

      // Redirect
      navigate("/admin/home");
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("❌ Failed to add location. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/home")}
        className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
      >
        🔙 Back to Home
      </button>

      {/* Form */}
      <div className="relative z-10 w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Add Parking Location
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <LocationImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            isLoadingState={isLoadingState}
          />

          {/* Location Name */}
          <div>
            <label className="block text-white text-lg font-semibold">
              Location Name
            </label>
            <input
              type="text"
              placeholder="Enter Location Name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all"
              required
            />
          </div>

          {/* Parking Slot Inputs */}
          {[
            { type: "two_wheeler_slots", label: "2-Wheeler Slots" },
            { type: "four_wheeler_slots", label: "4-Wheeler Slots" },
            { type: "bus_parking_slots", label: "Bus Slots" },
          ].map((slot) => (
            <div key={slot.type}>
              <label className="block text-white text-lg font-semibold">
                {slot.label}
              </label>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={slots[slot.type]}
                onChange={(e) =>
                  setSlots({
                    ...slots,
                    [slot.type]:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all"
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all"
          >
            Add Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
