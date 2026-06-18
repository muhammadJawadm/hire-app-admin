import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { FaSearch } from "react-icons/fa";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-rose-500", "bg-indigo-500",
];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name: string) => {
  const p = name.trim().split(" ");
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
};

const users = [
  { id: 1,  name: "Sarah Mitchell", email: "sarah@example.com",   role: "Renter",     verification: "Verified", status: "Active",    joined: "15 Jan 2024" },
  { id: 2,  name: "James Turner",   email: "james@example.com",   role: "Advertiser", verification: "Pending",  status: "Active",    joined: "3 Feb 2024"  },
  { id: 3,  name: "Emily Chen",     email: "emily@example.com",   role: "Renter",     verification: "Verified", status: "Active",    joined: "22 Nov 2023" },
  { id: 4,  name: "Marcus Reid",    email: "marcus@example.com",  role: "Advertiser", verification: "Verified", status: "Active",    joined: "7 Mar 2024"  },
  { id: 5,  name: "Oliver Walsh",   email: "oliver@example.com",  role: "Renter",     verification: "Rejected", status: "Suspended", joined: "1 Apr 2024"  },
  { id: 6,  name: "Priya Sharma",   email: "priya@example.com",   role: "Advertiser", verification: "Verified", status: "Active",    joined: "18 Dec 2023" },
  { id: 7,  name: "Tom Nguyen",     email: "tom@example.com",     role: "Renter",     verification: "Pending",  status: "Active",    joined: "25 May 2024" },
  { id: 8,  name: "Aisha Okonkwo",  email: "aisha@example.com",   role: "Both",       verification: "Verified", status: "Active",    joined: "9 Jun 2024"  },
  { id: 9,  name: "Daniel Brooks",  email: "daniel@example.com",  role: "Advertiser", verification: "Verified", status: "Suspended", joined: "2 Feb 2024"  },
  { id: 10, name: "Sofia Martinez", email: "sofia@example.com",   role: "Renter",     verification: "Verified", status: "Active",    joined: "14 Jul 2024" },
];

function roleBadge(role: string): "info" | "purple" | "orange" {
  if (role === "Advertiser") return "purple";
  if (role === "Both") return "orange";
  return "info";
}

function verificationBadge(v: string): "success" | "warning" | "danger" {
  if (v === "Verified") return "success";
  if (v === "Pending") return "warning";
  return "danger";
}

export default function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = users.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "All" || u.role === roleFilter) &&
      (statusFilter === "All" || u.status === statusFilter)
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage renters, advertisers and identity verifications.
        </p>
      </div>

      {/* Filters */}
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
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer"
        >
          {["All", "Renter", "Advertiser", "Both"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer"
        >
          {["All", "Active", "Suspended"].map((s) => (
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
                {["User", "Role", "Verification", "Status", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 shrink-0 rounded-full ${avatarColor(u.name)} flex items-center justify-center text-xs font-semibold text-white`}
                        >
                          {initials(u.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={roleBadge(u.role)}>{u.role}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={verificationBadge(u.verification)}>{u.verification}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={u.status === "Active" ? "success" : "danger"}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">
                      {u.joined}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                        {u.verification === "Pending" && (
                          <button className="text-green-600 hover:text-green-800 transition-colors">Approve</button>
                        )}
                        <button
                          className={
                            u.status === "Active"
                              ? "text-red-500 hover:text-red-700 transition-colors"
                              : "text-green-500 hover:text-green-700 transition-colors"
                          }
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
