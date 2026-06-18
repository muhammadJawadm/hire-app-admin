import { useState } from "react";
import { Badge } from "../components/ui/Badge";

const reviews = [
  { id: 1, booking: "BK-3919", item: "Camping Tent",        reviewer: "Emily Chen",     reviewee: "Daniel Brooks", rating: 4, comment: "Great quality item, minor wear marks.",               status: "Visible" },
  { id: 2, booking: "BK-3917", item: "Paddle Board",         reviewer: "Sarah Mitchell", reviewee: "Marcus Reid",   rating: 5, comment: "Absolutely brilliant, highly recommend!",               status: "Visible" },
  { id: 3, booking: "BK-3915", item: "GoPro Hero 11",        reviewer: "Aisha Okonkwo",  reviewee: "Priya Sharma",  rating: 3, comment: "Worked fine but battery was very low on arrival.",       status: "Visible" },
  { id: 4, booking: "BK-3914", item: "Road Bike",            reviewer: "Tom Nguyen",     reviewee: "Aisha Okonkwo", rating: 2, comment: "Multiple gear issues, very disappointing experience.",   status: "Flagged" },
  { id: 5, booking: "BK-3912", item: "Sony A7 III Camera",  reviewer: "Daniel Brooks",  reviewee: "James Turner",  rating: 5, comment: "Absolutely perfect, pristine condition!",               status: "Visible" },
  { id: 6, booking: "BK-3910", item: "Camping Tent",        reviewer: "Marcus Reid",    reviewee: "Daniel Brooks", rating: 1, comment: "Tent had a rip, advertiser refused all responsibility.", status: "Flagged" },
];

const disputes = [
  { id: "DSP-201", booking: "BK-3910", type: "Bond Refund",       parties: "Marcus Reid vs Daniel Brooks",   priority: "High",   status: "Open",         opened: "6 Aug 2024"  },
  { id: "DSP-200", booking: "BK-3916", type: "Item Damage",        parties: "Oliver Walsh vs James Turner",   priority: "Medium", status: "Under Review", opened: "23 Jul 2024" },
  { id: "DSP-199", booking: "BK-3908", type: "No Show",            parties: "Priya Sharma vs Tom Nguyen",     priority: "Low",    status: "Resolved",     opened: "18 Jul 2024" },
  { id: "DSP-198", booking: "BK-3905", type: "Not as Described",   parties: "Emily Chen vs Marcus Reid",      priority: "High",   status: "Escalated",    opened: "10 Jul 2024" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating}/5</span>
    </div>
  );
}

function priorityBadge(p: string): "danger" | "warning" | "info" {
  if (p === "High") return "danger";
  if (p === "Medium") return "warning";
  return "info";
}

function disputeStatusBadge(s: string): "warning" | "info" | "success" | "danger" {
  const map: Record<string, "warning" | "info" | "success" | "danger"> = {
    Open: "warning", "Under Review": "info", Resolved: "success", Escalated: "danger",
  };
  return map[s] ?? "info";
}

type Tab = "reviews" | "disputes";

export default function Reviews() {
  const [activeTab, setActiveTab] = useState<Tab>("reviews");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews &amp; Disputes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Moderate user reviews and manage dispute resolution workflows.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total Reviews", value: reviews.length, color: "bg-blue-50 text-blue-700" },
          { label: "Flagged Reviews", value: reviews.filter((r) => r.status === "Flagged").length, color: "bg-red-50 text-red-700" },
          { label: "Open Disputes", value: disputes.filter((d) => d.status === "Open" || d.status === "Under Review").length, color: "bg-orange-50 text-orange-700" },
          { label: "Resolved Disputes", value: disputes.filter((d) => d.status === "Resolved").length, color: "bg-green-50 text-green-700" },
        ].map((c) => (
          <div key={c.label} className={`rounded-lg px-4 py-2.5 ${c.color}`}>
            <span className="text-xl font-bold">{c.value}</span>
            <span className="ml-2 text-xs font-medium opacity-75">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex border-b border-gray-100">
          {(["reviews", "disputes"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab === "reviews" ? `Reviews (${reviews.length})` : `Disputes (${disputes.length})`}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {activeTab === "reviews" ? (
            <table className="min-w-full">
              <thead className="bg-gray-50/70">
                <tr>
                  {["Item", "Reviewer → Reviewee", "Rating", "Comment", "Status", "Actions"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900">{r.item}</p>
                      <p className="text-xs text-gray-400">{r.booking}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">
                      <span className="font-medium">{r.reviewer}</span>
                      <span className="mx-1.5 text-gray-300">→</span>
                      <span>{r.reviewee}</span>
                    </td>
                    <td className="px-5 py-3.5"><Stars rating={r.rating} /></td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-sm text-gray-600 truncate">{r.comment}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={r.status === "Visible" ? "success" : "danger"}>{r.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        {r.status === "Visible" ? (
                          <button className="text-red-500 hover:text-red-700 transition-colors">Hide</button>
                        ) : (
                          <button className="text-green-600 hover:text-green-800 transition-colors">Restore</button>
                        )}
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50/70">
                <tr>
                  {["Dispute ID", "Booking", "Type", "Parties", "Priority", "Status", "Opened", "Actions"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-700">{d.id}</td>
                    <td className="px-5 py-3.5 text-sm font-mono text-gray-500">{d.booking}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-700">{d.type}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{d.parties}</td>
                    <td className="px-5 py-3.5"><Badge variant={priorityBadge(d.priority)}>{d.priority}</Badge></td>
                    <td className="px-5 py-3.5"><Badge variant={disputeStatusBadge(d.status)}>{d.status}</Badge></td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{d.opened}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">Review</button>
                        {d.status !== "Resolved" && (
                          <button className="text-green-600 hover:text-green-800 transition-colors">Resolve</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
