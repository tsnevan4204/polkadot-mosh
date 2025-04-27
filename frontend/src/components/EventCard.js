import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import LoadingSpinner from "./LoadingSpinner";
import "./EventCard.css";

const EventCard = ({ event, onBuy, showBuyButton = true, isGuestUser = false }) => {
  const navigate = useNavigate();
  const { getArtistName, connectWallet, role } = useWeb3();
  const [artistName, setArtistName] = useState("Unknown Artist");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

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
    ? new Date(Number(eventDate) * 1000).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : "Date TBD";

  const formattedPrice = price ? `${ethers.utils.formatEther(price)} DOT` : "—";
  const sold = ticketsSold ? ticketsSold.toString() : "0";
  const supply = maxTickets ? maxTickets.toString() : "?";
  const soldOut = ticketsSold && maxTickets && ticketsSold.gte(maxTickets);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBuyTicket = async () => {
    if (isBuying) return;
    
    setIsBuying(true);
    try {
      await onBuy(id, price);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="event-card">
      {cancelled && <div className="cancelled-banner">Cancelled</div>}
      
      <img src={imageURL} alt={name} className="event-image" />

      <div className="event-details">
        <h3 className="event-title">{name}</h3>
        <p className="artist-name">🎤 {artistName}</p>
        <p className="location-name">📍 {location}</p>
        <p className="date-name">🗓 {formattedDate}</p>
        <div className="event-ticket-info">
          <p className="ticket-sold">🎫 {sold} / {supply} sold</p>
          
          {/* Only show progress bar for connected users, not for guests */}
          {!isGuestUser && goldRequirement > 0 && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${loyaltyProgress || 0}%` }}
                />
              </div>
              <p className="progress-text">
                {attendedCount !== undefined ? `${attendedCount || 0}/${goldRequirement} events` : `${loyaltyProgress || 0}%`} toward Gold
              </p>
            </div>
          )}
        </div>

        <div className="price-section">
          💰 <span className="price-text">{formattedPrice}</span>
          {/* Only show gold badge for connected users, not for guests */}
          {!isGuestUser && isGoldHolder && <span className="loyalty-badge">GOLD</span>}
        </div>

        {/* Only show buttons if event is not cancelled */}
        {!cancelled ? (
          <>
            {/* BUY BUTTON - Only shown for fans */}
            {showBuyButton && !isGuestUser && role === 'fan' && (
              <button
                className="buy-button"
                onClick={handleBuyTicket}
                disabled={soldOut || isBuying}
              >
                {soldOut ? "SOLD OUT" : (
                  isBuying ? (
                    <span className="button-loading">
                      <LoadingSpinner size="small" />
                      <span>Buying...</span>
                    </span>
                  ) : "🌀 Buy Ticket"
                )}
              </button>
            )}

            {/* For guests, show a connect wallet prompt instead of marketplace/buy buttons */}
            {isGuestUser ? (
              <button 
                className="connect-wallet-button"
                onClick={handleConnectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <span className="button-loading">
                    <LoadingSpinner size="small" />
                    <span>Connecting...</span>
                  </span>
                ) : "🔌 Connect Wallet"}
              </button>
            ) : (
              <button
                className="resell-button"
                onClick={() => navigate(`/marketplace/${id}`)}
              >
                🔁 View Marketplace
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EventCard;
