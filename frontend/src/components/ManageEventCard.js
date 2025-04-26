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

  const formattedDate = eventDate
    ? new Date(Number(eventDate) * 1000).toLocaleString()
    : "Date TBD";

  const formattedPrice = price ? `${ethers.utils.formatEther(price)} ETH` : "—";
  const sold = ticketsSold ? ticketsSold.toString() : "0";
  const supply = maxTickets ? maxTickets.toString() : "?";

  return (
    <div className="event-card">
      <img src={imageURL} alt={name} className="event-image" />

      <div className="event-details">
        <h3 className="event-title">{name}</h3>
        <p className="event-description">{description}</p>

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
