import React from "react";
import { ethers } from "ethers";
import "./EventCard.css"; // Reuse styling

const ManageEventCard = ({ event, onCancel, onUpdate }) => {
  const {
    id,
    metadata,
    price,
    maxTickets,
    ticketsSold,
    eventDate,
    cancelled,
  } = event;

  const name = metadata?.name || "Untitled";
  const description = metadata?.description || "No description.";
  const imageURL = metadata?.image?.startsWith("ipfs://")
    ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : metadata?.image || "https://via.placeholder.com/400x200.png?text=Concert";

  const location = metadata?.attributes?.find(attr => attr.trait_type === "Location")?.value || "Unknown Location"; // Added location
  const artist = metadata?.attributes?.find(attr => attr.trait_type === "Artist")?.value || "Unknown Artist"; // Added artist

  const formattedDate = eventDate
    ? new Date(Number(eventDate) * 1000).toLocaleString()
    : "Date TBD";

  const formattedPrice = price ? `${ethers.utils.formatEther(price)} DOT` : "—";
  const sold = ticketsSold ? ticketsSold.toString() : "0";
  const supply = maxTickets ? maxTickets.toString() : "?";

  return (
    <div className="event-card">
      <img src={imageURL} alt={name} className="event-image" />

      <div className="event-details">
        <h3 className="event-title">{name}</h3>
        <p className="event-description">{description}</p>
        <p className="event-meta">🎤 Artist: {artist}</p> {/* Display artist */}
        <p className="event-meta">📍 Location: {location}</p> {/* Display location */}

        <div className="event-meta">
          <p>🎫 {sold} / {supply} sold</p>
          <p>🗓 {formattedDate}</p>
          <p>💰 {formattedPrice}</p>
        </div>

        {cancelled ? (
          <p className="cancelled-banner">❌ This event is cancelled</p>
        ) : (
          <div className="admin-buttons">
            <button onClick={() => onCancel?.(id)} className="cancel-button">🛑 Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEventCard;
