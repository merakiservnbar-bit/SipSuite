import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
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

  const handleCreateEvent = async () => {
    await addDoc(collection(db, "events"), {
      name: "New Event",
      location: "",
      date: "",
      created_at: Date.now()
    });
  };

  return (
    <div>
      <h1 className="page-title">Events</h1>

      <button className="btn-primary" onClick={handleCreateEvent}>+ New Event</button>

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