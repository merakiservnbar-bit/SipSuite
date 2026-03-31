import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import EventCard from "../../components/EventCard";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Events</h1>

      <button>+ New Event</button>

      <input placeholder="Search events..." />

      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onClick={() => navigate(`/admin/events/${event.id}`)}
        />
      ))}
    </div>
  );
}