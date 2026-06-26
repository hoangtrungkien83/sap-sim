import { useState, useMemo, useCallback } from 'react';
import ConceptPanel from '../components/ConceptPanel';
import FilterBar from '../components/FilterBar';
import BalanceSheetReport from '../components/BalanceSheetReport';
import IncomeStatementReport from '../components/IncomeStatementReport';
import JournalEntriesOverview from '../components/JournalEntriesOverview';
import { CONCEPTS } from '../data/conceptData';

/**
 * ============================================================================
 *  SAP S/4HANA — BALANCE SHEET MODULE (mô phỏng ACDOCA / Universal Journal)
 * ============================================================================
 *
 *  File độc lập, copy-paste là chạy được ngay (chỉ cần React 18 + Tailwind).
 *  Giữ nguyên phong cách UI/UX Fiori (token màu, bo góc, spacing) của hệ
 *  thống mô phỏng SAP gốc, nhưng nâng cấp toàn diện thành 4 lớp:
 *
 *  BƯỚC 1 — ACDOCA_SEED + acdoca state: mô hình dữ liệu tập trung duy nhất.
 *           Mỗi dòng = 1 bút toán thật (Universal Journal), mang đủ thông
 *           tin FI (G/L account, company code), CO (cost/profit center),
 *           và nguồn gốc nghiệp vụ MM/SD/FI — đúng triết lý "single source
 *           of truth" của S/4HANA, không tách rời các phân hệ như ECC cũ.
 *
 *  BƯỚC 2 — SmartFilterBar: Company Code / Fiscal Year / Period / Ledger.
 *           Balance Sheet tính lại số dư real-time từ acdoca mỗi khi filter
 *           đổi (useMemo), kèm nút Export to CSV xuất đúng dữ liệu đang lọc.
 *
 *  BƯỚC 3 — Drill-down: số dư trên Balance Sheet là link click được, mở
 *           Line Items Display (mô phỏng Fiori app F0712) liệt kê từng
 *           dòng ACDOCA cấu thành số dư đó.
 *
 *  BƯỚC 4 — FB50 Post Journal Entry: form nhập bút toán nhiều dòng, validate
 *           Debit = Credit, post xong ghi thẳng vào acdoca state → Balance
 *           Sheet tự cập nhật ngay lập tức, không reload trang.
 *
 *  LIÊN KẾT MODULE QUA STATE TẬP TRUNG (giải thích nhanh):
 *  - acdoca (useState) là "database" duy nhất, giữ vai trò ACDOCA thật.
 *  - SmartFilterBar không sửa acdoca — nó chỉ thay đổi bộ filter (companyCode,
 *    fiscalYear, period, ledger), được dùng làm điều kiện lọc.
 *  - balanceSheetRows được tính bằng useMemo, phụ thuộc [acdoca, filters] —
 *    bất kỳ lúc nào acdoca đổi (do FB50 post) hoặc filters đổi (do người
 *    dùng đổi Company Code...), Balance Sheet tự tính lại không cần reload.
 *  - Drill-down (LineItemsDrawer) đọc trực tiếp từ acdoca, lọc theo
 *    glAccount + filters hiện hành — luôn đồng bộ 100% với số dư đang hiển
 *    thị, vì cùng một nguồn dữ liệu và cùng bộ điều kiện lọc.
 *  - FB50 (JournalEntryForm) là điểm GHI duy nhất vào acdoca qua setAcdoca
 *    (dùng functional update để không bao giờ mất dữ liệu cũ). Sau khi post,
 *    toàn bộ cây re-render vì acdoca đổi reference — Balance Sheet, KPI,
 *    Drill-down đều tự đồng bộ ngay lập tức.
 * ============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────
// BƯỚC 1: MÔ HÌNH DỮ LIỆU TẬP TRUNG — ACDOCA (Universal Journal) SEED DATA
// ─────────────────────────────────────────────────────────────────────────
// Mỗi bút toán mang đủ chiều FI (glAccount, companyCode), CO (costCenter /
// profitCenter), và nguồn gốc nghiệp vụ (sourceModule: FI/MM/SD/CO) — đúng
// nguyên lý "1 dòng duy nhất chứa mọi chiều phân tích" của bảng ACDOCA thật,
// thay vì tách rời các bảng BSEG/COEP/... như hệ thống ECC cũ.

const CHART_OF_ACCOUNTS = [
  { account: '100000', name: 'Tiền mặt / Cash and Cash Equivalents', type: 'BS', group: 'Assets' },
  { account: '120000', name: 'Phải thu khách hàng / Accounts Receivable', type: 'BS', group: 'Assets' },
  { account: '200000', name: 'Hàng tồn kho / Inventory', type: 'BS', group: 'Assets' },
  { account: '210000', name: 'Tài sản cố định / Fixed Assets', type: 'BS', group: 'Assets' },
  { account: '300000', name: 'Phải trả người bán / Accounts Payable', type: 'BS', group: 'Liabilities' },
  { account: '310000', name: 'Vay ngắn hạn / Short-term Loans', type: 'BS', group: 'Liabilities' },
  { account: '350000', name: 'Vốn chủ sở hữu / Equity', type: 'BS', group: 'Equity' },
  { account: '400000', name: 'Doanh thu bán hàng / Sales Revenue', type: 'PL', group: 'Revenue' },
  { account: '500000', name: 'Giá vốn hàng bán / Cost of Goods Sold', type: 'PL', group: 'Expenses' },
  { account: '610000', name: 'Chi phí nhân công / Personnel Expenses', type: 'PL', group: 'Expenses' },
  { account: '620000', name: 'Chi phí khấu hao / Depreciation Expense', type: 'PL', group: 'Expenses' },
];

const COMPANY_CODES = [
  { code: '1010', name: 'SAP Germany (1010)' },
  { code: '1710', name: 'SAP US Inc. (1710)' },
];

const LEDGERS = [
  { code: '0L', name: '0L — Leading Ledger (IFRS)' },
  { code: '2L', name: '2L — Local Ledger (Local GAAP)' },
];

const COST_CENTERS = ['CC-1010-PROD', 'CC-1010-LOGI', 'CC-1710-SALES', 'CC-1710-ADMIN', ''];
const PROFIT_CENTERS = ['PC-MFG-VN', 'PC-SALES-EU', 'PC-SALES-US', ''];

let docCounter = 90000010;
const nextDocNumber = () => String(docCounter++);

// 9 bút toán mẫu ban đầu — đủ để Balance Sheet có số liệu ngay khi mở app,
// trải đều nhiều Company Code / Fiscal Year / Period / Ledger / nguồn nghiệp
// vụ (FI thuần, MM goods movement, SD billing, CO cost allocation).
const ACDOCA_SEED = [
  {
    docNumber: '90000001', postingDate: '2026-01-15', companyCode: '1010', fiscalYear: '2026', period: 1, ledger: '0L',
    glAccount: '100000', costCenter: '', profitCenter: 'PC-MFG-VN', debitAmount: 500000000, creditAmount: 0,
    sourceModule: 'FI', text: 'Góp vốn đầu kỳ / Opening capital injection',
  },
  {
    docNumber: '90000001', postingDate: '2026-01-15', companyCode: '1010', fiscalYear: '2026', period: 1, ledger: '0L',
    glAccount: '350000', costCenter: '', profitCenter: 'PC-MFG-VN', debitAmount: 0, creditAmount: 500000000,
    sourceModule: 'FI', text: 'Góp vốn đầu kỳ / Opening capital injection',
  },
  {
    docNumber: '90000002', postingDate: '2026-02-10', companyCode: '1010', fiscalYear: '2026', period: 2, ledger: '0L',
    glAccount: '200000', costCenter: 'CC-1010-LOGI', profitCenter: 'PC-MFG-VN', debitAmount: 84300000, creditAmount: 0,
    sourceModule: 'MM', text: 'Nhập kho NVL từ PO 4500016001 / Goods Receipt',
  },
  {
    docNumber: '90000002', postingDate: '2026-02-10', companyCode: '1010', fiscalYear: '2026', period: 2, ledger: '0L',
    glAccount: '300000', costCenter: '', profitCenter: 'PC-MFG-VN', debitAmount: 0, creditAmount: 84300000,
    sourceModule: 'MM', text: 'Nhập kho NVL từ PO 4500016001 / Goods Receipt',
  },
  {
    docNumber: '90000003', postingDate: '2026-03-05', companyCode: '1010', fiscalYear: '2026', period: 3, ledger: '0L',
    glAccount: '120000', costCenter: '', profitCenter: 'PC-SALES-EU', debitAmount: 270000000, creditAmount: 0,
    sourceModule: 'SD', text: 'Xuất hóa đơn bán hàng SO 30001001 / Billing Document',
  },
  {
    docNumber: '90000003', postingDate: '2026-03-05', companyCode: '1010', fiscalYear: '2026', period: 3, ledger: '0L',
    glAccount: '400000', costCenter: '', profitCenter: 'PC-SALES-EU', debitAmount: 0, creditAmount: 270000000,
    sourceModule: 'SD', text: 'Xuất hóa đơn bán hàng SO 30001001 / Billing Document',
  },
  {
    docNumber: '90000004', postingDate: '2026-03-20', companyCode: '1010', fiscalYear: '2026', period: 3, ledger: '0L',
    glAccount: '500000', costCenter: 'CC-1010-PROD', profitCenter: 'PC-SALES-EU', debitAmount: 189000000, creditAmount: 0,
    sourceModule: 'SD', text: 'Ghi nhận giá vốn theo hóa đơn 90000003 / COGS recognition',
  },
  {
    docNumber: '90000004', postingDate: '2026-03-20', companyCode: '1010', fiscalYear: '2026', period: 3, ledger: '0L',
    glAccount: '200000', costCenter: 'CC-1010-PROD', profitCenter: 'PC-SALES-EU', debitAmount: 0, creditAmount: 189000000,
    sourceModule: 'SD', text: 'Ghi nhận giá vốn theo hóa đơn 90000003 / COGS recognition',
  },
  {
    docNumber: '90000005', postingDate: '2026-04-12', companyCode: '1710', fiscalYear: '2026', period: 4, ledger: '0L',
    glAccount: '610000', costCenter: 'CC-1710-ADMIN', profitCenter: 'PC-SALES-US', debitAmount: 45000000, creditAmount: 0,
    sourceModule: 'CO', text: 'Phân bổ chi phí nhân công Q1 / Payroll cost allocation',
  },
  {
    docNumber: '90000005', postingDate: '2026-04-12', companyCode: '1710', fiscalYear: '2026', period: 4, ledger: '0L',
    glAccount: '100000', costCenter: 'CC-1710-ADMIN', profitCenter: 'PC-SALES-US', debitAmount: 0, creditAmount: 45000000,
    sourceModule: 'CO', text: 'Phân bổ chi phí nhân công Q1 / Payroll cost allocation',
  },
  {
    docNumber: '90000006', postingDate: '2026-05-08', companyCode: '1010', fiscalYear: '2026', period: 5, ledger: '0L',
    glAccount: '210000', costCenter: 'CC-1010-PROD', profitCenter: 'PC-MFG-VN', debitAmount: 320000000, creditAmount: 0,
    sourceModule: 'FI', text: 'Mua sắm tài sản cố định / Fixed asset acquisition',
  },
  {
    docNumber: '90000006', postingDate: '2026-05-08', companyCode: '1010', fiscalYear: '2026', period: 5, ledger: '0L',
    glAccount: '310000', costCenter: '', profitCenter: 'PC-MFG-VN', debitAmount: 0, creditAmount: 320000000,
    sourceModule: 'FI', text: 'Mua sắm tài sản cố định / Fixed asset acquisition',
  },
  {
    docNumber: '90000007', postingDate: '2026-06-01', companyCode: '1010', fiscalYear: '2026', period: 6, ledger: '0L',
    glAccount: '620000', costCenter: 'CC-1010-PROD', profitCenter: 'PC-MFG-VN', debitAmount: 5333333, creditAmount: 0,
    sourceModule: 'CO', text: 'Khấu hao tài sản cố định kỳ 6 / Monthly depreciation run',
  },
  {
    docNumber: '90000007', postingDate: '2026-06-01', companyCode: '1010', fiscalYear: '2026', period: 6, ledger: '0L',
    glAccount: '210000', costCenter: 'CC-1010-PROD', profitCenter: 'PC-MFG-VN', debitAmount: 0, creditAmount: 5333333,
    sourceModule: 'CO', text: 'Khấu hao tài sản cố định kỳ 6 / Monthly depreciation run',
  },
  {
    docNumber: '90000008', postingDate: '2026-03-05', companyCode: '1010', fiscalYear: '2026', period: 3, ledger: '2L',
    glAccount: '120000', costCenter: '', profitCenter: 'PC-SALES-EU', debitAmount: 265000000, creditAmount: 0,
    sourceModule: 'SD', text: 'Bút toán song song theo Local GAAP / Parallel ledger posting',
  },
  {
    docNumber: '90000008', postingDate: '2026-03-05', companyCode: '1010', fiscalYear: '2026', period: 3, ledger: '2L',
    glAccount: '400000', costCenter: '', profitCenter: 'PC-SALES-EU', debitAmount: 0, creditAmount: 265000000,
    sourceModule: 'SD', text: 'Bút toán song song theo Local GAAP / Parallel ledger posting',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Tiện ích dùng chung
// ─────────────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString('vi-VN');

// ─────────────────────────────────────────────────────────────────────────
// BƯỚC 2: SMART FILTER BAR
// ─────────────────────────────────────────────────────────────────────────
function SmartFilterBar({ filters, onChange }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-4 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Company Code</label>
          <select
            value={filters.companyCode}
            onChange={handle('companyCode')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            <option value="ALL">Tất cả / All</option>
            {COMPANY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Fiscal Year</label>
          <select
            value={filters.fiscalYear}
            onChange={handle('fiscalYear')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            {['2025', '2026'].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Period (1–12)</label>
          <select
            value={filters.period}
            onChange={handle('period')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            <option value="ALL">Tất cả kỳ / All periods</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>Period {p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Ledger</label>
          <select
            value={filters.ledger}
            onChange={handle('ledger')}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            {LEDGERS.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BƯỚC 3: DRILL-DOWN — LINE ITEMS DISPLAY (mô phỏng Fiori F0712)
// ─────────────────────────────────────────────────────────────────────────
function LineItemsDrawer({ account, lines, onClose }) {
  if (!account) return null;
  const totalDebit = lines.reduce((s, l) => s + l.debitAmount, 0);
  const totalCredit = lines.reduce((s, l) => s + l.creditAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Đóng" />
      <div className="relative bg-white w-full max-w-3xl ml-auto h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--fiori-tile-border)] px-5 py-4 shrink-0">
          <div>
            <p className="text-xs text-[var(--fiori-text-secondary)]">F0712 — Display Line Items in General Ledger</p>
            <h2 className="text-base font-medium text-[var(--fiori-text-primary)]">
              {account.account} — {account.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded" aria-label="Đóng">
            <i className="ti ti-x text-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <p className="text-sm text-[var(--fiori-text-secondary)] text-center py-12">
              Không có bút toán nào khớp bộ lọc hiện tại cho tài khoản này.
            </p>
          ) : (
            <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
                    <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Doc Number</th>
                    <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Posting Date</th>
                    <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">G/L Account</th>
                    <th className="text-left px-3 py-2 font-medium text-[var(--fiori-text-secondary)]">Cost/Profit Center</th>
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
                      <td className="px-3 py-2">{l.glAccount}</td>
                      <td className="px-3 py-2 text-[var(--fiori-text-secondary)]">
                        {l.costCenter || l.profitCenter || '—'}
                      </td>
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
                    <td colSpan={4} className="px-3 py-2 text-right">Tổng / Total</td>
                    <td className="px-3 py-2 text-right">{fmt(totalDebit)}</td>
                    <td className="px-3 py-2 text-right">{fmt(totalCredit)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BƯỚC 4: FB50 — POST JOURNAL ENTRY
// ─────────────────────────────────────────────────────────────────────────
function emptyLine() {
  return { id: Math.random().toString(36).slice(2), glAccount: CHART_OF_ACCOUNTS[0].account, side: 'debit', amount: '', costCenter: '', profitCenter: '' };
}

function JournalEntryForm({ onPost }) {
  const [companyCode, setCompanyCode] = useState(COMPANY_CODES[0].code);
  const [postingDate, setPostingDate] = useState(new Date().toISOString().slice(0, 10));
  const [ledger, setLedger] = useState('0L');
  const [lines, setLines] = useState([emptyLine(), emptyLine()]);
  const [successMsg, setSuccessMsg] = useState('');

  const totalDebit = lines.reduce((s, l) => s + (l.side === 'debit' ? Number(l.amount || 0) : 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (l.side === 'credit' ? Number(l.amount || 0) : 0), 0);
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

  const updateLine = (id, patch) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };
  const addLine = () => setLines((prev) => [...prev, emptyLine()]);
  const removeLine = (id) => setLines((prev) => (prev.length > 2 ? prev.filter((l) => l.id !== id) : prev));

  const handlePost = () => {
    if (!isBalanced) return;
    const fiscalYear = postingDate.slice(0, 4);
    const period = Number(postingDate.slice(5, 7));
    const docNumber = nextDocNumber();

    const newEntries = lines
      .filter((l) => Number(l.amount) > 0)
      .map((l) => ({
        docNumber,
        postingDate,
        companyCode,
        fiscalYear,
        period,
        ledger,
        glAccount: l.glAccount,
        costCenter: l.costCenter,
        profitCenter: l.profitCenter,
        debitAmount: l.side === 'debit' ? Number(l.amount) : 0,
        creditAmount: l.side === 'credit' ? Number(l.amount) : 0,
        sourceModule: 'FI',
        text: `Bút toán thủ công FB50 / Manual journal entry ${docNumber}`,
      }));

    onPost(newEntries);
    setSuccessMsg(`Đã ghi sổ thành công — Document ${docNumber}. Balance Sheet đã cập nhật ngay lập tức.`);
    setLines([emptyLine(), emptyLine()]);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <i className="ti ti-pencil-plus text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h2 className="text-base font-medium">FB50 — Post Journal Entry</h2>
      </div>

      {/* Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 pb-5 border-b border-[var(--fiori-tile-border)]">
        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Company Code</label>
          <select
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            {COMPANY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Posting Date</label>
          <input
            type="date"
            value={postingDate}
            onChange={(e) => setPostingDate(e.target.value)}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--fiori-text-secondary)] mb-1">Ledger</label>
          <select
            value={ledger}
            onChange={(e) => setLedger(e.target.value)}
            className="w-full border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm"
          >
            {LEDGERS.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lines */}
      <div className="space-y-2 mb-3">
        <div className="hidden sm:grid grid-cols-12 gap-2 text-xs text-[var(--fiori-text-secondary)] font-medium px-1">
          <span className="col-span-3">G/L Account</span>
          <span className="col-span-2">Debit/Credit</span>
          <span className="col-span-2">Amount (VND)</span>
          <span className="col-span-2">Cost Center</span>
          <span className="col-span-2">Profit Center</span>
          <span className="col-span-1" />
        </div>
        {lines.map((line) => (
          <div key={line.id} className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center bg-[var(--fiori-page-bg)] rounded p-2">
            <select
              value={line.glAccount}
              onChange={(e) => updateLine(line.id, { glAccount: e.target.value })}
              className="col-span-2 sm:col-span-3 border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm bg-white"
            >
              {CHART_OF_ACCOUNTS.map((a) => (
                <option key={a.account} value={a.account}>{a.account} — {a.name}</option>
              ))}
            </select>
            <select
              value={line.side}
              onChange={(e) => updateLine(line.id, { side: e.target.value })}
              className="sm:col-span-2 border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm bg-white"
            >
              <option value="debit">Debit (Nợ)</option>
              <option value="credit">Credit (Có)</option>
            </select>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={line.amount}
              onChange={(e) => updateLine(line.id, { amount: e.target.value })}
              className="sm:col-span-2 border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm bg-white"
            />
            <select
              value={line.costCenter}
              onChange={(e) => updateLine(line.id, { costCenter: e.target.value })}
              className="sm:col-span-2 border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm bg-white"
            >
              <option value="">—</option>
              {COST_CENTERS.filter(Boolean).map((cc) => (
                <option key={cc} value={cc}>{cc}</option>
              ))}
            </select>
            <select
              value={line.profitCenter}
              onChange={(e) => updateLine(line.id, { profitCenter: e.target.value })}
              className="sm:col-span-2 border border-[var(--fiori-tile-border)] rounded px-2 py-1.5 text-sm bg-white"
            >
              <option value="">—</option>
              {PROFIT_CENTERS.filter(Boolean).map((pc) => (
                <option key={pc} value={pc}>{pc}</option>
              ))}
            </select>
            <button
              onClick={() => removeLine(line.id)}
              disabled={lines.length <= 2}
              className="sm:col-span-1 text-[var(--fiori-danger)] disabled:opacity-30 disabled:cursor-not-allowed flex justify-center"
              aria-label="Xóa dòng"
            >
              <i className="ti ti-trash text-base" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addLine}
        className="text-sm text-[var(--fiori-link)] hover:underline flex items-center gap-1 mb-4"
      >
        <i className="ti ti-plus text-base" aria-hidden="true" />
        Thêm dòng / Add line
      </button>

      {/* Validation summary */}
      <div
        className={`rounded-lg p-3 flex items-center justify-between text-sm mb-4 border ${
          isBalanced
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}
      >
        <div className="flex gap-6">
          <span>Tổng Nợ / Total Debit: <strong>{fmt(totalDebit)}</strong></span>
          <span>Tổng Có / Total Credit: <strong>{fmt(totalCredit)}</strong></span>
        </div>
        <span className="flex items-center gap-1 font-medium">
          <i className={`ti ${isBalanced ? 'ti-circle-check' : 'ti-alert-triangle'} text-base`} aria-hidden="true" />
          {isBalanced ? 'Cân bằng / Balanced' : 'Chưa cân bằng / Not balanced'}
        </span>
      </div>

      {successMsg && (
        <div className="rounded-lg p-3 mb-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-center gap-2">
          <i className="ti ti-circle-check text-base" aria-hidden="true" />
          {successMsg}
        </div>
      )}

      <button
        onClick={handlePost}
        disabled={!isBalanced}
        className="bg-[var(--fiori-link)] text-white text-sm font-medium px-5 py-2 rounded hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Post — Ghi sổ
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPONENT GỐC: BalanceSheetModule
// ─────────────────────────────────────────────────────────────────────────
export default function BalanceSheetModule() {
  // ---- BƯỚC 1: state ACDOCA tập trung, là "nguồn sự thật" duy nhất ----
  const [acdoca, setAcdoca] = useState(ACDOCA_SEED);

  // ---- BƯỚC 2: state bộ lọc Smart Filter Bar ----
  const [filters, setFilters] = useState({
    companyCode: 'ALL',
    fiscalYear: '2026',
    period: 'ALL',
    ledger: '0L',
  });

  // ---- BƯớc 3: tài khoản đang được drill-down (null = đóng) ----
  const [drilldownAccount, setDrilldownAccount] = useState(null);

  // ---- Tab điều hướng giữa Balance Sheet và FB50 ----
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'post'

  // Hàm post bút toán mới từ FB50 — điểm GHI duy nhất vào acdoca.
  // Dùng functional update (prev => [...prev, ...]) để không bao giờ mất
  // dữ liệu cũ kể cả khi có nhiều lệnh post liên tiếp nhanh.
  const handlePostEntries = useCallback((newEntries) => {
    setAcdoca((prev) => [...prev, ...newEntries]);
  }, []);

  // Lọc các dòng ACDOCA khớp bộ filter hiện hành — dùng chung cho cả
  // Balance Sheet tổng hợp lẫn Drill-down chi tiết, đảm bảo luôn đồng bộ.
  const filteredEntries = useMemo(() => {
    return acdoca.filter((e) => {
      if (filters.companyCode !== 'ALL' && e.companyCode !== filters.companyCode) return false;
      if (e.fiscalYear !== filters.fiscalYear) return false;
      if (filters.period !== 'ALL' && e.period !== Number(filters.period)) return false;
      if (e.ledger !== filters.ledger) return false;
      return true;
    });
  }, [acdoca, filters]);

  // ---- BƯỚC 2 (tiếp): tổng hợp số dư Balance Sheet real-time từ acdoca ----
  const balanceSheetRows = useMemo(() => {
    return CHART_OF_ACCOUNTS.map((acc) => {
      const lines = filteredEntries.filter((e) => e.glAccount === acc.account);
      const debit = lines.reduce((s, l) => s + l.debitAmount, 0);
      const credit = lines.reduce((s, l) => s + l.creditAmount, 0);
      // Quy ước số dư: Assets/Expenses tăng bên Nợ; Liabilities/Equity/Revenue
      // tăng bên Có — đúng nguyên tắc kế toán kép chuẩn.
      const isDebitNature = acc.group === 'Assets' || acc.group === 'Expenses';
      const balance = isDebitNature ? debit - credit : credit - debit;
      return { ...acc, debit, credit, balance, lineCount: lines.length };
    });
  }, [filteredEntries]);

  const groupedRows = useMemo(() => {
    const groups = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'];
    return groups.map((g) => ({
      group: g,
      rows: balanceSheetRows.filter((r) => r.group === g),
      total: balanceSheetRows.filter((r) => r.group === g).reduce((s, r) => s + r.balance, 0),
    }));
  }, [balanceSheetRows]);

  const totalAssets = groupedRows.find((g) => g.group === 'Assets')?.total ?? 0;
  const totalLiabEquity =
    (groupedRows.find((g) => g.group === 'Liabilities')?.total ?? 0) +
    (groupedRows.find((g) => g.group === 'Equity')?.total ?? 0);

  // ---- BƯỚC 3 (tiếp): dòng chi tiết phục vụ Drill-down ----
  const drilldownLines = useMemo(() => {
    if (!drilldownAccount) return [];
    return filteredEntries
      .filter((e) => e.glAccount === drilldownAccount.account)
      .sort((a, b) => a.postingDate.localeCompare(b.postingDate));
  }, [filteredEntries, drilldownAccount]);

  // ---- Export to CSV: xuất đúng dữ liệu Balance Sheet đang hiển thị ----
  const handleExportCsv = () => {
    const header = ['Account', 'Name', 'Group', 'Type', 'Debit', 'Credit', 'Balance'];
    const rows = balanceSheetRows.map((r) => [r.account, `"${r.name}"`, r.group, r.type, r.debit, r.credit, r.balance]);
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BalanceSheet_${filters.companyCode}_${filters.fiscalYear}_P${filters.period}_${filters.ledger}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <i className="ti ti-report-money text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h1 className="text-lg font-medium">Balance Sheet / Income Statement</h1>
      </div>
      <p className="text-sm text-[var(--fiori-text-secondary)] mb-4">
        Mô phỏng SAP S/4HANA Universal Journal (ACDOCA) — dữ liệu liên kết real-time giữa FI / CO / MM / SD.
      </p>

      {/* Tabs: 3 tab MỚI (dùng global FilterBar + mockData.js theo spec
          1010 US/1710 DE) + 2 tab CŨ giữ nguyên (VN/ACDOCA, FB50) để so
          sánh trực tiếp trước khi quyết định giữ bộ dữ liệu nào. */}
      <div className="flex gap-1 border-b border-[var(--fiori-tile-border)] mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bs_new')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'bs_new'
              ? 'border-[var(--fiori-link)] text-[var(--fiori-link)]'
              : 'border-transparent text-[var(--fiori-text-secondary)] hover:text-[var(--fiori-text-primary)]'
          }`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setActiveTab('is_new')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'is_new'
              ? 'border-[var(--fiori-link)] text-[var(--fiori-link)]'
              : 'border-transparent text-[var(--fiori-text-secondary)] hover:text-[var(--fiori-text-primary)]'
          }`}
        >
          Income Statement
        </button>
        <button
          onClick={() => setActiveTab('je_new')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'je_new'
              ? 'border-[var(--fiori-link)] text-[var(--fiori-link)]'
              : 'border-transparent text-[var(--fiori-text-secondary)] hover:text-[var(--fiori-text-primary)]'
          }`}
        >
          Journal Entries Overview
        </button>
        <span className="border-l border-[var(--fiori-tile-border)] my-2" />
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'report'
              ? 'border-[var(--fiori-link)] text-[var(--fiori-link)]'
              : 'border-transparent text-[var(--fiori-text-secondary)] hover:text-[var(--fiori-text-primary)]'
          }`}
        >
          Báo cáo (VN) — Legacy
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'post'
              ? 'border-[var(--fiori-link)] text-[var(--fiori-link)]'
              : 'border-transparent text-[var(--fiori-text-secondary)] hover:text-[var(--fiori-text-primary)]'
          }`}
        >
          FB50 — Post Journal Entry
        </button>
      </div>

      {(activeTab === 'bs_new' || activeTab === 'is_new' || activeTab === 'je_new') && (
        <>
          <ConceptPanel concept={CONCEPTS.BALANCE_SHEET} />
          <FilterBar />
          {activeTab === 'bs_new' && <BalanceSheetReport />}
          {activeTab === 'is_new' && <IncomeStatementReport />}
          {activeTab === 'je_new' && <JournalEntriesOverview />}
        </>
      )}

      {activeTab === 'report' && (
        <>
          <ConceptPanel concept={CONCEPTS.BALANCE_SHEET} />
          <SmartFilterBar filters={filters} onChange={setFilters} />

          {/* KPI tổng quan nhanh */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
              <p className="text-xs text-[var(--fiori-text-secondary)]">Tổng Tài sản / Total Assets</p>
              <p className="text-xl font-medium mt-1">{fmt(totalAssets)}</p>
            </div>
            <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
              <p className="text-xs text-[var(--fiori-text-secondary)]">Nợ phải trả + Vốn CSH</p>
              <p className="text-xl font-medium mt-1">{fmt(totalLiabEquity)}</p>
            </div>
            <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3">
              <p className="text-xs text-[var(--fiori-text-secondary)]">Số bút toán đang lọc</p>
              <p className="text-xl font-medium mt-1">{filteredEntries.length}</p>
            </div>
          </div>

          {/* Toolbar: Export */}
          <div className="flex justify-end mb-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 text-sm border border-[var(--fiori-tile-border)] px-3 py-1.5 rounded hover:bg-gray-50"
            >
              <i className="ti ti-download text-base" aria-hidden="true" />
              Export to CSV
            </button>
          </div>

          {/* Balance Sheet table, nhóm theo Assets/Liabilities/Equity/Revenue/Expenses */}
          <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
                  <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Account</th>
                  <th className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Description</th>
                  <th className="text-right px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">Balance (VND)</th>
                  <th className="text-right px-4 py-2 font-medium text-[var(--fiori-text-secondary)] w-24">Line Items</th>
                </tr>
              </thead>
              <tbody>
                {groupedRows.map((grp) => (
                  <FragmentGroup key={grp.group} group={grp} onDrilldown={setDrilldownAccount} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <JournalEntryForm onPost={handlePostEntries} />
      )}

      <LineItemsDrawer
        account={drilldownAccount}
        lines={drilldownLines}
        onClose={() => setDrilldownAccount(null)}
      />
    </div>
  );
}

// Nhóm hàng theo group (Assets/Liabilities/...) kèm dòng tổng — tách riêng
// để JSX chính gọn hơn, không dùng React.Fragment trực tiếp lồng map kép.
function FragmentGroup({ group, onDrilldown }) {
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
              <button
                onClick={() => onDrilldown(row)}
                className="text-[var(--fiori-link)] hover:underline font-medium"
              >
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
          Tổng {group.group}
        </td>
        <td className="px-4 py-1.5 text-right text-xs font-medium">{fmt(group.total)}</td>
        <td />
      </tr>
    </>
  );
}
