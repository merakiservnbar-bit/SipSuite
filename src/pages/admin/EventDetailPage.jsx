import { useParams } from "react-router-dom";
import QRCodeDisplay from "../../components/QRCodeDisplay";

export default function EventDetailPage() {
  const { eventId } = useParams();

  return (
    <div>
      <h1>Event</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20 }}>
        <button>Overview</button>
        <button>Menu</button>
        <button>Staff</button>
        <button>Analytics</button>
      </div>

      <h2>Overview</h2>
      <QRCodeDisplay eventId={eventId} />
    </div>
  );
}