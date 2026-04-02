import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import QRCodeDisplay from "../QRCodeDisplay";
import { useNavigate } from "react-router-dom";

export default function EventOverview({ eventId }) {

    console.log("EVENT ID:", eventId);
    const [event, setEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        location: "",
        date: "",
        start_time: "",
        end_time: "",
        target_wait_time: 120000,
        target_prep_time: 60000
    });
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!confirm("Delete this event?")) return;

        await deleteDoc(doc(db, "events", eventId));

        navigate("/admin");
    };

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
                end_time: data.end_time || "",
                target_wait_time: data.target_wait_time || "",
                target_prep_time: data.target_prep_time || ""
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
        <div className="event-overview-grid">

            {/* EVENT DETAILS */}
            <div className="card">
            {isEditing ? (
                <>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
                <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
                <input
                    type="number"
                    placeholder="Target Wait (seconds)"
                    value={form.target_wait_time / 1000}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        target_wait_time: Number(e.target.value) * 1000
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Target Prep (seconds)"
                    value={form.target_prep_time / 1000}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        target_prep_time: Number(e.target.value) * 1000
                        })
                    }
                />

                <div className="button-row">
                    <button onClick={updateEvent} className="btn-primary">Save</button>
                    <button onClick={() => setIsEditing(false)} className="btn-danger">Cancel</button>
                </div>
                </>
            ) : (
                <>
                <h2>{event.name}</h2>
                <p>{event.location}</p>
                <p>{event.date} • {event.start_time} - {event.end_time}</p>

                <div className="button-row">
                    <button onClick={() => setIsEditing(true)} className="btn-primary">
                    Edit
                    </button>

                    <button onClick={handleDelete} className="btn-danger">
                    Delete
                    </button>
                </div>
                </>
            )}
            </div>

            {/* QR CARD */}
            <div className="card">
            <QRCodeDisplay eventId={eventId} />

            <div className="button-row">
                <button onClick={() => window.print()} className="btn-primary">Print</button>

                <button
                onClick={() =>
                    navigator.clipboard.writeText(
                    `https://sip-suite.vercel.app/event/${eventId}`
                    )
                }
                className="btn-primary"
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
                className="btn-primary"
                >
                Download
                </button>
            </div>
            </div>

        </div>
    );
}