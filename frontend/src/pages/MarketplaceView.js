import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import "./MarketplaceView.css";

const MarketplacePage = () => {
  const { eventId } = useParams();
  const { eventContract, marketplaceContract } = useWeb3();
  const [eventData, setEventData] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [resaleListings, setResaleListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventContract || !marketplaceContract) return;

    const fetchMarketplaceData = async () => {
      setLoading(true);
      try {
        const event = await eventContract.events(eventId);
        setEventData(event);

        const uri = event.metadataURI;
        const metaRes = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
        const meta = await metaRes.json();
        setMetadata(meta);

        const listings = await marketplaceContract.getListingsForEvent(eventId);
        setResaleListings(listings);
      } catch (err) {
        console.error("❌ Failed to fetch event/market data", err);
      }
      setLoading(false);
    };

    fetchMarketplaceData();
  }, [eventContract, marketplaceContract, eventId]);

  const formatEther = (value) => `${ethers.utils.formatEther(value)} DOT`;

  return (
    <div className="marketplace-container">
      <h1 className="page-title">🎫 {metadata.name || "Event"} Marketplace</h1>

      {loading ? (
        <p className="glow-text">Loading tickets...</p>
      ) : (
        <>
          <div className="ticket-section">
            <h2 className="glow-text">Primary Market</h2>
            {eventData?.cancelled ? (
              <p className="glow-text">❌ This event has been cancelled</p>
            ) : (
              (() => {
                const location = metadata?.attributes?.find(attr => attr.trait_type === "Location")?.value || "Unknown Location";
                const artist = metadata?.attributes?.find(attr => attr.trait_type === "Artist")?.value || "Unknown Artist";

                return (
                  <div className="ticket-card">
                    <img
                      src={metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                      alt={metadata.name}
                      className="ticket-image"
                    />
                    <div className="ticket-details">
                      <h3>{metadata.name}</h3>
                      <p>{metadata.description}</p>
                      <p>📍 Location: {location}</p>
                      <p>🎤 Artist: {artist}</p>
                      <p>🧾 {formatEther(eventData.ticketPrice)}</p>
                      <p>🎫 {eventData.ticketsSold.toString()} / {eventData.maxTickets.toString()} sold</p>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          <div className="ticket-section">
            <h2 className="glow-text">Secondary Market</h2>
            {resaleListings.length === 0 ? (
              <p className="glow-text">No resale listings yet.</p>
            ) : (
              <ul className="resale-listings">
                {resaleListings.map((listing, i) => (
                  <li key={i} className="resale-item">
                    <p>🎟 Ticket #{listing.tokenId.toString()}</p>
                    <p>💰 {formatEther(listing.price)}</p>
                    <button
                      className="buy-button"
                      onClick={() => {
                        marketplaceContract.buyResaleTicket(eventId, listing.tokenId, {
                          value: listing.price,
                        });
                      }}
                    >
                      Buy Resale Ticket
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
