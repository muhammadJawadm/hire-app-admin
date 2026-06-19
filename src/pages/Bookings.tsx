import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { StatCard } from "../components/ui/StatCard";
import { Modal, FieldLabel, FieldSelect, ModalBtn } from "../components/ui/Modal";
import { FaSearch, FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const bookings = [
  { id: "BK-3921", item: "Sony A7 III Camera",     renter: "Sarah Mitchell", advertiser: "James Turner",  dates: "10–15 Aug", amount: 425, bond: 500, status: "Confirmed" },
  { id: "BK-3920", item: "Mountain Bike",           renter: "Tom Nguyen",     advertiser: "Marcus Reid",   dates: "8–10 Aug",  amount: 90,  bond: 300, status: "Active"    },
  { id: "BK-3919", item: "Camping Tent",            renter: "Emily Chen",     advertiser: "Daniel Brooks", dates: "5–8 Aug",   amount: 105, bond: 150, status: "Completed" },
  { id: "BK-3918", item: "DJI Mavic Drone",         renter: "Sofia Martinez", advertiser: "Priya Sharma",  dates: "12–14 Aug", amount: 240, bond: 800, status: "Pending"   },
  { id: "BK-3917", item: "Paddle Board",            renter: "Sarah Mitchell", advertiser: "Marcus Reid",   dates: "1–3 Aug",   amount: 110, bond: 250, status: "Completed" },
  { id: "BK-3916", item: "Canon 70-200mm Lens",     renter: "Oliver Walsh",   advertiser: "James Turner",  dates: "20–22 Jul", amount: 120, bond: 400, status: "Cancelled" },
  { id: "BK-3915", item: "GoPro Hero 11",           renter: "Aisha Okonkwo",  advertiser: "Priya Sharma",  dates: "18–20 Jul", amount: 60,  bond: 200, status: "Completed" },
  { id: "BK-3914", item: "Road Bike – Specialized", renter: "Tom Nguyen",     advertiser: "Aisha Okonkwo", dates: "15–17 Jul", amount: 80,  bond: 300, status: "Completed" },
];

type Booking = (typeof bookings)[0];
type ModalState =
  | { type: "view";   booking: Booking }
  | { type: "cancel"; booking: Booking }
  | null;

function statusBadge(s: string): "warning" | "info" | "success" | "neutral" | "danger" {
  const m: Record<string, "warning" | "info" | "success" | "neutral" | "danger"> = {
    Pending: "warning", Confirmed: "info", Active: "success", Completed: "neutral", Cancelled: "danger",
  };
  return m[s] ?? "neutral";
}

/* ── Modal content ──────────────────────────────────────────────────── */

function ViewBookingContent({ booking }: { booking: Booking }) {
  const commission = +(booking.amount * 0.025).toFixed(2);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs text-gray-400">Booking ID</p>
          <p className="font-mono text-base font-semibold text-gray-800">{booking.id}</p>
        </div>
        <Badge variant={statusBadge(booking.status)}>{booking.status}</Badge>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Item</p>
        <p className="text-sm font-semibold text-gray-900">{booking.item}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          { label: "Renter",     value: booking.renter     },
          { label: "Advertiser", value: booking.advertiser },
          { label: "Dates",      value: `${booking.dates} 2024` },
          { label: "Duration",   value: "5 days"           },
        ].map((d) => (
          <div key={d.label}>
            <p className="text-xs text-gray-400">{d.label}</p>
            <p className="mt-0.5 font-medium text-gray-800">{d.value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Fee Breakdown</p>
        <div className="space-y-2 rounded-xl border border-gray-100 p-4">
          {[
            { label: "Rental Fee",        value: `$${booking.amount.toFixed(2)}`     },
            { label: "Platform Commission (2.5%)", value: `$${commission.toFixed(2)}` },
            { label: "Bond (held separately)",     value: `$${booking.bond.toFixed(2)}` },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{r.label}</span>
              <span className="font-medium text-gray-800">{r.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
            <span className="font-semibold text-gray-800">Total Charged</span>
            <span className="text-base font-bold text-gray-900">${(booking.amount + commission).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CancelBookingContent({ booking }: { booking: Booking }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
        <FaExclamationTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Cancel booking {booking.id}?</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Both renter and advertiser will be notified. Escrow funds will be returned to the renter.
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
        <p className="font-medium text-gray-900">{booking.item}</p>
        <p className="mt-0.5 text-xs text-gray-400">{booking.renter} · {booking.dates} 2024</p>
      </div>
      <div>
        <FieldLabel>Reason for cancellation</FieldLabel>
        <FieldSelect>
          <option value="">Select a reason…</option>
          <option>Admin intervention</option>
          <option>Policy violation</option>
          <option>Renter request</option>
          <option>Advertiser request</option>
          <option>Item unavailable</option>
        </FieldSelect>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Bookings() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal]             = useState<ModalState>(null);

  const filtered = bookings.filter(
    (b) =>
      (b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.item.toLowerCase().includes(search.toLowerCase()) ||
        b.renter.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || b.status === statusFilter)
  );

  const count = (s: string) => bookings.filter((b) => b.status === s).length;

  const modalTitle =
    modal?.type === "view"   ? "Booking Details" :
    modal?.type === "cancel" ? "Cancel Booking"  : "";

  const modalFooter = modal ? (
    <>
      <ModalBtn variant="secondary" onClick={() => setModal(null)}>Close</ModalBtn>
      {modal.type === "cancel" && <ModalBtn variant="danger">Cancel Booking</ModalBtn>}
    </>
  ) : undefined;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">Track rentals from request through to completion.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Bookings" value={String(bookings.length)} sub="All time"               icon={FaCalendarCheck} iconBg="bg-blue-50"   iconColor="text-blue-600"   />
        <StatCard label="Active"         value={String(count("Active"))} sub="Currently renting"      icon={FaCheckCircle}   iconBg="bg-green-50"  iconColor="text-green-600"  />
        <StatCard label="Completed"      value={String(count("Completed"))} sub="Successfully returned" icon={FaCheckCircle} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Cancelled"      value={String(count("Cancelled"))} sub="By renter or admin"    icon={FaTimesCircle} iconBg="bg-red-50"    iconColor="text-red-600"    />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-50 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input type="text" placeholder="Search by ID, item or renter..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer">
          {["All", "Pending", "Confirmed", "Active", "Completed", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Booking ID", "Item", "Renter", "Advertiser", "Dates", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">No bookings match your filters.</td></tr>
              ) : filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-sm font-medium text-gray-700">{b.id}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-800">{b.item}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{b.renter}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{b.advertiser}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{b.dates}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">${b.amount}</td>
                  <td className="px-5 py-3.5"><Badge variant={statusBadge(b.status)}>{b.status}</Badge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <button onClick={() => setModal({ type: "view", booking: b })} className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                      {["Pending", "Confirmed", "Active"].includes(b.status) && (
                        <button onClick={() => setModal({ type: "cancel", booking: b })} className="text-red-500 hover:text-red-700 transition-colors">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {bookings.length} bookings
        </div>
      </div>

      <Modal isOpen={modal !== null} onClose={() => setModal(null)} title={modalTitle} size="md" footer={modalFooter}>
        {modal?.type === "view"   && <ViewBookingContent booking={modal.booking} />}
        {modal?.type === "cancel" && <CancelBookingContent booking={modal.booking} />}
      </Modal>
    </div>
  );
}
