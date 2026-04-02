import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BartenderEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");

  return (
    <div style={{ padding: 20 }}>
      <h1>Event</h1>

      <button
        onClick={() => navigate(`/bartender/events/${eventId}/live`)}
        style={{ marginBottom: 20 }}
        className="btn-primary"
      >
        Start Event
      </button>

      <div style={{ display: "flex", gap: 20 }}>
        <button onClick={() => setTab("overview")} className="btn-secondary">Overview</button>
        <button onClick={() => setTab("menu")} className="btn-secondary">Menu</button>
      </div>

      {tab === "overview" && <p>Event details here</p>}
      {tab === "menu" && <p>Menu preview here</p>}
    </div>
  );
}