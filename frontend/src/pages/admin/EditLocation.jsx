// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import backgroundImage from "../../assets/cc3.png";

// const dummyLocation = {
//   id: 1,
//   name: "CC3",
//   slots: {
//     twoWheeler: [{ occupied: true }, { occupied: false }, { occupied: true }],
//     fourWheeler: [{ occupied: false }, { occupied: true }, { occupied: true }],
//     bus: [{ occupied: false }, { occupied: false }],
//   },
// };

// const EditLocation = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     setTimeout(() => {
//       setLocation(dummyLocation);
//     }, 500);
//   }, [id]);

//   const handleEditSlot = (slotType, index) => {
//     const newType = prompt("Enter new slot type (twoWheeler, fourWheeler, bus):", slotType);
//     if (!["twoWheeler", "fourWheeler", "bus"].includes(newType)) {
//       toast.error("Invalid slot type!");
//       return;
//     }

//     const updatedSlots = { ...location.slots };
//     const slotToMove = updatedSlots[slotType].splice(index, 1)[0];
//     updatedSlots[newType].push(slotToMove);

//     setLocation((prev) => ({
//       ...prev,
//       slots: updatedSlots,
//     }));

//     toast.success("✅ Slot updated successfully!");
//   };

//   const handleDeleteSlot = (slotType, index) => {
//     const updatedSlots = { ...location.slots };
//     updatedSlots[slotType].splice(index, 1);

//     setLocation((prev) => ({
//       ...prev,
//       slots: updatedSlots,
//     }));

//     toast.success("❌ Slot deleted successfully!");
//   };

//   const handleAddSlot = (slotType) => {
//     const updatedSlots = { ...location.slots };
//     updatedSlots[slotType].push({ occupied: false });

//     setLocation((prev) => ({
//       ...prev,
//       slots: updatedSlots,
//     }));

//     toast.success("➕ New slot added successfully!");
//   };

//   if (!location) {
//     return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       ></div>

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/50"></div>

//       {/* Content Wrapper */}
//       <div className="relative z-10 flex flex-col items-center w-full px-4 py-10">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate("/home")}
//           className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
//         >
//           🔙 Back
//         </button>

//         <h1 className="text-3xl font-bold mb-6 text-white">{location.name} - Edit Slots</h1>

//         {/* Slots Section */}
//         <div className="w-full max-w-3xl space-y-6">
//           {["twoWheeler", "fourWheeler", "bus"].map((slotType) => (
//             <div key={slotType} className="bg-gray-800 p-6 rounded-lg shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-white">
//                 {slotType === "twoWheeler" ? "🛵 2-Wheeler Slots" : slotType === "fourWheeler" ? "🚗 4-Wheeler Slots" : "🚌 Bus Slots"}
//               </h2>
//               <div className="grid grid-cols-2 gap-4">
//                 {location.slots[slotType].map((slot, index) => (
//                   <div
//                     key={index}
//                     className="p-4 rounded-lg text-center font-semibold bg-gray-500 text-white shadow-md"
//                   >
//                     {slot.occupied ? "Occupied" : "Empty"}
//                     <div className="flex gap-2 justify-center mt-2">
//                       <button
//                         onClick={() => handleEditSlot(slotType, index)}
//                         className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteSlot(slotType, index)}
//                         className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => handleAddSlot(slotType)}
//                 className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all w-full"
//               >
//                 ➕ Add Slot
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditLocation;



import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import backgroundImage from "../../assets/road.png";
import LocationImageUpload from "../../components/Admin/LocationImageUpload";

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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    locationName: "",
    imageUrl: "",
    slots: {
      twoWheeler: 0,
      fourWheeler: 0,
      bus: 0
    }
  });

  const [imageFile, setImageFile] = useState(null);
  const [slots, setSlots] = useState({ twoWheeler: 0, fourWheeler: 0, bus: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulating fetching data with dummyLocation

      setFormData({
        locationName: dummyLocation.name,
        imageUrl: "", // No image URL in dummy data
        slots: {
          twoWheeler: dummyLocation.slots.twoWheeler.length,
          fourWheeler: dummyLocation.slots.fourWheeler.length,
          bus: dummyLocation.slots.bus.length,
        },
      });
      setIsLoading(false);
    
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested slot fields
    if (name.startsWith('slots.')) {
      const slotType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        slots: {
          ...prev.slots,
          [slotType]: value === "" ? "" : Number(value),
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(`✅ Location "${formData.locationName}" updated successfully!`);
      navigate("/admin/home");
      setIsSubmitting(false);
    }, 1000);
  };


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading location data...</div>;
  }


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden add-location p-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/home")}
        className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
      >
        🔙 Back to Home
      </button> 

      {/* Form Container */}
      <div className="add-location-card relative z-10 w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md shadow-xl rounded-2xl mb-9 p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Edit Parking Location</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <LocationImageUpload 
            imageFile={imageFile} 
            setImageFile={setImageFile} 
            uploadedImageUrl={formData.imageUrl} 
            setUploadedImageUrl={(url) => setFormData(prev => ({...prev, imageUrl: url}))} 
          />

          {/* Location Name */}
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

          {/* Slots Inputs */}
          {["twoWheeler", "fourWheeler", "bus"].map((type) => (
            <div key={type}>
              <label className="block text-white text-lg font-semibold">{type.replace(/([A-Z])/g, ' $1').trim()} Slots</label>
              <input type="number" name={`slots.${type}`} value={formData.slots[type]} min="0" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            </div>
          ))}


          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} className={`w-full py-3 rounded-lg font-bold text-lg ${isSubmitting ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}>
            {isSubmitting ? "⏳ Updating..." : "✅ Update Location"}
          </button>
        </form> 
      </div>
    </div>
  );
};

export default EditLocation;





















