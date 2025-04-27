import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
import LoyaltyBadge from "../components/LoyaltyBadge";
import "./ManageTickets.css";

const ManageTickets = () => {
  const { ticketContract, eventContract, address } = useWeb3();
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artistTicketCounts, setArtistTicketCounts] = useState({}); // 🆕

  useEffect(() => {
    if (!ticketContract || !eventContract || !address) return;

    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        const total = await ticketContract.nextTokenId();
        const owned = [];
        const artistCounts = {};

        for (let i = 0; i < total; i++) {
          try {
            const owner = await ticketContract.ownerOf(i);
            if (owner.toLowerCase() === address.toLowerCase()) {
              const uri = await ticketContract.tokenURI(i);
              const eventIdBN = await ticketContract.tokenToEvent(i);
              const eventId = Number(eventIdBN);

              const event = await eventContract.events(eventId);
              const meta = await fetchMetadata(uri);
              const artist = meta?.attributes?.find(attr => attr.trait_type === "Artist")?.value || "Unknown Artist";

              if (!artistCounts[artist]) {
                artistCounts[artist] = 0;
              }
              artistCounts[artist] += 1;

              owned.push({ eventId, metadata: meta, eventData: event, artist, ticketId: i });
            }
          } catch (err) {
            // Skip if not exist
          }
        }

        setArtistTicketCounts(artistCounts);
        setMyTickets(owned);
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

  return (
    <div className="manage-tickets-container">
      <h1 className="page-title">🎟 Your Tickets</h1>

      {loading ? (
        <p className="glow-text">⏳ Loading tickets...</p>
      ) : myTickets.length === 0 ? (
        <p className="glow-text">😢 No tickets purchased yet.</p>
      ) : (
        <div className="ticket-card-grid">
          {myTickets.map(({ eventData, metadata, ticketId, artist, eventId }) => {
            const imageURL = metadata?.image?.startsWith("ipfs://")
              ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
              : metadata?.image || "https://via.placeholder.com/400x200.png?text=Concert";

            const eventDate = eventData.eventDate
              ? new Date(Number(eventData.eventDate) * 1000).toLocaleString()
              : "Unknown Date";

            const artistCount = artistTicketCounts[artist] || 0;
            const goldRequirement = eventData.goldRequirement ? Number(eventData.goldRequirement) : 3; // fallback
            const isGold = artistCount >= goldRequirement;

            return (
              <div key={ticketId} className="ticket-card">
                <img src={imageURL} alt={metadata?.name} className="ticket-image" />
                <div className="ticket-details">
                  <h3>{metadata?.name || "Untitled Event"} 
                    <LoyaltyBadge isGold={isGold} progress={artistCount} goal={goldRequirement} />
                  </h3>
                  <p>{metadata?.description}</p>
                  <p>📍 Location: {metadata?.attributes?.find(attr => attr.trait_type === "Location")?.value || "Unknown Location"}</p>
                  <p>🎤 Artist: {artist}</p>
                  <p>🆔 Event #{eventId}</p>
                  <p>🗓 {eventDate}</p>
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
