import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

export default function MenuEditor({ eventId }) {
  const [bars, setBars] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [barName, setBarName] = useState("");
  const [drinkName, setDrinkName] = useState("");

  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // 🔥 FETCH DATA
  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      const barsSnap = await getDocs(collection(db, "bars"));
      const menuSnap = await getDocs(collection(db, "menu_items"));

      setBars(
        barsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(b => b.event_id === eventId)
      );

      setMenuItems(
        menuSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(m => m.event_id === eventId)
      );
    };

    fetchData();
  }, [eventId]);

  // 🔥 CREATE
  const createBar = async () => {
    await addDoc(collection(db, "bars"), {
      name: barName,
      event_id: eventId
    });
  };

  const createMenuItem = async () => {
    await addDoc(collection(db, "menu_items"), {
      name: drinkName,
      event_id: eventId,
      price: 0,
      is_available: true
    });
  };

  // 🔥 DELETE
  const deleteMenuItem = async (id) => {
    if (!window.confirm("Delete this drink?")) return;

    await deleteDoc(doc(db, "menu_items", id));
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  // 🔥 UPDATE
  const updateMenuItem = async (id) => {
    await updateDoc(doc(db, "menu_items", id), {
      name: editValue
    });

    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, name: editValue } : item
      )
    );

    setEditingItemId(null);
  };

  return (
    <div>
      <h2>Menu</h2>

      <input
        placeholder="New drink"
        onChange={(e) => setDrinkName(e.target.value)}
      />
      <button onClick={createMenuItem} className="btn-primary">Add</button>

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