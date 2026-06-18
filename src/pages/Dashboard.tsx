import { Link } from "react-router";
import { StatCard } from "../components/ui/StatCard";
import {
  FaUsers, FaClipboardList, FaCalendarCheck, FaHourglassHalf,
  FaDollarSign, FaLock, FaShieldAlt,
  FaUserPlus, FaCheckCircle, FaFlag, FaExclamationCircle, FaArrowRight,
} from "react-icons/fa";

const kpiStats = [
  { label: "Total Users",            value: "3,842", sub: "↑ 12% from last month",  icon: FaUsers,          iconBg: "bg-blue-50",   iconColor: "text-blue-600"   },
  { label: "Active Listings",        value: "1,267", sub: "↑ 8% from last month",   icon: FaClipboardList,  iconBg: "bg-green-50",  iconColor: "text-green-600"  },
  { label: "Active Rentals",         value: "234",   sub: "↑ 5% from last month",   icon: FaCalendarCheck,  iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  { label: "Pending Verifications",  value: "47",    sub: "Requires attention",      icon: FaHourglassHalf,  iconBg: "bg-yellow-50", iconColor: "text-yellow-600" },
];

const financialStats = [
  { label: "Commission Earned", value: "$28,492",  sub: "This month · 2.5% rate",         icon: FaDollarSign, iconBg: "bg-blue-50",   iconColor: "text-blue-600"   },
  { label: "Escrow Held",       value: "$142,380", sub: "Across 234 active rentals",      icon: FaLock,       iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  { label: "Bonds Held",        value: "$89,750",  sub: "Across 189 active rentals",      icon: FaShieldAlt,  iconBg: "bg-red-50",    iconColor: "text-red-600"    },
];

const activities = [
  { id: 1, icon: FaUserPlus,        iconBg: "bg-blue-50",   iconColor: "text-blue-500",   text: "Sarah Mitchell signed up as Advertiser",                    time: "2 min ago"  },
  { id: 2, icon: FaCheckCircle,     iconBg: "bg-green-50",  iconColor: "text-green-500",  text: "Booking #BK-3921 confirmed — Sony A7 III Camera",           time: "15 min ago" },
  { id: 3, icon: FaFlag,            iconBg: "bg-red-50",    iconColor: "text-red-500",    text: "Listing #L-1204 flagged for policy violation",               time: "32 min ago" },
  { id: 4, icon: FaCheckCircle,     iconBg: "bg-purple-50", iconColor: "text-purple-500", text: "James Turner identity verification approved",                time: "1 hr ago"   },
  { id: 5, icon: FaExclamationCircle, iconBg: "bg-orange-50", iconColor: "text-orange-500", text: "Dispute DSP-201 opened for booking #BK-3910",             time: "2 hrs ago"  },
  { id: 6, icon: FaUserPlus,        iconBg: "bg-blue-50",   iconColor: "text-blue-500",   text: "Tom Nguyen signed up as Renter",                            time: "3 hrs ago"  },
];

const quickActions = [
  { label: "Pending Verifications", count: 47, path: "/users",        colors: "border-yellow-400 bg-yellow-50 text-yellow-700" },
  { label: "Flagged Listings",      count: 3,  path: "/listings",     colors: "border-red-400 bg-red-50 text-red-700"           },
  { label: "Open Disputes",         count: 5,  path: "/reviews",      colors: "border-orange-400 bg-orange-50 text-orange-700"  },
  { label: "Pending Bookings",      count: 12, path: "/bookings",     colors: "border-blue-400 bg-blue-50 text-blue-700"        },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back — here is today's overview.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Financial snapshot */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Financial Snapshot
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {financialStats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Activity + Quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity feed */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent Activity</h2>
            <span className="text-xs text-gray-400">Live feed</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {activities.map((a) => (
              <li key={a.id} className="flex items-start gap-3.5 px-5 py-3.5">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.iconBg}`}>
                  <a.icon size={13} className={a.iconColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Needs attention */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-800">Needs Attention</h2>
          </div>
          <div className="space-y-3 p-4">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.path}
                className={`flex items-center justify-between rounded-lg border-l-4 px-4 py-3.5 transition-opacity hover:opacity-75 ${a.colors}`}
              >
                <div>
                  <p className="text-xs font-medium opacity-75">{a.label}</p>
                  <p className="text-2xl font-bold">{a.count}</p>
                </div>
                <FaArrowRight size={13} className="opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
