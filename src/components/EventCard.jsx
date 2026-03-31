export default function EventCard({ event, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#1A1A1D",
        padding: 20,
        borderRadius: 12,
        cursor: "pointer",
        marginBottom: 15
      }}
    >
      <h3>{event.name}</h3>

      <p style={{ color: "#aaa" }}>{event.location}</p>

      <p style={{ fontSize: 14 }}>
        {event.date} • {event.start_time} - {event.end_time}
      </p>
    </div>
  );
}