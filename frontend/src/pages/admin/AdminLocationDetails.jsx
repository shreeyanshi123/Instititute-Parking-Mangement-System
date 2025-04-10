// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
// // import backgroundImage from "../../assets/cc3.png";
// // import axios from "axios";

// // const AdminLocationDetails = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [location, setLocation] = useState(null);
// //   const [loadingSlots, setLoadingSlots] = useState({}); // ⏳ Slot loading state

// //   useEffect(() => {
// //     const fetchLocationDetails = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:5000/admin/getSlots/${id}`);
// //         setLocation(response.data.location);
// //       } catch (error) {
// //         console.error("Error fetching location details:", error);
// //         toast.error(" Failed to fetch location details. Please try again.");
// //       }
// //     };
// //     fetchLocationDetails();
// //   }, [id]);

// //   const handleReleaseVehicle = async (slotType, index) => {
// //     if (!location || !location.slots[slotType]) return;

// //     const slot = location.slots[slotType][index];
// //     const slotKey = `${slotType}-${index}`;

// //     setLoadingSlots((prev) => ({ ...prev, [slotKey]: true })); // ⏳ Start loading

// //     try {
// //       const response = await axios.post("http://localhost:5000/admin/releaseSlot", {
// //         slotId: slot.slot_id,
// //       });

// //       if (response.status === 200) {
// //         setLocation((prev) => {
// //           const updatedSlots = { ...prev.slots };
// //           updatedSlots[slotType][index] = { ...updatedSlots[slotType][index], is_empty: true };
// //           return { ...prev, slots: updatedSlots };
// //         });

// //         toast.success(` Slot ${slot.slot_id} released successfully!`);
// //       }
// //     } catch (error) {
// //       console.error("Error releasing slot:", error);
// //       toast.error("Failed to release slot. Try again.");
// //     } finally {
// //       setLoadingSlots((prev) => ({ ...prev, [slotKey]: false })); // ✅ Stop loading
// //     }
// //   };

// //   if (!location) {
// //     return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
// //       <div
// //         className="absolute inset-0 bg-cover bg-center"
// //         style={{ backgroundImage: `url(${backgroundImage})` }}
// //       ></div>
// //       <div className="absolute inset-0 bg-black/50"></div>

// //       <div className="relative z-10 flex flex-col items-center w-full px-4 py-10">
// //         <button
// //           onClick={() => navigate("/admin/home")}
// //           className="absolute top-5 left-5 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all z-20"
// //         >
// //           🔙 Back
// //         </button>

// //         <h1 className="text-3xl font-bold mt-16 mb-6 text-white">{location.name}</h1>

// //         <div className="w-full max-w-3xl space-y-8">
// //           {["twoWheeler", "fourWheeler", "bus"].map((slotType) => (
// //             <div key={slotType} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
// //               <h2 className="text-2xl font-semibold mb-4">
// //                 {slotType === "twoWheeler"
// //                   ? "2-Wheeler Slots"
// //                   : slotType === "fourWheeler"
// //                   ? "4-Wheeler Slots"
// //                   : " Bus Slots"}
// //               </h2>
// //               <div className="grid grid-cols-2 gap-4">
// //                 {location.slots[slotType].map((slot, index) => {
// //                   const slotKey = `${slotType}-${index}`;
// //                   const isLoading = loadingSlots[slotKey];

