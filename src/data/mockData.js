// ─────────────────────────────────────────────────────────────────────────
// mockData.js — Unified relational mock database cho Finance modules
// (Balance Sheet, Income Statement, Journal Entries Overview).
//
// Đây là bộ dữ liệu MỚI theo đúng spec đã chốt:
//   - Company Code: 1010 (US), 1710 (DE)
//   - Ledger: 0L (Leading Ledger), 2L (IFRS)
//   - Fiscal Year: 2025, 2026
//   - Period: "001"–"012" (zero-padded 3 digit, đúng format SAP thật)
//   - Account number theo pattern chuẩn: 1xxxxxxx Assets, 2xxxxxxx
//     Liabilities, 3xxxxxxx Equity, 4xxxxxxx Revenue, 5xxxxxxx Expenses.
//
// File này SONG SONG với ACDOCA_SEED cũ trong BalanceSheetModule.jsx
// (dữ liệu VN/VND, account 6 chữ số) — không xóa cái cũ, để có thể so
// sánh trực tiếp và chọn giữ bộ nào sau khi xem demo.
//
// THIẾT KẾ QUAN HỆ (đảm bảo Balance Sheet luôn cân đối):
//   Mỗi "documentTemplate" sinh ra các dòng bút toán cho NHIỀU tổ hợp
//   company/year/period bằng cách nhân bản có điều chỉnh số tiền nhẹ theo
//   period (để nhìn "động" hơn, không phải số tĩnh lặp lại) — nhưng mọi
//   document luôn giữ Tổng Debit = Tổng Credit, nên Assets luôn bằng
//   Liabilities + Equity với BẤT KỲ tổ hợp filter nào có dữ liệu.
// ─────────────────────────────────────────────────────────────────────────

export const COMPANY_CODES = [
  { code: '1010', name: '1010 — SAP America Inc. (US)', country: 'US', currency: 'USD' },
  { code: '1710', name: '1710 — SAP Deutschland SE (DE)', country: 'DE', currency: 'EUR' },
];

export const LEDGERS = [
  { code: '0L', name: '0L — Leading Ledger' },
  { code: '2L', name: '2L — IFRS' },
];

export const FISCAL_YEARS = ['2025', '2026'];

// Period dạng "001".."012" — đúng format SAP thật (3 ký tự, zero-padded).
export const PERIODS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(3, '0'));

export const CHART_OF_ACCOUNTS = [
  // Assets — 1xxxxxxx
  { account: '10000000', name: 'Cash and Cash Equivalents', group: 'Assets', statementType: 'BS' },
  { account: '11000000', name: 'Accounts Receivable', group: 'Assets', statementType: 'BS' },
  { account: '12000000', name: 'Inventory', group: 'Assets', statementType: 'BS' },
  { account: '15000000', name: 'Fixed Assets', group: 'Assets', statementType: 'BS' },
  // Liabilities — 2xxxxxxx
  { account: '20000000', name: 'Accounts Payable', group: 'Liabilities', statementType: 'BS' },
  { account: '21000000', name: 'Short-term Loans', group: 'Liabilities', statementType: 'BS' },
  { account: '22000000', name: 'Accrued Liabilities', group: 'Liabilities', statementType: 'BS' },
  // Equity — 3xxxxxxx
  { account: '30000000', name: 'Common Stock', group: 'Equity', statementType: 'BS' },
  { account: '33000000', name: 'Retained Earnings', group: 'Equity', statementType: 'BS' },
  // Revenue — 4xxxxxxx
  { account: '40000000', name: 'Sales Revenue', group: 'Revenue', statementType: 'PL' },
  // Expenses — 5xxxxxxx
  { account: '50000000', name: 'Cost of Goods Sold', group: 'Expenses', statementType: 'PL' },
  { account: '61000000', name: 'Personnel Expenses', group: 'Expenses', statementType: 'PL' },
  { account: '62000000', name: 'Depreciation Expense', group: 'Expenses', statementType: 'PL' },
];

function acct(code) {
  return CHART_OF_ACCOUNTS.find((a) => a.account === code);
}

