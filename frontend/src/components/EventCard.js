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
        <p className="event-description">{description}</p>
        <p className="event-meta">🎤 Artist: {artist}</p>
        <p className="event-meta">📍 Location: {location}</p>

        <div className="event-meta">
          <p>🎫 {sold} / {supply} sold</p>
          <p>🗓 {formattedDate}</p>
          <p>🧾 {formattedPrice}</p>
        </div>

        {cancelled && <p className="cancelled-banner">❌ Cancelled</p>}

        {showBuyButton && !cancelled && (
          <button
            className="buy-button"
            onClick={() => onBuy?.(id, price)}
            disabled={soldOut}
          >
            {soldOut ? "SOLD OUT" : "🌀 Buy Ticket"}
          </button>
        )}

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
