import { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import QRCodeDisplay from "../../components/QRCodeDisplay";

export default function AdminPage() {
    const [eventName, setEventName] = useState("");
    const [barName, setBarName] = useState("");
    const [drinkName, setDrinkName] = useState("");
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [bars, setBars] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editingBarId, setEditingBarId] = useState(null);
    const [editBarValue, setEditBarValue] = useState("");

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

    const updateMenuItem = async (id) => {
        await updateDoc(doc(db, "menu_items", id), {
            name: editValue
        });

        setMenuItems(prev =>
            prev.map(item =>
            item.id === id ? { ...item, name: editValue } : item
            )
        );

        setEditingItemId(null);
        setEditValue("");
    };

    const updateBar = async (id) => {
        await updateDoc(doc(db, "bars", id), {
            name: editBarValue
        });

        setBars(prev =>
            prev.map(bar =>
            bar.id === id ? { ...bar, name: editBarValue } : bar
            )
        );

        setEditingBarId(null);
        setEditBarValue("");
    };

    const deleteMenuItem = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this drink?");
        if (!confirmDelete) return;

        await deleteDoc(doc(db, "menu_items", id));

        setMenuItems(prev => prev.filter(item => item.id !== id));
    };

    const deleteBar = async (id) => {
        const confirmDelete = window.confirm("Delete this bar?");
        if (!confirmDelete) return;

        await deleteDoc(doc(db, "bars", id));

        setBars(prev => prev.filter(bar => bar.id !== id));
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

        const fetchBars = async () => {
            const snapshot = await getDocs(collection(db, "bars"));

            const data = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(bar => bar.event_id === selectedEventId);

            setBars(data);
        };

        fetchBars();
    }, [selectedEventId]);

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

            <h2>Bars</h2>

            {bars.map(bar => (
                <div key={bar.id} style={{ marginBottom: 10 }}>
                    
                    {editingBarId === bar.id ? (
                    <>
                        <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button onClick={() => updateBar(bar.id)}>Save</button>
                    </>
                    ) : (
                    <>
                        <span>{bar.name}</span>

                        <button
                        onClick={() => {
                            setEditingBarId(bar.id);
                            setEditValue(bar.name);
                        }}
                        style={{ marginLeft: 10 }}
                        >
                        Edit
                        </button>

                        <button
                        onClick={() => deleteBar(bar.id)}
                        style={{ marginLeft: 10, background: "red", color: "white" }}
                        >
                        Delete
                        </button>
                    </>
                    )}
                    
                </div>
            ))}

            <h2>Menu Items</h2>

            {menuItems.map(item => (
                <div key={item.id} style={{ marginBottom: 10 }}>
                    
                    {editingItemId === item.id ? (
                    <>
                        <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button onClick={() => updateMenuItem(item.id)}>Save</button>
                    </>
                    ) : (
                    <>
                        <span>{item.name}</span>

                        <button
                        onClick={() => {
                            setEditingItemId(item.id);
                            setEditValue(item.name);
                        }}
                        style={{ marginLeft: 10 }}
                        >
                        Edit
                        </button>

                        <button
                        onClick={() => deleteMenuItem(item.id)}
                        style={{ marginLeft: 10, background: "red", color: "white" }}
                        >
                        Delete
                        </button>
                    </>
                    )}
                    
                </div>
            ))}
        </div>
    );
}