import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import OrderStatus from "./OrderStatus";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useParams } from "react-router-dom";


export default function EventPage() {

  const [bars, setBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [menu, setMenu] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const { eventId } = useParams();

  useEffect(() => {
    if (!eventId) return;

    const q = query(
      collection(db, "menu_items"),
      where("event_id", "==", eventId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMenu(items);
    });

    return () => unsubscribe();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    const fetchBars = async () => {
      console.log("EVENT ID:", eventId);

      const q = query(
        collection(db, "bars"),
        where("event_id", "==", eventId)
      );

      const snapshot = await getDocs(q);

      console.log("BARS SNAPSHOT:", snapshot.docs);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("BARS DATA:", data);

      setBars(data);
    };

    fetchBars();
  }, [eventId]);

  const placeOrder = async (item) => {
    if (!selectedBar) {
      alert("Please select a bar first");
      return;
    }

    if (item.is_available === false) {
      alert("This item is currently unavailable");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        event_id: eventId,
        bar_id: selectedBar,
        items: [{ name: item.name, qty: 1 }],
        status: "pending",
        guest_name: "Guest",
        order_number: Date.now().toString().slice(-4),
        created_at: Date.now()
      });

      // ✅ SAVE ORDER ID HERE (inside function)
      setCurrentOrderId(docRef.id);
      localStorage.setItem("orderId", docRef.id);

    } catch (error) {
      console.error("ORDER ERROR:", error);
    }
  };

  useEffect(() => {
    const savedOrder = localStorage.getItem("orderId");
    if (savedOrder) {
      setCurrentOrderId(savedOrder);
    }
  }, []);

  if (currentOrderId) {
    return <OrderStatus orderId={currentOrderId} />;
  }

  return (

    <div style={{ padding: 20 }}>

      <h1 className="page-title">Menu</h1>

      <div className="menu-grid">
        {menu.map(item => (
          <div
            key={item.id}
            className={`menu-card ${
              item.is_available === false ? "unavailable" : ""
            }`}
          >
            <div className="menu-name">{item.name}</div>

            {item.is_available === false ? (
              <span className="badge">Unavailable</span>
            ) : (
              <button
                className="btn-primary"
                onClick={() => placeOrder(item)}
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}