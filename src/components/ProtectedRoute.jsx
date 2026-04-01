import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, staff, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  // role-based protection
  if (role === "staff" && !staff) {
    return <p>Not authorized</p>;
  }

  return children;
}