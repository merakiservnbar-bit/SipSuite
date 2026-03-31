import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeDisplay({ eventId }) {
  const url = `https://sip-suite.vercel.app/event/${eventId}`;

  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        background: "#0f0f10",
        color: "white",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ marginBottom: 10 }}>Scan to Order</h1>
      <p style={{ marginBottom: 30, color: "#aaa" }}>
        Skip the line. Order from your phone.
      </p>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          display: "inline-block"
        }}
      >
        <QRCodeCanvas value={url} size={220} />
      </div>

      <p style={{ marginTop: 20, fontSize: 12 }}>
        {url}
      </p>
    </div>
  );
}