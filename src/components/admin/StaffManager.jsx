import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function StaffManager({ eventId }) {
  const [staff, setStaff] = useState([]);
  const [bars, setBars] = useState([]);

  // 🔥 GET STAFF
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "staff"),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStaff(data);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔥 GET BARS
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bars"),
      (snapshot) => {
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(bar => bar.event_id === eventId);

        setBars(data);
      }
    );

    return () => unsubscribe();
  }, [eventId]);

  // 🔥 ASSIGN STAFF TO BAR
  const toggleAssign = async (bar, staffId) => {
    const current = bar.staff_ids || [];

    const updated = current.includes(staffId)
      ? current.filter(id => id !== staffId)
      : [...current, staffId];

    await updateDoc(doc(db, "bars", bar.id), {
      staff_ids: updated
    });
  };

  return (
    <div>
      <h2>Staff Assignment</h2>

      {bars.map(bar => (
        <div key={bar.id} className="card">
          <h3>{bar.name}</h3>

          {staff.map(s => (
            <div key={s.id}>
              <label>
                <input
                  type="checkbox"
                  checked={(bar.staff_ids || []).includes(s.id)}
                  onChange={() => toggleAssign(bar, s.id)}
                />
                {s.name || s.email}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}