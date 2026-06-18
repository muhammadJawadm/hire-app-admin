import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { FaSearch, FaPlus } from "react-icons/fa";

const listings = [
  { id: 1, title: "Sony A7 III Camera",      category: "Electronics",     advertiser: "James Turner",   fee: 85,  bond: 500, status: "Available", location: "Sydney CBD"  },
  { id: 2, title: "Mountain Bike – Trek",    category: "Sports & Outdoors", advertiser: "Marcus Reid",   fee: 45,  bond: 300, status: "Rented",    location: "Melbourne"   },
  { id: 3, title: "DJI Mavic Pro Drone",     category: "Electronics",     advertiser: "Priya Sharma",   fee: 120, bond: 800, status: "Available", location: "Brisbane"    },
  { id: 4, title: "Camping Tent (6-person)", category: "Sports & Outdoors", advertiser: "Daniel Brooks", fee: 35,  bond: 150, status: "Available", location: "Perth"       },
  { id: 5, title: "Canon EF 70-200mm Lens",  category: "Electronics",     advertiser: "James Turner",   fee: 60,  bond: 400, status: "Rented",    location: "Sydney CBD"  },
  { id: 6, title: "Stand Up Paddle Board",   category: "Sports & Outdoors", advertiser: "Marcus Reid",   fee: 55,  bond: 250, status: "Available", location: "Gold Coast"  },
  { id: 7, title: "GoPro Hero 11",           category: "Electronics",     advertiser: "Priya Sharma",   fee: 30,  bond: 200, status: "Available", location: "Adelaide"    },
  { id: 8, title: "Road Bike – Specialized", category: "Sports & Outdoors", advertiser: "Aisha Okonkwo", fee: 40,  bond: 300, status: "Flagged",   location: "Melbourne"   },
];

const categories = ["All", "Electronics", "Sports & Outdoors", "Tools & Equipment", "Music & Audio", "Vehicles", "Party & Events"];
const statuses = ["All", "Available", "Rented", "Flagged"];

function statusBadge(s: string): "success" | "info" | "danger" {
  if (s === "Available") return "success";
  if (s === "Rented") return "info";
  return "danger";
}

export default function Listings() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "All" || l.category === categoryFilter) &&
      (statusFilter === "All" || l.status === statusFilter)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse, approve and moderate all platform listings.
          </p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          <FaPlus size={12} />
          Add Listing
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-50 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer"
        >
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Item", "Advertiser", "Daily Fee", "Bond", "Location", "Status", "Actions"].map((h) => (
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
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                    No listings match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{l.title}</p>
                      <p className="text-xs text-gray-400">{l.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{l.advertiser}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800">${l.fee}/day</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">${l.bond}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{l.location}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusBadge(l.status)}>{l.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                        {l.status === "Flagged" && (
                          <button className="text-green-600 hover:text-green-800 transition-colors">Approve</button>
                        )}
                        <button className="text-red-500 hover:text-red-700 transition-colors">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {listings.length} listings
        </div>
      </div>
    </div>
  );
}
