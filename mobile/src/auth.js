import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const storageKey = "skilllearn-session";

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((raw) => {
        if (raw) setSessionState(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      token: session?.token || "",
      user: session?.user || null,
      async setSession(next) {
        setSessionState(next);
        await AsyncStorage.setItem(storageKey, JSON.stringify(next));
      },
      async logout() {
        setSessionState(null);
        await AsyncStorage.removeItem(storageKey);
      },
    }),
    [ready, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
