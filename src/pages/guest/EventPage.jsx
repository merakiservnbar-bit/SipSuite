import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { APP_CONFIG } from "../../config/appConfig";
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
    const fetchMenu = async () => {
      const q = query(
        collection(db, "menu_items")
      );

      const snapshot = await getDocs(q);

      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMenu(items);
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchBars = async () => {
      const q = query(
        collection(db, "bars"),
        where("event_id", "==", eventId)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBars(data);
    };

    fetchBars();
  }, []);

  const placeOrder = async (item) => {
  if (!selectedBar) {
    alert("Please select a bar first");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "orders"), {
      event_id: APP_CONFIG.eventId,
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

      <h1 style={{ marginBottom: 20 }}>Menu</h1>

      {menu.map(item => (
        <Card key={item.id}>
          <p style={{ fontSize: 18 }}>{item.name}</p>

          <Button onClick={() => placeOrder(item)}>
            Add
          </Button>
        </Card>
      ))}

      <h2>Select Pickup Bar</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {bars.map(bar => (
          <Button
            key={bar.id}
            variant={selectedBar === bar.id ? "primary" : "secondary"}
            onClick={() => setSelectedBar(bar.id)}
          >
            {bar.name}
          </Button>
        ))}
      </div>
    </div>
  );
}