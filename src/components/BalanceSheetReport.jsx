import { useMemo, useState } from 'react';
import { useFinanceContext } from '../store/financeContextStore';
import { queryAcdoca, getAccountInfo } from '../data/mockData';
import EmptyState from './EmptyState';

const fmt = (n) => Number(n || 0).toLocaleString('en-US');

// Thứ tự nhóm hiển thị trên Balance Sheet — Assets trước, rồi Liabilities,
// rồi Equity. PL accounts (Revenue/Expenses) không thuộc Balance Sheet,
// bị lọc ra ở đây và dùng riêng cho Income Statement.
const BS_GROUP_ORDER = ['Assets', 'Liabilities', 'Equity'];

/**
 * BalanceSheetReport — đọc activeFilters từ financeContextStore (KHÔNG
 * tự quản lý filter state riêng nữa), query mockData.js, group theo
 * Assets/Liabilities/Equity, và validate Assets = Liabilities + Equity.
 */
export default function BalanceSheetReport() {
  const activeFilters = useFinanceContext((s) => s.activeFilters);
  const [drilldownAccount, setDrilldownAccount] = useState(null);

  const { rows, isEmpty } = useMemo(() => queryAcdoca(activeFilters), [activeFilters]);

  const groupedRows = useMemo(() => {
    const balanceByAccount = new Map();
    let netIncome = 0;
    for (const row of rows) {
      const info = getAccountInfo(row.glAccount);
      if (info.statementType === 'BS') {
        const prev = balanceByAccount.get(row.glAccount) ?? { ...info, balance: 0, lineCount: 0 };
        // Quy ước số dư: Assets/Expenses tăng bên Debit; Liabilities/Equity/
        // Revenue tăng bên Credit — đúng nguyên lý kế toán kép chuẩn.
        const isDebitNature = info.group === 'Assets';
        const delta = isDebitNature ? row.debitAmount - row.creditAmount : row.creditAmount - row.debitAmount;
        prev.balance += delta;
        prev.lineCount += 1;
        balanceByAccount.set(row.glAccount, prev);
      } else if (info.statementType === 'PL') {
        // Bút toán P&L (Revenue/Expenses) KHÔNG xuất hiện trực tiếp trên
        // Balance Sheet, nhưng Net Income của kỳ phải "khép" (close) vào
        // Retained Earnings trong Equity — đây là nguyên lý kế toán cơ bản
        // (closing entries): Assets = Liabilities + Equity CHỈ đúng khi
        // Equity đã bao gồm lợi nhuận lũy kế trong kỳ. Thiếu bước này sẽ
        // luôn lệch đúng bằng giá trị Net Income — đây là lỗi phổ biến khi
        // mô phỏng Balance Sheet mà quên closing entry.
        netIncome += info.group === 'Revenue' ? row.creditAmount - row.debitAmount : -(row.debitAmount - row.creditAmount);
      }
    }
    // Cộng Net Income lũy kế vào Retained Earnings (33000000) — nếu account
    // này chưa có dòng BS nào trong kỳ (vd company mới), tạo entry mới.
    if (netIncome !== 0) {
      const retainedEarnings = getAccountInfo('33000000');
      const prev = balanceByAccount.get('33000000') ?? { ...retainedEarnings, balance: 0, lineCount: 0 };
      balanceByAccount.set('33000000', { ...prev, balance: prev.balance + netIncome });
    }
    return BS_GROUP_ORDER.map((group) => {
      const groupRows = [...balanceByAccount.values()].filter((r) => r.group === group);
      return { group, rows: groupRows, total: groupRows.reduce((s, r) => s + r.balance, 0) };
    });
  }, [rows]);

  const totalAssets = groupedRows.find((g) => g.group === 'Assets')?.total ?? 0;
  const totalLiabilities = groupedRows.find((g) => g.group === 'Liabilities')?.total ?? 0;
  const totalEquity = groupedRows.find((g) => g.group === 'Equity')?.total ?? 0;
  const totalLiabEquity = totalLiabilities + totalEquity;
  const isBalanced = Math.abs(totalAssets - totalLiabEquity) < 1; // sai số làm tròn

  const drilldownLines = useMemo(() => {
    if (!drilldownAccount) return [];
    return rows.filter((r) => r.glAccount === drilldownAccount.account);
  }, [rows, drilldownAccount]);

  if (isEmpty) {
    return <EmptyState filters={activeFilters} />;
  }

  return (
    <div>
      {/* KPI tổng quan + cảnh báo nếu lệch (về lý thuyết không thể lệch vì
          mỗi document trong mockData.js luôn Dr=Cr, nhưng vẫn validate
          tường minh — đúng tinh thần "Balance Sheet must balance" của yêu
          cầu, không giả định ngầm). */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
          <p className="text-xs text-[var(--fiori-text-secondary)]">Total Assets</p>
          <p className="text-xl font-medium mt-1">{fmt(totalAssets)}</p>
        </div>
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
          <p className="text-xs text-[var(--fiori-text-secondary)]">Total Liabilities + Equity</p>
          <p className="text-xl font-medium mt-1">{fmt(totalLiabEquity)}</p>
        </div>
        <div className={`bg-white border rounded-lg p-3 ${isBalanced ? 'border-[var(--fiori-success)]' : 'border-[var(--fiori-danger)]'}`}>
          <p className="text-xs text-[var(--fiori-text-secondary)]">Balance Check</p>
          <p className={`text-sm font-medium mt-1 flex items-center gap-1 ${isBalanced ? 'text-[var(--fiori-success)]' : 'text-[var(--fiori-danger)]'}`}>
            <i className={`ti ${isBalanced ? 'ti-circle-check' : 'ti-alert-triangle'} text-base`} aria-hidden="true" />
            {isBalanced ? 'Balanced' : `Out of balance by ${fmt(totalAssets - totalLiabEquity)}`}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
              <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Account</th>
              <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Description</th>
              <th className="text-right px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Balance</th>
              <th className="text-right px-4 py-2 font-medium text-[var(--fiori-text-secondary)] w-24">Line Items</th>
            </tr>
          </thead>
          <tbody>
            {groupedRows.map((grp) => (
              <GroupRows key={grp.group} group={grp} onDrilldown={setDrilldownAccount} />
            ))}
          </tbody>
        </table>
      </div>

      {drilldownAccount && (
        <DrilldownDrawer account={drilldownAccount} lines={drilldownLines} onClose={() => setDrilldownAccount(null)} />
      )}
    </div>
  );
}

function GroupRows({ group, onDrilldown }) {
  if (group.rows.length === 0) return null;
  return (
    <>
      <tr className="bg-[var(--fiori-page-bg)]">
        <td colSpan={4} className="px-4 py-1.5 font-medium text-xs text-[var(--fiori-text-secondary)] uppercase tracking-wide">
          {group.group}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.account} className="border-b border-[var(--fiori-tile-border)] last:border-0 hover:bg-[var(--fiori-page-bg)]">
          <td className="px-4 py-2 font-mono text-xs">{row.account}</td>
          <td className="px-4 py-2">{row.name}</td>
          <td className="px-4 py-2 text-right">
            {row.lineCount > 0 ? (
              <button onClick={() => onDrilldown(row)} className="text-[var(--fiori-link)] hover:underline font-medium">
                {fmt(row.balance)}
              </button>
            ) : (
              <span className="text-[var(--fiori-text-secondary)]">{fmt(row.balance)}</span>
            )}
          </td>
          <td className="px-4 py-2 text-right text-[var(--fiori-text-secondary)]">{row.lineCount}</td>
        </tr>
      ))}
      <tr className="border-b-2 border-[var(--fiori-tile-border)]">
        <td colSpan={2} className="px-4 py-1.5 text-right text-xs font-medium text-[var(--fiori-text-secondary)]">
          Total {group.group}
        </td>
        <td className="px-4 py-1.5 text-right text-xs font-medium">{fmt(group.total)}</td>
        <td />
      </tr>
    </>
  );
}

