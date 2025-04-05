import React, { useState, useEffect } from "react";
import axios from "axios";

const GetUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/getUser", { withCredentials: true })
      .then((response) => {
        console.log(response.data); // Debugging
        if (response.data.success) {
          setUser(response.data.user); // Save only the user data
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => setError("Error fetching user",err));
  }, []);

  return (
    <div>
      <h2>User Details</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GetUser;
