// Footer.js
import React from 'react';
import './Footer.css'; // Import CSS for styling

const Footer = () => {
  return (
    
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="./Header.js">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@imageconverter.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div className="footer-socials">
          <h4>Follow Us</h4>
          <a href="https://facebook.com" class="fa fa-facebook">  Facebook</a><br></br><br></br>
          <a href="https://twitter.com" class="fa fa-twitter">  Twitter</a><br></br><br></br>
          <a href="https://instagram.com" class="fa fa-instagram">  Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Image Converter. All rights reserved.</p>
      </div>
      
    </footer>
  );
};

export default Footer;
