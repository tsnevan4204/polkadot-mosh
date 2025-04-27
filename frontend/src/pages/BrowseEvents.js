import React, { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-hot-toast";
import EventCard from "../components/EventCard"; // Placeholder for the EventCard component
import "./BrowseEvents.css"; // 👈 you'll create this file

const BrowseEvents = () => {
  const { events, loading, refetch } = useEvents();
  const { eventContract, address } = useWeb3();
  const [txPending, setTxPending] = useState(false);

  const buyTicket = async (eventId, price) => {
    console.log(eventContract);
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
      {loading ? (
        <p className="glow-text">⚡ Syncing events...</p>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