function DrilldownDrawer({ account, lines, onClose }) {
  const totalDebit = lines.reduce((s, l) => s + l.debitAmount, 0);
  const totalCredit = lines.reduce((s, l) => s + l.creditAmount, 0);
  return (
    <div className="fixed inset-0 z-50 flex">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Close" />
      <div className="relative bg-white w-full max-w-3xl ml-auto h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--fiori-tile-border)] px-5 py-4 shrink-0">
          <div>
            <p className="text-xs text-[var(--fiori-text-secondary)]">F0712 — Display Line Items in General Ledger</p>
            <h2 className="text-base font-medium text-[var(--fiori-text-primary)]">{account.account} — {account.name}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded" aria-label="Close">
            <i className="ti ti-x text-lg" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
                  <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Doc Number</th>
                  <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Posting Date</th>
                  <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Period</th>
                  <th className="text-right px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Debit</th>
                  <th className="text-right px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Credit</th>
                  <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Source</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i} className="border-b border-[var(--fiori-tile-border)] last:border-0 hover:bg-[var(--fiori-page-bg)]">
                    <td className="px-3 py-2 font-medium">{l.docNumber}</td>
                    <td className="px-3 py-2">{l.postingDate}</td>
                    <td className="px-3 py-2">{l.period}</td>
                    <td className="px-3 py-2 text-right">{l.debitAmount ? fmt(l.debitAmount) : ''}</td>
                    <td className="px-3 py-2 text-right">{l.creditAmount ? fmt(l.creditAmount) : ''}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-[var(--fiori-tile-border)] text-[var(--fiori-text-secondary)]">
                        {l.sourceModule}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--fiori-tile-border)] font-medium bg-[var(--fiori-page-bg)]">
                  <td colSpan={3} className="px-3 py-2 text-right">Total</td>
                  <td className="px-3 py-2 text-right">{fmt(totalDebit)}</td>
                  <td className="px-3 py-2 text-right">{fmt(totalCredit)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
