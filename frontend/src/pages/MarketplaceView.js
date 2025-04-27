import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import "./MarketplaceView.css";

const MarketplacePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { marketplaceContract, eventContract } = useWeb3();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [currentTokenId, setCurrentTokenId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventContract) return;
      
      try {
        const event = await eventContract.events(eventId);
        const metadataUri = event.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        
        const response = await fetch(metadataUri);
        const metadata = await response.json();
        
        setEventDetails({
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
          location: metadata.attributes?.find(attr => attr.trait_type === "Location")?.value || "Unknown Location",
          artist: metadata.attributes?.find(attr => attr.trait_type === "Artist Name")?.value || 
                 metadata.attributes?.find(attr => attr.trait_type === "Artist")?.value || "Unknown Artist",
          date: new Date(event.eventDate.toNumber() * 1000).toLocaleString(),
          price: event.ticketPrice,
          ticketsSold: event.ticketsSold.toString(),
          maxTickets: event.maxTickets.toString()
        });
      } catch (err) {
        console.error("Failed to fetch event details:", err);
      }
    };
    
    fetchEventDetails();
  }, [eventContract, eventId]);

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
      setCurrentTokenId(tokenId);
      
      toast.loading("Processing your purchase...");
      const tx = await marketplaceContract.buyTicket(tokenId, { value: price });
      await tx.wait();
      
      toast.dismiss();
      toast.success("🎟️ Ticket purchased!");
      fetchMarketplace();
    } catch (err) {
      console.error("Buy failed:", err);
      toast.error("❌ Failed to buy ticket.");
    } finally {
      setBuying(false);
      setCurrentTokenId(null);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="marketplace-container">
      <button onClick={goBack} className="back-button">
        ← Back to Events
      </button>
      
      <h1 className="page-title">🎟 Secondary Marketplace</h1>
      
      {eventDetails && (
        <div className="event-details-section">
          <div className="event-image-wrapper">
            <img src={eventDetails.image} alt={eventDetails.name} className="event-image" />
          </div>
          <div className="event-info">
            <h2>{eventDetails.name}</h2>
            <p className="artist-detail">🎤 {eventDetails.artist}</p>
            <p className="location-detail">📍 {eventDetails.location}</p>
            <p className="date-detail">🗓 {eventDetails.date}</p>
            <p className="ticket-detail">🎫 {eventDetails.ticketsSold} / {eventDetails.maxTickets} tickets sold</p>
            <p className="price-detail">💰 {formatEther(eventDetails.price)} DOT (original price)</p>
          </div>
        </div>
      )}

      <div className="marketplace-section">
        <h2 className="section-title">Available Resale Tickets</h2>
        
        {loading ? (
          <div className="loading-marketplace">
            <LoadingSpinner size="large" text="Loading marketplace listings..." />
          </div>
        ) : listings.length === 0 ? (
          <div className="no-listings">
            <p className="glow-text">No resale tickets available.</p>
            <p className="marketplace-help-text">Check back later or browse other events to find tickets.</p>
          </div>
        ) : (
          <div className="resale-listings">
            {listings.map((l, i) => (
              <div key={i} className="resale-card">
                {buying && currentTokenId === l.tokenId && (
                  <div className="buying-overlay">
                    <LoadingSpinner size="medium" />
                    <p>Processing Purchase...</p>
                  </div>
                )}
                <div className="ticket-info">
                  <h3 className="ticket-title">Ticket #{l.tokenId.toString()}</h3>
                  <div className="price-section marketplace-price">
                    💰 <span className="price-text">{formatEther(l.price)} DOT</span>
                  </div>
                  <div className="seller-info">
                    👤 Seller: {shortenAddress(l.seller)}
                  </div>
                </div>
                <button
                  className="buy-button marketplace-buy"
                  onClick={() => buyTicket(l.tokenId, l.price)}
                  disabled={buying}
                >
                  {buying && currentTokenId === l.tokenId ? (
                    <span className="button-loading">
                      <LoadingSpinner size="small" />
                      <span>Buying...</span>
                    </span>
                  ) : (
                    "🌀 Buy Ticket"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
