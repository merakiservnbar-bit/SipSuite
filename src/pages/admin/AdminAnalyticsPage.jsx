import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminAnalyticsPage() {
    const [orders, setOrders] = useState([]);
    const [staffMap, setStaffMap] = useState({});

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "orders"), (snap) => {
            const data = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(data);
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "staff"), (snap) => {
            const map = {};
            snap.docs.forEach(doc => {
                map[doc.id] = doc.data();
            });
            setStaffMap(map);
        });

        return () => unsub();
    }, []);

    const completed = orders.filter(o => o.completed_at);

    const avgWait =
        completed.reduce((sum, o) => sum + (o.completed_at - o.created_at), 0) /
    (completed.length || 1);

    const avgPrep =
        completed.reduce((sum, o) => sum + (o.completed_at - o.started_at), 0) /
    (completed.length || 1);

    const drinkStats = {};

    orders.forEach(order => {
    order.items?.forEach(item => {
        if (!drinkStats[item.name]) {
        drinkStats[item.name] = 0;
        }
        drinkStats[item.name] += item.qty;
    });
    });

    const topDrinks = Object.entries(drinkStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

    const staffStats = {};

    completed.forEach(order => {
        if (!order.staff_id || !order.started_at) return;

        if (!staffStats[order.staff_id]) {
            staffStats[order.staff_id] = {
            count: 0,
            totalPrep: 0
            };
        }

        staffStats[order.staff_id].count++;
        staffStats[order.staff_id].totalPrep +=
            order.completed_at - order.started_at;
    });

    const staffLeaderboard = Object.entries(staffStats)
        .map(([id, data]) => ({
            name:
            staffMap[id]?.name ||
            staffMap[id]?.email ||
            "Unknown",
            count: data.count,
            avgPrep: Math.floor(data.totalPrep / data.count)
        }))
        .sort((a, b) => a.avgPrep - b.avgPrep);

    return (
        <div>
            <h1 className="page-title">Admin Analytics</h1>

            <div className="analytics-grid">

                <div className="stat-card">
                    <p className="text-secondary">Total Orders</p>
                    <h2>{orders.length}</h2>
                </div>

                <div className="stat-card">
                    <p className="text-secondary">Avg Wait</p>
                    <h2>{Math.floor(avgWait / 1000)}s</h2>
                </div>

                <div className="stat-card">
                    <p className="text-secondary">Avg Prep</p>
                    <h2>{Math.floor(avgPrep / 1000)}s</h2>
                </div>

            </div>

            <h2>Top Drinks</h2>

            <div className="analytics-grid">
                {topDrinks.map(d => (
                    <div key={d.name} className="stat-card">
                    <h3>{d.name}</h3>
                    <p>{d.count} orders</p>
                    </div>
                ))}
            </div>

            <h2>Top Staff</h2>

            <div className="analytics-grid">
                {staffLeaderboard.map((s, i) => (
                    <div key={i} className="stat-card">
                    <h3>#{i + 1} {s.name}</h3>
                    <p>{s.count} orders</p>
                    <p>⏱ {Math.floor(s.avgPrep / 1000)}s</p>
                    </div>
                ))}
            </div>
        </div>
    );
}