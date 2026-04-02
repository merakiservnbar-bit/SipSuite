import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function AnalyticsPage() {
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
                o =>
                o.event_id === eventId &&
                o.status === "ready" &&
                o.completed_at
            );

            setOrders(data);
        }
        );

        return () => unsubscribe();
    }, [eventId]);

    // 🧠 HELPERS
    const avg = (arr) =>
        arr.length === 0
        ? 0
        : arr.reduce((a, b) => a + b, 0) / arr.length;

    const format = (ms) => {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    // 🎯 CALCULATIONS
    const waits = orders.map(o => o.completed_at - o.created_at);
    const preps = orders
        .filter(o => o.started_at)
        .map(o => o.completed_at - o.started_at);

    const avgWait = format(avg(waits));
    const avgPrep = format(avg(preps));

    const drinkCounts = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            drinkCounts[item.name] = (drinkCounts[item.name] || 0) + 1;
        });
    });

    const popularDrinks = Object.entries(drinkCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const slowestOrders = [...orders]
        .sort(
            (a, b) =>
            (b.completed_at - b.created_at) -
            (a.completed_at - a.created_at)
        )
        .slice(0, 5);

    const ordersByMinute = {};

    orders.forEach(o => {
    const date = new Date(o.created_at);

    const key = `${date.getHours()}:${date.getMinutes()
        .toString()
        .padStart(2, "0")}`;

    ordersByMinute[key] = (ordersByMinute[key] || 0) + 1;
    });

    const timeline = Object.entries(ordersByMinute).sort();

    const chartData = timeline.map(([time, count]) => ({
        time,
        orders: count
    }));

    const drinkStats = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            if (!drinkStats[item.name]) {
            drinkStats[item.name] = {
                count: 0,
                totalPrep: 0
            };
            }

            drinkStats[item.name].count += 1;

            if (order.started_at) {
            drinkStats[item.name].totalPrep +=
                order.completed_at - order.started_at;
            }
        });
    });

    const drinkPerformance = Object.entries(drinkStats).map(
        ([name, data]) => ({
            name,
            count: data.count,
            avgPrep:
            data.count > 0
                ? Math.floor(data.totalPrep / data.count)
                : 0
        })
    );

    return (
        <div style={{ padding: 20 }}>
            <h1>Analytics</h1>

            <div style={{ marginBottom: 20 }}>
                <h3>Total Orders: {orders.length}</h3>
                <h3>Avg Wait: {avgWait}</h3>
                <h3>Avg Prep: {avgPrep}</h3>
            </div>

            <div>
                <h2>Recent Orders</h2>

                {orders.slice(0, 10).map(o => (
                <div key={o.id}>
                    #{o.order_number} — {o.items.map(i => i.name).join(", ")}
                </div>
                ))}
            </div>

            <h2>Top Drinks</h2>
            {popularDrinks.map(([name, count]) => (
            <div key={name}>
                {name} — {count}
            </div>
            ))}

            <h2>Slowest Orders</h2>
            {slowestOrders.map(o => {
                const wait = o.completed_at - o.created_at;

                return (
                    <div key={o.id}>
                    #{o.order_number} — {Math.floor(wait / 1000)}s
                    </div>
                );
            })}

            <h2>Orders Over Time</h2>

            <div style={{ width: "100%", height: 300 }} className="card-elevated">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid stroke="#222" />

                        <XAxis
                        dataKey="time"
                        stroke="#888"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                        />

                        <YAxis
                        stroke="#888"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                        />

                        <Tooltip
                        contentStyle={{
                            backgroundColor: "#1A1A1D",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff"
                        }}
                        />

                        <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#C6A96B"
                        strokeWidth={3}
                        dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <h2>Drink Performance</h2>

            {drinkPerformance.map(d => (
                <div key={d.name} className="card">
                    {d.name} — {d.count} orders — Avg Prep: {Math.floor(d.avgPrep / 1000)}s
                </div>
            ))}

        </div>
    );
}