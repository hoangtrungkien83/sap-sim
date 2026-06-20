import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_TABS } from '../data/launchpadData';
import AllMyAppsPanel from './AllMyAppsPanel';

export default function FioriShell({ children }) {
  const location = useLocation();
  const [appsOpen, setAppsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--fiori-page-bg)]">
      {/* Top dark bar */}
      <header className="bg-[var(--fiori-shell-bg)] text-white h-12 flex items-center px-3 gap-4 shrink-0">
        <button className="p-2 hover:bg-white/10 rounded" aria-label="Menu">
          <i className="ti ti-menu-2 text-lg" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="bg-white text-[#354a5f] px-1.5 py-0.5 rounded text-xs font-bold">SAP</span>
        </div>
        <button
          onClick={() => setAppsOpen(true)}
          className="flex items-center gap-1 ml-1 cursor-pointer hover:bg-white/10 rounded px-2 py-1"
        >
          <span className="text-sm">Home</span>
          <i className="ti ti-chevron-down text-xs" aria-hidden="true" />
        </button>
        <div className="flex-1" />
        <button className="p-2 hover:bg-white/10 rounded" aria-label="Search">
          <i className="ti ti-search text-lg" aria-hidden="true" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded" aria-label="Notifications">
          <i className="ti ti-bell text-lg" aria-hidden="true" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded" aria-label="Favorites">
          <i className="ti ti-heart text-lg" aria-hidden="true" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded" aria-label="Help">
          <i className="ti ti-help text-lg" aria-hidden="true" />
        </button>
        <button
          className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-xs font-medium ml-1"
          aria-label="User"
        >
          <i className="ti ti-user text-base" aria-hidden="true" />
        </button>
      </header>

      {/* Nav tabs bar */}
      <nav className="bg-white border-b border-[var(--fiori-nav-border)] h-10 flex items-center px-3 gap-5 shrink-0 overflow-x-auto">
        {NAV_TABS.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.key}
              to={tab.path}
              className={`text-sm whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                active
                  ? 'border-[var(--fiori-nav-active)] text-[var(--fiori-nav-active)] font-medium'
                  : 'border-transparent text-[var(--fiori-text-secondary)] hover:text-[var(--fiori-text-primary)]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Page content */}
      <main className="flex-1 px-6 py-5 max-w-[1400px] w-full mx-auto">{children}</main>

      <AllMyAppsPanel open={appsOpen} onClose={() => setAppsOpen(false)} />
    </div>
  );
}
