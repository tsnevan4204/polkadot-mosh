import React, { useState, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-hot-toast";
import EventCard from "../components/EventCard"; // Placeholder for the EventCard component
import "./BrowseEvents.css"; // 👈 you'll create this file

const BrowseEvents = () => {
  const { events, loading, refetch } = useEvents();
  const { eventContract, address } = useWeb3();
  const [txPending, setTxPending] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(true);

  // Check if the user has a wallet connected
  useEffect(() => {
    setIsGuestUser(!address);
  }, [address]);

  const buyTicket = async (eventId, price) => {
    if (!eventContract || !address) return alert("Connect wallet first!");

    try {
      setTxPending(true);
      const tx = await eventContract.buyTicket(eventId, { value: price });
      await tx.wait();
      toast.success("Ticket purchased!");
      refetch();
    } catch (err) {
      console.error("Ticket purchase failed:", err);
      toast.error("Purchase failed!");
    } finally {
      setTxPending(false);
    }
  };

  return (
    <div className="browse-events-container">
      <h1 className="neon-title">🎸 Upcoming Concerts</h1>
      
      {isGuestUser ? (
        <div className="guest-banner">
          <p>Connect your wallet to buy tickets and access exclusive features! 🎟️</p>
        </div>
      ) : loading ? (
        <p className="glow-text">⚡ Loading events...</p>
      ) : events.length === 0 ? (
        <p className="glow-text">🚫 No events yet. You rebel, make one!</p>
      ) : (
        <div className="event-grid">
          {events.map((e, i) => (
            <EventCard
              key={i}
              event={e}
              onBuy={buyTicket}
              showBuyButton={!txPending && e.ticketsSold < e.maxTickets}
              isGuestUser={false}
            />
          ))}
        </div>
      )}
      
      {isGuestUser && events.length > 0 && (
        <div className="event-grid">
          {events.map((e, i) => (
            <EventCard
              key={i}
              event={e}
              onBuy={buyTicket}
              showBuyButton={false}
              isGuestUser={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
