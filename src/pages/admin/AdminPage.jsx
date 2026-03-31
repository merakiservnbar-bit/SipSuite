import { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function AdminPage() {
  const [eventName, setEventName] = useState("");
  const [createdEventId, setCreatedEventId] = useState(null);
  const [barName, setBarName] = useState("");
  const [drinkName, setDrinkName] = useState("");

  const createEvent = async () => {
    const docRef = await addDoc(collection(db, "events"), {
      name: eventName,
      status: "active"
    });

    setCreatedEventId(docRef.id);
  };

  const createBar = async () => {
    await addDoc(collection(db, "bars"), {
        name: barName,
        event_id: createdEventId
    });
  };

  const createMenuItem = async () => {
    await addDoc(collection(db, "menu_items"), {
        name: drinkName,
        event_id: createdEventId,
        category: "cocktails",
        price: 0
    });
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

      <h2>Add Bar</h2>
      <input
        placeholder="Bar Name"
        value={barName}
        onChange={(e) => setBarName(e.target.value)}
      />

      <button onClick={createBar}>Add Bar</button>

      <h2>Add Drink</h2>
      <input
        placeholder="Drink Name"
        value={drinkName}
        onChange={(e) => setDrinkName(e.target.value)}
      />

      <button onClick={createMenuItem}>Add Drink</button>

      <button onClick={createEvent}>Create Event</button>

      {createdEventId && (
        <p>Event Created: {createdEventId}</p>
      )}
    </div>
  );
}