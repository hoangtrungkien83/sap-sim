import { Link } from 'react-router-dom';

/**
 * crumbs: [{ label, path }] — path bỏ trống ở phần tử cuối (trang hiện tại, không click được)
 */
export default function Breadcrumb({ crumbs }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-[var(--fiori-text-secondary)] mb-3" aria-label="Breadcrumb">
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <i className="ti ti-chevron-right text-xs" aria-hidden="true" />}
            {isLast || !c.path ? (
              <span className={isLast ? 'text-[var(--fiori-text-primary)] font-medium' : ''}>{c.label}</span>
            ) : (
              <Link to={c.path} className="hover:text-[var(--fiori-link)] hover:underline">
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
