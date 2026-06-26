import { useMemo } from 'react';
import { useFinanceContext } from '../store/financeContextStore';
import { queryAcdoca, getAccountInfo } from '../data/mockData';
import EmptyState from './EmptyState';

const fmt = (n) => Number(n || 0).toLocaleString('en-US');

/**
 * JournalEntriesOverview — mô phỏng FB03/FBL3N "Display Document" list:
 * mỗi document (docNumber) hiển thị gộp các dòng Dr/Cr của nó. Dùng
 * activeFilters chung — đổi Company Code/Fiscal Year ở FilterBar lập
 * tức ảnh hưởng danh sách này, đúng yêu cầu đồng bộ xuyên module.
 *
 * Khác với Balance Sheet (cumulative theo period), Journal Entries hiển
 * thị ĐÚNG các document trong period đã chọn (hoặc cả năm nếu ALL) — vì
 * đây là danh sách giao dịch, không phải số dư lũy kế.
 */
export default function JournalEntriesOverview() {
  const activeFilters = useFinanceContext((s) => s.activeFilters);
  const { rows: cumulativeRows, isEmpty } = useMemo(() => queryAcdoca(activeFilters), [activeFilters]);

  const periodRows = useMemo(() => {
    if (activeFilters.period === 'ALL') return cumulativeRows;
    return cumulativeRows.filter((r) => r.period === activeFilters.period);
  }, [cumulativeRows, activeFilters.period]);

  const documents = useMemo(() => {
    const byDoc = new Map();
    for (const row of periodRows) {
      const doc = byDoc.get(row.docNumber) ?? {
        docNumber: row.docNumber,
        postingDate: row.postingDate,
        period: row.period,
        sourceModule: row.sourceModule,
        text: row.text,
        lines: [],
      };
      doc.lines.push(row);
      byDoc.set(row.docNumber, doc);
    }
    return [...byDoc.values()].sort((a, b) => a.docNumber.localeCompare(b.docNumber));
  }, [periodRows]);

  if (isEmpty || documents.length === 0) {
    return <EmptyState filters={activeFilters} />;
  }

  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
            <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Doc Number</th>
            <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Posting Date</th>
            <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Period</th>
            <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Text</th>
            <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Source</th>
            <th className="text-right px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Amount</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <DocumentRow key={doc.docNumber} doc={doc} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentRow({ doc }) {
  const totalDebit = doc.lines.reduce((s, l) => s + l.debitAmount, 0);
  return (
    <tr className="border-b border-[var(--fiori-tile-border)] last:border-0 hover:bg-[var(--fiori-page-bg)] align-top">
      <td className="px-4 py-2 font-medium">{doc.docNumber}</td>
      <td className="px-4 py-2">{doc.postingDate}</td>
      <td className="px-4 py-2">{doc.period}</td>
      <td className="px-4 py-2">
        <p>{doc.text}</p>
        <div className="mt-1 space-y-0.5">
          {doc.lines.map((l, i) => {
            const info = getAccountInfo(l.glAccount);
            return (
              <p key={i} className="text-xs text-[var(--fiori-text-secondary)] font-mono">
                {l.debitAmount ? 'Dr' : 'Cr'} {l.glAccount} — {info.name}
              </p>
            );
          })}
        </div>
      </td>
      <td className="px-4 py-2">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-[var(--fiori-tile-border)] text-[var(--fiori-text-secondary)]">
          {doc.sourceModule}
        </span>
      </td>
      <td className="px-4 py-2 text-right font-medium">{fmt(totalDebit)}</td>
    </tr>
  );
}
