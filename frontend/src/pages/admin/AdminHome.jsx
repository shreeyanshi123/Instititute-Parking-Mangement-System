import AdminNavbar from "../../components/Admin/AdminNavbar";
import backgroundImage from "../../assets/road.png";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLocationCard from "../../components/Admin/AdminLocationCard";
const AdminHome = () => {
  const [location, setLocation] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/get")
      .then((res) => {
        console.log(res.data); // ✅ Check actual response
        console.log(res.data.locations); // ✅ Check if locations exist

        setLocation(res.data.locations); // Ensure locations array is set correctly
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    console.log(`Editing slots for location ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleting slots for location ID: ${id}`);
  };

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
      <AdminNavbar />

      {/* Welcome Admin text below the navbar */}
      <div className="relative pt-20 px-6 flex justify-center">
        <h1 className="text-4xl font-bold text-white text-center sm:text-left">
          🏢 Welcome Admin
        </h1>
      </div>

      {/* Location Cards Section (Responsive Grid) */}
      <div className="relative p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {location.map((locationElement) => (
          <AdminLocationCard
            key={locationElement.location_id}
            id={locationElement.location_id}
            image={locationElement.image_url}
            name={locationElement.location_name}
            onEdit={() => handleEdit(locationElement.location_id)}
            onDelete={() => handleDelete(locationElement.location_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
