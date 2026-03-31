import { Routes, Route } from "react-router-dom";
import EventPage from "./pages/guest/EventPage";
import BartenderPage from "./pages/bartender/BartenderPage";
import QRCodeDisplay from "./components/QRCodeDisplay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QRCodeDisplay eventId="IW2uiDADYDBUfJGY3cRg" />} />
      <Route path="/event/:eventId" element={<EventPage />} />
      <Route path="/bartender" element={<BartenderPage />} />
    </Routes>
  );
}

export default App;