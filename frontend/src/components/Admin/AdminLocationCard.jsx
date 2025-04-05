import { useNavigate } from "react-router-dom";

const AdminLocationCard = ({ id, image, name }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64 h-64 flex flex-col items-center justify-between">
      {/* Clickable Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-36 object-cover rounded-lg cursor-pointer"
        onClick={() => navigate(`/admin/location/${id}`)}
      />

      {/* Clickable Location Name */}
      <h2
        className="text-lg font-semibold mt-2 cursor-pointer hover:text-blue-600"
        onClick={() => navigate(`/admin/location/${id}`)}
      >
        {name}
      </h2>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/admin/location/${id}/edit`)} // 🔗 Navigate to edit page
          className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
        >
          Edit Slots
        </button>
        <button
          onClick={() => navigate(`/admin/location/${id}/edit`)}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
        >
          Delete Slots
        </button>
      </div>
    </div>
  );
};

export default AdminLocationCard;
