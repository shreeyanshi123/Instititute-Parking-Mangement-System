import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import backgroundImage from "../../assets/cc3.png";

const dummyLocation = {
  id: 1,
  name: "CC3",
  slots: {
    twoWheeler: [{ occupied: true }, { occupied: false }, { occupied: true }],
    fourWheeler: [{ occupied: false }, { occupied: true }, { occupied: true }],
    bus: [{ occupied: false }, { occupied: false }],
  },
};

const EditLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLocation(dummyLocation);
    }, 500);
  }, [id]);

  const handleEditSlot = (slotType, index) => {
    const newType = prompt("Enter new slot type (twoWheeler, fourWheeler, bus):", slotType);
    if (!["twoWheeler", "fourWheeler", "bus"].includes(newType)) {
      toast.error("Invalid slot type!");
      return;
    }

    const updatedSlots = { ...location.slots };
    const slotToMove = updatedSlots[slotType].splice(index, 1)[0];
    updatedSlots[newType].push(slotToMove);

    setLocation((prev) => ({
      ...prev,
      slots: updatedSlots,
    }));

    toast.success("✅ Slot updated successfully!");
  };

  const handleDeleteSlot = (slotType, index) => {
    const updatedSlots = { ...location.slots };
    updatedSlots[slotType].splice(index, 1);

    setLocation((prev) => ({
      ...prev,
      slots: updatedSlots,
    }));

    toast.success("❌ Slot deleted successfully!");
  };

  const handleAddSlot = (slotType) => {
    const updatedSlots = { ...location.slots };
    updatedSlots[slotType].push({ occupied: false });

    setLocation((prev) => ({
      ...prev,
      slots: updatedSlots,
    }));

    toast.success("➕ New slot added successfully!");
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

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
        >
          🔙 Back
        </button>

        <h1 className="text-3xl font-bold mb-6 text-white">{location.name} - Edit Slots</h1>

        {/* Slots Section */}
        <div className="w-full max-w-3xl space-y-6">
          {["twoWheeler", "fourWheeler", "bus"].map((slotType) => (
            <div key={slotType} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {slotType === "twoWheeler" ? "🛵 2-Wheeler Slots" : slotType === "fourWheeler" ? "🚗 4-Wheeler Slots" : "🚌 Bus Slots"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {location.slots[slotType].map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg text-center font-semibold bg-gray-500 text-white shadow-md"
                  >
                    {slot.occupied ? "Occupied" : "Empty"}
                    <div className="flex gap-2 justify-center mt-2">
                      <button
                        onClick={() => handleEditSlot(slotType, index)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slotType, index)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleAddSlot(slotType)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all w-full"
              >
                ➕ Add Slot
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditLocation;