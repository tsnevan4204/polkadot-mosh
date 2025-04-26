import { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import axios from "axios";

export const useEvents = () => {
  const { eventContract } = useWeb3();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMetadata = async (ipfsURI) => {
    if (!ipfsURI) return {};
    const url = ipfsURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error("Metadata fetch failed for", ipfsURI, err);
      return {};
    }
  };

  const fetchEvents = async () => {
    if (!eventContract) return;

    setLoading(true);
    try {
      const total = await eventContract.nextEventId();
      const promises = [];

      for (let i = 0; i < total; i++) {
        promises.push(eventContract.events(i));
      }

      const rawEvents = await Promise.all(promises);

      const eventsWithMeta = await Promise.all(
        rawEvents.map(async (e) => {
          const meta = await fetchMetadata(e.metadataURI);
          return {
            id: e.id.toNumber(),
            metadata: meta,
            price: e.ticketPrice,
            maxTickets: e.maxTickets,
            ticketsSold: e.ticketsSold,
            eventDate: e.eventDate,
            organizer: e.organizer,
            cancelled: e.cancelled,
          };
        })
      );

      setEvents(eventsWithMeta);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [eventContract]);

  return { events, loading, refetch: fetchEvents };
};
