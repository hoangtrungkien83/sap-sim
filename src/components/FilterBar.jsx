import { useFinanceContext } from '../store/financeContextStore';
import { COMPANY_CODES, LEDGERS, FISCAL_YEARS, PERIODS } from '../data/mockData';

/**
 * FilterBar — Global Filter Bar dùng chung cho Balance Sheet, Income
 * Statement, Journal Entries Overview (và bất kỳ module Finance khác
 * trong tương lai).
 *
 * Hành vi mô phỏng đúng SAP GUI: đổi dropdown chỉ cập nhật `draftFilters`
 * (chưa ảnh hưởng dữ liệu hiển thị). Chỉ khi bấm "Go" mới gọi `go()` của
 * financeContextStore, copy draft → active sau 1 khoảng delay giả lập
 * network round-trip — lúc đó MỌI module đang mount (Balance Sheet,
 * Income Statement, Journal Entries) đều tự động re-render theo
 * activeFilters mới, vì cùng đọc 1 global store.
 */
export default function FilterBar() {
  const draftFilters = useFinanceContext((s) => s.draftFilters);
  const setDraftFilter = useFinanceContext((s) => s.setDraftFilter);
  const isLoading = useFinanceContext((s) => s.isLoading);
  const go = useFinanceContext((s) => s.go);

  const handle = (key) => (e) => setDraftFilter(key, e.target.value);

  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-4 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Company Code</label>
          <select
            value={draftFilters.companyCode}
            onChange={handle('companyCode')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            {COMPANY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Ledger</label>
          <select
            value={draftFilters.ledger}
            onChange={handle('ledger')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            {LEDGERS.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Fiscal Year</label>
          <select
            value={draftFilters.fiscalYear}
            onChange={handle('fiscalYear')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            {FISCAL_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Period</label>
          <select
            value={draftFilters.period}
            onChange={handle('period')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            <option value="ALL">All Periods</option>
            {PERIODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={go}
            disabled={isLoading}
            className="w-full bg-[var(--fiori-link)] text-white text-sm font-medium px-4 py-1.5 rounded hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <i className="ti ti-loader-2 animate-spin text-base" aria-hidden="true" />
                Loading...
              </>
            ) : (
              <>
                <i className="ti ti-player-play text-base" aria-hidden="true" />
                Go
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
