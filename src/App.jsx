import { Routes, Route } from "react-router-dom";
import EventPage from "./pages/guest/EventPage";
import BartenderPage from "./pages/bartender/BartenderPage";
import QRCodeDisplay from "./components/QRCodeDisplay";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QRCodeDisplay eventId="IW2uiDADYDBUfJGY3cRg" />} />
      <Route path="/event/:eventId" element={<EventPage />} />
      <Route path="/bartender" element={<BartenderPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;