import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { useTickets } from "../hooks/useTickets";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import "./ManageTickets.css";

const ManageTickets = () => {
  const { ticketContract, marketplaceContract, address } = useWeb3();
  const { tickets, loading, refetch } = useTickets();
  const [prices, setPrices] = useState({});
  const [txPending, setTxPending] = useState(false);
  const [currentTokenId, setCurrentTokenId] = useState(null);

  const listTicket = async (tokenId) => {
    const priceInput = prices[tokenId];
    if (!priceInput) return toast.error("Set a price first!");

    try {
      setTxPending(true);
      setCurrentTokenId(tokenId);
      
      const parsedPrice = ethers.utils.parseEther(priceInput.toString());

      toast.loading("Approving ticket transfer...");
      await ticketContract.approve(marketplaceContract.address, tokenId);
      
      toast.loading("Listing ticket on marketplace...");
      const tx = await marketplaceContract.listTicket(tokenId, parsedPrice);
      await tx.wait();

      toast.dismiss();
      toast.success("🎟️ Ticket listed!");
      await refetch();
    } catch (err) {
      console.error("List failed:", err);
      toast.error("❌ List failed.");
    } finally {
      setTxPending(false);
      setCurrentTokenId(null);
    }
  };

  return (
    <div className="manage-tickets-container">
      <h1 className="page-title">🎟 Your Tickets</h1>

      {loading ? (
        <div className="loading-tickets">
          <LoadingSpinner size="large" text="Loading your tickets..." />
        </div>
      ) : tickets.length === 0 ? (
        <div className="no-tickets">
          <p className="glow-text">No tickets owned yet.</p>
          <p className="ticket-help-text">Purchase tickets from the events page to see them here.</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((t) => (
            <div key={t.tokenId} className="ticket-card">
              {currentTokenId === t.tokenId && txPending && (
                <div className="ticket-listing-overlay">
                  <LoadingSpinner size="medium" />
                  <p>Processing...</p>
                </div>
              )}
              <img
                src={t.uri.replace("ipfs://", "https://ipfs.io/ipfs/")}
                alt={`Ticket ${t.tokenId}`}
                className="ticket-image"
              />
              <div className="ticket-info">
                <p>🎟 #{t.tokenId}</p>
                <input
                  type="number"
                  placeholder="Price (DOT)"
                  value={prices[t.tokenId] || ""}
                  onChange={(e) =>
                    setPrices({ ...prices, [t.tokenId]: e.target.value })
                  }
                  className="price-input"
                  disabled={txPending}
                />
                <button
                  className="list-button"
                  onClick={() => listTicket(t.tokenId)}
                  disabled={txPending}
                >
                  {txPending && currentTokenId === t.tokenId ? (
                    <span className="button-loading">
                      <LoadingSpinner size="small" />
                      <span>Listing...</span>
                    </span>
                  ) : (
                    "List Ticket"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
