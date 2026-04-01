import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import QRCodeDisplay from "../QRCodeDisplay";

export default function EventOverview({ eventId }) {

    console.log("EVENT ID:", eventId);
    const [event, setEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        location: "",
        date: "",
        start_time: "",
        end_time: ""
    });

    const updateEvent = async () => {
        try {
            await updateDoc(doc(db, "events", eventId), form);

            setEvent(form);

            setIsEditing(false);
        } catch (error) {
            console.error("UPDATE ERROR:", error);
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
            console.log("Fetching event:", eventId);

            const docRef = doc(db, "events", eventId);
            const snap = await getDoc(docRef);

            console.log("SNAP:", snap.exists());

            if (snap.exists()) {
                const data = snap.data();
                console.log("EVENT DATA:", data);

                setEvent(data);

                setForm({
                name: data.name || "",
                location: data.location || "",
                date: data.date || "",
                start_time: data.start_time || "",
                end_time: data.end_time || ""
                });
            } else {
                console.log("NO DOCUMENT FOUND");
            }

            } catch (error) {
            console.error("ERROR FETCHING EVENT:", error);
            }
        };

        if (eventId) fetchEvent();
    }, [eventId]);

    if (!event) return <p>Loading...</p>;
    

    return (
        <div>
        {isEditing ? (
            <>
                <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                />

                <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                <input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                />

                <input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                />

                <button onClick={updateEvent}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
            ) : (
            <>
                <h2>{event.name}</h2>
                <p>{event.location}</p>
                <p>
                {event.date} • {event.start_time} - {event.end_time}
                </p>

                <button onClick={() => setIsEditing(true)}>
                Edit Event
                </button>
            </>
        )}

        <div style={{ marginTop: 30 }}>
            <QRCodeDisplay eventId={eventId} />
        </div>

        <div style={{ marginTop: 20 }}>
            <button onClick={() => window.print()}>
            Print QR
            </button>

            <button
            onClick={() => {
                navigator.clipboard.writeText(
                `https://sip-suite.vercel.app/event/${eventId}`
                );
            }}
            style={{ marginLeft: 10 }}
            >
            Copy Link
            </button>

            <button
                onClick={() => {
                    const canvas = document.getElementById("qr-code");
                    const url = canvas.toDataURL("image/png");

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "qr-code.png";
                    a.click();
                }}
                style={{marginLeft:10}}
            >
                Download QR
            </button>
        </div>
        </div>
    );
}