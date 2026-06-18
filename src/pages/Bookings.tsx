import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { StatCard } from "../components/ui/StatCard";
import { FaSearch, FaCalendarCheck,  FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const bookings = [
  { id: "BK-3921", item: "Sony A7 III Camera",    renter: "Sarah Mitchell", advertiser: "James Turner",   dates: "10–15 Aug", amount: 425, status: "Confirmed" },
  { id: "BK-3920", item: "Mountain Bike",          renter: "Tom Nguyen",     advertiser: "Marcus Reid",    dates: "8–10 Aug",  amount: 90,  status: "Active"    },
  { id: "BK-3919", item: "Camping Tent",           renter: "Emily Chen",     advertiser: "Daniel Brooks",  dates: "5–8 Aug",   amount: 105, status: "Completed" },
  { id: "BK-3918", item: "DJI Mavic Drone",        renter: "Sofia Martinez", advertiser: "Priya Sharma",   dates: "12–14 Aug", amount: 240, status: "Pending"   },
  { id: "BK-3917", item: "Paddle Board",           renter: "Sarah Mitchell", advertiser: "Marcus Reid",    dates: "1–3 Aug",   amount: 110, status: "Completed" },
  { id: "BK-3916", item: "Canon 70-200mm Lens",    renter: "Oliver Walsh",   advertiser: "James Turner",   dates: "20–22 Jul", amount: 120, status: "Cancelled" },
  { id: "BK-3915", item: "GoPro Hero 11",          renter: "Aisha Okonkwo",  advertiser: "Priya Sharma",   dates: "18–20 Jul", amount: 60,  status: "Completed" },
  { id: "BK-3914", item: "Road Bike – Specialized",renter: "Tom Nguyen",     advertiser: "Aisha Okonkwo",  dates: "15–17 Jul", amount: 80,  status: "Completed" },
];

function statusBadge(s: string): "warning" | "info" | "success" | "neutral" | "danger" {
  const map: Record<string, "warning" | "info" | "success" | "neutral" | "danger"> = {
    Pending: "warning", Confirmed: "info", Active: "success", Completed: "neutral", Cancelled: "danger",
  };
  return map[s] ?? "neutral";
}

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = bookings.filter(
    (b) =>
      (b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.item.toLowerCase().includes(search.toLowerCase()) ||
        b.renter.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || b.status === statusFilter)
  );

  const count = (s: string) => bookings.filter((b) => b.status === s).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">Track rentals from request through to completion.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Bookings"  value={String(bookings.length)} sub="All time"          icon={FaCalendarCheck} iconBg="bg-blue-50"   iconColor="text-blue-600"   />
        <StatCard label="Active"          value={String(count("Active"))} sub="Currently renting" icon={FaCheckCircle}   iconBg="bg-green-50"  iconColor="text-green-600"  />
        <StatCard label="Completed"       value={String(count("Completed"))} sub="Successfully returned" icon={FaCheckCircle} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Cancelled"       value={String(count("Cancelled"))} sub="By renter or admin"    icon={FaTimesCircle} iconBg="bg-red-50"    iconColor="text-red-600"    />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-50 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, item or renter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer"
        >
          {["All", "Pending", "Confirmed", "Active", "Completed", "Cancelled"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Booking ID", "Item", "Renter", "Advertiser", "Dates", "Amount", "Status", "Actions"].map((h) => (
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
                    No bookings match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-700">{b.id}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-800">{b.item}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{b.renter}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{b.advertiser}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{b.dates}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">${b.amount}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusBadge(b.status)}>{b.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                        {["Pending", "Confirmed", "Active"].includes(b.status) && (
                          <button className="text-red-500 hover:text-red-700 transition-colors">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {bookings.length} bookings
        </div>
      </div>
    </div>
  );
}
