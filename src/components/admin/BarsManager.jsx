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
  const [staff, setStaff] = useState([]);

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

  const toggleStaffAssignment = async (barId, staffId, currentStaff = []) => {
    let updated;

    if (currentStaff.includes(staffId)) {
      updated = currentStaff.filter(id => id !== staffId);
    } else {
      updated = [...currentStaff, staffId];
    }

    await updateDoc(doc(db, "bars", barId), {
      staff_ids: updated
    });

    setBars(prev =>
      prev.map(bar =>
        bar.id === barId ? { ...bar, staff_ids: updated } : bar
      )
    );
  };

  useEffect(() => {
    const fetchStaff = async () => {
      const snapshot = await getDocs(collection(db, "staff"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStaff(data);
    };

    fetchStaff();
  }, []);

  return (
    <div>
      <h2>Bars</h2>

      <input
        placeholder="Bar name"
        value={barName}
        onChange={(e) => setBarName(e.target.value)}
      />
      <button onClick={createBar} className="btn-primary">Add Bar</button>

      <div style={{ marginTop: 20 }}>
        {bars.map(bar => (
          <div key={bar.id} style={{ marginBottom: 20 }}>

            <strong>{bar.name}</strong>

            <div style={{ marginTop: 10 }}>
              {staff.map(person => (
                <label key={person.id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={(bar.staff_ids || []).includes(person.id)}
                    onChange={() =>
                      toggleStaffAssignment(
                        bar.id,
                        person.id,
                        bar.staff_ids || []
                      )
                    }
                  />
                  {person.name}
                </label>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}