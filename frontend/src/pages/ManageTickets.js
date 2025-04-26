import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
import MarketplacePage from "./MarketplaceView";
import "./ManageTickets.css";

const ManageTickets = () => {
  const { ticketContract, eventContract, marketplaceContract, address } = useWeb3();
  const [myTickets, setMyTickets] = useState([]);
  const [resalePrices, setResalePrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketContract || !eventContract || !address) return;

    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        const total = await ticketContract.nextTokenId();
        const ticketsByEvent = {};

        for (let i = 0; i < total; i++) {
          const owner = await ticketContract.ownerOf(i);
          if (owner.toLowerCase() === address.toLowerCase()) {
            const uri = await ticketContract.tokenURI(i);
            const eventIdBN = await ticketContract.tokenToEvent(i);
            const eventId = Number(eventIdBN);

            if (!ticketsByEvent[eventId]) {
              const event = await eventContract.events(eventId);
              const meta = await fetchMetadata(uri);
              ticketsByEvent[eventId] = {
                eventId,
                metadata: meta,
                eventData: event,
                ticketIds: [],
              };
            }

            ticketsByEvent[eventId].ticketIds.push(i);
          }
        }

        setMyTickets(Object.values(ticketsByEvent));
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      }
      setLoading(false);
    };

    fetchMyTickets();
  }, [ticketContract, eventContract, address]);

  const fetchMetadata = async (ipfsURI) => {
    if (!ipfsURI) return {};
    const url = ipfsURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    try {
      const res = await fetch(url);
      return await res.json();
    } catch (err) {
      console.error("Metadata fetch failed:", err);
      return {};
    }
  };

  const listTicketForSale = async (tokenId) => {
    try {
      const price = prompt("Enter resale price in ETH:");
      if (!price) return;

      const parsedPrice = ethers.utils.parseEther(price);

      // 1. Approve marketplace to transfer ticket
      await ticketContract.approve(marketplaceContract.address, tokenId);
      console.log("✅ Approved marketplace");

      // 2. List ticket for sale
      const tx = await marketplaceContract.listTicket(tokenId, parsedPrice);
      await tx.wait();
      alert("🎉 Ticket listed for resale!");
    } catch (err) {
      console.error("Listing failed:", err);
      alert("❌ Listing failed.");
    }
  };

  return (
    <div className="manage-tickets-container">
      <h1 className="page-title">🎟 Your Tickets</h1>

      {loading ? (
        <p className="glow-text">⏳ Loading tickets...</p>
      ) : myTickets.length === 0 ? (
        <p className="glow-text">😢 No tickets purchased yet.</p>
      ) : (
        <div className="ticket-card-grid">
          {myTickets.map(({ eventData, metadata, ticketIds, eventId }) => {
            const imageURL = metadata?.image?.startsWith("ipfs://")
              ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
              : metadata?.image || "https://via.placeholder.com/400x200.png?text=Concert";
            const eventDate = eventData.eventDate
              ? new Date(Number(eventData.eventDate) * 1000).toLocaleString()
              : "Unknown Date";

            return (
              <div key={eventId} className="ticket-card">
                <img src={imageURL} alt={metadata?.name} className="ticket-image" />
                <div className="ticket-details">
                  <h3>{metadata?.name || "Untitled Event"}</h3>
                  <p>{metadata?.description}</p>
                  <p>🆔 Event #{eventId}</p>
                  <p>🎟 {ticketIds.length} ticket(s)</p>
                  <p>🗓 {eventDate}</p>
                  <div className="resale-section">
                    {ticketIds.map((tokenId) => (
                      <div key={tokenId} className="resale-row">
                        <span className="ticket-id">🎟 #{tokenId}</span>
                        <input
                          type="number"
                          placeholder="Price (ETH)"
                          value={resalePrices[tokenId] || ""}
                          onChange={(e) =>
                            setResalePrices({ ...resalePrices, [tokenId]: e.target.value })
                          }
                          className="resale-input"
                        />
                        <button
                          onClick={() => listTicketForSale(tokenId)}
                          className="resale-button"
                        >
                          List
                        </button>
                      </div>
                    ))}
                  </div>
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
