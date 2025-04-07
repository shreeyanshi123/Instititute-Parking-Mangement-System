import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import axios from "axios";

const AdminLocationCard = ({ id, image, name, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const res = await axios.post("http://localhost:5000/admin/location/delete", {
        location_id: id, // ✅ Sending in request body
      });

      toast.success(res.data.message || "Location deleted successfully");
      onDelete(id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete location");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64 h-64 flex flex-col items-center justify-between">
      <img
        src={image}
        alt={name}
        className="w-full h-36 object-cover rounded-lg cursor-pointer"
        onClick={() => navigate(`/admin/location/${id}`)}
      />
      <h2
        className="text-lg font-semibold mt-2 cursor-pointer hover:text-blue-600"
        onClick={() => navigate(`/admin/location/${id}`)}
      >
        {name}
      </h2>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/admin/location/${id}/edit`)}
          className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
        >
          Edit Slots
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
        >
          Delete Slots
        </button>
      </div>
      <ToastContainer style={{ zIndex: 9999 }} />
    </div>
  );
};

export default AdminLocationCard;
