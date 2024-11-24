import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from 'react-router-dom';
import "./Navbar.css"; // Ensure your custom CSS is imported

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top ">
        <div className="container-fluid">
          {/* Brand */}
          <a className="navbar-brand" href="/">
            <img
              src="https://img.icons8.com/?size=100&id=blpKd0mpBEOj&format=png&color=000000"
              alt="Logo"
              width="35"
              height="28"
              className="d-inline-block align-text-top"
            />
            <span className="electro">MyDevice</span>
          </a>

          {/* Navbar Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="nav nav-underline">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/dashboard">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasCategory"
                  aria-controls="offcanvasCategory"
                >
                  Category
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/hot-deals">
                  Hot Deals
                </a>
              </li>
            </ul>
          </div>

          {/* User Dropdown */}
          <div className="dropdown">
            <a
              className="btn dropdown-toggle"
              href="#"
              role="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/user.png"
                alt="User Icon"
                width="28"
                height="28"
                className="rounded-circle"
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <a className="dropdown-item" href="/profile">
                  Profile:
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/product-form">
                  Sell product
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Offcanvas */}
      <div
        className="offcanvas offcanvas-top custom-offcanvas"
        tabIndex="-1"
        id="offcanvasCategory"
        aria-labelledby="offcanvasCategoryLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasCategoryLabel">
            Categories
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group">
            <li className="list-group-item"><a href="#">Electronics</a></li>
            <li className="list-group-item"><a href="#">Fashion</a></li>
            <li className="list-group-item"><a href="#">Books</a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
