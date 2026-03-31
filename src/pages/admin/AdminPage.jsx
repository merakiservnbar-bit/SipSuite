import { useState } from "react";
import { db, deleteDoc, doc } from "../../services/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import QRCodeDisplay from "../../components/QRCodeDisplay";

export default function AdminPage() {
    const [eventName, setEventName] = useState("");
    const [createdEventId, setCreatedEventId] = useState(null);
    const [barName, setBarName] = useState("");
    const [drinkName, setDrinkName] = useState("");
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    const createEvent = async () => {
        const docRef = await addDoc(collection(db, "events"), {
            name: eventName,
            status: "active"
        });

        setSelectedEventId(docRef.id);
    };

    const createBar = async () => {
        await addDoc(collection(db, "bars"), {
            name: barName,
            event_id: selectedEventId
        });
    };

    const createMenuItem = async () => {
        await addDoc(collection(db, "menu_items"), {
            name: drinkName,
            event_id: selectedEventId,
            category: "cocktails",
            price: 0
        });
    };

    const deleteMenuItem = async (id) => {
        await deleteDoc(doc(db, "menu_items", id));

        setMenuItems(prev => prev.filter(item => item.id !== id));
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const snapshot = await getDocs(collection(db, "events"));

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setEvents(data);
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        if (!selectedEventId) return;

        const fetchMenuItems = async () => {
            const snapshot = await getDocs(
                collection(db, "menu_items")
            );

            const data = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(item => item.event_id === selectedEventId);

            setMenuItems(data);
        };

        fetchMenuItems();
    }, [selectedEventId]);

    return (
        <div style={{ padding: 20 }}>
            <h1>Admin Dashboard</h1>

            {/* 🔽 STEP 2 — EVENT SELECTOR */}
            <h2>Select Event</h2>

            {events.map(event => (
                <div key={event.id} style={{ marginBottom: 10 }}>
                    <button onClick={() => setSelectedEventId(event.id)}>
                        {event.name}
                    </button>
                </div>
            ))}

            {/* ✅ STEP 5 GOES RIGHT HERE */}
            {selectedEventId && (
                <div style={{ marginTop: 20 }}>
                    <p>Managing Event: {selectedEventId}</p>

                    <QRCodeDisplay eventId={selectedEventId} />
                </div>
            )}

            {/* 🔽 CREATE EVENT */}
            <h2>Create Event</h2>
            <input
                placeholder="Event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
            />
            <button onClick={createEvent}>Create Event</button>

            {/* 🔽 ADD BAR */}
            <h2>Add Bar</h2>
            <input
                placeholder="Bar name"
                value={barName}
                onChange={(e) => setBarName(e.target.value)}
            />
            <button onClick={createBar}>Add Bar</button>

            {/* 🔽 ADD DRINK */}
            <h2>Add Drink</h2>
            <input
                placeholder="Drink name"
                value={drinkName}
                onChange={(e) => setDrinkName(e.target.value)}
            />
            <button onClick={createMenuItem}>Add Drink</button>

            <h2>Menu Items</h2>

            {menuItems.map(item => (
                <div key={item.id} style={{marginBottom: 10}}>
                    <span>{item.name}</span>

                    <button
                        onClick={() => deleteMenuItem(item.id)}
                        style={{ marginLeft: 10, background: "red", color: "white"}}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}