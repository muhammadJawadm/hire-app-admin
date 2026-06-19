import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Modal, FieldLabel, FieldInput, FieldSelect, FieldTextarea, ModalBtn } from "../components/ui/Modal";
import { FaSearch, FaPlus, FaExclamationTriangle } from "react-icons/fa";

const CATEGORY_OPTIONS = ["Electronics", "Sports & Outdoors", "Tools & Equipment", "Music & Audio", "Vehicles", "Party & Events"];

const LISTINGS_DATA = [
  { id: 1, title: "Sony A7 III Camera",      category: "Electronics",      advertiser: "James Turner",   fee: 85,  bond: 500, status: "Available", location: "Sydney CBD"  },
  { id: 2, title: "Mountain Bike – Trek",    category: "Sports & Outdoors", advertiser: "Marcus Reid",    fee: 45,  bond: 300, status: "Rented",    location: "Melbourne"   },
  { id: 3, title: "DJI Mavic Pro Drone",     category: "Electronics",      advertiser: "Priya Sharma",   fee: 120, bond: 800, status: "Available", location: "Brisbane"    },
  { id: 4, title: "Camping Tent (6-person)", category: "Sports & Outdoors", advertiser: "Daniel Brooks",  fee: 35,  bond: 150, status: "Available", location: "Perth"       },
  { id: 5, title: "Canon EF 70-200mm Lens",  category: "Electronics",      advertiser: "James Turner",   fee: 60,  bond: 400, status: "Rented",    location: "Sydney CBD"  },
  { id: 6, title: "Stand Up Paddle Board",   category: "Sports & Outdoors", advertiser: "Marcus Reid",    fee: 55,  bond: 250, status: "Available", location: "Gold Coast"  },
  { id: 7, title: "GoPro Hero 11",           category: "Electronics",      advertiser: "Priya Sharma",   fee: 30,  bond: 200, status: "Available", location: "Adelaide"    },
  { id: 8, title: "Road Bike – Specialized", category: "Sports & Outdoors", advertiser: "Aisha Okonkwo", fee: 40,  bond: 300, status: "Flagged",   location: "Melbourne"   },
];

type Listing = (typeof LISTINGS_DATA)[0];
type ModalState =
  | { type: "view";   listing: Listing }
  | { type: "add" }
  | { type: "remove"; listing: Listing }
  | null;

function statusBadge(s: string): "success" | "info" | "danger" {
  if (s === "Available") return "success";
  if (s === "Rented") return "info";
  return "danger";
}

/* ── Modal content ──────────────────────────────────────────────────── */

function ViewListingContent({ listing }: { listing: Listing }) {
  return (
    <div className="space-y-5">
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
        Listing photo not available
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900">{listing.title}</h4>
        <p className="text-sm text-gray-400">{listing.category}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          { label: "Advertiser", value: listing.advertiser },
          { label: "Location",   value: listing.location   },
          { label: "Daily Fee",  value: `$${listing.fee}/day` },
          { label: "Bond",       value: `$${listing.bond}` },
          { label: "Status",     value: listing.status     },
          { label: "Listing ID", value: `L-${String(listing.id).padStart(4, "0")}` },
        ].map((d) => (
          <div key={d.label}>
            <p className="text-xs text-gray-400">{d.label}</p>
            <p className="mt-0.5 font-medium text-gray-800">{d.value}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Description</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          High-quality item in excellent condition. Regularly maintained and cleaned between rentals. Includes all accessories and original packaging.
        </p>
      </div>
    </div>
  );
}

function AddListingContent() {
  return (
    <div className="space-y-4">
      <div><FieldLabel>Listing Title</FieldLabel><FieldInput placeholder="e.g. Sony A7 III Camera" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Category</FieldLabel>
          <FieldSelect>
            {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
          </FieldSelect>
        </div>
        <div><FieldLabel>Location</FieldLabel><FieldInput placeholder="e.g. Sydney CBD" /></div>
        <div><FieldLabel>Daily Fee ($)</FieldLabel><FieldInput type="number" placeholder="85" min="1" /></div>
        <div><FieldLabel>Bond Amount ($)</FieldLabel><FieldInput type="number" placeholder="500" min="0" /></div>
      </div>
      <div><FieldLabel>Description</FieldLabel><FieldTextarea rows={3} placeholder="Describe the item condition, what's included, etc." /></div>
      <div>
        <FieldLabel>Photos</FieldLabel>
        <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
          Click to upload photos
        </div>
      </div>
    </div>
  );
}

function RemoveListingContent({ listing }: { listing: Listing }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
        <FaExclamationTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Remove this listing?</p>
          <p className="mt-0.5 text-xs text-gray-500">
            This will permanently remove the listing and notify the advertiser. Active bookings must be cancelled first.
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
        <p className="font-medium text-gray-900">{listing.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{listing.category} · {listing.advertiser}</p>
      </div>
      <div>
        <FieldLabel>Reason for removal</FieldLabel>
        <FieldTextarea rows={3} placeholder="Describe the policy violation or reason..." />
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Listings() {
  const [search, setSearch]                 = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [modal, setModal]                   = useState<ModalState>(null);

  const filtered = LISTINGS_DATA.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "All" || l.category === categoryFilter) &&
      (statusFilter === "All" || l.status === statusFilter)
  );

  const modalTitle =
    modal?.type === "view"   ? "Listing Details" :
    modal?.type === "add"    ? "Add Listing"      :
    modal?.type === "remove" ? "Remove Listing"   : "";

  const modalFooter = modal ? (
    <>
      <ModalBtn variant="secondary" onClick={() => setModal(null)}>Cancel</ModalBtn>
      {modal.type === "add"    && <ModalBtn variant="primary">Add Listing</ModalBtn>}
      {modal.type === "remove" && <ModalBtn variant="danger">Remove</ModalBtn>}
    </>
  ) : undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
          <p className="mt-1 text-sm text-gray-500">Browse, approve and moderate all platform listings.</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <FaPlus size={12} /> Add Listing
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-50 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <FaSearch size={13} className="shrink-0 text-gray-400" />
          <input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer">
          {["All", ...CATEGORY_OPTIONS].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none cursor-pointer">
          {["All", "Available", "Rented", "Flagged"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Item", "Advertiser", "Daily Fee", "Bond", "Location", "Status", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">No listings match your filters.</td></tr>
              ) : filtered.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{l.title}</p>
                    <p className="text-xs text-gray-400">{l.category}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">{l.advertiser}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800">${l.fee}/day</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">${l.bond}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{l.location}</td>
                  <td className="px-5 py-3.5"><Badge variant={statusBadge(l.status)}>{l.status}</Badge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <button onClick={() => setModal({ type: "view", listing: l })} className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                      {l.status === "Flagged" && <button className="text-green-600 hover:text-green-800 transition-colors">Approve</button>}
                      <button onClick={() => setModal({ type: "remove", listing: l })} className="text-red-500 hover:text-red-700 transition-colors">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          Showing {filtered.length} of {LISTINGS_DATA.length} listings
        </div>
      </div>

      <Modal isOpen={modal !== null} onClose={() => setModal(null)} title={modalTitle} size={modal?.type === "view" ? "md" : "md"} footer={modalFooter}>
        {modal?.type === "view"   && <ViewListingContent listing={modal.listing} />}
        {modal?.type === "add"    && <AddListingContent />}
        {modal?.type === "remove" && <RemoveListingContent listing={modal.listing} />}
      </Modal>
    </div>
  );
}
