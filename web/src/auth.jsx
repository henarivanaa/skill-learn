import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const storageKey = "skilllearn-session";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(readSession);

  const value = useMemo(
    () => ({
      token: session?.token || "",
      user: session?.user || null,
      setSession(next) {
        setSessionState(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
      },
      logout() {
        setSessionState(null);
        localStorage.removeItem(storageKey);
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
