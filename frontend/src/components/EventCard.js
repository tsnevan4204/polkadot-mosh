import React from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event, onBuy, showBuyButton = true }) => {
  const navigate = useNavigate();

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
    isGoldHolder      // true or false
  } = event;

  const name = metadata?.name || "Untitled Concert";
  const description = metadata?.description || "No description provided.";
  const location = metadata?.attributes?.find(attr => attr.trait_type === "Location")?.value || "Unknown Location";
  const artist = metadata?.attributes?.find(attr => attr.trait_type === "Artist")?.value || "Unknown Artist";
  const imageURL = metadata?.image?.startsWith("ipfs://")
    ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : metadata?.image || "https://via.placeholder.com/400x200.png?text=Concert";

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

        <p className="artist-name">🎤 {artist}</p>
        <p className="location-name">📍 {location}</p>
        <p className="date-name">🗓 {formattedDate}</p>

        <div className="event-ticket-info">
          <p className="ticket-sold">🎫 {sold} / {supply} sold</p>
          {/* Progress Bar for loyalty */}
          {loyaltyProgress !== undefined && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${loyaltyProgress}%` }}
                />
              </div>
              <p className="progress-text">{loyaltyProgress}% toward Gold</p>
            </div>
          )}
        </div>

        <div className="price-section">
          💰 <span className="price-text">{formattedPrice}</span>
          {isGoldHolder && <span className="loyalty-badge">GOLD</span>}
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
