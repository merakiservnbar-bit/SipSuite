export default function Card({ children }) {
  return (
    <div
      style={{
        background: "#1A1A1D",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}
    >
      {children}
    </div>
  );
}