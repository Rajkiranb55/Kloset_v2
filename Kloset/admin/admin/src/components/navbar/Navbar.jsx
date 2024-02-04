import React from "react";
import "./navbar.css";
import nav_logo from "../../assets/nav-logo.svg";
import nav_profile from "../../assets/nav-profile.svg";
const Navbar = () => {
  return (
    <div className="navbar">
      <img src={nav_logo} className="nav_logo" alt="" />
      <img src={nav_profile} className="nav_profile" />
    </div>
  );
};

export default Navbar;
