import { useState, useEffect, useCallback } from "react";

export type NetworkStatus = "online" | "offline";

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>(
    typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline"
  );
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null);
  const [justReconnected, setJustReconnected] = useState(false);

  const handleOnline = useCallback(() => {
    setStatus("online");
    setLastOnlineAt(new Date());
    setJustReconnected(true);
    // Reset reconnected flag after 5s
    setTimeout(() => setJustReconnected(false), 5000);
  }, []);

  const handleOffline = useCallback(() => {
    setStatus("offline");
    setJustReconnected(false);
  }, []);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { status, lastOnlineAt, justReconnected, isOnline: status === "online" };
}
