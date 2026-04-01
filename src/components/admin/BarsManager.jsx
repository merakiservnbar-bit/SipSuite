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

export default function BarsManager({ eventId }) {
  const [bars, setBars] = useState([]);
  const [barName, setBarName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!eventId) return;

    const fetchBars = async () => {
      const snapshot = await getDocs(collection(db, "bars"));

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(bar => bar.event_id === eventId);

      setBars(data);
    };

    fetchBars();
  }, [eventId]);

  const createBar = async () => {
    await addDoc(collection(db, "bars"), {
      name: barName,
      event_id: eventId
    });

    setBarName("");
  };

  const deleteBar = async (id) => {
    if (!window.confirm("Delete this bar?")) return;

    await deleteDoc(doc(db, "bars", id));
    setBars(prev => prev.filter(bar => bar.id !== id));
  };

  const updateBar = async (id) => {
    await updateDoc(doc(db, "bars", id), {
      name: editValue
    });

    setBars(prev =>
      prev.map(bar =>
        bar.id === id ? { ...bar, name: editValue } : bar
      )
    );

    setEditingId(null);
  };

  return (
    <div>
      <h2>Bars</h2>

      <input
        placeholder="Bar name"
        value={barName}
        onChange={(e) => setBarName(e.target.value)}
      />
      <button onClick={createBar}>Add Bar</button>

      <div style={{ marginTop: 20 }}>
        {bars.map(bar => (
          <div key={bar.id} style={{ marginBottom: 10 }}>
            {editingId === bar.id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button onClick={() => updateBar(bar.id)}>Save</button>
              </>
            ) : (
              <>
                <span>{bar.name}</span>

                <button onClick={() => {
                  setEditingId(bar.id);
                  setEditValue(bar.name);
                }}>
                  Edit
                </button>

                <button onClick={() => deleteBar(bar.id)} style={{ marginLeft: 10}}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}