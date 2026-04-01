import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

export default function LiveMenu({ eventId }) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (!eventId) return;

    const fetchMenu = async () => {
      const snapshot = await getDocs(collection(db, "menu_items"));

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => item.event_id === eventId);

      setMenu(data);
    };

    fetchMenu();
  }, [eventId]);

  const toggleAvailability = async (item) => {
    const newStatus = !item.is_available;

    await updateDoc(doc(db, "menu_items", item.id), {
      is_available: newStatus
    });

    setMenu(prev =>
      prev.map(m =>
        m.id === item.id ? { ...m, is_available: newStatus } : m
      )
    );
  };

  return (
    <div>
      <h2>Menu Control</h2>

      {menu.map(item => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            padding: 10,
            background: "#1A1A1D",
            borderRadius: 8
          }}
        >
          <span>{item.name}</span>

          <button
            onClick={() => toggleAvailability(item)}
            style={{
              background: item.is_available === false ? "red" : "green",
              color: "white",
              padding: "5px 10px",
              borderRadius: 5
            }}
          >
            {item.is_available === false ? "86'd" : "Available"}
          </button>
        </div>
      ))}
    </div>
  );
}