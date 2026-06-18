import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const initialCategories = [
  { id: 1, name: "Electronics",      description: "Cameras, drones, audio gear and gadgets", listings: 342, searches: 1203, status: "Active"   },
  { id: 2, name: "Sports & Outdoors", description: "Bikes, boards, camping and sporting gear",  listings: 218, searches: 876,  status: "Active"   },
  { id: 3, name: "Tools & Equipment", description: "Power tools, hand tools and machinery",     listings: 189, searches: 542,  status: "Active"   },
  { id: 4, name: "Music & Audio",     description: "Instruments, PA systems and studio gear",   listings: 97,  searches: 381,  status: "Active"   },
  { id: 5, name: "Vehicles",          description: "Cars, vans, trailers and transport",        listings: 54,  searches: 287,  status: "Active"   },
  { id: 6, name: "Party & Events",    description: "Lighting, decorations and event supplies",  listings: 73,  searches: 219,  status: "Inactive" },
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);

  const toggleStatus = (id: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c
      )
    );
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage item categories, usage stats and visibility.
          </p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          <FaPlus size={12} />
          New Category
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Categories",  value: categories.length },
          { label: "Active",            value: categories.filter((c) => c.status === "Active").length },
          { label: "Total Listings",    value: categories.reduce((s, c) => s + c.listings, 0).toLocaleString() },
          { label: "Total Searches",    value: categories.reduce((s, c) => s + c.searches, 0).toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Category", "Listings", "Searches / mo", "Status", "Actions"].map((h) => (
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
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.description}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{c.listings}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{c.searches.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={c.status === "Active" ? "success" : "neutral"}>{c.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <FaEdit size={11} /> Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={c.status === "Active"
                          ? "text-yellow-600 hover:text-yellow-800 transition-colors"
                          : "text-green-600 hover:text-green-800 transition-colors"}
                      >
                        {c.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          {categories.length} categories total
        </div>
      </div>
    </div>
  );
}