// ── Document templates: định nghĩa các bút toán "khuôn" theo company code.
// Mỗi template áp dụng cho 1 companyCode cố định, lặp lại qua các period
// có dữ liệu (không phải period nào cũng có — để demo empty state thật).
// scale: hệ số nhân theo period, tạo cảm giác số liệu "sống" thay vì y
// nguyên mỗi kỳ.
const DOC_TEMPLATES = [
  {
    companyCode: '1010', ledger: '0L', sourceModule: 'FI',
    text: 'Opening capital injection',
    lines: [
      { account: '10000000', dr: 800000 },
      { account: '30000000', cr: 800000 },
    ],
  },
  {
    companyCode: '1010', ledger: '0L', sourceModule: 'MM',
    text: 'Goods Receipt against PO',
    lines: [
      { account: '12000000', dr: 120000 },
      { account: '20000000', cr: 120000 },
    ],
  },
  {
    companyCode: '1010', ledger: '0L', sourceModule: 'SD',
    text: 'Customer billing document',
    lines: [
      { account: '11000000', dr: 340000 },
      { account: '40000000', cr: 340000 },
    ],
  },
  {
    companyCode: '1010', ledger: '0L', sourceModule: 'SD',
    text: 'COGS recognition on billing',
    lines: [
      { account: '50000000', dr: 210000 },
      { account: '12000000', cr: 210000 },
    ],
  },
  {
    companyCode: '1010', ledger: '0L', sourceModule: 'CO',
    text: 'Monthly depreciation run',
    lines: [
      { account: '62000000', dr: 15000 },
      { account: '15000000', cr: 15000 },
    ],
  },
  {
    companyCode: '1010', ledger: '2L', sourceModule: 'FI',
    text: 'Parallel ledger adjustment (IFRS)',
    lines: [
      { account: '11000000', dr: 332000 },
      { account: '40000000', cr: 332000 },
    ],
  },
  {
    companyCode: '1710', ledger: '0L', sourceModule: 'FI',
    text: 'Opening capital injection',
    lines: [
      { account: '10000000', dr: 650000 },
      { account: '30000000', cr: 650000 },
    ],
  },
  {
    companyCode: '1710', ledger: '0L', sourceModule: 'MM',
    text: 'Goods Receipt against PO',
    lines: [
      { account: '12000000', dr: 95000 },
      { account: '20000000', cr: 95000 },
    ],
  },
  {
    companyCode: '1710', ledger: '0L', sourceModule: 'CO',
    text: 'Personnel cost allocation',
    lines: [
      { account: '61000000', dr: 58000 },
      { account: '21000000', cr: 58000 },
    ],
  },
  {
    companyCode: '1710', ledger: '0L', sourceModule: 'FI',
    text: 'Fixed asset acquisition',
    lines: [
      { account: '15000000', dr: 400000 },
      { account: '21000000', cr: 400000 },
    ],
  },
];

// Period nào có dữ liệu cho mỗi company — CỐ Ý không phủ hết 1-12, để
// minh họa rõ trường hợp "empty state" (vd 1710/2025 hoặc period chưa
// đóng sổ chưa có bút toán nào).
const ACTIVE_PERIODS = {
  '1010-2026': ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'],
  '1010-2025': ['010', '011', '012'],
  '1710-2026': ['001', '002', '003', '004', '005', '006'],
  '1710-2025': [], // CỐ Ý rỗng — test empty state cho 1710/FY2025
};

function buildAcdocaSeed() {
  const rows = [];
  let docCounter = 91000001;

  for (const [key, periods] of Object.entries(ACTIVE_PERIODS)) {
    const [companyCode, fiscalYear] = key.split('-');
    periods.forEach((period, periodIdx) => {
      const templates = DOC_TEMPLATES.filter((t) => t.companyCode === companyCode);
      templates.forEach((tpl, tplIdx) => {
        // scale nhẹ theo period để số liệu "động" — dao động ±15%,
        // nhưng KHÔNG phá vỡ Dr=Cr vì áp dụng scale đồng nhất cho mọi
        // dòng trong cùng 1 document.
        const scale = 1 + ((periodIdx + tplIdx) % 5) * 0.03;
        const docNumber = String(docCounter++);
        const postingDate = `${fiscalYear}-${String(((periodIdx % 12) + 1)).padStart(2, '0')}-${String(5 + (tplIdx % 20)).padStart(2, '0')}`;

        tpl.lines.forEach((line) => {
          const amount = Math.round((line.dr ?? line.cr) * scale);
          rows.push({
            docNumber,
            postingDate,
            companyCode,
            fiscalYear,
            period,
            ledger: tpl.ledger,
            glAccount: line.account,
            debitAmount: line.dr ? amount : 0,
            creditAmount: line.cr ? amount : 0,
            sourceModule: tpl.sourceModule,
            text: tpl.text,
          });
        });
      });
    });
  }
  return rows;
}

// Dataset chính — tính 1 lần khi module load (không phải mỗi render).
export const MOCK_ACDOCA = buildAcdocaSeed();

/**
 * queryAcdoca — hàm "fetch" giả lập: lọc ACDOCA theo Company Code +
 * Ledger + Fiscal Year + Period, trả về { rows, isEmpty }.
 *
 * period === 'ALL' → lấy toàn bộ 12 kỳ (cumulative, đúng hành vi Balance
 * Sheet thật — số dư là lũy kế từ đầu năm tới kỳ được chọn, không phải
 * chỉ riêng 1 kỳ).
 *
 * QUAN TRỌNG về tính cumulative: với report Balance Sheet thật, số dư
 * tại Period N là TỔNG mọi bút toán từ Period 001 đến N (không chỉ riêng
 * period N) — đây là khái niệm "cumulative balance" của BS, khác với P&L
 * (chỉ tính trong kỳ/year-to-date theo lựa chọn). Hàm này áp dụng đúng
 * logic đó: lọc theo period <= period đã chọn.
 */
export function queryAcdoca({ companyCode, ledger, fiscalYear, period }) {
  const periodNum = period === 'ALL' ? 12 : Number(period);
  const rows = MOCK_ACDOCA.filter(
    (r) =>
      r.companyCode === companyCode &&
      r.ledger === ledger &&
      r.fiscalYear === fiscalYear &&
      Number(r.period) <= periodNum
  );
  return { rows, isEmpty: rows.length === 0 };
}

export function getAccountInfo(code) {
  return acct(code) ?? { account: code, name: 'Unknown Account', group: 'Other', statementType: 'BS' };
}
