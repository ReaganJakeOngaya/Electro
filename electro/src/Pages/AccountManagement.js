import React, { useState, useEffect } from "react";
import axios from "axios";
import './AccountManagement.css';

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
    <div className="account-management">
      <div className="container">
        {/* Profile Section */}
        {user ? (
          <section className="profile">
            <h2>Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
          </section>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <h2>Account Management</h2>
      <div className="buttons">
        <button onClick={handleDeleteAccount} className="btn-delete">
          Request Account Deletion
        </button>
        <button onClick={handleRecoverAccount} className="btn-recover">
          Recover Account
        </button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AccountManagement;
