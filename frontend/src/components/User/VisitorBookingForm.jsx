// src/components/User/BookingFormModal.jsx
import React from "react";

const VisitorBookingForm = ({
  selectedSlot,
  bookingForm,
  handleFormChange,
  handleBookingSubmit,
  closeModal,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          Reserve Slot {selectedSlot.slot_id}
        </h2>
        <form onSubmit={handleBookingSubmit}>
          <div className="mb-2">
            <label htmlFor="vehicle_number" className="block font-semibold">
              Vehicle Number
            </label>
            <input
              id="vehicle_number"
              type="text"
              name="vehicle_number"
              value={bookingForm.vehicle_number}
              onChange={handleFormChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="vehicle_type" className="block font-semibold">
              Vehicle Type
            </label>
            <select
              id="vehicle_type"
              name="vehicle_type"
              value={bookingForm.vehicle_type}
              onChange={handleFormChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Type</option>
              <option value="twoWheeler">2-Wheeler</option>
              <option value="FourWheeler">4-Wheeler</option>
              <option value="Other">Bus</option>
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
            >
              Reserve Slot
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitorBookingForm;
