import React from 'react'
import "./Footer.css";

const Footer = () => {
  return (
     <footer className="playful-footer">
      <hr></hr>
      <div className="container text-center py-4">
        <h2 className="footer-logo">My Device .Inc</h2>
        <div className="social-icons mt-3">
          <a href="#" className="me-3">
            <img src='https://img.icons8.com/?size=100&id=yGcWL8copNNQ&format=png&color=000000' alt='facebook' />
          </a>
          <a href="#" className="me-3">
            <img src='https://img.icons8.com/?size=100&id=bG29Ckcdp6YP&format=png&color=000000' alt='twitter' />
          </a>
          <a href="#" className="me-3">
            <img src='https://img.icons8.com/?size=100&id=32323&format=png&color=000000' alt='Instagram' />
          </a>
          <a href="#" className="me-3">
            <img src='https://img.icons8.com/?size=100&id=16713&format=png&color=000000' alt='whatsapp' />
          </a>
        </div>
        <div className="footer-links mt-4">
          <a href="#" className="me-4">
            About Us
          </a>
          <a href="#" className="me-4">
            Contact
          </a>
          <a href="#" className="me-4">
            Terms
          </a>
          <a href="#">Privacy</a>
        </div>
        <div className="footer-bottom mt-4">
          © 2024 Electro Inc. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer