import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaBars, FaBell, FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
  onMobileMenuClick: () => void;
  isCollapsed: boolean;
}

export default function Header({ onMobileMenuClick, isCollapsed }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                     = useRef<HTMLDivElement>(null);
  const navigate                        = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 transition-all duration-300 ease-in-out
        left-0 ${isCollapsed ? "lg:left-16" : "lg:left-64"}
      `}
    >
      {/* Mobile hamburger */}
      <button onClick={onMobileMenuClick}
        className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
        <FaBars size={17} />
      </button>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 w-72">
        <FaSearch size={13} className="shrink-0 text-gray-400" />
        <input type="text" placeholder="Search..."
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Notifications link */}
        <Link to="/notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          title="Push Notifications">
          <FaBell size={17} />
        </Link>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* User chip */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors">
            <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-tight text-gray-800">Admin</p>
              <p className="text-xs leading-tight text-gray-400">Administrator</p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <Link to="/profile" onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <FaUser size={12} className="text-gray-400" /> My Profile
              </Link>
              <div className="my-1 border-t border-gray-100" />
              <button onClick={() => { setDropdownOpen(false); navigate("/login"); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <FaSignOutAlt size={12} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
