import { useEffect, useState, useRef } from "react";
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
    const [event, setEvent] = useState(null);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const getWaitTime = (order) => {
        const end =
            order.status === "ready"
            ? order.completed_at
            : Date.now();

        return formatTime(end - order.created_at);
    };

    const getPrepTime = (order) => {
        if (!order.started_at) return "0:00";

        const end =
            order.status === "ready"
            ? order.completed_at
            : Date.now();

        return formatTime(end - order.started_at);
    };

    const prevOrderCount = useRef(0);
    const audio = new Audio("/notification.mp3");

    const [, setTick] = useState(0);

    const getWaitBackground = (order) => {
        if (!event) return "#111827";
        if (order.status === "ready") return "#111827";

        const wait = Date.now() - order.created_at;

        const target = event.target_wait_time || 120000;

        if (wait > target * 1.5) return "#3b0000";
        if (wait > target) return "#3a2a00";

        return "#111827";
    };

    const getPrepBorder = (order) => {
        if (!event) return "1px solid #1F2937";
        if (order.status === "ready") return "1px solid #1F2937";
        if (!order.started_at) return "1px solid #1F2937";

        const prep = Date.now() - order.started_at;

        const target = event.target_prep_time || 60000;

        if (prep > target * 1.5) return "2px solid red";
        if (prep > target) return "2px solid orange";

        return "1px solid #1F2937";
    };

    useEffect(() => {
        if (!eventId) return;

        const unsubscribe = onSnapshot(
            doc(db, "events", eventId),
            (docSnap) => {
            setEvent(docSnap.data());
            }
        );

        return () => unsubscribe();
    }, [eventId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

                const activeOrders = data.filter(
                    o => o.status === "pending" || o.status === "in_progress"
                );

                const wasEmpty = prevOrderCount.current === 0;
                const isNowNotEmpty = activeOrders.length > 0;

                if (wasEmpty && isNowNotEmpty) {
                    audio.play().catch(() => {});
                }

                prevOrderCount.current = activeOrders.length;

                setOrders(data);
            }
        );

        return () => unsubscribe();
    }, [assignedBars, eventId]);

    const updateStatus = async (order, newStatus) => {
        const updateData = {
            status: newStatus
        };

        if (newStatus === "in_progress") {
            updateData.started_at = Date.now();
        }

        if (newStatus === "ready") {
            updateData.completed_at = Date.now();
        }

        await updateDoc(doc(db, "orders", order.id), {
            ...updateData,
            staff_id: bartenderId   // 🔥 ADD THIS
        });
    };

     const isRecentReady = (order) => {
        if (order.status !== "ready") return true;

        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        return now - order.completed_at < fiveMinutes;
    };

    const pending = orders.filter(o => o.status === "pending");
    const inProgress = orders.filter(o => o.status === "in_progress");
    const ready = orders.filter(
        o => o.status === "ready" && isRecentReady(o)
    );

    const renderOrder = (order, type) => {
        return (
            <div
                key={order.id}
                className="order-card"
                style={{
                    background: getWaitBackground(order),
                    border: getPrepBorder(order)
                }}
            >
                <div className="order-header">
                    <span className="order-number">
                    #{order.order_number}
                    </span>
                </div>

                <div className="order-items">
                    {order.items.map((i, idx) => (
                    <div key={idx}>{i.name}</div>
                    ))}
                </div>

                <div className="order-timer">
                    ⏱ {getWaitTime(order)} / {getPrepTime(order)}
                </div>

                {type === "pending" && (
                    <button
                    className="btn-primary"
                    onClick={() => updateStatus(order, "in_progress")}
                    >
                    Start
                    </button>
                )}

                {type === "in_progress" && (
                    <button
                    className="btn-primary"
                    onClick={() => updateStatus(order, "ready")}
                    >
                    Ready
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="live-orders-container">
            <div className="live-orders-header">
            <h1>Live Orders</h1>
            </div>

            <div className="columns">

                {/* PENDING */}
                <div className="column">
                    <h2 className="column-title">Pending</h2>
                    {pending.map(order => renderOrder(order, "pending"))}
                </div>

                {/* IN PROGRESS */}
                <div className="column">
                    <h2 className="column-title">In Progress</h2>
                    {inProgress.map(order => renderOrder(order, "in_progress"))}
                </div>

                {/* READY */}
                <div className="column">
                    <h2 className="column-title">Ready</h2>
                    {ready.map(order => renderOrder(order, "ready"))}
                </div>

            </div>
        </div>
    );
}