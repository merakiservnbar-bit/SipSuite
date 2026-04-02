import full from "../../assets/sipsuite-logo-full.png";
import icon from "../../assets/sipsuite-icon-only.png";
import wordmark from "../../assets/sipsuite-wordmark-only.png"
import flat from "../../assets/sipsuite-flat.png"

export default function Logo({ variant = "full", size = 40 }) {
  const map = {
    full,
    icon,
    wordmark,
    flat
  }

  return (
    <img
      src={map[variant]}
      alt="SipSuite"
      style={{ height: size }}
    />
  );
}