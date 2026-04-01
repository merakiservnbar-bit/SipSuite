import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setStaff(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // match staff
      const snapshot = await getDocs(collection(db, "staff"));

      const match = snapshot.docs.find(
        doc => doc.data().email === currentUser.email
      );

      if (match) {
        setStaff({ id: match.id, ...match.data() });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, staff, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);