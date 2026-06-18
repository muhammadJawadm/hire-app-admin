import { useState } from "react";
import { FaSave, FaCheckCircle, FaPlus } from "react-icons/fa";

const adminRoles = [
  { name: "Super Admin", email: "admin@hireapp.com",  perms: "Full access" },
  { name: "Mod Team",    email: "mod@hireapp.com",    perms: "Listings, Reviews" },
];

export default function Settings() {
  const [commissionRate, setCommissionRate] = useState("2.5");
  const [bondThreshold, setBondThreshold]   = useState("1000");
  const [notifyEmail, setNotifyEmail]       = useState("admin@hireapp.com");
  const [terms, setTerms]                   = useState(
    "By proceeding with a rental involving a bond that exceeds the threshold, you acknowledge and accept the platform liability waiver and agree that HireApp acts solely as an intermediary."
  );
  const [disclaimer, setDisclaimer]         = useState(
    "HireApp is not liable for damage, loss, theft or disputes arising from peer-to-peer rental transactions. All disputes are handled through the platform mediation process."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure platform-wide rules, commission rates and policy content.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <FaCheckCircle size={14} />
          Settings saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Platform configuration */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Platform Configuration</h2>
            <p className="mt-0.5 text-xs text-gray-400">Global rules applied to all transactions.</p>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-400">Applied to both renter and advertiser sides.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Bond Warning Threshold ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={bondThreshold}
                  onChange={(e) => setBondThreshold(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-400">Shows liability disclaimer above this amount.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Admin Notification Email
                </label>
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Policy content */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Policy Content</h2>
            <p className="mt-0.5 text-xs text-gray-400">Text shown to users during the rental and payment flow.</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Bond Warning Terms
                </label>
                <textarea
                  rows={4}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Liability Disclaimer
                </label>
                <textarea
                  rows={4}
                  value={disclaimer}
                  onChange={(e) => setDisclaimer(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Live config preview */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Active Configuration</h2>
            <div className="mt-4 space-y-3 divide-y divide-gray-100">
              {[
                { label: "Commission (renter)",     value: `${commissionRate}%` },
                { label: "Commission (advertiser)", value: `${commissionRate}%` },
                { label: "Bond threshold",          value: `$${Number(bondThreshold || 0).toLocaleString()}` },
                { label: "Notification email",      value: notifyEmail },
              ].map((c) => (
                <div key={c.label} className="flex items-start justify-between gap-2 pt-3 first:pt-0">
                  <span className="text-xs text-gray-500">{c.label}</span>
                  <span className="text-right text-xs font-semibold text-gray-900 break-all">{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin roles */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Admin Roles</h2>
            <p className="mt-0.5 text-xs text-gray-400">Sub-admin permissions and access levels.</p>
            <div className="mt-4 space-y-2">
              {adminRoles.map((a) => (
                <div
                  key={a.email}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{a.name}</p>
                    <p className="truncate text-xs text-gray-400">{a.email}</p>
                    <p className="text-xs font-medium text-blue-500 mt-0.5">{a.perms}</p>
                  </div>
                  <button className="ml-2 shrink-0 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    Edit
                  </button>
                </div>
              ))}
              <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 py-2 text-xs text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                <FaPlus size={10} /> Add Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save action */}
      <div className="flex justify-end border-t border-gray-100 pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <FaSave size={13} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
