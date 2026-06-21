import { useState, useMemo } from 'react';
import { useT } from '../hooks/useT';

/**
 * columns: [{ key, label, render?(row), sortable? }]
 * rows: array dữ liệu
 * onRowClick?: (row) => void — nếu có, hàng có thể click để mở Object Page
 * searchPlaceholder: text gợi ý ô tìm kiếm
 * searchKeys: mảng key dùng để lọc full-text (mặc định lọc theo mọi key trong columns)
 */
export default function DataTable({
  columns,
  rows,
  onRowClick,
  searchPlaceholder,
  searchKeys,
  emptyText,
}) {
  const { t } = useT();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const effectivePlaceholder = searchPlaceholder ?? t('table_search');
  const effectiveEmptyText = emptyText ?? t('table_no_results');
  const effectiveSearchKeys = searchKeys ?? columns.map((c) => c.key);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      effectiveSearchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [rows, query, effectiveSearchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av ?? '').localeCompare(String(bv ?? ''))
        : String(bv ?? '').localeCompare(String(av ?? ''));
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="relative flex-1 max-w-xs">
          <i
            className="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[var(--fiori-text-secondary)]"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={effectivePlaceholder}
            className="w-full border border-[var(--fiori-tile-border)] rounded pl-8 pr-3 py-1.5 text-sm"
          />
        </div>
        <span className="text-xs text-[var(--fiori-text-secondary)] whitespace-nowrap">
          {sorted.length} / {rows.length} {t('table_items_of')}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-8 text-center text-sm text-[var(--fiori-text-secondary)]">
          {rows.length === 0 ? effectiveEmptyText : `${t('table_no_results')} "${query}"`}
        </div>
      ) : (
        <>
          {/* Desktop/tablet: bảng đầy đủ */}
          <div className="hidden sm:block bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      onClick={() => handleSort(c)}
                      className={`text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)] select-none ${
                        c.sortable ? 'cursor-pointer hover:text-[var(--fiori-text-primary)]' : ''
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {c.label}
                        {c.sortable && sortKey === c.key && (
                          <i
                            className={`ti ${sortDir === 'asc' ? 'ti-arrow-up' : 'ti-arrow-down'} text-xs`}
                            aria-hidden="true"
                          />
                        )}
                        {c.sortable && sortKey !== c.key && (
                          <i className="ti ti-arrows-sort text-xs opacity-30" aria-hidden="true" />
                        )}
                      </span>
                    </th>
                  ))}
                  {onRowClick && <th className="w-8" />}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-[var(--fiori-tile-border)] last:border-0 ${
                      onRowClick ? 'cursor-pointer hover:bg-[var(--fiori-page-bg)]' : 'hover:bg-[var(--fiori-page-bg)]'
                    }`}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-2">
                        {c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}
                    {onRowClick && (
                      <td className="px-2">
                        <i className="ti ti-chevron-right text-[var(--fiori-text-secondary)]" aria-hidden="true" />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: card-list dọc, cột đầu làm tiêu đề chính */}
          <div className="sm:hidden space-y-2">
            {sorted.map((row, i) => {
              const [titleCol, ...restCols] = columns;
              return (
                <div
                  key={row.id ?? i}
                  onClick={() => onRowClick?.(row)}
                  className={`bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3 ${
                    onRowClick ? 'cursor-pointer active:bg-[var(--fiori-page-bg)]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[var(--fiori-text-primary)]">
                      {titleCol.render ? titleCol.render(row) : row[titleCol.key]}
                    </span>
                    {onRowClick && <i className="ti ti-chevron-right text-[var(--fiori-text-secondary)]" aria-hidden="true" />}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {restCols.map((c) => (
                      <div key={c.key} className="text-xs">
                        <dt className="text-[var(--fiori-text-secondary)]">{c.label}</dt>
                        <dd className="text-[var(--fiori-text-primary)]">{c.render ? c.render(row) : row[c.key]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
