import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";

export default function MenuEditor({ eventId }) {
  const [bars, setBars] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [barName, setBarName] = useState("");
  const [drinkName, setDrinkName] = useState("");

  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [drinks, setDrinks] = useState([]);

  // 🔥 FETCH DATA
  useEffect(() => {
    if (!eventId) return;

    const barsQuery = query(
      collection(db, "bars"),
      where("event_id", "==", eventId)
    );

    const menuQuery = query(
      collection(db, "menu_items"),
      where("event_id", "==", eventId)
    );

    const unsubscribeBars = onSnapshot(barsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBars(data);
    });

    const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(data);
    });

    return () => {
      unsubscribeBars();
      unsubscribeMenu();
    };
  }, [eventId]);

  // 🔥 CREATE
  const createBar = async () => {
    await addDoc(collection(db, "bars"), {
      name: barName,
      event_id: eventId
    });
  };

  const createMenuItem = async () => {
    const selected = drinks.find(d => d.id === drinkName);

    if (!selected) return;

    await addDoc(collection(db, "menu_items"), {
      drink_id: selected.id,
      name: selected.name,
      category: selected.category,
      event_id: eventId,
      price: 0,
      is_available: true
    });

    setDrinkName(""); // 🔥 reset dropdown
  };

  // 🔥 DELETE
  const deleteMenuItem = async (id) => {
    if (!window.confirm("Delete this drink?")) return;

    await deleteDoc(doc(db, "menu_items", id));
  };

  // 🔥 UPDATE
  const updateMenuItem = async (id) => {
    await updateDoc(doc(db, "menu_items", id), {
      name: editValue
    });

    setEditingItemId(null);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "drinks"),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDrinks(data);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Menu</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select
          value={drinkName}
          onChange={(e) => setDrinkName(e.target.value)}
        >
          <option value="">Select Drink</option>

          {drinks.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button
          className="btn-primary"
          onClick={createMenuItem}
          disabled={!drinkName}
          style={{
            opacity: !drinkName ? 0.5 : 1,
            cursor: !drinkName ? "not-allowed" : "pointer",
            width: "auto",
            padding: "8px 16px"
          }}
        >
          Add
        </button>
      </div>
      

      {menuItems.map(item => (
        <div key={item.id}>
          {editingItemId === item.id ? (
            <>
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <button onClick={() => updateMenuItem(item.id)} className="btn-primary">Save</button>
            </>
          ) : (
            <>
              <span>{item.name}</span>
              <button 
                onClick={() => {
                  setEditingItemId(item.id);
                  setEditValue(item.name);
                }}
                className="btn-primary"
              >Edit</button>
              <button onClick={() => deleteMenuItem(item.id)} style={{backgroundColor:"red", color:"white"}}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}