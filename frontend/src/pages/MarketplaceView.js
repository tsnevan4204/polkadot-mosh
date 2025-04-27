import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-hot-toast";
import "./MarketplaceView.css";

const MarketplacePage = () => {
  const { eventId } = useParams();
  const { marketplaceContract } = useWeb3();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const fetchMarketplace = async () => {
    if (!marketplaceContract) return;
    setLoading(true);

    try {
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

  useEffect(() => {
    fetchMarketplace();
  }, [marketplaceContract, eventId]);

  const formatEther = (value) => ethers.utils.formatEther(value);

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const buyTicket = async (tokenId, price) => {
    try {
      setBuying(true);
      const tx = await marketplaceContract.buyTicket(tokenId, { value: price });
      await tx.wait();
      toast.success("🎟️ Ticket purchased!");
      fetchMarketplace();
    } catch (err) {
      console.error("Buy failed:", err);
      toast.error("❌ Failed to buy ticket.");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="marketplace-container">
      <h1 className="page-title">🎟 Secondary Marketplace</h1>

      {loading ? (
        <p className="glow-text">Loading tickets...</p>
      ) : listings.length === 0 ? (
        <p className="glow-text">No resale tickets available.</p>
      ) : (
        <ul className="resale-listings">
          {listings.map((l, i) => (
            <li key={i} className="resale-item">
              <div className="ticket-info">
                <p>🎟️ Ticket #{l.tokenId.toString()}</p>
                <p>💰 {formatEther(l.price)} DOT</p>
                <div className="seller-tag">👤 Seller: {shortenAddress(l.seller)}</div>
              </div>
              <button
                className="buy-button"
                onClick={() => buyTicket(l.tokenId, l.price)}
                disabled={buying}
              >
                {buying ? "Buying..." : "Buy"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MarketplacePage;
