import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Modal, FieldLabel, FieldSelect, FieldTextarea, ModalBtn } from "../components/ui/Modal";

const reviews = [
  { id: 1, booking: "BK-3919", item: "Camping Tent",       reviewer: "Emily Chen",     reviewee: "Daniel Brooks", rating: 4, comment: "Great quality item, minor wear marks on the tent poles but otherwise perfect.",                                         status: "Visible" },
  { id: 2, booking: "BK-3917", item: "Paddle Board",        reviewer: "Sarah Mitchell", reviewee: "Marcus Reid",   rating: 5, comment: "Absolutely brilliant, highly recommend! Board was in immaculate condition with all accessories included.",                  status: "Visible" },
  { id: 3, booking: "BK-3915", item: "GoPro Hero 11",       reviewer: "Aisha Okonkwo",  reviewee: "Priya Sharma",  rating: 3, comment: "Worked fine but battery was very low on arrival. Had to spend time charging before use.",                                  status: "Visible" },
  { id: 4, booking: "BK-3914", item: "Road Bike",           reviewer: "Tom Nguyen",     reviewee: "Aisha Okonkwo", rating: 2, comment: "Multiple gear issues from the start. Gears were slipping badly and brakes were worn. Very disappointing experience.",        status: "Flagged" },
  { id: 5, booking: "BK-3912", item: "Sony A7 III Camera",  reviewer: "Daniel Brooks",  reviewee: "James Turner",  rating: 5, comment: "Absolutely perfect. Camera was in pristine condition with all lenses, batteries and a full accessories kit.",                status: "Visible" },
  { id: 6, booking: "BK-3910", item: "Camping Tent",        reviewer: "Marcus Reid",    reviewee: "Daniel Brooks", rating: 1, comment: "Tent had a significant rip along the main seam. Advertiser refused all responsibility and disputed the bond claim.",          status: "Flagged" },
];

const disputes = [
  { id: "DSP-201", booking: "BK-3910", type: "Bond Refund",     parties: "Marcus Reid vs Daniel Brooks", priority: "High",   status: "Open",         opened: "6 Aug 2024"  },
  { id: "DSP-200", booking: "BK-3916", type: "Item Damage",     parties: "Oliver Walsh vs James Turner", priority: "Medium", status: "Under Review", opened: "23 Jul 2024" },
  { id: "DSP-199", booking: "BK-3908", type: "No Show",         parties: "Priya Sharma vs Tom Nguyen",   priority: "Low",    status: "Resolved",     opened: "18 Jul 2024" },
  { id: "DSP-198", booking: "BK-3905", type: "Not as Described",parties: "Emily Chen vs Marcus Reid",    priority: "High",   status: "Escalated",    opened: "10 Jul 2024" },
];

