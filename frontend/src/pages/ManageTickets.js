import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./ManageTickets.css";

const ManageTickets = () => {
  const { ticketContract, eventContract, marketplaceContract, address, getArtistName } = useWeb3();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [ticketDetails, setTicketDetails] = useState({});

  useEffect(() => {
    if (!ticketContract || !address) return;

    const load = async () => {
      setLoading(true);
      try {
        const total = await ticketContract.nextTokenId();
        const owned = [];
        for (let i = 0; i < total; i++) {
          try {
            const owner = await ticketContract.ownerOf(i);
            if (owner.toLowerCase() === address.toLowerCase()) {
              const uri = await ticketContract.tokenURI(i);
              const eventId = await ticketContract.tokenToEvent(i);
              owned.push({ tokenId: i, uri, eventId: eventId.toNumber() });
            }
          } catch {}
        }
        setTickets(owned);
        
        // Load event details for each ticket
        const details = {};
        for (const ticket of owned) {
          try {
            const event = await eventContract.events(ticket.eventId);
            const metadataUri = event.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            const metadata = await axios.get(metadataUri);
            const artistName = await getArtistName(event.organizer);
            
            details[ticket.tokenId] = {
              eventName: metadata.data.name,
              description: metadata.data.description,
              date: new Date(event.eventDate.toNumber() * 1000).toLocaleString(),
              venue: metadata.data.attributes.find(attr => attr.trait_type === "Venue")?.value || "Unknown Venue",
              artist: artistName,
              price: ethers.utils.formatEther(event.ticketPrice),
              image: metadata.data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
              cancelled: event.cancelled
            };
          } catch (err) {
            console.error(`Error loading details for event ${ticket.eventId}:`, err);
            details[ticket.tokenId] = { error: true };
          }
        }
        setTicketDetails(details);
      } catch (err) {
        console.error("Ticket load failed:", err);
      }
      setLoading(false);
    };

    load();
  }, [ticketContract, eventContract, address, getArtistName]);

  const listTicket = async (tokenId) => {
    const priceInput = prices[tokenId];
    if (!priceInput) return toast.error("Set a price first!");

    try {
      const parsedPrice = ethers.utils.parseEther(priceInput.toString());

      await ticketContract.approve(marketplaceContract.address, tokenId);
      const tx = await marketplaceContract.listTicket(tokenId, parsedPrice);
      await tx.wait();

      toast.success("Ticket listed!");
      window.location.reload();
    } catch (err) {
      console.error("List failed:", err);
      toast.error("List failed.");
    }
  };

  // Format date in a readable way
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="manage-tickets-container">
      <h1 className="page-title">🎟 Your Tickets</h1>

      {loading ? (
        <p className="glow-text">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="glow-text">No tickets owned yet.</p>
      ) : (
        <div className="ticket-grid">
          {tickets.map((t) => {
            const details = ticketDetails[t.tokenId] || {};
            const isCancelled = details.cancelled;
            
            return (
              <div key={t.tokenId} className={`ticket-card ${isCancelled ? 'cancelled' : ''}`}>
                {isCancelled && <div className="cancelled-banner">CANCELLED</div>}
                <img
                  src={details.image || t.uri.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  alt={`Ticket ${t.tokenId}`}
                  className="ticket-image"
                />
                <div className="ticket-content">
                  <div className="ticket-header">
                    <span className="ticket-id">Ticket #{t.tokenId}</span>
                  </div>
                  
                  <div className="event-details">
                    <h3 className="event-title">{details.eventName || "Loading..."}</h3>
                    <p className="event-artist">
                      <span className="detail-label">Artist:</span> {details.artist || "Unknown"}
                    </p>
                    <p className="event-date">
                      <span className="detail-label">Date:</span> {details.date ? formatDate(details.date) : "TBA"}
                    </p>
                    <p className="event-venue">
                      <span className="detail-label">Venue:</span> {details.venue || "TBA"}
                    </p>
                    <p className="event-price">
                      <span className="detail-label">Original Price:</span> {details.price || "?"} DOT
                    </p>
                  </div>
                  
                  {!isCancelled && (
                    <div className="ticket-resale">
                      <div className="price-input-container">
                        <input
                          type="number"
                          placeholder="Price (DOT)"
                          value={prices[t.tokenId] || ""}
                          onChange={(e) =>
                            setPrices({ ...prices, [t.tokenId]: e.target.value })
                          }
                          className="price-input"
                        />
                        <div className="dot-symbol">DOT</div>
                      </div>
                      <button
                        className="list-button"
                        onClick={() => listTicket(t.tokenId)}
                      >
                        <span className="icon">💰</span> List for Sale
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
