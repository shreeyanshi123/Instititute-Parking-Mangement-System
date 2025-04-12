import backgroundImage from "../../assets/road.png";
import { useEffect, useState } from "react";
import axios from "axios";
import UserLocationCard from "../../components/User/UserLocationCard";
import UserNavBar from "../../components/User/UserNavBar";
const AdminHome = () => {
  const [location, setLocation] = useState([]);
  const [role,setRole] = useState("");
  const [name,setName] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:5000/user/getAllLocations")
      .then((res) => {
        console.log(res.data); 
        setRole(res.data.role);
        setLocation(res.data.locations); 
      })
      .catch((err) => {
        console.log(err);
      });
      getUserDetails();
  }, []);

 const getUserDetails = async()=>{
  axios.get("http://localhost:5000/auth/getUser").then((res)=>{
    setName(res.data.user.name);
  })
  .catch((err)=>{
    console.log(err);
  })
 }

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>{" "}
        {/* Black overlay ONLY on the background */}
      </div>

      {/* Fixed Navbar */}
      <UserNavBar />

      {/* Welcome Admin text below the navbar */}
      <div className="relative pt-20 px-6 flex justify-center">
        <h1 className="text-4xl font-bold text-white text-center sm:text-left">
          🏢 Welcome {name}
        </h1>
      </div>

      {/* Location Cards Section (Responsive Grid) */}
      <div className="relative p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {location.map((locationElement) => (
          console.log(locationElement,"role:",role), // ✅ Check each location ID
          <UserLocationCard
            key={locationElement.location_id}
            id={locationElement.location_id}
            image={locationElement.image_url}
            name={locationElement.location_name}      
            role = {role}     
          />
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
