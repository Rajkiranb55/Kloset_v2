import React from "react";
import "./navbar.css";
import nav_logo from "../../assets/nav-logo.svg";
import nav_profile from "../../assets/nav-profile.svg";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <div className="navbar">
      {/* <img src={nav_logo} className="nav_logo" alt="" /> */}
      <div className="nav_logo">
        {/* <img src={logo} alt="" /> */}
        <p>Kloset</p>
      </div>
      <img src={nav_profile} className="nav_profile" />
    </div>
  );
};

export default Navbar;
