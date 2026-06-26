import { useMemo } from 'react';
import { useFinanceContext } from '../store/financeContextStore';
import { queryAcdoca, getAccountInfo } from '../data/mockData';
import EmptyState from './EmptyState';

const fmt = (n) => Number(n || 0).toLocaleString('en-US');
const PL_GROUP_ORDER = ['Revenue', 'Expenses'];

/**
 * IncomeStatementReport — dùng CÙNG activeFilters từ financeContextStore
 * như Balance Sheet (đúng yêu cầu: chuyển module vẫn giữ Company Code/
 * Fiscal Year context). Khác biệt: chỉ lấy account statementType==='PL',
 * và số liệu KHÔNG cumulative theo period như BS — P&L period-based, chỉ
 * tính các bút toán nằm ĐÚNG period đã chọn (hoặc cả năm nếu 'ALL').
 *
 * Lưu ý kỹ thuật: queryAcdoca() ở mockData.js trả lũy kế (period <= N)
 * để phục vụ Balance Sheet đúng bản chất. Với P&L ta cần lọc lại đúng
 * period (not cumulative) — nên filter thêm 1 lớp ở đây thay vì sửa
 * queryAcdoca (giữ hàm đó đúng nghĩa cho BS, tránh phá vỡ logic dùng chung).
 */
export default function IncomeStatementReport() {
  const activeFilters = useFinanceContext((s) => s.activeFilters);
  const { rows: cumulativeRows, isEmpty } = useMemo(() => queryAcdoca(activeFilters), [activeFilters]);

  const periodRows = useMemo(() => {
    if (activeFilters.period === 'ALL') return cumulativeRows; // year-to-date, toàn bộ kỳ
    return cumulativeRows.filter((r) => r.period === activeFilters.period); // đúng kỳ đã chọn
  }, [cumulativeRows, activeFilters.period]);

  const groupedRows = useMemo(() => {
    const balanceByAccount = new Map();
    for (const row of periodRows) {
      const info = getAccountInfo(row.glAccount);
      if (info.statementType !== 'PL') continue;
      const prev = balanceByAccount.get(row.glAccount) ?? { ...info, balance: 0, lineCount: 0 };
      // Revenue tăng bên Credit; Expenses tăng bên Debit.
      const isCreditNature = info.group === 'Revenue';
      const delta = isCreditNature ? row.creditAmount - row.debitAmount : row.debitAmount - row.creditAmount;
      prev.balance += delta;
      prev.lineCount += 1;
      balanceByAccount.set(row.glAccount, prev);
    }
    return PL_GROUP_ORDER.map((group) => {
      const groupRows = [...balanceByAccount.values()].filter((r) => r.group === group);
      return { group, rows: groupRows, total: groupRows.reduce((s, r) => s + r.balance, 0) };
    });
  }, [periodRows]);

  const totalRevenue = groupedRows.find((g) => g.group === 'Revenue')?.total ?? 0;
  const totalExpenses = groupedRows.find((g) => g.group === 'Expenses')?.total ?? 0;
  const netIncome = totalRevenue - totalExpenses;

  // Empty state riêng cho P&L: có thể BS có data (period <= N) nhưng
  // đúng period N không có bút toán PL nào — phải check periodRows, không
  // dùng isEmpty của queryAcdoca (vốn check trên cumulativeRows).
  if (isEmpty || periodRows.length === 0) {
    return <EmptyState filters={activeFilters} />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
          <p className="text-xs text-[var(--fiori-text-secondary)]">Total Revenue</p>
          <p className="text-xl font-medium mt-1">{fmt(totalRevenue)}</p>
        </div>
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
          <p className="text-xs text-[var(--fiori-text-secondary)]">Total Expenses</p>
          <p className="text-xl font-medium mt-1">{fmt(totalExpenses)}</p>
        </div>
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
          <p className="text-xs text-[var(--fiori-text-secondary)]">Net Income</p>
          <p className={`text-xl font-medium mt-1 ${netIncome >= 0 ? 'text-[var(--fiori-success)]' : 'text-[var(--fiori-danger)]'}`}>
            {fmt(netIncome)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
              <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Account</th>
              <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Description</th>
              <th className="text-right px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {groupedRows.map((grp) =>
              grp.rows.length === 0 ? null : (
                <PlGroup key={grp.group} group={grp} />
              )
            )}
            <tr className="border-t-2 border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
              <td colSpan={2} className="px-4 py-2 font-medium">Net Income</td>
              <td className={`px-4 py-2 text-right font-medium ${netIncome >= 0 ? 'text-[var(--fiori-success)]' : 'text-[var(--fiori-danger)]'}`}>
                {fmt(netIncome)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlGroup({ group }) {
  return (
    <>
      <tr className="bg-[var(--fiori-page-bg)]">
        <td colSpan={3} className="px-4 py-1.5 font-medium text-xs text-[var(--fiori-text-secondary)] uppercase tracking-wide">
          {group.group}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.account} className="border-b border-[var(--fiori-tile-border)] last:border-0 hover:bg-[var(--fiori-page-bg)]">
          <td className="px-4 py-2 font-mono text-xs">{row.account}</td>
          <td className="px-4 py-2">{row.name}</td>
          <td className="px-4 py-2 text-right">{fmt(row.balance)}</td>
        </tr>
      ))}
      <tr className="border-b-2 border-[var(--fiori-tile-border)]">
        <td colSpan={2} className="px-4 py-1.5 text-right text-xs font-medium text-[var(--fiori-text-secondary)]">
          Total {group.group}
        </td>
        <td className="px-4 py-1.5 text-right text-xs font-medium">{fmt(group.total)}</td>
      </tr>
    </>
  );
}
