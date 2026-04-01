import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDocs
} from "firebase/firestore";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function BartenderPage() {
  const [orders, setOrders] = useState([]);
  const bartenderId = "LPJVIBcUedbgr3zUJ4PH";
  const [assignedBars, setAssignedBars] = useState([]);

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "orders", id), {
      status: newStatus
    });
  };

  const pending = orders.filter(o => o.status === "pending");
  const inProgress = orders.filter(o => o.status === "in_progress");
  const ready = orders.filter(o => o.status === "ready");

  const getBarName = (barId) => {
    const bar = assignedBars.find(b => b.id === barId);
    return bar ? bar.name : "Unknown";
  };

  useEffect(() => {
    const fetchBars = async () => {
      const snapshot = await getDocs(collection(db, "bars"));

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(bar => (bar.staff_ids || []).includes(bartenderId));

      setAssignedBars(data);
    };

    fetchBars();
  }, []);

  useEffect(() => {
    if (assignedBars.length === 0) return;

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order =>
            assignedBars.some(bar => bar.id === order.bar_id)
          );

        setOrders(data);
      }
    );

    return () => unsubscribe();
  }, [assignedBars]);

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