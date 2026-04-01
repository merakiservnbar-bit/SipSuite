import { useState } from "react";
import { useParams } from "react-router-dom";
import EventOverview from "../../components/admin/EventOverview";
import MenuEditor from "../../components/admin/MenuEditor";
import BarsManager from "../../components/admin/BarsManager";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <h1>Event</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("overview")}>Overview</button>
        <button onClick={() => setActiveTab("menu")}>Menu</button>
        <button onClick={() => setActiveTab("bars")}>Bars</button>
        <button onClick={() => setActiveTab("staff")}>Staff</button>
        <button>Analytics</button>
      </div>

      {/* Views */}
      {activeTab === "overview" && (
        <EventOverview eventId={eventId} />
      )}

      {activeTab === "menu" && (
        <MenuEditor eventId={eventId} />
      )}

      {activeTab === "bars" && (
        <BarsManager eventId={eventId} />
      )}
    </div>
  );
}