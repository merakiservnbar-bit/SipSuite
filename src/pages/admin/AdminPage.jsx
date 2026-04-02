import { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import QRCodeDisplay from "../../components/QRCodeDisplay";
import Section from "../../components/ui/Section";
import EventCard from "../../components/EventCard";

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
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const createEvent = async () => {
        const docRef = await addDoc(collection(db, "events"), {
            name: eventName,
            location,
            date,
            start_time: startTime,
            end_time: endTime,
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

    if (!selectedEventId) {
        return (
            <div style={{ padding: 30 }}>
            <h1>Events</h1>

            {events.map(event => (
                <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEventId(event.id)}
                />
            ))}
            </div>
        );
    }

    return (
        <div
            style={{
            padding: 30,
            maxWidth: 900,
            margin: "0 auto"
            }}
        >
            <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>

            <Section title="Events">
                {events.map(event => (
                    <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEventId(event.id)}
                    />
                ))}
            </Section>

            {selectedEventId && (
                <Section title="Current Event">
                    <p>{selectedEventId}</p>
                    <QRCodeDisplay eventId={selectedEventId} />
                </Section>
            )}

            <Section title="Create Event">
                <input placeholder="Event name" onChange={e => setEventName(e.target.value)} />
                <input placeholder="Location" onChange={e => setLocation(e.target.value)} />
                <input type="date" onChange={e => setDate(e.target.value)} />
                <input type="time" onChange={e => setStartTime(e.target.value)} />
                <input type="time" onChange={e => setEndTime(e.target.value)} />
                <button onClick={createEvent} className="btn-primary">Create</button>
            </Section>

            <Section title="Bars">
                <input
                    placeholder="Bar name"
                    value={barName}
                    onChange={(e) => setBarName(e.target.value)}
                />
                <button onClick={createBar} style={{ marginLeft: 10 }} className="btn-primary">
                    Add
                </button>

                <div style={{ marginTop: 15 }}>
                    {bars.map(bar => (
                    <div
                        key={bar.id}
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10
                        }}
                    >
                        <span>{bar.name}</span>

                        <div>
                        <button
                            onClick={() => {
                            setEditingBarId(bar.id);
                            setEditBarValue(bar.name);
                            }}
                            className="btn-primary"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteBar(bar.id)}
                            style={{ marginLeft: 10, background: "red", color: "white" }}
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            </Section>

            <Section title="Menu">

                <button onClick={() => setSelectedEventId(null)} className="btn-primary">
                    ← Back to Events
                </button >
                <input
                    placeholder="Drink name"
                    value={drinkName}
                    onChange={(e) => setDrinkName(e.target.value)}
                />
                <button onClick={createMenuItem} style={{ marginLeft: 10 }} className="btn-primary">
                    Add
                </button>

                <div style={{ marginTop: 15 }}>
                    {menuItems.map(item => (
                    <div
                        key={item.id}
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10
                        }}
                    >
                        {editingItemId === item.id ? (
                        <>
                            <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            />
                            <button onClick={() => updateMenuItem(item.id)} className="btn-primary">Save</button>
                        </>
                        ) : (
                        <>
                            <span>{item.name}</span>

                            <div>
                            <button
                                onClick={() => {
                                setEditingItemId(item.id);
                                setEditValue(item.name);
                                }}
                                className="btn-primary"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteMenuItem(item.id)}
                                style={{ marginLeft: 10, background: "red", color: "white" }}
                            >
                                Delete
                            </button>
                            </div>
                        </>
                        )}
                    </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}