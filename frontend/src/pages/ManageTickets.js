import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import "./ManageTickets.css";

const ManageTickets = () => {
  const { ticketContract, marketplaceContract, address } = useWeb3();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});

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
              owned.push({ tokenId: i, uri });
            }
          } catch {}
        }
        setTickets(owned);
      } catch (err) {
        console.error("Ticket load failed:", err);
      }
      setLoading(false);
    };

    load();
  }, [ticketContract, address]);

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

  return (
    <div className="manage-tickets-container">
      <h1 className="page-title">🎟 Your Tickets</h1>

      {loading ? (
        <p className="glow-text">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="glow-text">No tickets owned yet.</p>
      ) : (
        <div className="ticket-grid">
          {tickets.map((t) => (
            <div key={t.tokenId} className="ticket-card">
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
                />
                <button
                  className="list-button"
                  onClick={() => listTicket(t.tokenId)}
                >
                  List Ticket
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
