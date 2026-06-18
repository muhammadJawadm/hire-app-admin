import { FaBars, FaBell, FaSearch } from "react-icons/fa";

interface HeaderProps {
  onMobileMenuClick: () => void;
  isCollapsed: boolean;
}

export default function Header({ onMobileMenuClick, isCollapsed }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 right-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 transition-all duration-300 ease-in-out
        left-0 ${isCollapsed ? "lg:left-16" : "lg:left-64"}
      `}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuClick}
        className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Open sidebar"
      >
        <FaBars size={17} />
      </button>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 w-72">
        <FaSearch size={13} className="shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <FaBell size={17} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors">
          <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight text-gray-800">Admin</p>
            <p className="text-xs leading-tight text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
