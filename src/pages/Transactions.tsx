import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { FaSearch, FaDollarSign, FaLock, FaExchangeAlt, FaCheckCircle } from "react-icons/fa";

const transactions = [
  { id: "TXN-9841", type: "Rental Fee", booking: "BK-3921", user: "Sarah Mitchell",  amount: 425.00, escrow: "Released", date: "10 Aug 2024" },
  { id: "TXN-9840", type: "Bond",       booking: "BK-3921", user: "Sarah Mitchell",  amount: 500.00, escrow: "Held",     date: "10 Aug 2024" },
  { id: "TXN-9839", type: "Commission", booking: "BK-3920", user: "System",          amount: 2.25,   escrow: "Settled",  date: "8 Aug 2024"  },
  { id: "TXN-9838", type: "Rental Fee", booking: "BK-3920", user: "Tom Nguyen",      amount: 90.00,  escrow: "Held",     date: "8 Aug 2024"  },
  { id: "TXN-9837", type: "Bond",       booking: "BK-3919", user: "Emily Chen",      amount: 150.00, escrow: "Released", date: "5 Aug 2024"  },
  { id: "TXN-9836", type: "Rental Fee", booking: "BK-3919", user: "Emily Chen",      amount: 105.00, escrow: "Released", date: "5 Aug 2024"  },
  { id: "TXN-9835", type: "Bond",       booking: "BK-3918", user: "Sofia Martinez",  amount: 800.00, escrow: "Held",     date: "4 Aug 2024"  },
  { id: "TXN-9834", type: "Rental Fee", booking: "BK-3918", user: "Sofia Martinez",  amount: 240.00, escrow: "Held",     date: "4 Aug 2024"  },
];

const financialSummary = [
  { label: "Total Volume",       value: "$2,312.25", sub: "All transactions",        icon: FaDollarSign,   iconBg: "bg-blue-50",   iconColor: "text-blue-600"   },
  { label: "In Escrow",          value: "$1,630.00", sub: "Currently held",          icon: FaLock,         iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  { label: "Released",           value: "$680.00",   sub: "Successfully disbursed",  icon: FaCheckCircle,  iconBg: "bg-green-50",  iconColor: "text-green-600"  },
  { label: "Commissions",        value: "$2.25",     sub: "Platform fees collected", icon: FaExchangeAlt,  iconBg: "bg-purple-50", iconColor: "text-purple-600" },
];

function typeBadge(t: string): "info" | "purple" | "neutral" {
  if (t === "Rental Fee") return "info";
  if (t === "Bond") return "purple";
  return "neutral";
}

function escrowBadge(e: string): "warning" | "success" | "neutral" | "danger" {
  const map: Record<string, "warning" | "success" | "neutral" | "danger"> = {
    Held: "warning", Released: "success", Settled: "neutral", Disputed: "danger",
  };
  return map[e] ?? "neutral";
}

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = transactions.filter(
    (t) =>
      (t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.booking.toLowerCase().includes(search.toLowerCase())) &&
      (typeFilter === "All" || t.type === typeFilter)
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Full ledger of rental fees, bonds, commissions and escrow status.
        </p>
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-50 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, booking or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer"
        >
          {["All", "Rental Fee", "Bond", "Commission"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Transaction", "Type", "Booking", "User", "Amount", "Escrow", "Date", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-700">{t.id}</td>
                    <td className="px-5 py-3.5"><Badge variant={typeBadge(t.type)}>{t.type}</Badge></td>
                    <td className="px-5 py-3.5 text-sm font-mono text-gray-500">{t.booking}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{t.user}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">${t.amount.toFixed(2)}</td>
                    <td className="px-5 py-3.5"><Badge variant={escrowBadge(t.escrow)}>{t.escrow}</Badge></td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{t.date}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        {t.escrow === "Held" && (
                          <button className="text-green-600 hover:text-green-800 transition-colors">Release</button>
                        )}
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">Details</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>
    </div>
  );
}
