import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Modal, FieldLabel, FieldTextarea, ModalBtn } from "../components/ui/Modal";
import { FaSearch, FaDollarSign, FaLock, FaExchangeAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const transactions = [
  { id: "TXN-9841", type: "Rental Fee", booking: "BK-3921", user: "Sarah Mitchell", amount: 425.00, escrow: "Released", date: "10 Aug 2024" },
  { id: "TXN-9840", type: "Bond",       booking: "BK-3921", user: "Sarah Mitchell", amount: 500.00, escrow: "Held",     date: "10 Aug 2024" },
  { id: "TXN-9839", type: "Commission", booking: "BK-3920", user: "System",         amount: 2.25,   escrow: "Settled",  date: "8 Aug 2024"  },
  { id: "TXN-9838", type: "Rental Fee", booking: "BK-3920", user: "Tom Nguyen",     amount: 90.00,  escrow: "Held",     date: "8 Aug 2024"  },
  { id: "TXN-9837", type: "Bond",       booking: "BK-3919", user: "Emily Chen",     amount: 150.00, escrow: "Released", date: "5 Aug 2024"  },
  { id: "TXN-9836", type: "Rental Fee", booking: "BK-3919", user: "Emily Chen",     amount: 105.00, escrow: "Released", date: "5 Aug 2024"  },
  { id: "TXN-9835", type: "Bond",       booking: "BK-3918", user: "Sofia Martinez", amount: 800.00, escrow: "Held",     date: "4 Aug 2024"  },
  { id: "TXN-9834", type: "Rental Fee", booking: "BK-3918", user: "Sofia Martinez", amount: 240.00, escrow: "Held",     date: "4 Aug 2024"  },
];

type Transaction = (typeof transactions)[0];
type ModalState =
  | { type: "details"; txn: Transaction }
  | { type: "release"; txn: Transaction }
  | null;

const financialSummary = [
  { label: "Total Volume",  value: "$2,312.25", sub: "All transactions",       icon: FaDollarSign,  iconBg: "bg-blue-50",   iconColor: "text-blue-600"   },
  { label: "In Escrow",     value: "$1,630.00", sub: "Currently held",         icon: FaLock,        iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  { label: "Released",      value: "$680.00",   sub: "Successfully disbursed", icon: FaCheckCircle, iconBg: "bg-green-50",  iconColor: "text-green-600"  },
  { label: "Commissions",   value: "$2.25",     sub: "Platform fees",          icon: FaExchangeAlt, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
];

function typeBadge(t: string): "info" | "purple" | "neutral" {
  if (t === "Rental Fee") return "info";
  if (t === "Bond") return "purple";
  return "neutral";
}
function escrowBadge(e: string): "warning" | "success" | "neutral" | "danger" {
  const m: Record<string, "warning" | "success" | "neutral" | "danger"> = {
    Held: "warning", Released: "success", Settled: "neutral", Disputed: "danger",
  };
  return m[e] ?? "neutral";
}

/* ── Modal content ──────────────────────────────────────────────────── */

function TxnDetailsContent({ txn }: { txn: Transaction }) {
  const auditEvents = [
    { event: "Payment initiated",              time: `${txn.date} 09:14` },
    { event: "Payment confirmed by gateway",   time: `${txn.date} 09:15` },
    { event: txn.escrow === "Released" ? "Funds released to advertiser" : "Funds placed in escrow", time: `${txn.date} 09:15` },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs text-gray-400">Transaction ID</p>
          <p className="font-mono text-base font-semibold text-gray-800">{txn.id}</p>
        </div>
        <Badge variant={escrowBadge(txn.escrow)}>{txn.escrow}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          { label: "Type",    value: txn.type    },
          { label: "Booking", value: txn.booking },
          { label: "User",    value: txn.user    },
          { label: "Date",    value: txn.date    },
          { label: "Amount",  value: `$${txn.amount.toFixed(2)}` },
          { label: "Escrow",  value: txn.escrow  },
        ].map((d) => (
          <div key={d.label}>
            <p className="text-xs text-gray-400">{d.label}</p>
            <p className="mt-0.5 font-medium text-gray-800">{d.value}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Audit Trail</p>
        <div className="space-y-2">
          {auditEvents.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <div>
                <p className="text-xs font-medium text-gray-700">{a.event}</p>
                <p className="text-xs text-gray-400">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReleaseEscrowContent({ txn }: { txn: Transaction }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
        <FaExclamationTriangle size={18} className="mt-0.5 shrink-0 text-yellow-600" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Release ${txn.amount.toFixed(2)} from escrow?</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Funds will transfer to the advertiser immediately. This action is logged in the audit trail and cannot be undone.
          </p>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
        {[
          { label: "Transaction", value: txn.id      },
          { label: "Booking",     value: txn.booking },
          { label: "User",        value: txn.user    },
          { label: "Amount",      value: `$${txn.amount.toFixed(2)}` },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-gray-500">{r.label}</span>
            <span className="font-mono font-semibold text-gray-900">{r.value}</span>
          </div>
        ))}
      </div>
      <div>
        <FieldLabel>Release note (required for audit)</FieldLabel>
        <FieldTextarea rows={2} placeholder="Reason for manual escrow release..." />
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Transactions() {
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modal, setModal]         = useState<ModalState>(null);

  const filtered = transactions.filter(
    (t) =>
      (t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.booking.toLowerCase().includes(search.toLowerCase())) &&
      (typeFilter === "All" || t.type === typeFilter)
  );

  const modalTitle =
    modal?.type === "details" ? "Transaction Details" :
    modal?.type === "release" ? "Release Escrow"       : "";

  const modalFooter = modal ? (
    <>
      <ModalBtn variant="secondary" onClick={() => setModal(null)}>
        {modal.type === "details" ? "Close" : "Cancel"}
      </ModalBtn>
      {modal.type === "release" && <ModalBtn variant="primary">Confirm Release</ModalBtn>}
    </>
  ) : undefined;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">Full ledger of rental fees, bonds, commissions and escrow.</p>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {financialSummary.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
              </div>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}>
                <s.icon size={16} className={s.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-50 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input type="text" placeholder="Search by ID, booking or user..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer">
          {["All", "Rental Fee", "Bond", "Commission"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Transaction", "Type", "Booking", "User", "Amount", "Escrow", "Date", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">No transactions match your filters.</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-sm font-medium text-gray-700">{t.id}</td>
                  <td className="px-5 py-3.5"><Badge variant={typeBadge(t.type)}>{t.type}</Badge></td>
                  <td className="px-5 py-3.5 font-mono text-sm text-gray-500">{t.booking}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{t.user}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">${t.amount.toFixed(2)}</td>
                  <td className="px-5 py-3.5"><Badge variant={escrowBadge(t.escrow)}>{t.escrow}</Badge></td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{t.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <button onClick={() => setModal({ type: "details", txn: t })} className="text-blue-600 hover:text-blue-800 transition-colors">Details</button>
                      {t.escrow === "Held" && (
                        <button onClick={() => setModal({ type: "release", txn: t })} className="text-green-600 hover:text-green-800 transition-colors">Release</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>

      <Modal isOpen={modal !== null} onClose={() => setModal(null)} title={modalTitle} size="md" footer={modalFooter}>
        {modal?.type === "details" && <TxnDetailsContent txn={modal.txn} />}
        {modal?.type === "release" && <ReleaseEscrowContent txn={modal.txn} />}
      </Modal>
    </div>
  );
}
