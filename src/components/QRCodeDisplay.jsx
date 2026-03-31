import {QRCodeCanvas} from "qrcode.react";

export default function QRCodeDisplay({ eventId }) {
  const url = `sip-suite-fx4yv5smk-merakiservnbar-bits-projects.vercel.app/event/${eventId}`;

  return (
    <div style={{ padding: 20 }}>
      <h2>Scan to Order</h2>
      <QRCodeCanvas value={url} size={200} />
      <p>{url}</p>
    </div>
  );
}