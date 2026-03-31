import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { APP_CONFIG } from "../../config/appConfig";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function BartenderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("event_id", "==", APP_CONFIG.eventId),
      where("bar_id", "==", APP_CONFIG.barId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "orders", id), {
      status: newStatus
    });
  };

  const pending = orders.filter(o => o.status === "pending");
  const inProgress = orders.filter(o => o.status === "in_progress");
  const ready = orders.filter(o => o.status === "ready");

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Bartender Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start"
        }}
      >
        {/* PENDING */}
        <div style={{ flex: 1 }}>
          <h2>Pending</h2>
          {pending.map(order => (
            <Card key={order.id}>
              <p>#{order.order_number}</p>
              <p>{order.items[0].name}</p>
              <Button onClick={() => updateStatus(order.id, "in_progress")}>
                Start
              </Button>
            </Card>
          ))}
        </div>

        {/* IN PROGRESS */}
        <div style={{ flex: 1 }}>
          <h2>In Progress</h2>
          {inProgress.map(order => (
            <Card key={order.id}>
              <p>#{order.order_number}</p>
              <p>{order.items[0].name}</p>
              <Button onClick={() => updateStatus(order.id, "ready")}>
                Ready
              </Button>
            </Card>
          ))}
        </div>

        {/* READY */}
        <div style={{ flex: 1 }}>
          <h2>Ready</h2>
          {ready.map(order => (
            <Card key={order.id}>
              <p>#{order.order_number}</p>
              <p>{order.items[0].name}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}