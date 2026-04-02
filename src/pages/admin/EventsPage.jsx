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
      <h1 className="page-title">Events</h1>

      <button className="btn-primary">+ New Event</button>

      <input placeholder="Search events..." />

      <div className="event-grid">
        {events.map(event => (
          <div
            key={event.id}
            className="event-card"
            onClick={() => navigate(`/admin/events/${event.id}`)}
          >
            <h3>{event.name}</h3>
            <p className="text-secondary">{event.location}</p>
            <p className="text-muted">{event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}