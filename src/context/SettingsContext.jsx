import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/settings").then((s) => {
      setSettings(s);
      setLoading(false);
    }).catch(() => {
      setSettings({});
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--color-primary", settings.couleur_primaire || "#1B3A2D");
    root.style.setProperty("--color-secondary", settings.couleur_secondaire || "#E07B2A");
    root.style.setProperty("--color-accent", settings.couleur_accent || "#F59E0B");
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
