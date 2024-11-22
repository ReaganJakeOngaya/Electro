import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'

const Home = () => {
  return (
    <div className=" home container-fluid bg-light vh-100 d-flex flex-column align-items-center justify-content-center">
      <header className="text-center mb-5">
        <h1 className="display-3 fw-bold ">Welcome to Electro</h1>
        <p className="lead text-secondary">
          Your one-stop shop for the latest electronics. Explore the best deals and enjoy the latest technology!
        </p>
      </header>
      
      <div className="d-flex gap-3">
        <a href="/login" className="btn btn-outline-primary btn-lg">
          Login
        </a>
        <a href="/register" className="btn btn-primary btn-lg">
          Signup
        </a>
      </div>

    </div>
  );
};

export default Home;
