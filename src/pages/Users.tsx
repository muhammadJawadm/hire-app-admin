import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Modal, FieldLabel, FieldInput, FieldSelect, FieldTextarea, ModalBtn } from "../components/ui/Modal";
import { FaSearch, FaPlus, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-rose-500", "bg-indigo-500",
];
const avatarColor = (n: string) => AVATAR_COLORS[n.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (n: string) => {
  const p = n.trim().split(" ");
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
};

const USERS = [
  { id: 1,  name: "Sarah Mitchell", email: "sarah@example.com",  role: "Renter",     verification: "Verified", status: "Active",    joined: "15 Jan 2024" },
  { id: 2,  name: "James Turner",   email: "james@example.com",  role: "Advertiser", verification: "Pending",  status: "Active",    joined: "3 Feb 2024"  },
  { id: 3,  name: "Emily Chen",     email: "emily@example.com",  role: "Renter",     verification: "Verified", status: "Active",    joined: "22 Nov 2023" },
  { id: 4,  name: "Marcus Reid",    email: "marcus@example.com", role: "Advertiser", verification: "Verified", status: "Active",    joined: "7 Mar 2024"  },
  { id: 5,  name: "Oliver Walsh",   email: "oliver@example.com", role: "Renter",     verification: "Rejected", status: "Suspended", joined: "1 Apr 2024"  },
  { id: 6,  name: "Priya Sharma",   email: "priya@example.com",  role: "Advertiser", verification: "Verified", status: "Active",    joined: "18 Dec 2023" },
  { id: 7,  name: "Tom Nguyen",     email: "tom@example.com",    role: "Renter",     verification: "Pending",  status: "Active",    joined: "25 May 2024" },
  { id: 8,  name: "Aisha Okonkwo",  email: "aisha@example.com",  role: "Both",       verification: "Verified", status: "Active",    joined: "9 Jun 2024"  },
  { id: 9,  name: "Daniel Brooks",  email: "daniel@example.com", role: "Advertiser", verification: "Verified", status: "Suspended", joined: "2 Feb 2024"  },
  { id: 10, name: "Sofia Martinez", email: "sofia@example.com",  role: "Renter",     verification: "Verified", status: "Active",    joined: "14 Jul 2024" },
];

type User = (typeof USERS)[0];
type ModalState =
  | { type: "view";    user: User }
  | { type: "add" }
  | { type: "approve"; user: User }
  | { type: "suspend"; user: User }
  | null;

function roleBadge(r: string): "info" | "purple" | "orange" {
  if (r === "Advertiser") return "purple";
  if (r === "Both") return "orange";
  return "info";
}
function verificationBadge(v: string): "success" | "warning" | "danger" {
  if (v === "Verified") return "success";
  if (v === "Pending") return "warning";
  return "danger";
}

/* ── Modal content components ───────────────────────────────────────── */

function UserViewContent({ user }: { user: User }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${avatarColor(user.name)}`}>
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-gray-900">{user.name}</h4>
          <p className="text-sm text-gray-400">{user.email}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant={roleBadge(user.role)}>{user.role}</Badge>
            <Badge variant={verificationBadge(user.verification)}>{user.verification}</Badge>
            <Badge variant={user.status === "Active" ? "success" : "danger"}>{user.status}</Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          { label: "User ID",  value: `USR-${String(user.id).padStart(4, "0")}` },
          { label: "Joined",   value: user.joined },
          { label: "Phone",    value: "+61 412 345 678" },
          { label: "Location", value: "Sydney, NSW" },
        ].map((d) => (
          <div key={d.label}>
            <p className="text-xs text-gray-400">{d.label}</p>
            <p className="mt-0.5 font-medium text-gray-800">{d.value}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Identity Documents</p>
        <div className="grid grid-cols-2 gap-3">
          {["Driver's Licence", "Passport / ID"].map((doc) => (
            <div key={doc} className="flex h-20 items-center justify-center rounded-lg border border-dashed border-gray-200 text-xs text-gray-400">
              {doc}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Rentals", value: "12" },
          { label: "Listings", value: user.role === "Renter" ? "0" : "5" },
          { label: "Rating", value: "4.8 ★" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddUserContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><FieldLabel>Full Name</FieldLabel><FieldInput placeholder="e.g. John Smith" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput type="email" placeholder="john@example.com" /></div>
        <div>
          <FieldLabel>Role</FieldLabel>
          <FieldSelect><option>Renter</option><option>Advertiser</option></FieldSelect>
        </div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput placeholder="+61 4XX XXX XXX" /></div>
      </div>
      <div><FieldLabel>Temporary Password</FieldLabel><FieldInput type="password" placeholder="Min. 8 characters" /></div>
    </div>
  );
}

function ApproveContent({ user }: { user: User }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
        <FaCheckCircle size={18} className="mt-0.5 shrink-0 text-green-500" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Approve verification for {user.name}?</p>
          <p className="mt-0.5 text-xs text-gray-500">This unlocks full platform access and marks their status as Verified.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[{ label: "Name", value: user.name }, { label: "Email", value: user.email },
          { label: "Role", value: user.role }, { label: "Applied", value: user.joined }].map((d) => (
          <div key={d.label}>
            <p className="text-xs text-gray-400">{d.label}</p>
            <p className="font-medium text-gray-800">{d.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuspendContent({ user }: { user: User }) {
  const suspending = user.status === "Active";
  return (
    <div className="space-y-4">
      <div className={`flex items-start gap-3 rounded-xl border p-4 ${suspending ? "border-red-100 bg-red-50" : "border-green-100 bg-green-50"}`}>
        <FaExclamationCircle size={18} className={`mt-0.5 shrink-0 ${suspending ? "text-red-500" : "text-green-500"}`} />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {suspending ? `Suspend ${user.name}?` : `Reactivate ${user.name}?`}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {suspending
              ? "The user will immediately lose platform access. This action can be reversed."
              : "The user will regain full platform access."}
          </p>
        </div>
      </div>
      {suspending && (
        <div>
          <FieldLabel>Reason for suspension</FieldLabel>
          <FieldTextarea rows={3} placeholder="Describe the policy violation or reason for suspension..." />
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Users() {
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal]             = useState<ModalState>(null);

  const filtered = USERS.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "All" || u.role === roleFilter) &&
      (statusFilter === "All" || u.status === statusFilter)
  );

  const modalTitle =
    modal?.type === "view"    ? "User Details"        :
    modal?.type === "add"     ? "Add User"             :
    modal?.type === "approve" ? "Approve Verification" :
    modal?.type === "suspend" ? (modal.user.status === "Active" ? "Suspend User" : "Activate User") : "";

  const modalFooter = modal ? (
    <>
      <ModalBtn variant="secondary" onClick={() => setModal(null)}>Cancel</ModalBtn>
      {modal.type === "add"     && <ModalBtn variant="primary">Add User</ModalBtn>}
      {modal.type === "approve" && <ModalBtn variant="primary">Approve</ModalBtn>}
      {modal.type === "suspend" && (
        <ModalBtn variant={modal.user.status === "Active" ? "danger" : "primary"}>
          {modal.user.status === "Active" ? "Suspend" : "Activate"}
        </ModalBtn>
      )}
    </>
  ) : undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage renters, advertisers and identity verifications.</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <FaPlus size={12} /> Add User
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-50 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer">
          {["All", "Renter", "Advertiser", "Both"].map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer">
          {["All", "Active", "Suspended"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["User", "Role", "Verification", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No users match your filters.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 shrink-0 rounded-full ${avatarColor(u.name)} flex items-center justify-center text-xs font-semibold text-white`}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Badge variant={roleBadge(u.role)}>{u.role}</Badge></td>
                  <td className="px-5 py-3.5"><Badge variant={verificationBadge(u.verification)}>{u.verification}</Badge></td>
                  <td className="px-5 py-3.5"><Badge variant={u.status === "Active" ? "success" : "danger"}>{u.status}</Badge></td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{u.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <button onClick={() => setModal({ type: "view", user: u })} className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                      {u.verification === "Pending" && (
                        <button onClick={() => setModal({ type: "approve", user: u })} className="text-green-600 hover:text-green-800 transition-colors">Approve</button>
                      )}
                      <button onClick={() => setModal({ type: "suspend", user: u })}
                        className={u.status === "Active" ? "text-red-500 hover:text-red-700 transition-colors" : "text-green-500 hover:text-green-700 transition-colors"}>
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {USERS.length} users
        </div>
      </div>

      <Modal isOpen={modal !== null} onClose={() => setModal(null)} title={modalTitle} footer={modalFooter}>
        {modal?.type === "view"    && <UserViewContent user={modal.user} />}
        {modal?.type === "add"     && <AddUserContent />}
        {modal?.type === "approve" && <ApproveContent user={modal.user} />}
        {modal?.type === "suspend" && <SuspendContent user={modal.user} />}
      </Modal>
    </div>
  );
}
