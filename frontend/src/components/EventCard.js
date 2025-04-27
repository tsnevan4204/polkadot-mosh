import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import "./EventCard.css";

const EventCard = ({ event, onBuy, showBuyButton = true }) => {
  const navigate = useNavigate();
  const { getArtistName } = useWeb3();
  const [artistName, setArtistName] = useState("Unknown Artist");

  const {
    id,
    metadata,
    price,
    maxTickets,
    ticketsSold,
    eventDate,
    organizer,
    cancelled,
    loyaltyProgress,  // % Progress toward loyalty (0–100)
    isGoldHolder,     // true or false
    goldRequirement,  // Number of events required for Gold
    attendedCount     // Number of events attended
  } = event;

  const name = metadata?.name || "Untitled Concert";
  const description = metadata?.description || "No description provided.";
  const location = metadata?.attributes?.find(attr => attr.trait_type === "Location")?.value || "Unknown Location";
  const imageURL = metadata?.image?.startsWith("ipfs://")
    ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : metadata?.image || "https://via.placeholder.com/400x200.png?text=Concert";

  // Get artist name from metadata
  useEffect(() => {
    // First try to get from metadata
    const artistAttr = metadata?.attributes?.find(attr => attr.trait_type === "Artist Name");
    console.log("Artist Name from metadata:", artistAttr);
    if (artistAttr && artistAttr.value) {
      setArtistName(artistAttr.value);
      return;
    }
    
    // Fallback to the old method
    const oldArtistAttr = metadata?.attributes?.find(attr => attr.trait_type === "Artist");
    if (oldArtistAttr && oldArtistAttr.value) {
      // If it's an address, try to fetch the real name
      if (oldArtistAttr.value.startsWith("0x")) {
        getArtistName(oldArtistAttr.value).then(name => {
          if (name) setArtistName(name);
        });
      } else {
        setArtistName(oldArtistAttr.value);
      }
      return;
    }
    
    // If still not found, try to get it from the organizer address
    if (organizer) {
      getArtistName(organizer).then(name => {
        if (name) setArtistName(name);
      });
    }
  }, [metadata, organizer, getArtistName]);

  const formattedDate = eventDate
    ? new Date(Number(eventDate) * 1000).toLocaleString()
    : "Date TBD";

  const formattedPrice = price ? `${ethers.utils.formatEther(price)} DOT` : "—";
  const sold = ticketsSold ? ticketsSold.toString() : "0";
  const supply = maxTickets ? maxTickets.toString() : "?";
  const soldOut = ticketsSold && maxTickets && ticketsSold.gte(maxTickets);

  return (
    <div className="event-card">
      <img src={imageURL} alt={name} className="event-image" />

      <div className="event-details">
        <h3 className="event-title">{name}</h3>

        <p className="artist-name">🎤 {artistName}</p>
        <p className="location-name">📍 {location}</p>
        <p className="date-name">🗓 {formattedDate}</p>
        <div className="event-ticket-info">
          <p className="ticket-sold">🎫 {sold} / {supply} sold</p>
          {/* Only show progress bar for fans, not musicians */}
          {attendedCount !== undefined && loyaltyProgress !== undefined && goldRequirement > 0 && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${loyaltyProgress}%` }}
                />
              </div>
              <p className="progress-text">
                {attendedCount !== undefined ? `${attendedCount}/${goldRequirement} events` : `${loyaltyProgress}%`} toward Gold
              </p>
            </div>
          )}
        </div>

        <div className="price-section">
          💰 <span className="price-text">{formattedPrice}</span>
          {/* Only show gold badge for fans */}
          {isGoldHolder && attendedCount !== undefined && <span className="loyalty-badge">GOLD</span>}
        </div>

        {cancelled && <p className="cancelled-banner">❌ Cancelled</p>}

        {/* BUY BUTTON under price */}
        {showBuyButton && !cancelled && (
          <button
            className="buy-button"
            onClick={() => onBuy?.(id, price)}
            disabled={soldOut}
          >
            {soldOut ? "SOLD OUT" : "🌀 Buy Ticket"}
          </button>
        )}

        {/* Resell Button always shown */}
        <button
          className="resell-button"
          onClick={() => navigate(`/marketplace/${id}`)}
        >
          🔁 View Marketplace
        </button>
      </div>
    </div>
  );
};

export default EventCard;
