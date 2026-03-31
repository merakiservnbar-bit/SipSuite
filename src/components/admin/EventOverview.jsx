import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import QRCodeDisplay from "../QRCodeDisplay";

export default function EventOverview({ eventId }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", eventId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setEvent(snap.data());
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.name}</h2>

      <p>{event.location}</p>

      <p>
        {event.date} • {event.start_time} - {event.end_time}
      </p>

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