// //                   return (
// //                     <div
// //                       key={index}
// //                       className={`p-4 rounded-lg text-center font-semibold ${
// //                         slot.is_empty ? "bg-green-500" : "bg-red-500"
// //                       } text-white shadow-md`}
// //                     >
// //                       {slot.slot_id} <br />
// //                       {slot.is_empty ? "Empty" : "Occupied"}
// //                       {!slot.is_empty && (
// //                         <button
// //                           onClick={() => handleReleaseVehicle(slotType, index)}
// //                           className={`block mt-2 px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
// //                             isLoading
// //                               ? "bg-gray-300 text-gray-600 cursor-wait"
// //                               : "bg-white text-gray-900 hover:bg-gray-300"
// //                           }`}
// //                           disabled={isLoading}
// //                         >
// //                           {isLoading ? (
// //                             <span className="flex items-center justify-center gap-1">
// //                               <svg
// //                                 className="animate-spin h-4 w-4 text-gray-600"
// //                                 xmlns="http://www.w3.org/2000/svg"
// //                                 fill="none"
// //                                 viewBox="0 0 24 24"
// //                               >
// //                                 <circle
// //                                   className="opacity-25"
// //                                   cx="12"
// //                                   cy="12"
// //                                   r="10"
// //                                   stroke="currentColor"
// //                                   strokeWidth="4"
// //                                 ></circle>
// //                                 <path
// //                                   className="opacity-75"
// //                                   fill="currentColor"
// //                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
// //                                 ></path>
// //                               </svg>
// //                               Releasing...
// //                             </span>
// //                           ) : (
// //                             "Release Vehicle"
// //                           )}
// //                         </button>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //       <ToastContainer style={{ zIndex: 9999 }} />
// //     </div>
// //   );
// // };

// // export default AdminLocationDetails;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import AdminNavbar from "../../components/Admin/AdminNavbar";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
// import axios from "axios";

// // const dummyLocation = {
// //   id: 1,
// //   name: "CC3",
// //   slots: {
// //     twoWheeler: [{ occupied: true }, { occupied: false }, { occupied: true }, { occupied: false }, { occupied: true },{ occupied: true }, { occupied: false }, { occupied: true }, { occupied: false },],
// //     fourWheeler: [{ occupied: false }, { occupied: true }, { occupied: true }, { occupied: false },{ occupied: true }, { occupied: true }, { occupied: true }, { occupied: false },{ occupied: false }, { occupied: true }, { occupied: true }, { occupied: false },{ occupied: false }, { occupied: true }, { occupied: true },],
// //     bus: [{ occupied: false }, { occupied: false }, { occupied: true }, { occupied: false }, { occupied: true }],
// //   },
// // };

// // const dummyVehicles = {
// //   1: { vehicle_number: "UP32AB1234", vehicle_type: "Car", user_id: 101 },
// //   2: { vehicle_number: "DL8CAF7654", vehicle_type: "Bike", user_id: 102 },
// // };

// // const dummyBookings = {
// //   1: {
// //     vehicle_id: 1,
// //     slot_id: "fourWheeler-1",
// //     booking_time: "2025-04-02T09:00",
// //     end_time: "2025-04-02T12:00",
// //     status: "Active",
// //     released: false,
// //   },
// //   2: {
// //     vehicle_id: 2,
// //     slot_id: "twoWheeler-0",
// //     booking_time: "2025-04-02T08:30",
// //     end_time: "2025-04-02T11:30",
// //     status: "Active",
// //     released: false,
// //   },
// // };

// // const LocationDetails = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [location, setLocation] = useState(null);

// //   useEffect(() => {
// //     setTimeout(() => {
// //       setLocation(dummyLocation);
// //     }, 500);
// //   }, [id]);

// //   const [vehicles, setVehicles] = useState({});
// // const [bookings, setBookings] = useState({});
// // const [showModal, setShowModal] = useState(false);
// // const [modalData, setModalData] = useState(null);

// // useEffect(() => {
// //   setTimeout(() => {
// //     setLocation(dummyLocation);
// //     setVehicles(dummyVehicles);
// //     setBookings(dummyBookings);
// //   }, 500);
// // }, [id]);

// // const reserveSlot = (slotType, index) => {
// //   const vehicleNumber = document.getElementById("vehicleNumber").value;
// //   const vehicleType = document.getElementById("vehicleType").value;

// //   const newVehicleId = Object.keys(vehicles).length + 1;
// //   const newBookingId = Object.keys(bookings).length + 1;

// //   const updatedVehicles = {
// //     ...vehicles,
// //     [newVehicleId]: {
// //       vehicle_number: vehicleNumber,
// //       vehicle_type: vehicleType,
// //       user_id: 999, // dummy user
// //     },
// //   };

