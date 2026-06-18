import { useState } from "react";
import { FaDownload, FaDollarSign, FaUsers, FaCheckCircle, FaChartLine } from "react-icons/fa";

type Period = "week" | "month" | "year";

const summary: Record<Period, { label: string; value: string; sub: string }[]> = {
  week: [
    { label: "Revenue",         value: "$8,700",  sub: "This week"          },
    { label: "New Users",       value: "84",      sub: "Signed up"          },
    { label: "Completion Rate", value: "79%",     sub: "Of rentals ended ok" },
    { label: "Avg. Booking",    value: "$114",    sub: "Per rental"         },
  ],
  month: [
    { label: "Revenue",         value: "$28,492", sub: "This month"         },
    { label: "New Users",       value: "312",     sub: "Signed up"          },
    { label: "Completion Rate", value: "82%",     sub: "Of rentals ended ok" },
    { label: "Avg. Booking",    value: "$128",    sub: "Per rental"         },
  ],
  year: [
    { label: "Revenue",         value: "$261,492", sub: "This year"         },
    { label: "New Users",       value: "3,842",    sub: "Total"             },
    { label: "Completion Rate", value: "84%",      sub: "Of rentals ended ok"},
    { label: "Avg. Booking",    value: "$121",     sub: "Per rental"        },
  ],
};

const summaryIcons = [FaDollarSign, FaUsers, FaCheckCircle, FaChartLine];
const summaryColors = [
  { bg: "bg-blue-50",   color: "text-blue-600"   },
  { bg: "bg-purple-50", color: "text-purple-600" },
  { bg: "bg-green-50",  color: "text-green-600"  },
  { bg: "bg-orange-50", color: "text-orange-600" },
];

const monthlyRevenue = [
  { month: "Jan", value: 4200  },
  { month: "Feb", value: 5100  },
  { month: "Mar", value: 6800  },
  { month: "Apr", value: 7200  },
  { month: "May", value: 8900  },
  { month: "Jun", value: 9400  },
  { month: "Jul", value: 11200 },
  { month: "Aug", value: 8700  },
];

const categoryRevenue = [
  { name: "Electronics",     value: 18420 },
  { name: "Sports & Outdoors", value: 9840 },
  { name: "Tools",           value: 6230  },
  { name: "Vehicles",        value: 4560  },
  { name: "Music & Audio",   value: 3180  },
  { name: "Party & Events",  value: 2190  },
];

const maxMonthly = Math.max(...monthlyRevenue.map((d) => d.value));
const maxCategory = Math.max(...categoryRevenue.map((d) => d.value));

export default function Reports() {
  const [period, setPeriod] = useState<Period>("month");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Aggregate analytics — revenue, growth and category performance.
          </p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
          <FaDownload size={12} />
          Export CSV
        </button>
      </div>

      {/* Period selector */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit shadow-sm">
        {(["week", "month", "year"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all ${
              period === p
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {p === "week" ? "This Week" : p === "month" ? "This Month" : "This Year"}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summary[period].map((s, i) => {
          const Icon = summaryIcons[i];
          const c = summaryColors[i];
          return (
            <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg}`}>
                  <Icon size={18} className={c.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Monthly revenue bar chart */}
        <div className="lg:col-span-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Monthly Revenue</h2>
            <span className="text-xs text-gray-400">Jan – Aug 2024</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {monthlyRevenue.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-gray-500">
                  ${(d.value / 1000).toFixed(1)}k
                </span>
                <div className="w-full flex flex-col justify-end" style={{ height: "112px" }}>
                  <div
                    className="w-full rounded-t-md bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ height: `${(d.value / maxMonthly) * 100}%` }}
                    title={`$${d.value.toLocaleString()}`}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown horizontal bars */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-800">Revenue by Category</h2>
          <div className="space-y-3.5">
            {categoryRevenue.map((d) => (
              <div key={d.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-gray-600">{d.name}</span>
                  <span className="text-xs font-medium text-gray-700">${d.value.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(d.value / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rental completion table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-800">Rental Outcomes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {["Category", "Total Bookings", "Completed", "Cancelled", "Completion Rate", "Revenue"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { cat: "Electronics",      total: 186, completed: 162, cancelled: 24, revenue: 18420 },
                { cat: "Sports & Outdoors", total: 127, completed: 108, cancelled: 19, revenue: 9840  },
                { cat: "Tools",            total: 94,  completed: 79,  cancelled: 15, revenue: 6230  },
                { cat: "Vehicles",         total: 42,  completed: 38,  cancelled: 4,  revenue: 4560  },
                { cat: "Music & Audio",    total: 61,  completed: 49,  cancelled: 12, revenue: 3180  },
              ].map((r) => (
                <tr key={r.cat} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{r.cat}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{r.total}</td>
                  <td className="px-5 py-3.5 text-sm text-green-600 font-medium">{r.completed}</td>
                  <td className="px-5 py-3.5 text-sm text-red-500">{r.cancelled}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-green-500"
                          style={{ width: `${(r.completed / r.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {Math.round((r.completed / r.total) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">${r.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
