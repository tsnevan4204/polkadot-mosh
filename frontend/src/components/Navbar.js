import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import WalletButton from "./WalletButton";
import "./Navbar.css";
import GoldRequirementSetter from "./GoldRequirementSetter";

const Navbar = () => {
  const { role } = useWeb3();

  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <Link to="/" className="logo-link">
          <h1 className="mosh-title">🎧 Mosh</h1>
        </Link>
        <GoldRequirementSetter /> {/* ⭐ New loyalty setter */}
        <WalletButton />
      </div>


      <nav className="navbar-links">
        {role && (
          <>
            <Link to="/" className="nav-link">Browse Events</Link>
            {role === "fan" && (
              <Link to="/manage-tickets" className="nav-link">Manage Tickets</Link>
            )}
            {role === "musician" && (
              <Link to="/manage-concerts" className="nav-link">Manage Concerts</Link>
            )}
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