// //   const updatedBookings = {
// //     ...bookings,
// //     [newBookingId]: {
// //       vehicle_id: newVehicleId,
// //       slot_id: `${slotType}-${index}`,
// //       booking_time: new Date().toISOString(),
// //       end_time: "",
// //       released: false,
// //       status: "Active",
// //       user_id: 999,
// //     },
// //   };

// //   const updatedLocation = { ...location };
// //   updatedLocation.slots[slotType][index].occupied = true;

// //   setVehicles(updatedVehicles);
// //   setBookings(updatedBookings);
// //   setLocation(updatedLocation);
// //   toast.success("Slot reserved!");
// //   setShowModal(false);
// // };

// // const releaseSlot = (slotType, index) => {
// //   const slotKey = `${slotType}-${index}`;
// //   const updatedLocation = { ...location };
// //   updatedLocation.slots[slotType][index].occupied = false;

// //   const updatedBookings = { ...bookings };
// //   const bookingEntry = Object.entries(bookings).find(
// //     ([_, b]) => b.slot_id === slotKey && !b.released
// //   );
// //   if (bookingEntry) {
// //     updatedBookings[bookingEntry[0]].released = true;
// //     updatedBookings[bookingEntry[0]].status = "Completed";
// //     updatedBookings[bookingEntry[0]].end_time = new Date().toISOString();
// //   }

// //   setLocation(updatedLocation);
// //   setBookings(updatedBookings);
// //   toast.success("Vehicle released!");
// //   setShowModal(false);
// // };

// // const handleSlotClick = (slotType, index) => {
// //   const slotKey = `${slotType}-${index}`;
// //   const booking = Object.values(bookings).find(b => b.slot_id === slotKey && !b.released);

// //   if (booking) {
// //     const vehicle = vehicles[booking.vehicle_id];
// //     setModalData({
// //       type: "occupied",
// //       slotType,
// //       index,
// //       vehicle,
// //       booking,
// //     });
// //   } else {
// //     setModalData({
// //       type: "unoccupied",
// //       slotType,
// //       index,
// //     });
// //   }
// //   setShowModal(true);
// // };

// //   const handleReleaseVehicle = (slotType, index) => {
// //     const updatedSlots = { ...location.slots };
// //     updatedSlots[slotType][index].occupied = false;

// //     setLocation((prev) => ({
// //       ...prev,
// //       slots: updatedSlots,
// //     }));

// //     toast.success("🚗 Vehicle released successfully!");
// //   };

// const AdminLocationDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [vehicles, setVehicles] = useState({});
//   const [bookings, setBookings] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const [location, setLocation] = useState(null);
//   const [loadingSlots, setLoadingSlots] = useState({}); // ⏳ Slot loading state

//   useEffect(() => {
//     const fetchLocationDetails = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/admin/getSlots/${id}`
//         );
//         setLocation(response.data.location);
//       } catch (error) {
//         console.error("Error fetching location details:", error);
//         toast.error(" Failed to fetch location details. Please try again.");
//       }
//     };
//     fetchLocationDetails();
//   }, [id]);

//   const handleSlotClick = (slotType, index) => {
//     const slotKey = `${slotType}-${index}`;
//     const booking = Object.values(bookings).find(
//       (b) => b.slot_id === slotKey && !b.released
//     );

//     if (booking) {
//       const vehicle = vehicles[booking.vehicle_id];
//       setModalData({
//         type: "occupied",
//         slotType,
//         index,
//         vehicle,
//         booking,
//       });
//     } else {
//       setModalData({
//         type: "unoccupied",
//         slotType,
//         index,
//       });
//     }
//     setShowModal(true);
//   };

//   const handleReleaseVehicle = async (slotType, index) => {
//     if (!location || !location.slots[slotType]) return;

//     const slot = location.slots[slotType][index];
//     const slotKey = `${slotType}-${index}`;

//     setLoadingSlots((prev) => ({ ...prev, [slotKey]: true })); // ⏳ Start loading

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/admin/releaseSlot",
//         {
//           slotId: slot.slot_id,
//         }
//       );

