import React from 'react';
import './Header.css'; // Import the CSS for the header
import logo from './1322164.ico'; // Add your logo path here

const Header = () => {
  return (
    
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Image Format Converter</h1>
        <p>Convert your images to various formats quickly and easily.</p>
      </div>
    </header>
  );
};

export default Header;
