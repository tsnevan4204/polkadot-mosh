import React from "react";
import { Link } from "react-router-dom";
import WalletButton from "./WalletButton";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <h1 className="mosh-title">🎧 Mosh</h1>
        <WalletButton />
      </div>

      <nav className="navbar-links">
        <Link to="/" className="nav-link">
          Browse Events
        </Link>
        <Link to="/manage-tickets" className="nav-link">
          Manage Tickets
        </Link>
        <Link to="/manage-concerts" className="nav-link">
          Manage Concerts
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
