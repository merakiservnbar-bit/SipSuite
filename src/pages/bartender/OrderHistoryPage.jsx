import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function OrderHistoryPage() {
  const { eventId } = useParams();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!eventId) return;

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(
            order =>
              order.event_id === eventId &&
              order.status === "ready"
          );

        // newest first
        data.sort((a, b) => b.completed_at - a.completed_at);

        setOrders(data);
      }
    );

    return () => unsubscribe();
  }, [eventId]);

  // 🧠 TIME HELPERS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getWait = (o) => formatTime(o.completed_at - o.created_at);
  const getPrep = (o) =>
    o.started_at
      ? formatTime(o.completed_at - o.started_at)
      : "0:00";

  return (
    <div style={{ padding: 20 }}>
      <h1>Order History</h1>

      {orders.map(order => (
        <div
          key={order.id}
          style={{
            padding: 15,
            marginBottom: 10,
            background: "#1A1A1D",
            borderRadius: 8
          }}
          className="card"
        >
          <p><strong>#{order.order_number}</strong></p>

          <p>{order.items.map(i => i.name).join(", ")}</p>

          <p style={{ fontSize: 12 }}>
            Wait: {getWait(order)} | Prep: {getPrep(order)}
          </p>

          <p style={{ fontSize: 12, color: "#aaa" }}>
            Completed:{" "}
            {new Date(order.completed_at).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}