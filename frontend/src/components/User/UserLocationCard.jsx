import { useNavigate } from "react-router-dom";

const UserLocationCard = ({ id, image, name }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64 h-64 flex flex-col items-center justify-between">
      {/* Clickable Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-36 object-cover rounded-lg cursor-pointer"
        onClick={() => navigate(`/user/location/${id}`)}
      />

      {/* Clickable Location Name */}
      <h2
        className="text-lg font-semibold mt-2 cursor-pointer hover:text-blue-600"
        onClick={() => navigate(`/user/location/${id}`)}
      >
        {name}
      </h2>

      
    </div>
  );
};

export default UserLocationCard;
