import React, { useState } from "react";
import { ethers } from "ethers";
import { trackRefunds } from "../utils/refundTracker";

const RefundTrackerPage = () => {
  const [eventId, setEventId] = useState("");

  const handleTrack = async () => {
    if (!window.ethereum) {
      alert("No wallet detected.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    await trackRefunds(Number(eventId), provider);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", color: "#00ffe7" }}>
      <h2>🔍 Refund Tracker Utility</h2>
      <input
        type="number"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        placeholder="Enter Event ID"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#1a1a1a",
          border: "1px solid #00ffe7",
          color: "#fff"
        }}
      />
      <br />
      <button
        onClick={handleTrack}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          backgroundColor: "#00ffe7",
          color: "#000",
          cursor: "pointer",
          border: "none",
          borderRadius: "5px"
        }}
      >
        🛰 Track Refunds
      </button>
    </div>
  );
};

export default RefundTrackerPage;
