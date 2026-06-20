import { useNavigate } from 'react-router-dom';

/**
 * ObjectPage: khung trang chi tiết kiểu Fiori Object Page.
 *
 * title: tiêu đề chính (vd: "Purchase Order 4500017001")
 * subtitle: dòng phụ (vd: tên vendor)
 * status: <StatusBadge /> hoặc node bất kỳ đặt cạnh tiêu đề
 * keyFacts: [{ label, value }] — dải số liệu chính hiển thị ngang dưới header
 * actions: [{ label, onClick, icon?, primary? }] — nút hành động
 * children: các section chi tiết (dùng <ObjectSection> bên trong)
 */
export default function ObjectPage({ title, subtitle, status, keyFacts = [], actions = [], children }) {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-[var(--fiori-text-secondary)] hover:text-[var(--fiori-text-primary)] mb-2"
      >
        <i className="ti ti-arrow-left text-base" aria-hidden="true" />
        Back
      </button>

      <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 mb-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium text-[var(--fiori-text-primary)]">{title}</h1>
              {status}
            </div>
            {subtitle && <p className="text-sm text-[var(--fiori-text-secondary)] mt-0.5">{subtitle}</p>}
          </div>
          {actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className={
                    a.primary
                      ? 'bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90 flex items-center gap-1'
                      : 'border border-[var(--fiori-tile-border)] text-sm px-3 py-1.5 rounded hover:bg-gray-50 flex items-center gap-1'
                  }
                >
                  {a.icon && <i className={`ti ${a.icon} text-base`} aria-hidden="true" />}
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {keyFacts.length > 0 && (
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 pt-4 border-t border-[var(--fiori-tile-border)]">
            {keyFacts.map((f) => (
              <div key={f.label}>
                <p className="text-xs text-[var(--fiori-text-secondary)]">{f.label}</p>
                <p className="text-sm font-medium text-[var(--fiori-text-primary)] mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5">{children}</div>
    </div>
  );
}

export function ObjectSection({ title, children, action }) {
  return (
    <section className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--fiori-tile-border)]">
        <h2 className="text-sm font-medium text-[var(--fiori-text-primary)]">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
