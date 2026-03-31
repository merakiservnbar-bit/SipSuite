import QRCodeDisplay from "../QRCodeDisplay";

export default function EventOverview({ eventId }) {
  return (
    <div>
      <h2>Overview</h2>

      <QRCodeDisplay eventId={eventId} />
    </div>
  );
}