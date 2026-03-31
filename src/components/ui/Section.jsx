export default function Section({ title, children }) {
  return (
    <div
      style={{
        background: "#1A1A1D",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20
      }}
    >
      <h2 style={{ marginBottom: 15 }}>{title}</h2>
      {children}
    </div>
  );
}