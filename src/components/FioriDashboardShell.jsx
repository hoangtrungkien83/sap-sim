import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_TABS, tr } from '../data/launchpadData';
import AllMyAppsPanel from './AllMyAppsPanel';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';
import LangSwitcher from './LangSwitcher';
import { useT } from '../hooks/useT';

// FioriDashboardShell — giống FioriShell nhưng thêm nút Dark/Light toggle.
// Toggle ghi class 'fiori-dark' lên <html> và persist vào localStorage.
// Mọi token màu dark mode định nghĩa trong index.css (xem cuối file đó).

export default function FioriDashboardShell({ children }) {
  const location = useLocation();
  const { lang } = useT();
  const [appsOpen,      setAppsOpen]      = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('fiori-dark') === '1'; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('fiori-dark', dark);
    try { localStorage.setItem('fiori-dark', dark ? '1' : '0'); } catch { /* ok */ }
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--fiori-page-bg)]">

      {/* ── Top bar ── */}
      <header className="bg-[var(--fiori-shell-bg)] text-white h-12 flex items-center px-3 gap-2 sm:gap-4 shrink-0">
        <button
          className="p-2 hover:bg-white/10 rounded sm:hidden"
          aria-label="Menu"
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          <i className="ti ti-menu-2 text-lg" aria-hidden="true" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded hidden sm:block" aria-label="Menu">
          <i className="ti ti-menu-2 text-lg" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="bg-white text-[#354a5f] px-1.5 py-0.5 rounded text-xs font-bold">SAP</span>
        </div>

        <button
          onClick={() => setAppsOpen(true)}
          className="hidden sm:flex items-center gap-1 ml-1 cursor-pointer hover:bg-white/10 rounded px-2 py-1"
        >
          <span className="text-sm">{tr(NAV_TABS[0].label, lang)}</span>
          <i className="ti ti-chevron-down text-xs" aria-hidden="true" />
        </button>

        <div className="flex-1" />

        <LangSwitcher />

        {/* Dark / Light toggle */}
        <button
          onClick={() => setDark((v) => !v)}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-white hover:bg-white/10 border border-white/20 transition-colors"
          aria-label={dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'} text-base`} aria-hidden="true" />
          <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
        </button>

        <button
          className="p-2 hover:bg-white/10 rounded"
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
        >
          <i className="ti ti-search text-lg" aria-hidden="true" />
        </button>

        <button
          className="p-2 hover:bg-white/10 rounded relative"
          aria-label="Notifications"
          onClick={() => setNotifOpen((v) => !v)}
        >
          <i className="ti ti-bell text-lg" aria-hidden="true" />
          <span
            className="absolute top-1 right-1 bg-[var(--fiori-danger)] text-white text-[9px] font-bold rounded-full px-1 min-w-[14px] text-center leading-[14px]"
            aria-label="9 notifications"
          >9</span>
        </button>

        <button className="p-2 hover:bg-white/10 rounded hidden sm:block" aria-label="Favorites">
          <i className="ti ti-heart text-lg" aria-hidden="true" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded hidden sm:block" aria-label="Help">
          <i className="ti ti-help text-lg" aria-hidden="true" />
        </button>

        <button
          onClick={() => setAppsOpen(true)}
          className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-xs font-medium ml-1 sm:hidden"
          aria-label="All My Apps"
        >
          <i className="ti ti-grid-dots text-base" aria-hidden="true" />
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-400 hidden sm:flex items-center justify-center text-xs font-medium ml-1 cursor-pointer" title="User">
          <i className="ti ti-user text-base" aria-hidden="true" />
        </div>
      </header>

      {/* ── Nav tabs desktop ── */}
      <nav
        className="hidden sm:flex bg-[var(--fiori-nav-bg)] border-b border-[var(--fiori-nav-border)] h-10 items-center px-3 gap-5 shrink-0 overflow-x-auto"
        aria-label="Module navigation"
      >
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
              {tr(tab.label, lang)}
            </Link>
          );
        })}
      </nav>

      {/* ── Nav tabs mobile ── */}
      {mobileNavOpen && (
        <nav className="sm:hidden bg-[var(--fiori-nav-bg)] border-b border-[var(--fiori-nav-border)] flex flex-col shrink-0">
          {NAV_TABS.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <Link
                key={tab.key}
                to={tab.path}
                onClick={() => setMobileNavOpen(false)}
                className={`text-sm px-4 py-3 border-b border-[var(--fiori-nav-border)] last:border-0 ${
                  active ? 'text-[var(--fiori-nav-active)] font-medium bg-[var(--fiori-page-bg)]' : 'text-[var(--fiori-text-secondary)]'
                }`}
              >
                {tr(tab.label, lang)}
              </Link>
            );
          })}
        </nav>
      )}

      <main className="flex-1 px-3 sm:px-6 py-5 max-w-[1400px] w-full mx-auto">{children}</main>

      <AllMyAppsPanel   open={appsOpen}    onClose={() => setAppsOpen(false)}    />
      <SearchBar        open={searchOpen}  onClose={() => setSearchOpen(false)}  />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)}    />
    </div>
  );
}
