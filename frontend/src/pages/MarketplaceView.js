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
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventContract || !marketplaceContract) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const event = await eventContract.events(eventId);
        setEventData(event);

        const metaRes = await fetch(event.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/"));
        const meta = await metaRes.json();
        setMetadata(meta);

        const listedTokenIds = await marketplaceContract.getListingsByEvent(eventId);
        const listingData = await Promise.all(
          listedTokenIds.map(async (tokenId) => {
            const listing = await marketplaceContract.listings(tokenId);
            return {
              tokenId,
              price: listing.price,
              seller: listing.seller,
            };
          })
        );
        setListings(listingData);
      } catch (err) {
        console.error("Marketplace load failed:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [eventContract, marketplaceContract, eventId]);

  const formatEther = (value) => ethers.utils.formatEther(value);

  const buyTicket = async (tokenId, price) => {
    try {
      const tx = await marketplaceContract.buyTicket(tokenId, { value: price });
      await tx.wait();
      alert("🎟️ Ticket purchased!");
      window.location.reload();
    } catch (err) {
      console.error("Buy failed:", err);
      alert("❌ Failed to buy ticket.");
    }
  };

  return (
    <div className="marketplace-container">
      <h1 className="page-title">🎟 {metadata.name || "Event"} Marketplace</h1>

      {loading ? (
        <p className="glow-text">Loading...</p>
      ) : (
        <>
          <div className="ticket-section">
            <h2 className="glow-text">Primary Info</h2>
            <div className="ticket-card">
              <img
                src={metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                alt={metadata.name}
                className="ticket-image"
              />
              <div className="ticket-details">
                <h3>{metadata.name}</h3>
                <p>{metadata.description}</p>
                <p>📍 {metadata.attributes?.find(a => a.trait_type === "Location")?.value || "Unknown"}</p>
                <p>🎤 {metadata.attributes?.find(a => a.trait_type === "Artist")?.value || "Unknown"}</p>
                <p>🎫 {eventData?.ticketsSold.toString()} / {eventData?.maxTickets.toString()} sold</p>
              </div>
            </div>
          </div>

          <div className="ticket-section">
            <h2 className="glow-text">Secondary Market</h2>
            {listings.length === 0 ? (
              <p className="glow-text">No tickets listed yet.</p>
            ) : (
              <ul className="resale-listings">
                {listings.map((l, i) => (
                  <li key={i} className="resale-item">
                    <p>🎟️ Ticket #{l.tokenId.toString()}</p>
                    <p>💰 {formatEther(l.price)} DOT</p>
                    <button
                      className="buy-button"
                      onClick={() => buyTicket(l.tokenId, l.price)}
                    >
                      Buy
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