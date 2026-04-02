import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BartenderEventsPage() {
  const { staff } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!staff) return;

    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "bars"));

      const bars = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const assignedBars = bars.filter(bar =>
        (bar.staff_ids || []).includes(staff.id)
      );

      const eventIds = [...new Set(assignedBars.map(b => b.event_id))];

      // fetch event details
      const eventsSnap = await getDocs(collection(db, "events"));

      const eventData = eventsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(e => eventIds.includes(e.id));

      setEvents(eventData);
    };

    fetchEvents();
  }, [staff]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Events</h1>

      {events.map(event => (
        <div
          key={event.id}
          onClick={() => navigate(`/bartender/events/${event.id}`)}
          style={{
            padding: 20,
            marginBottom: 15,
            borderRadius: 10,
            cursor: "pointer"
          }}
          className="card"
        >
          <h3 className="text-secondary">{event.name}</h3>
          <p>{event.location}</p>
          <p>{event.date}</p>
        </div>
      ))}
    </div>
  );
}