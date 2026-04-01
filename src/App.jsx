import { Routes, Route } from "react-router-dom";
import EventPage from "./pages/guest/EventPage";
import BartenderEventsPage from "./pages/bartender/BartenderEventsPage";
import BartenderEventPage from "./pages/bartender/BartenderEventPage";
import BartenderLivePage from "./pages/bartender/BartenderLivePage";
import AdminLayout from "./layouts/AdminLayout";
import EventsPage from "./pages/admin/EventsPage";
import EventDetailPage from "./pages/admin/EventDetailPage";
import StaffPage from "./pages/admin/StaffPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EventsPage />} />
        <Route path="events/:eventId" element={<EventDetailPage />} />
        <Route path="staff" element={<StaffPage />} />
      </Route>
      <Route path="/event/:eventId" element={<EventPage />} />
      <Route
        path="/bartender"
        element={
          <ProtectedRoute role="staff">
            <BartenderEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bartender/events/:eventId"
        element={
          <ProtectedRoute role="staff">
            <BartenderEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bartender/events/:eventId/live"
        element={
          <ProtectedRoute role="staff">
            <BartenderLivePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;