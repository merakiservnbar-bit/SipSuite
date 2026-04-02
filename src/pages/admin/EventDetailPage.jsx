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
      <div className="tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={activeTab === "overview" ? "tab active" : "tab"}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("bars")}
          className={activeTab === "bars" ? "tab active" : "tab"}
        >
          Bars
        </button>

        <button
          onClick={() => setActiveTab("menu")}
          className={activeTab === "menu" ? "tab active" : "tab"}
        >
          Menu
        </button>

        <button
          onClick={() => setActiveTab("staff")}
          className={activeTab === "staff" ? "tab active" : "tab"}
        >
          Staff
        </button>

        <button className="tab">Analytics</button>
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

      {activeTab === "staff" && (
        <p className="text-muted">Staff assignment coming next</p>
      )}
    </div>
  );
}