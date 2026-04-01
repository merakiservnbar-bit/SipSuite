import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDocs
} from "firebase/firestore";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { useAuth } from "../../context/AuthContext";

export default function LiveOrders({ eventId }) {
  const { staff } = useAuth();
  const bartenderId = staff?.id;

  const [orders, setOrders] = useState([]);
  const [assignedBars, setAssignedBars] = useState([]);

  // 🔥 FETCH BARS
  useEffect(() => {
    if (!bartenderId || !eventId) return;

    const fetchBars = async () => {
      const snapshot = await getDocs(collection(db, "bars"));

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(bar =>
          (bar.staff_ids || []).includes(bartenderId) &&
          bar.event_id === eventId
        );

      setAssignedBars(data);
    };

    fetchBars();
  }, [bartenderId, eventId]);

  // 🔥 LIVE ORDERS
  useEffect(() => {
    if (assignedBars.length === 0) return;

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order =>
            order.event_id === eventId &&
            assignedBars.some(bar => bar.id === order.bar_id)
          );

        setOrders(data);
      }
    );

    return () => unsubscribe();
  }, [assignedBars, eventId]);

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "orders", id), {
      status: newStatus
    });
  };

  const pending = orders.filter(o => o.status === "pending");
  const inProgress = orders.filter(o => o.status === "in_progress");
  const ready = orders.filter(o => o.status === "ready");

  return (
    <div style={{ display: "flex", gap: 20 }}>
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
  );
}