//       if (response.status === 200) {
//         setLocation((prev) => {
//           const updatedSlots = { ...prev.slots };
//           updatedSlots[slotType][index] = {
//             ...updatedSlots[slotType][index],
//             is_empty: true,
//           };
//           return { ...prev, slots: updatedSlots };
//         });

//         toast.success(` Slot ${slot.slot_id} released successfully!`);
//       }
//     } catch (error) {
//       console.error("Error releasing slot:", error);
//       toast.error("Failed to release slot. Try again.");
//     } finally {
//       setLoadingSlots((prev) => ({ ...prev, [slotKey]: false })); // ✅ Stop loading
//     }
//   };

//   if (!location) {
//     return (
//       <div className="flex justify-center items-center h-screen text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
//       <AdminNavbar />

//       <div className="relative z-10 flex flex-col items-center w-full px-4 py-14">
//         <h1 className="text-4xl font-bold mt-10 mb-14 text-black">
//           {location.name} - Parking Slots
//         </h1>

//         {/* Parking Layout */}
//         <div className="w-full max-w-6xl bg-gray-900 p-8 rounded-lg shadow-xl grid flex justify-center">
//           <div className="grid grid-cols-3 gap-12 flex justify-center ">
//             {/* Two-Wheeler Section (Left) */}
//             <div className="flex flex-col items-center text-center">
//               <h2 className="text-xl font-semibold mb-4 text-white">
//                 🛵 2-Wheeler
//               </h2>
//               <div className="grid grid-cols-5 gap-3">
//                 {location.slots.twoWheeler.map((slot, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleSlotClick("twoWheeler", index)}
//                     className={`w-9 h-14 flex items-center justify-center rounded-md text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
//                       slot.occupied
//                         ? "bg-red-300 hover:bg-red-400"
//                         : "bg-green-600 hover:bg-green-400"
//                     }`}
//                   >
//                     {slot.occupied ? "O" : "UO"}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Four-Wheeler Section (Right) */}
//             <div className="flex flex-col items-center text-center mr-5">
//               <h2 className="text-xl font-semibold mb-4 text-white">
//                 🚗 4-Wheeler
//               </h2>
//               <div className="grid grid-cols-4 gap-3">
//                 {location.slots.fourWheeler.map((slot, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleSlotClick("fourWheeler", index)}
//                     className={`w-12 h-[65px] flex items-center justify-center rounded-md text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
//                       slot.occupied
//                         ? "bg-red-300 hover:bg-red-400"
//                         : "bg-green-600 hover:bg-green-400"
//                     }`}
//                   >
//                     {slot.occupied ? "O" : "UO"}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Bus Section (Bottom) */}

//             <div className="flex flex-col items-center text-center">
//               <h2 className="text-xl font-semibold mb-4 text-white">🚌 Bus</h2>
//               <div className="grid grid-cols-3 gap-3">
//                 {location.slots.bus.map((slot, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleSlotClick("bus", index)}
//                     className={`w-20 h-[115px] flex items-center justify-center rounded-md text-lg font-bold text-white shadow-md transition-all cursor-pointer ${
//                       slot.occupied
//                         ? "bg-red-300 hover:bg-red-400"
//                         : "bg-green-600 hover:bg-green-400"
//                     }`}
//                   >
//                     {slot.occupied ? "O" : "UO"}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* {showModal && modalData && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-white rounded-lg p-6 w-[350px] text-black space-y-4">
//       {modalData.type === "occupied" ? (
//         <>
//          <div className="flex items-center justify-between">
//   <h2 className="text-xl font-bold">Vehicle Details</h2>
//   <button
//   className="ml-auto bg-gray-200 text-gray-700 text-xl rounded-md w-8 h-8 flex items-center justify-center"
//   onClick={() => setShowModal(false)}
// >
//   X
// </button>
// </div>

