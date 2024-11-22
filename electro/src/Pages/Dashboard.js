import React, { useState, useEffect  } from "react";
import axios from 'axios';
// import Navbar from './Navbar';
// import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState({});
  

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data for profile
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user', { params: { user_id: 1 } });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  

 

  
  return (
    <div className="dashboard">
      <div className="container">
        {/* Profile Section */}
        <section className="profile">
          <h2>Welcome, {user.first_name} </h2>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;