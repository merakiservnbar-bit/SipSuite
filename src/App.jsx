import { Routes, Route } from "react-router-dom";
import EventPage from "./pages/guest/EventPage";
import BartenderPage from "./pages/bartender/BartenderPage";
import AdminLayout from "./layouts/AdminLayout";
import EventsPage from "./pages/admin/EventsPage";
import EventDetailPage from "./pages/admin/EventDetailPage";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<EventsPage />} />
        <Route path="events/:eventId" element={<EventDetailPage />} />
        <Route path="/admin/staff" element={<StaffPage />} />
      </Route>
      <Route path="/event/:eventId" element={<EventPage />} />
      <Route path="/bartender" element={<BartenderPage />} />
    </Routes>
  );
}

export default App;