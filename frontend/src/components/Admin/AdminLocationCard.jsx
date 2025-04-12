import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

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
        className="w-full h-44 object-cover rounded-lg cursor-pointer"  
        onClick={() => navigate(`/admin/location/${id}`)}
      />
      <div className="flex items-center justify-between w-full mt-2 p-4">
                {/* Location Name */}
                <h2
                  className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                  style={{fontSize:"25px"}}
                  onClick={() => navigate(`/admin/location/${id}`)}
                >
                  {name}
                </h2>
      
                {/* Action Icons */}
                <div className="flex gap-3 text-xl">
                  <FaEdit
                    onClick={() => navigate(`/admin/location/${id}/edit`)}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    title="Edit Slots"
                  />
                  <FaTrash
                    onClick={handleDelete}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    title="Delete Slots"
                  />
              </div>
          </div>
      <ToastContainer style={{ zIndex: 9999 }} />
    </div>
  );
};

export default AdminLocationCard;
