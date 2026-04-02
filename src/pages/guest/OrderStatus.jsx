import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function OrderStatus({ orderId }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "orders", orderId),
      (docSnap) => {
        if (docSnap.exists()) {
          setOrder(docSnap.data());
        }
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Order #{order.order_number}</h1>

      <p>Status: {order.status}</p>

      {order.status === "pending" && <p>Waiting to be made...</p>}
      {order.status === "in_progress" && <p>Being prepared 🍸</p>}
      {order.status === "ready" && <p>Ready for pickup ✅</p>}

      <button onClick={() => {
        localStorage.removeItem("orderId");
        window.location.reload();
        className="btn-secondary"
      }}>
        Back to Menu
      </button>
    </div>

    
  );
}