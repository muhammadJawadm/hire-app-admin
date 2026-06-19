import { useState, useEffect } from "react";
import type { NType } from "../contexts/NotificationContext";
import {
  FaMobileAlt, FaCheckCircle, FaSpinner, FaPaperPlane,
  FaKey, FaEdit, FaTrash, FaEye, FaEyeSlash, FaGlobe,
  FaTimesCircle, FaShieldAlt, FaCalendarCheck, FaExclamationCircle,
  FaLock, FaFlag, FaCog,
} from "react-icons/fa";

/* ── Constants ───────────────────────────────────────────────────────── */

const FCM_URL          = "https://fcm.googleapis.com/fcm/send";
const FCM_CONFIG_KEY   = "hireapp_fcm_config";
const FCM_HISTORY_KEY  = "hireapp_fcm_history";

const TARGET_TOPICS: Record<string, string> = {
  all:         "/topics/all",
  renters:     "/topics/renters",
  advertisers: "/topics/advertisers",
};

const TYPE_META: Record<NType, { label: string; icon: React.ElementType; iconBg: string; iconColor: string }> = {
  verification: { label: "Verification", icon: FaShieldAlt,         iconBg: "bg-blue-100",   iconColor: "text-blue-600"   },
  booking:      { label: "Booking",      icon: FaCalendarCheck,     iconBg: "bg-green-100",  iconColor: "text-green-600"  },
  dispute:      { label: "Dispute",      icon: FaExclamationCircle, iconBg: "bg-red-100",    iconColor: "text-red-500"    },
  escrow:       { label: "Escrow",       icon: FaLock,              iconBg: "bg-orange-100", iconColor: "text-orange-500" },
  review:       { label: "Review",       icon: FaFlag,              iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
  system:       { label: "System",       icon: FaCog,               iconBg: "bg-gray-100",   iconColor: "text-gray-500"   },
};

/* ── Types ───────────────────────────────────────────────────────────── */

interface FCMConfig {
  serverKey:  string;
  backendUrl: string;
  mode:       "direct" | "backend";
}

interface FCMRecord {
  id:        string;
  title:     string;
  body:      string;
  type:      NType;
  target:    string;
  timestamp: number;
  status:    "success" | "error";
  messageId?: string;
  error?:    string;
}

type SendStatus = "idle" | "sending" | "success" | "error";

/* ── Storage helpers ─────────────────────────────────────────────────── */

function loadConfig(): FCMConfig {
  try { const r = localStorage.getItem(FCM_CONFIG_KEY); if (r) return JSON.parse(r); } catch {}
  return { serverKey: "", backendUrl: "", mode: "direct" };
}

function loadHistory(): FCMRecord[] {
  try { const r = localStorage.getItem(FCM_HISTORY_KEY); if (r) return JSON.parse(r); } catch {}
  return [];
}

function saveHistory(h: FCMRecord[]) {
  try { localStorage.setItem(FCM_HISTORY_KEY, JSON.stringify(h.slice(0, 100))); } catch {}
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min  = Math.floor(diff / 60_000);
  if (min < 1)  return "Just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)  return `${hr} hr ago`;
  const d = Math.floor(hr / 24);
  if (d < 7)    return `${d} day${d > 1 ? "s" : ""} ago`;
  return new Date(ts).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

/* ── Firebase Config Card ────────────────────────────────────────────── */

function ConfigCard({ config, onChange }: { config: FCMConfig; onChange: (c: FCMConfig) => void }) {
  const [editing,  setEditing]  = useState(false);
  const [showKey,  setShowKey]  = useState(false);
  const [draft,    setDraft]    = useState(config);

  const configured = config.mode === "direct" ? !!config.serverKey : !!config.backendUrl;

  const save = () => {
    onChange(draft);
    localStorage.setItem(FCM_CONFIG_KEY, JSON.stringify(draft));
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
              <FaKey size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Firebase Configuration</p>
              <p className="text-xs text-gray-400">
                {configured
                  ? config.mode === "direct"
                    ? `Server Key ●●●●${config.serverKey.slice(-4)} · Direct mode`
                    : `Backend: ${config.backendUrl}`
                  : "Not configured — add your Firebase credentials to enable sending"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              configured ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {configured ? "✓ Configured" : "Not set"}
            </span>
            <button onClick={() => { setDraft(config); setEditing(true); }}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
              <FaEdit size={10} /> Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-white shadow-sm ring-2 ring-blue-50">
      <div className="border-b border-gray-100 px-5 py-4">
        <p className="text-sm font-semibold text-gray-900">Firebase Configuration</p>
        <p className="mt-0.5 text-xs text-gray-400">Choose how this admin panel connects to Firebase Cloud Messaging.</p>
      </div>
      <div className="space-y-4 p-5">
        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-2">
          {([
            { key: "direct",  label: "Server Key (Direct)",  sub: "Call FCM from browser"           },
            { key: "backend", label: "Backend API Proxy",    sub: "Route through your server (secure)" },
          ] as const).map((m) => (
            <button key={m.key} onClick={() => setDraft((d) => ({ ...d, mode: m.key }))}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                draft.mode === m.key ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
              <p className="text-xs font-semibold text-gray-800">{m.label}</p>
              <p className="mt-0.5 text-[10px] text-gray-400">{m.sub}</p>
            </button>
          ))}
        </div>

        {draft.mode === "direct" ? (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Firebase Server Key
              <span className="ml-1 font-normal text-gray-400">(Firebase Console → Project Settings → Cloud Messaging)</span>
            </label>
            <div className="relative">
              <input type={showKey ? "text" : "password"} placeholder="AAAA…"
                value={draft.serverKey} onChange={(e) => setDraft((d) => ({ ...d, serverKey: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 pr-10 px-3 py-2.5 font-mono text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              <button onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showKey ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
              </button>
            </div>
            <p className="mt-1.5 rounded-lg bg-yellow-50 px-3 py-2 text-[10px] text-yellow-700">
              For production, use Backend Proxy mode so your Server Key is never exposed in the browser.
            </p>
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Backend API Endpoint
              <span className="ml-1 font-normal text-gray-400">(your server forwards to FCM with the Server Key)</span>
            </label>
            <input type="url" placeholder="https://yourapp.com/api/send-notification"
              value={draft.backendUrl} onChange={(e) => setDraft((d) => ({ ...d, backendUrl: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            <p className="mt-1.5 text-[10px] text-gray-400">
              Your endpoint should accept: <code className="rounded bg-gray-100 px-1">POST {"{ title, body, topic, type }"}</code>
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button onClick={save}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Save
          </button>
          <button onClick={() => setEditing(false)}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Compose Card ────────────────────────────────────────────────────── */

const BLANK = { title: "", body: "", type: "system" as NType, target: "all" as const, token: "" };

function ComposeCard({ config, onSent }: {
  config: FCMConfig;
  onSent: (r: FCMRecord) => void;
}) {
  const [form,   setForm]   = useState(BLANK);
  const [status, setStatus] = useState<SendStatus>("idle");
  const [result, setResult] = useState<{ messageId?: string; error?: string } | null>(null);

  const configured = config.mode === "direct" ? !!config.serverKey : !!config.backendUrl;
  const canSend    = configured && !!form.title.trim() && !!form.body.trim() &&
                     (form.target !== "token" || !!form.token.trim());

  const send = async () => {
    if (!canSend) return;
    setStatus("sending");
    setResult(null);

    const to = form.target === "token" ? form.token.trim() : TARGET_TOPICS[form.target];

    try {
      let data: Record<string, unknown>;

      if (config.mode === "backend") {
        const res = await fetch(config.backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title, body: form.body, topic: to, type: form.type }),
        });
        data = await res.json();
        if (!res.ok) throw new Error((data.error as string) || `HTTP ${res.status}`);
      } else {
        const res = await fetch(FCM_URL, {
          method: "POST",
          headers: { Authorization: `key=${config.serverKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            to,
            notification: { title: form.title, body: form.body, sound: "default" },
            data: { type: form.type, click_action: "FLUTTER_NOTIFICATION_CLICK" },
          }),
        });
        data = await res.json();
        if (!res.ok || (data.failure as number) > 0) {
          throw new Error(((data.results as { error?: string }[])?.[0]?.error) || "Delivery failed");
        }
      }

      const record: FCMRecord = {
        id: String(Date.now()), title: form.title, body: form.body,
        type: form.type, target: to, timestamp: Date.now(),
        status: "success", messageId: data.message_id as string | undefined,
      };
      setStatus("success");
      setResult({ messageId: record.messageId });
      onSent(record);
      setForm(BLANK);
      setTimeout(() => { setStatus("idle"); setResult(null); }, 5000);

    } catch (err) {
      const msg    = err instanceof Error ? err.message : "Unknown error";
      const isCors = msg.includes("Failed to fetch");
      const display = isCors
        ? "Blocked by CORS — browsers cannot call FCM directly. Switch to Backend Proxy mode."
        : msg;
      setStatus("error");
      setResult({ error: display });
      onSent({
        id: String(Date.now()), title: form.title, body: form.body,
        type: form.type, target: to, timestamp: Date.now(),
        status: "error", error: display,
      });
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <FaPaperPlane size={13} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Compose Push Notification</p>
            <p className="text-xs text-gray-400">Delivered instantly to all subscribed mobile app users via Firebase.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">Title</label>
          <input type="text" placeholder="e.g. New listing available near you"
            value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-colors" />
        </div>

        {/* Body */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">Message</label>
          <textarea rows={3} placeholder="Write your notification message…"
            value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-colors" />
        </div>

        {/* Category + Target */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">Category</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as NType }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 cursor-pointer">
              {(Object.entries(TYPE_META) as [NType, (typeof TYPE_META)[NType]][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">Target Audience</label>
            <select value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value as typeof form.target }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 cursor-pointer">
              <option value="all">All Users</option>
              <option value="renters">Renters Only</option>
              <option value="advertisers">Advertisers Only</option>
              <option value="token">Specific Device</option>
            </select>
          </div>
        </div>

        {/* Device token input */}
        {form.target === "token" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">Device Token</label>
            <input type="text" placeholder="FCM device registration token…"
              value={form.token} onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 font-mono text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-colors" />
          </div>
        )}

        {/* FCM topic preview */}
        {form.target !== "token" && (
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs">
            <FaGlobe size={10} className="shrink-0 text-gray-400" />
            <span className="text-gray-500">FCM topic:</span>
            <span className="font-mono font-medium text-gray-700">{TARGET_TOPICS[form.target]}</span>
          </div>
        )}

        {/* Warning if not configured */}
        {!configured && (
          <p className="rounded-lg border border-yellow-100 bg-yellow-50 px-3 py-2.5 text-xs text-yellow-700">
            Configure your Firebase credentials above before sending.
          </p>
        )}

        {/* Send button */}
        <button onClick={send} disabled={!canSend || status === "sending"}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all ${
            canSend && status !== "sending"
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm"
              : "cursor-not-allowed bg-gray-100 text-gray-400"}`}>
          {status === "sending"
            ? <><FaSpinner size={13} className="animate-spin" /> Sending to Firebase…</>
            : <><FaMobileAlt size={13} /> Send to Mobile App</>}
        </button>

        {/* Result */}
        {status === "success" && result && (
          <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
            <FaCheckCircle size={16} className="mt-0.5 shrink-0 text-green-500" />
            <div>
              <p className="text-sm font-semibold text-green-800">Push notification sent!</p>
              {result.messageId && (
                <p className="mt-0.5 font-mono text-[10px] text-green-600">Message ID: {result.messageId}</p>
              )}
            </div>
          </div>
        )}
        {status === "error" && result?.error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <FaTimesCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-800">Failed to send</p>
              <p className="mt-0.5 text-xs text-red-600 leading-relaxed">{result.error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sent History ────────────────────────────────────────────────────── */

function HistoryCard({ history, onDelete, onClear }: {
  history: FCMRecord[];
  onDelete: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Sent History</p>
          <p className="text-xs text-gray-400">{history.length} notification{history.length !== 1 ? "s" : ""} sent</p>
        </div>
        {history.length > 0 && (
          <button onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
            <FaTrash size={10} /> Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {history.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FaMobileAlt size={18} className="text-gray-200" />
            </div>
            <p className="text-sm text-gray-400">No notifications sent yet</p>
          </div>
        ) : history.map((r) => {
          const meta = TYPE_META[r.type];
          const Icon = meta.icon;
          return (
            <div key={r.id} className="flex items-start gap-3.5 px-5 py-4 hover:bg-gray-50/60 transition-colors">
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.iconBg}`}>
                <Icon size={14} className={meta.iconColor} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">{r.title}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    r.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {r.status === "success" ? "Delivered" : "Failed"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-400">{r.body}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                  <span>{timeAgo(r.timestamp)}</span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">{r.target}</span>
                  <span className={`rounded px-1.5 py-0.5 font-medium ${meta.iconBg} ${meta.iconColor}`}>{meta.label}</span>
                  {r.messageId && <span className="font-mono text-green-500">ID …{r.messageId.slice(-10)}</span>}
                  {r.error && <span className="text-red-400 max-w-xs truncate">{r.error}</span>}
                  <button onClick={() => onDelete(r.id)} className="ml-auto text-gray-300 hover:text-red-400 transition-colors">
                    <FaTrash size={9} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Notifications() {
  const [config,  setConfig]  = useState<FCMConfig>(loadConfig);
  const [history, setHistory] = useState<FCMRecord[]>(loadHistory);

  useEffect(() => { saveHistory(history); }, [history]);

  const delivered  = history.filter((r) => r.status === "success").length;
  const failed     = history.filter((r) => r.status === "error").length;
  const todayCount = history.filter((r) => r.timestamp >= new Date().setHours(0, 0, 0, 0)).length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Push Notifications</h1>
        <p className="mt-1 text-sm text-gray-500">Send push notifications to mobile app users via Firebase Cloud Messaging.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Sent",  value: history.length, color: "text-blue-600",  bg: "bg-blue-50"  },
          { label: "Delivered",   value: delivered,      color: "text-green-600", bg: "bg-green-50" },
          { label: "Failed",      value: failed,         color: "text-red-500",   bg: "bg-red-50"   },
          { label: "Today",       value: todayCount,     color: "text-indigo-600",bg: "bg-indigo-50"},
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
              <FaMobileAlt size={14} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Config */}
      <ConfigCard config={config} onChange={setConfig} />

      {/* Compose */}
      <ComposeCard config={config} onSent={(r) => setHistory((h) => [r, ...h])} />

      {/* History */}
      <HistoryCard
        history={history}
        onDelete={(id) => setHistory((h) => h.filter((r) => r.id !== id))}
        onClear={() => setHistory([])}
      />

    

    </div>
  );
}
