export default function Button({ children, onClick, variant = "primary" }) {
  const styles = {
    primary: {
      background: "#C6A96B",
      color: "#000"
    },
    secondary: {
      background: "#1A1A1D",
      color: "#fff",
      border: "1px solid #333"
    }
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: "10px 16px",
        borderRadius: "8px"
      }}
    >
      {children}
    </button>
  );
}