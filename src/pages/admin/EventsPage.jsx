import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import EventCard from "../../components/EventCard";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    date: ""
  });

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

      <button className="btn-primary" onClick={() => setShowModal(true)}>
        + New Event
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Event</h2>

            <input
              placeholder="Event Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />

            <input
              type="datetime-local"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />

            <button
              className="btn-primary"
              onClick={async () => {
                const docRef = await addDoc(collection(db, "events"), {
                  ...form,
                  created_at: Date.now()
                });

                setEvents(prev => [
                  { id: docRef.id, ...form },
                  ...prev
                ]);

                setForm({ name: "", location: "", date: "" }); // ✅ ADD THIS
                setShowModal(false);
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}

      <input placeholder="Search events..." />

      <div className="event-grid">
        {events.map(event => (
          <div className="event-card">

            <div onClick={() => navigate(`/admin/events/${event.id}`)}>
              <h3>{event.name}</h3>
              <p>{event.location}</p>
            </div>

            <button
              className="btn-danger"
              onClick={(e) => {
                e.stopPropagation();

                if (!confirm("Delete event?")) return;

                deleteDoc(doc(db, "events", event.id));

                setEvents(prev => prev.filter(e => e.id !== event.id));
              }}
            >
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}