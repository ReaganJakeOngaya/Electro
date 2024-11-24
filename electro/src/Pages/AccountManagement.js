import React, { useState, useEffect } from "react";
import axios from "axios";
import './AccountManagement.css';
import Navbar from "../Components/Navbar";

const AccountManagement = () => {
  const [user, setUser] = useState(null); // Store the user object
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data for profile
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user", {
        params: { user_id: 1 }, // Replace with dynamic user fetching logic if needed
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage("Failed to load user data.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user) {
        setMessage("User data not available.");
        return;
      }
      const response = await axios.post("http://localhost:5000/delete_account", {
        user_id: user.id, // Sending the user's ID
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error processing request.");
      console.error("Error requesting account deletion:", error);
    }
  };

  const handleRecoverAccount = async () => {
    try {
      if (!user) {
        setMessage("User data not available.");
        return;
      }
      const response = await axios.post("http://localhost:5000/recover_account", {
        user_id: user.id, // Sending the user's ID
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error processing request.");
      console.error("Error recovering account:", error);
    }
  };

  return (
    <div className="account-management container d-flex flex-column justify-content-center align-items-center  bg-light rounded shadow">
      <Navbar />
  <h2 className="text-primary mb-4">Profile</h2>
  <div className="user d-flex flex-column align-items-center text-center">
    <div className="user-pic mb-3">
      <img
        className="img-user rounded-circle border border-primary shadow"
        src="https://img.icons8.com/?size=100&id=MstlsvKUSlqA&format=png&color=000000"
        alt="user-photo"
      />
    </div>
    <div className="profile">
      {user ? (
        <>
          <p><strong>First Name:</strong> {user.first_name}</p>
          <p><strong>Last Name:</strong> {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  </div>

  <h2 className="text-danger mt-5">Account Management</h2>
  <div className="buttons mt-4">
    <button onClick={handleDeleteAccount} className="btn btn-danger mx-2">
      Request Account Deletion
    </button>
    <button onClick={handleRecoverAccount} className="btn btn-success mx-2">
      Recover Account
    </button>
  </div>
  {message && <p className="message text-info mt-3">{message}</p>}
</div>


  );
};

export default AccountManagement;
