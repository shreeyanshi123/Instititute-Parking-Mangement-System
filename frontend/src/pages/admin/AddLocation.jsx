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
  const [slots, setSlots] = useState({ twoWheeler: 0, fourWheeler: 0, bus: 0 });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { twoWheeler, fourWheeler, bus } = slots;
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/addlocation",
        {
          location_name: locationName,
          image_url: uploadedImageUrl,
          two_wheeler_slots: twoWheeler,
          four_wheeler_slots: fourWheeler,
          bus_parking_slots: bus,
        }
      );

      toast.success(`✅ Location "${locationName}" added successfully!`);

      // Store in local storage or global state
      const newLocation = response.data;
      localStorage.setItem("newLocation", JSON.stringify(newLocation));

      // Reset state
      setLocationName("");
      setSlots({ twoWheeler: 0, fourWheeler: 0, bus: 0 });

      // Redirect to home
      navigate("/home");
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Back Button (Top-Left) */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
      >
        🔙 Back to Home
      </button>

      {/* Form Container */}
      <div className="relative z-10 w-full  max-w-lg bg-white bg-opacity-10 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          🚗 Add Parking Location
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Name */}
          <div>
            <LocationImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              isLoadingState={isLoadingState}
            />

            <label className="block text-white text-lg font-semibold">
              📍 Location Name
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

          {/* Slots Inputs */}
          {[
            { type: "twoWheeler", label: "🛵 2-Wheeler Slots" },
            { type: "fourWheeler", label: "🚗 4-Wheeler Slots" },
            { type: "bus", label: "🚌 Bus Slots" },
          ].map((slot) => (
            <div key={slot.type}>
              <label className="block text-white text-lg font-semibold">
                {slot.label}
              </label>
              <input
                type="number"
                value={slots[slot.type]}
                min="0"
                onChange={(e) =>
                  setSlots({ ...slots, [slot.type]: e.target.value })
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
            ➕ Add Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
