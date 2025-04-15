import { useNavigate } from "react-router-dom";

const UserLocationCard = ({ id, image, name,role }) => {
  const navigate = useNavigate();
  const HandleNavigate = () => {
    if (role === "faculty_student") {
      navigate(`/user/location/${id}`);
    } else {
      navigate(`/visitor/location/${id}`);
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64 h-64 flex flex-col items-center justify-between location-card">
      {/* Clickable Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-lg cursor-pointer"
        onClick={HandleNavigate}
      />

      {/* Clickable Location Name */}
      <h2
        className="text-lg font-semibold mt-2 mb-2 cursor-pointer hover:text-blue-600"
        style={{fontSize:"25px"}}
        onClick={HandleNavigate}
      >
        {name}
      </h2>

      
    </div>
  );
};

export default UserLocationCard;
