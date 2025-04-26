import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { useEvents } from "../hooks/useEvents";
import "./ManageConcerts.css";
import CreateConcertForm from "../components/CreateConcertForm"; // Placeholder for the form component
import ManageEventCard from "../components/ManageEventCard";

const ManageConcerts = () => {
  const { events, loading, refetch } = useEvents();
  const [myEvents, setMyEvents] = useState([]);
  const { address, eventContract } = useWeb3();

  useEffect(() => {
    if (events && address) {
      const filtered = events.filter(
        (e) => e.organizer.toLowerCase() === address.toLowerCase()
      );
      setMyEvents(filtered);
    }
  }, [events, address]);

  const handleCancelEvent = async (eventId) => {
    try {
        const confirm = window.confirm("Are you sure you want to cancel this event?");
        if (!confirm) return;

        const expectedRefund = await eventContract.totalReceived(eventId);
        const tx = await eventContract.cancelEvent(eventId, { value: expectedRefund });
        await tx.wait();

        alert("🚫 Event cancelled and buyers refunded.");
        refetch();
    } catch (err) {
        console.error("Cancel failed:", err);
        alert("❌ Failed to cancel event.");
    }
  };


  return (
    <div className="manage-concerts-container">
      <h1 className="page-title">🎛 Manage Your Concerts</h1>

      {/* 🎤 Form Placeholder (future component) */}
      <div className="form-section">
        <p className="glow-text">Create a new concert</p>
        <CreateConcertForm onCreated={refetch} />
      </div>

      <hr className="neon-divider" />

      <h2 className="glow-text">Your Events</h2>
      {loading ? (
        <p className="glow-text">⚡ Loading events...</p>
      ) : myEvents.length === 0 ? (
        <p className="glow-text">🫥 You haven't hosted any concerts yet.</p>
      ) : (
        <div className="event-card-grid">
          {events.map((e, i) => (
            <ManageEventCard
            key={i}
            event={e}
            onCancel={handleCancelEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageConcerts;