type Review  = (typeof reviews)[0];
type Dispute = (typeof disputes)[0];
type ModalState =
  | { type: "view-review"; review: Review }
  | { type: "resolve";     dispute: Dispute }
  | null;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`h-3.5 w-3.5 ${i <= rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
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
  const m: Record<string, "warning" | "info" | "success" | "danger"> = {
    Open: "warning", "Under Review": "info", Resolved: "success", Escalated: "danger",
  };
  return m[s] ?? "info";
}

/* ── Modal content ──────────────────────────────────────────────────── */

function ViewReviewContent({ review }: { review: Review }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs text-gray-400">Booking</p>
          <p className="font-mono text-sm font-semibold text-gray-800">{review.booking}</p>
        </div>
        <Badge variant={review.status === "Visible" ? "success" : "danger"}>{review.status}</Badge>
      </div>
      <div>
        <p className="text-base font-semibold text-gray-900">{review.item}</p>
        <div className="mt-1"><Stars rating={review.rating} /></div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          { label: "Reviewer", value: review.reviewer },
          { label: "Reviewee", value: review.reviewee },
        ].map((d) => (
          <div key={d.label}>
            <p className="text-xs text-gray-400">{d.label}</p>
            <p className="mt-0.5 font-medium text-gray-800">{d.value}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Review Content</p>
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
          &ldquo;{review.comment}&rdquo;
        </div>
      </div>
      {review.status === "Flagged" && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
          This review has been flagged for moderation. Review the content and choose to restore or permanently remove it.
        </div>
      )}
    </div>
  );
}

function ResolveDisputeContent({ dispute }: { dispute: Dispute }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs text-gray-400">Dispute ID</p>
          <p className="font-mono text-sm font-semibold text-gray-800">{dispute.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={priorityBadge(dispute.priority)}>{dispute.priority}</Badge>
          <Badge variant={disputeStatusBadge(dispute.status)}>{dispute.status}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          { label: "Type",    value: dispute.type    },
          { label: "Booking", value: dispute.booking },
          { label: "Parties", value: dispute.parties },
          { label: "Opened",  value: dispute.opened  },
        ].map((d) => (
          <div key={d.label}>
            <p className="text-xs text-gray-400">{d.label}</p>
            <p className="mt-0.5 font-medium text-gray-800">{d.value}</p>
          </div>
        ))}
      </div>
      <div>
        <FieldLabel>Resolution decision</FieldLabel>
        <FieldSelect>
          <option value="">Select outcome…</option>
          <option>Favour renter — full bond refund</option>
          <option>Favour advertiser — bond retained</option>
          <option>Mutual settlement — split bond</option>
          <option>Escalate to legal team</option>
          <option>No action — close dispute</option>
        </FieldSelect>
      </div>
      <div>
        <FieldLabel>Resolution notes</FieldLabel>
        <FieldTextarea rows={3} placeholder="Summarise the evidence reviewed and the reasoning behind your decision..." />
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

type Tab = "reviews" | "disputes";

export default function Reviews() {
  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [modal, setModal]         = useState<ModalState>(null);

  const modalTitle =
    modal?.type === "view-review" ? "Review Details" :
    modal?.type === "resolve"     ? "Resolve Dispute" : "";

  const modalFooter = modal ? (
    <>
      <ModalBtn variant="secondary" onClick={() => setModal(null)}>
        {modal.type === "view-review" ? "Close" : "Cancel"}
      </ModalBtn>
      {modal.type === "view-review" && (
        modal.review.status === "Visible"
          ? <ModalBtn variant="danger">Hide Review</ModalBtn>
          : <ModalBtn variant="primary">Restore Review</ModalBtn>
      )}
      {modal.type === "resolve" && <ModalBtn variant="primary">Submit Resolution</ModalBtn>}
    </>
  ) : undefined;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews &amp; Disputes</h1>
        <p className="mt-1 text-sm text-gray-500">Moderate user reviews and manage dispute resolution workflows.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total Reviews",     value: reviews.length,                                                             color: "bg-blue-50 text-blue-700"   },
          { label: "Flagged Reviews",   value: reviews.filter((r) => r.status === "Flagged").length,                      color: "bg-red-50 text-red-700"     },
          { label: "Open Disputes",     value: disputes.filter((d) => d.status === "Open" || d.status === "Under Review").length, color: "bg-orange-50 text-orange-700" },
          { label: "Resolved Disputes", value: disputes.filter((d) => d.status === "Resolved").length,                    color: "bg-green-50 text-green-700" },
        ].map((c) => (
          <div key={c.label} className={`rounded-lg px-4 py-2.5 ${c.color}`}>
            <span className="text-xl font-bold">{c.value}</span>
            <span className="ml-2 text-xs font-medium opacity-75">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex border-b border-gray-100">
          {(["reviews", "disputes"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"
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
                    <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
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
                    <td className="max-w-xs px-5 py-3.5">
                      <p className="truncate text-sm text-gray-600">{r.comment}</p>
                    </td>
                    <td className="px-5 py-3.5"><Badge variant={r.status === "Visible" ? "success" : "danger"}>{r.status}</Badge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button onClick={() => setModal({ type: "view-review", review: r })} className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                        {r.status === "Visible"
                          ? <button className="text-red-500 hover:text-red-700 transition-colors">Hide</button>
                          : <button className="text-green-600 hover:text-green-800 transition-colors">Restore</button>
                        }
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
                    <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-sm font-medium text-gray-700">{d.id}</td>
                    <td className="px-5 py-3.5 font-mono text-sm text-gray-500">{d.booking}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-700">{d.type}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{d.parties}</td>
                    <td className="px-5 py-3.5"><Badge variant={priorityBadge(d.priority)}>{d.priority}</Badge></td>
                    <td className="px-5 py-3.5"><Badge variant={disputeStatusBadge(d.status)}>{d.status}</Badge></td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{d.opened}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button onClick={() => setModal({ type: "resolve", dispute: d })} className="text-blue-600 hover:text-blue-800 transition-colors">Review</button>
                        {d.status !== "Resolved" && (
                          <button onClick={() => setModal({ type: "resolve", dispute: d })} className="text-green-600 hover:text-green-800 transition-colors">Resolve</button>
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

      <Modal isOpen={modal !== null} onClose={() => setModal(null)} title={modalTitle} size="md" footer={modalFooter}>
        {modal?.type === "view-review" && <ViewReviewContent review={modal.review} />}
        {modal?.type === "resolve"     && <ResolveDisputeContent dispute={modal.dispute} />}
      </Modal>
    </div>
  );
}
