import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const EditLocation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    locationName: "",
    imageUrl: "",
    slots: {
      twoWheeler: 0,
      fourWheeler: 0,
      bus: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/location/${id}`);
        const data = response.data;

        setFormData({
          locationName: data.name,
          imageUrl: data.imageUrl || "",
          slots: {
            twoWheeler: data.slots.twoWheeler.length,
            fourWheeler: data.slots.fourWheeler.length,
            bus: data.slots.bus.length,
          },
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching location:", error);
        toast.error("❌ Failed to load location data.");
        navigate("/admin/home");
      }
    };

    fetchLocationDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('slots.')) {
      const slotType = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        slots: {
          ...prev.slots,
          [slotType]: value === "" ? "" : Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(`http://localhost:5000/admin/edit/${id}`, {
        locationName: formData.locationName,
        slots: formData.slots,
      });

      toast.success(`✅ Location "${formData.locationName}" updated successfully!`);
      navigate("/admin/home");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("❌ Failed to update location.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading location data...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden add-location p-6">
      <button
        onClick={() => navigate("/admin/home")}
        className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
      >
        🔙 Back to Home
      </button>

      <div className="add-location-card relative z-10 w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md shadow-xl rounded-2xl mb-9 p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Edit Parking Location</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
        

          <div>
            <label className="block text-white text-lg font-semibold">Location Name</label>
            <input
              type="text"
              name="locationName"
              placeholder="Enter Location Name"
              value={formData.locationName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all"
              required
            />
          </div>

          {["twoWheeler", "fourWheeler", "bus"].map((type) => (
            <div key={type}>
              <label className="block text-white text-lg font-semibold">
                {type.replace(/([A-Z])/g, ' $1').trim()} Slots
              </label>
              <input
                type="number"
                name={`slots.${type}`}
                value={formData.slots[type]}
                min="0"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold text-lg ${isSubmitting ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isSubmitting ? "⏳ Updating..." : "✅ Update Location"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLocation;
