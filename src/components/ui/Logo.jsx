import logo from "../../assets/sipsuite-logo-full.png";
import icon from "../../assets/sipsuite-icon-only.png";

export default function Logo({ type = "full", size = 40 }) {
  const src = type === "icon" ? icon : logo;

  return (
    <img
      src={src}
      alt="SipSuite"
      style={{ height: size }}
    />
  );
}