//           <p><strong>Number:</strong> {modalData.vehicle.vehicle_number}</p>
//           <p><strong>Type:</strong> {modalData.vehicle.vehicle_type}</p>
//           <p><strong>Booking Time:</strong> {modalData.booking.booking_time}</p>
//           <p><strong>End Time:</strong> {modalData.booking.end_time}</p>
//           <button
//             onClick={() => releaseSlot(modalData.slotType, modalData.index)}
//             className="px-4 py-2 bg-red-500 text-white rounded"
//           >
//             Release
//           </button>
//         </>
//       ) : (
//         <>
//            <div className="flex items-center justify-between">
//   <h2 className="text-xl font-bold">Vehicle Details</h2>
//   <button
//   className="ml-auto bg-gray-200 text-gray-700 text-xl rounded-md w-8 h-8 flex items-center justify-center"
//   onClick={() => setShowModal(false)}
// >
//   X
// </button>
// </div>
//           <input
//             type="text"
//             placeholder="Vehicle Number"
//             className="w-full border px-2 py-1 rounded"
//             id="vehicleNumber"
//           />
//           <select id="vehicleType" className="w-full border px-2 py-1 rounded">
//             <option value="Car">{modalData.slotType}</option>
//             <option value="Bike">Bike</option>
//             <option value="Bike">Bus</option>
//             <option value="Other">Other</option>
//           </select>
//           <button
//             onClick={() => reserveSlot(modalData.slotType, modalData.index)}
//             className="px-4 py-2 bg-green-600 text-white rounded"
//           >
//             Reserve
//           </button>
//         </>
//       )}
//        */}
//       {/* </div>
//   </div>
// )} */}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default AdminLocationDetails;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../components/Admin/AdminNavbar";

const AdminLocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [slotId, setSlotId] = useState(null);
  const [occupied, setOccupied] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
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
    fetchLocationDetails();
  }, [id]);

  const handleSlotClick = (type, index) => {
    const slot = location.slots[type][index];
    setOccupied(!slot.is_empty);
    setReserved(slot.reserved);
    setSlotId(slot.slot_id);
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleReleaseVehicle = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/releaseSlot",
        {
          slotId: slotId,
        }
      );

      if (response.status === 200) {
        toast.success(`Slot released successfully!`);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error releasing slot:", error);
      toast.error("Failed to release slot. Try again.");
    }
  };

  const handleReserve = async (vehicle_number, slotid) => {
    if (!vehicle_number || !slotid) {
      toast.warn("Please provide valid vehicle details.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/reserveSlot",
        {
          slot_id: slotid,
          vehicle_number: vehicle_number,
        }
      );

      if (response.status === 200) {
        toast.success("Slot reserved successfully!");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error reserving slot:", error);
      toast.error("Reservation failed. Try again.");
    }
  };

  const handleUnreserve = async (slotId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/unreserveSlot",
        { slot_id :slotId }
      );
      if (response.status === 200) {
        toast.success("Slot unreserved successfully!");
        setShowModal(false);
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
      <AdminNavbar />

      <div className="relative z-10 flex flex-col items-center w-full px-4 py-14">
        <h1 className="text-4xl font-bold mt-10 mb-14 text-black">
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[350px] text-black space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {occupied ? "Vehicle Details" : "Reserve Slot"}
              </h2>
              <button
                className="ml-auto bg-gray-200 text-gray-700 text-xl rounded-md w-8 h-8 flex items-center justify-center"
                onClick={() => setShowModal(false)}
              >
                X
              </button>
            </div>

            {occupied ? (
              <>
                <p>
                  <strong>Number:</strong> UP32AB1234
                </p>
                <p>
                  <strong>Type:</strong> Car
                </p>
                <p>
                  <strong>Booking Time:</strong> 10:00 AM
                </p>
                <p>
                  <strong>End Time:</strong> 1:00 PM
                </p>
                <button
                  onClick={() => handleReleaseVehicle(slotId)}
                  className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Release
                </button>
              </>
            ) : reserved ? (
              <>
                <p className="mb-4">
                  <strong>This slot is reserved.</strong>
                </p>
                <button
                  onClick={() => handleUnreserve(slotId)}
                  className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Unreserve
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
                  onClick={() => handleReserve(vehicleNumber, slotId)}
                  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Reserve
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        className="mt-4 w-full py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={() => setShowModal(false)}
      >
        Cancel
      </button>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminLocationDetails;
