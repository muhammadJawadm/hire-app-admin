import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type NType = "verification" | "booking" | "dispute" | "escrow" | "review" | "system";

export interface AppNotification {
  id: string;
  type: NType;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  pushed: boolean;
}

export type SwStatus = "idle" | "registering" | "active" | "error" | "unsupported";

interface NotifCtx {
  notifications: AppNotification[];
  unreadCount: number;
  pushedCount: number;
  permission: NotificationPermission | "unsupported";
  swStatus: SwStatus;
  requestPermission: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotif: (id: string) => void;
  clearAll: () => void;
  sendPush: (title: string, body: string, type: NType) => Promise<void>;
}

const Ctx = createContext<NotifCtx | null>(null);

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
}

const STORAGE_KEY = "hireapp_admin_notifications";

const INITIAL: AppNotification[] = [
  { id: "n1", type: "verification", title: "New verification request",  body: "James Turner submitted ID documents for review.",          timestamp: Date.now() - 2 * 60_000,       read: false, pushed: false },
  { id: "n2", type: "booking",      title: "Booking confirmed",         body: "BK-3921 · Sony A7 III Camera — 10–15 Aug.",               timestamp: Date.now() - 18 * 60_000,      read: false, pushed: false },
  { id: "n3", type: "dispute",      title: "Dispute opened",            body: "DSP-201 · Marcus Reid vs Daniel Brooks (Bond Refund).",   timestamp: Date.now() - 60 * 60_000,      read: false, pushed: true  },
  { id: "n4", type: "escrow",       title: "Escrow release requested",  body: "TXN-9841 · $425.00 awaiting manual approval.",            timestamp: Date.now() - 3 * 3600_000,     read: true,  pushed: true  },
  { id: "n5", type: "review",       title: "Review flagged",            body: "Road Bike review by Tom Nguyen auto-flagged.",            timestamp: Date.now() - 24 * 3600_000,    read: true,  pushed: false },
  { id: "n6", type: "system",       title: "Platform maintenance",      body: "Scheduled maintenance window: Sun 18 Aug 2–4am AEST.",   timestamp: Date.now() - 48 * 3600_000,    read: true,  pushed: true  },
  { id: "n7", type: "booking",      title: "Booking completed",         body: "BK-3919 · Camping Tent returned by Emily Chen.",          timestamp: Date.now() - 72 * 3600_000,    read: true,  pushed: false },
  { id: "n8", type: "verification", title: "Verification approved",     body: "Marcus Reid's identity has been successfully verified.",  timestamp: Date.now() - 96 * 3600_000,    read: true,  pushed: false },
];

function loadStored(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppNotification[];
  } catch {}
  return INITIAL;
}

function getPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadStored);
  const [permission,    setPermission]    = useState<NotificationPermission | "unsupported">(getPermission);
  const [swStatus,      setSwStatus]      = useState<SwStatus>("idle");
  const [swReg,         setSwReg]         = useState<ServiceWorkerRegistration | null>(null);

  /* ── Persist to localStorage ─────────────────────────────────────── */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  /* ── Register Service Worker ─────────────────────────────────────── */
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setSwStatus("unsupported");
      return;
    }
    setSwStatus("registering");
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        setSwReg(reg);
        setSwStatus("active");
      })
      .catch(() => setSwStatus("error"));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pushedCount = notifications.filter((n) => n.pushed).length;

  /* ── Actions ─────────────────────────────────────────────────────── */
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const markRead = useCallback((id: string) =>
    setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n)), []);

  const markAllRead = useCallback(() =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true }))), []);

  const deleteNotif = useCallback((id: string) =>
    setNotifications((p) => p.filter((n) => n.id !== id)), []);

  const clearAll = useCallback(() => setNotifications([]), []);

  /* ── Send push (via Service Worker → works on mobile) ────────────── */
  const sendPush = useCallback(async (title: string, body: string, type: NType) => {
    const notif: AppNotification = {
      id: String(Date.now()),
      type,
      title,
      body,
      timestamp: Date.now(),
      read: false,
      pushed: true,
    };
    setNotifications((p) => [notif, ...p]);

    if (permission !== "granted") return;

    if (swReg) {
      /* Use service worker — this works on mobile */
      await swReg.showNotification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: type,
        renotify: true,
        vibrate: [200, 100, 200],
      } as NotificationOptions);
    } else if ("Notification" in window) {
      /* Fallback for desktop when SW not ready */
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  }, [permission, swReg]);

  return (
    <Ctx.Provider value={{
      notifications, unreadCount, pushedCount,
      permission, swStatus,
      requestPermission, markRead, markAllRead,
      deleteNotif, clearAll, sendPush,
    }}>
      {children}
    </Ctx.Provider>
  );
}
