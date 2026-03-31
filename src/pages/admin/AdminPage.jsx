import { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function AdminPage() {
  const [eventName, setEventName] = useState("");
  const [createdEventId, setCreatedEventId] = useState(null);

  const createEvent = async () => {
    const docRef = await addDoc(collection(db, "events"), {
      name: eventName,
      status: "active"
    });

    setCreatedEventId(docRef.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h2>Create Event</h2>
      <input
        placeholder="Event name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      <button onClick={createEvent}>Create Event</button>

      {createdEventId && (
        <p>Event Created: {createdEventId}</p>
      )}
    </div>
  );
}