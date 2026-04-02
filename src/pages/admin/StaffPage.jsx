import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [name, setName] = useState("");

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

  const addStaff = async () => {
    await addDoc(collection(db, "staff"), {
      name
    });

    setName("");
  };

  return (
    <div>
      <h1>Staff</h1>

      <input
        placeholder="Staff name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addStaff} className="btn-primary">Add</button>

      {staff.map(person => (
        <div key={person.id}>
          {person.name}
        </div>
      ))}
    </div>
  );
}