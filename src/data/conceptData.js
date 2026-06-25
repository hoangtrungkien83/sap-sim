// ─────────────────────────────────────────────────────────────────────────
// CONCEPT DATA — nội dung giáo dục cho ConceptPanel.
//
// File này KHÔNG chứa logic nghiệp vụ, KHÔNG được sapStore.js import.
// Đây là lớp "annotation" thuần UI: với mỗi transaction/object/list/module,
// định nghĩa T-code chuẩn, mục đích nghiệp vụ, đường dẫn menu SAP GUI thật,
// SAP module sở hữu, và (khi có) ví dụ bút toán kép (Dr/Cr) điển hình.
//
// Mục tiêu: người học có thể tra cứu chéo với tài liệu SAP chính thức
// (Help Portal, S/4HANA Application Help) bằng đúng T-code/account đã thấy
// ở đây — không bịa thuật ngữ, không đơn giản hóa sai khái niệm.
//
// Mỗi entry: { tcode, sapModule, title:{vi,en}, purpose:{vi,en},
//              menuPath, integration:{vi,en}, sampleEntry?: [{account,desc,dr,cr}] }
// ─────────────────────────────────────────────────────────────────────────

export const CONCEPTS = {
  // ── Transactions ──
  ME21N: {
    tcode: 'ME21N',
    sapModule: 'MM (Materials Management)',
    title: { vi: 'Tạo đơn đặt hàng', en: 'Create Purchase Order' },
    purpose: {
      vi: 'Tạo chứng từ ràng buộc pháp lý giữa doanh nghiệp và nhà cung cấp, xác định vật tư, số lượng, giá, điều khoản giao hàng. Là điểm khởi đầu chu trình Procure-to-Pay (P2P).',
      en: 'Creates a legally binding document between the company and a vendor, specifying material, quantity, price, and delivery terms. The starting point of the Procure-to-Pay (P2P) cycle.',
    },
    menuPath: 'Logistics → Materials Management → Purchasing → Purchase Order → Create → Vendor/Supplying Plant Known',
    integration: {
      vi: 'Không tạo bút toán FI ngay (PO chỉ là cam kết, chưa phải nghĩa vụ tài chính). Bút toán chỉ phát sinh khi Goods Receipt (MIGO) hoặc Invoice Receipt (MIRO) được đăng.',
      en: 'Does not post an FI document immediately (a PO is a commitment, not yet a financial obligation). Postings only occur at Goods Receipt (MIGO) or Invoice Receipt (MIRO).',
    },
  },
  MIGO: {
    tcode: 'MIGO',
    sapModule: 'MM (Inventory Management)',
    title: { vi: 'Ghi nhận phiếu nhập kho', en: 'Goods Movement (Goods Receipt)' },
    purpose: {
      vi: 'Ghi nhận việc nhận hàng thực tế vào kho đối chiếu với PO (movement type 101). Cập nhật tồn kho và tạo Material Document + bút toán FI tự động (do tích hợp MM-FI).',
      en: 'Records the physical receipt of goods against a PO (movement type 101). Updates stock and auto-creates a Material Document plus an FI posting via MM-FI integration.',
    },
    menuPath: 'Logistics → Materials Management → Inventory Management → Goods Movement → Goods Receipt → For Purchase Order',
    integration: {
      vi: 'Mỗi GR sinh ra ĐỒNG THỜI: (1) Material Document (MM), (2) bút toán FI tự động Nợ Hàng tồn kho / Có GR/IR clearing account — đây là cơ chế MM-FI integration kinh điển, không cần nhập tay bên FI.',
      en: 'Each GR simultaneously generates: (1) a Material Document (MM), (2) an automatic FI posting debiting Inventory / crediting the GR/IR clearing account — the classic MM-FI integration, with no manual FI entry needed.',
    },
    sampleEntry: [
      { account: '200000 — Hàng tồn kho / Inventory', dr: true },
      { account: '300010 — GR/IR Clearing Account', dr: false },
    ],
  },
  MIRO: {
    tcode: 'MIRO',
    sapModule: 'MM (Invoice Verification / Logistics Invoice Verification - LIV)',
    title: { vi: 'Kiểm tra & ghi nhận hóa đơn nhà cung cấp', en: 'Enter Incoming Invoice (Logistics Invoice Verification)' },
    purpose: {
      vi: 'Đối chiếu hóa đơn nhà cung cấp với PO và GR (3-way match: PO ↔ GR ↔ Invoice) trước khi ghi nhận nghĩa vụ phải trả. Đóng GR/IR clearing account và mở công nợ thật (Accounts Payable).',
      en: 'Matches the vendor invoice against the PO and GR (3-way match: PO ↔ GR ↔ Invoice) before posting a payable. Clears the GR/IR clearing account and opens the real vendor liability (Accounts Payable).',
    },
    menuPath: 'Logistics → Materials Management → Logistics Invoice Verification → Document Entry → Enter Invoice',
    integration: {
      vi: '3-way match là kiểm soát nội bộ then chốt: hệ thống KHÔNG cho phép xuất hóa đơn vượt giá trị hàng đã nhận (GR), tránh gian lận/sai sót thanh toán vượt mức đã giao.',
      en: '3-way match is a critical internal control: the system blocks invoicing beyond the value of goods actually received (GR), preventing fraud or overpayment.',
    },
    sampleEntry: [
      { account: '300010 — GR/IR Clearing Account', dr: true },
      { account: '300000 — Phải trả người bán / Accounts Payable', dr: false },
    ],
  },
  VA01: {
    tcode: 'VA01',
    sapModule: 'SD (Sales and Distribution)',
    title: { vi: 'Tạo đơn bán hàng', en: 'Create Sales Order' },
    purpose: {
      vi: 'Ghi nhận yêu cầu mua hàng của khách hàng, thực hiện Availability Check (ATP — Available-to-Promise) để xác định khả năng giao hàng dựa trên tồn kho hiện có.',
      en: "Records a customer's purchase request and performs an Availability Check (ATP — Available-to-Promise) to determine deliverability based on current stock.",
    },
    menuPath: 'Logistics → Sales and Distribution → Sales → Order → Create',
    integration: {
      vi: 'ATP check là khái niệm cốt lõi SD: nếu tồn kho đủ → Confirmed (trừ kho ngay); nếu thiếu → Backorder (chờ bổ sung, không trừ kho cho tới khi Confirmed). Không tạo bút toán FI ở bước này.',
      en: 'ATP check is a core SD concept: sufficient stock → Confirmed (stock reserved immediately); insufficient → Backorder (waits for replenishment, no stock deduction until Confirmed). No FI posting at this step.',
    },
  },
  VF01: {
    tcode: 'VF01',
    sapModule: 'SD (Billing)',
    title: { vi: 'Tạo hóa đơn bán hàng', en: 'Create Billing Document' },
    purpose: {
      vi: 'Tạo hóa đơn chính thức cho khách hàng dựa trên Sales Order đã Confirmed (hoặc Delivery đã xuất kho trong cấu hình đầy đủ). Ghi nhận doanh thu và công nợ phải thu.',
      en: 'Creates the official customer invoice based on a Confirmed Sales Order (or a goods-issued Delivery in a full configuration). Recognizes revenue and the receivable.',
    },
    menuPath: 'Logistics → Sales and Distribution → Billing → Billing Document → Create',
    integration: {
      vi: 'Billing Document tự sinh bút toán FI Nợ Phải thu khách hàng / Có Doanh thu — tích hợp SD-FI tự động, đúng nguyên lý "billing tạo accounting document ngay khi release to accounting".',
      en: 'The Billing Document auto-generates an FI posting debiting Accounts Receivable / crediting Revenue — automatic SD-FI integration, following the principle that billing creates an accounting document upon release to accounting.',
    },
    sampleEntry: [
      { account: '120000 — Phải thu khách hàng / Accounts Receivable', dr: true },
      { account: '400000 — Doanh thu bán hàng / Sales Revenue', dr: false },
    ],
  },

  // ── Object Pages ──
  PO_DETAIL: {
    tcode: 'ME23N',
    sapModule: 'MM (Purchasing)',
    title: { vi: 'Hiển thị đơn đặt hàng', en: 'Display Purchase Order' },
    purpose: {
      vi: 'Xem chi tiết PO, theo dõi tiến độ Goods Receipt và Invoice Receipt, kiểm tra Document Flow đầy đủ từ PO tới chứng từ FI cuối cùng.',
      en: 'View PO details, track Goods Receipt and Invoice Receipt progress, and inspect the full Document Flow from PO through to the final FI document.',
    },
    menuPath: 'Logistics → Materials Management → Purchasing → Purchase Order → Display',
    integration: {
      vi: 'Tab "Document Flow" trong ME23N thật cho phép drill-down ngược/xuôi toàn bộ chuỗi chứng từ — đây là tính năng truy vết được mô phỏng trực tiếp trong Object Page này.',
      en: 'The "Document Flow" tab in real ME23N allows forward/backward drill-down through the entire document chain — this is the traceability feature mirrored directly in this Object Page.',
    },
  },
  SO_DETAIL: {
    tcode: 'VA03',
    sapModule: 'SD (Sales)',
    title: { vi: 'Hiển thị đơn bán hàng', en: 'Display Sales Order' },
    purpose: {
      vi: 'Xem chi tiết SO, trạng thái ATP, và Document Flow tới Billing/FI. Với SO Backorder, đây là nơi theo dõi khi nào đơn được tự động Confirmed sau khi có hàng.',
      en: 'View SO details, ATP status, and Document Flow through to Billing/FI. For Backorder SOs, this is where to track when the order gets auto-confirmed once stock arrives.',
    },
    menuPath: 'Logistics → Sales and Distribution → Sales → Order → Display',
    integration: {
      vi: 'Trong SAP thật, việc re-check ATP cho Backorder thường chạy qua batch job (vd report rebate/backorder processing — V_RA, hoặc Rescheduling), không tự động real-time như mô phỏng — đây là điểm đơn giản hóa có chủ đích để minh họa khái niệm.',
      en: "In real SAP, re-checking ATP for backorders typically runs via batch jobs (e.g. backorder rescheduling reports), not real-time as simplified here — an intentional simplification to illustrate the concept clearly.",
    },
  },
  INVOICE_DETAIL: {
    tcode: 'MIR4',
    sapModule: 'MM (Invoice Verification)',
    title: { vi: 'Hiển thị hóa đơn nhà cung cấp', en: 'Display Supplier Invoice' },
    purpose: {
      vi: 'Xem lại hóa đơn đã đăng qua MIRO, kiểm tra số tiền đã ghi nhận và bút toán FI (Vendor Invoice) tương ứng trong sổ cái.',
      en: 'Review an invoice posted via MIRO, checking the recorded amount and the corresponding FI posting (Vendor Invoice) in the general ledger.',
    },
    menuPath: 'Logistics → Materials Management → Logistics Invoice Verification → Further Processing → Display Invoice Document',
  },
  BILLING_DETAIL: {
    tcode: 'VF03',
    sapModule: 'SD (Billing)',
    title: { vi: 'Hiển thị hóa đơn bán hàng', en: 'Display Billing Document' },
    purpose: {
      vi: 'Xem lại Billing Document đã xuất, kiểm tra việc "release to accounting" đã sinh đúng bút toán FI (Customer Invoice) hay chưa.',
      en: 'Review an issued Billing Document and verify that "release to accounting" correctly generated the FI posting (Customer Invoice).',
    },
    menuPath: 'Logistics → Sales and Distribution → Billing → Billing Document → Display',
  },
  VENDOR_DETAIL: {
    tcode: 'XK03 / BP',
    sapModule: 'MM / FI (Vendor Master)',
    title: { vi: 'Hiển thị hồ sơ nhà cung cấp', en: 'Display Vendor Master' },
    purpose: {
      vi: 'Vendor Master là master data trung tâm, dùng chung bởi MM (purchasing data) và FI (company code data — tài khoản đối chiếu, điều khoản thanh toán). Trong S/4HANA, được quản lý qua Business Partner (BP) thay vì XK03 cũ.',
      en: 'Vendor Master is central master data shared by MM (purchasing data) and FI (company code data — reconciliation account, payment terms). In S/4HANA, it is managed via Business Partner (BP) instead of the legacy XK03.',
    },
    menuPath: 'Cross-Application Components → SAP Business Partner → Maintain Business Partner (BP)',
    integration: {
      vi: 'Mỗi Vendor Master liên kết với 1 Reconciliation Account (vd 300000) — mọi bút toán phải trả của vendor này TỰ ĐỘNG hạch toán vào account đó, đảm bảo sổ phụ (subledger) khớp sổ cái (G/L) tuyệt đối.',
      en: 'Each Vendor Master links to a Reconciliation Account (e.g. 300000) — every payable posting for that vendor automatically hits that account, guaranteeing the subledger always ties to the G/L exactly.',
    },
  },
  CUSTOMER_DETAIL: {
    tcode: 'XD03 / BP',
    sapModule: 'SD / FI (Customer Master)',
    title: { vi: 'Hiển thị hồ sơ khách hàng', en: 'Display Customer Master' },
    purpose: {
      vi: 'Tương tự Vendor Master, Customer Master dùng chung bởi SD (sales data) và FI (company code data). Quản lý qua Business Partner trong S/4HANA.',
      en: 'Like Vendor Master, Customer Master is shared by SD (sales data) and FI (company code data), managed via Business Partner in S/4HANA.',
    },
    menuPath: 'Cross-Application Components → SAP Business Partner → Maintain Business Partner (BP)',
    integration: {
      vi: 'Reconciliation Account (vd 120000) gắn với Customer Master đảm bảo mọi Billing Document của khách hàng này tự động vào đúng tài khoản phải thu trên sổ cái.',
      en: 'The Reconciliation Account (e.g. 120000) attached to the Customer Master ensures every Billing Document for this customer automatically posts to the correct receivable account in the G/L.',
    },
  },

  // ── List pages ──
  LIST_VENDORS: {
    tcode: 'XK03 (list) / MKVZ',
    sapModule: 'MM',
    title: { vi: 'Danh sách nhà cung cấp', en: 'Vendor List' },
    purpose: { vi: 'Tra cứu nhanh toàn bộ Vendor Master đã tạo trong hệ thống.', en: 'Quick lookup of all Vendor Masters created in the system.' },
    menuPath: 'Logistics → Materials Management → Purchasing → Master Data → Vendor → Purchasing → Display',
  },
  LIST_PO: {
    tcode: 'ME2N / ME2M',
    sapModule: 'MM',
    title: { vi: 'Danh sách đơn đặt hàng', en: 'Purchase Order List' },
    purpose: { vi: 'Báo cáo tổng hợp PO theo nhiều tiêu chí lọc (vendor, material, plant, trạng thái) — dùng để theo dõi PO còn mở (Open PO).', en: 'A consolidated PO report with filters (vendor, material, plant, status) — used to monitor open POs.' },
    menuPath: 'Logistics → Materials Management → Purchasing → Purchase Order → List Displays → By Vendor',
  },
  LIST_INVOICES: {
    tcode: 'MIR6 / MRBR',
    sapModule: 'MM',
    title: { vi: 'Danh sách hóa đơn nhà cung cấp', en: 'Supplier Invoice List' },
    purpose: { vi: 'Theo dõi toàn bộ Invoice Document đã được Invoice Verification (MIRO) xử lý, bao gồm trạng thái blocked/released.', en: 'Tracks all Invoice Documents processed by Invoice Verification (MIRO), including blocked/released status.' },
    menuPath: 'Logistics → Materials Management → Logistics Invoice Verification → Further Processing → Invoice Overview',
  },
  LIST_SO: {
    tcode: 'VA05',
    sapModule: 'SD',
    title: { vi: 'Danh sách đơn bán hàng', en: 'List of Sales Orders' },
    purpose: { vi: 'Báo cáo SO theo khách hàng, material, hoặc trạng thái — dùng theo dõi backlog và Backorder cần xử lý.', en: 'Reports SOs by customer, material, or status — used to monitor backlog and pending Backorders.' },
    menuPath: 'Logistics → Sales and Distribution → Sales → Information System → Orders → List of Sales Orders',
  },
  LIST_BILLING: {
    tcode: 'VF05',
    sapModule: 'SD',
    title: { vi: 'Danh sách hóa đơn bán hàng', en: 'List of Billing Documents' },
    purpose: { vi: 'Tổng hợp Billing Document đã xuất, kiểm tra trạng thái "release to accounting" (đã sinh FI document hay chưa).', en: 'Consolidates issued Billing Documents, checking "release to accounting" status (whether the FI document was generated).' },
    menuPath: 'Logistics → Sales and Distribution → Billing → Information System → Billing Documents → List of Billing Documents',
  },
  LIST_STOCK: {
    tcode: 'MMBE / MB52',
    sapModule: 'MM (Inventory Management)',
    title: { vi: 'Tổng quan tồn kho', en: 'Stock Overview' },
    purpose: {
      vi: 'MMBE hiển thị tồn kho theo nhiều cấp (Plant → Storage Location → Batch); MB52 là báo cáo tồn kho dạng bảng đơn giản hơn. App này mô phỏng MB52.',
      en: 'MMBE shows stock across multiple levels (Plant → Storage Location → Batch); MB52 is a simpler tabular stock report. This app mirrors MB52.',
    },
    menuPath: 'Logistics → Materials Management → Inventory Management → Environment → Stock → Stock Overview',
    integration: {
      vi: 'Mô phỏng này chỉ có 1 cấp Plant, chưa có Storage Location/Batch như MMBE thật — đơn giản hóa có chủ đích để tập trung vào khái niệm cộng/trừ kho qua MIGO/VA01.',
      en: 'This simulation only models the Plant level, without Storage Location/Batch like real MMBE — an intentional simplification to focus on the stock in/out concept via MIGO/VA01.',
    },
  },

  // ── Balance Sheet module ──
  BALANCE_SHEET: {
    tcode: 'F.01 / FSV (S/4HANA: app "Display Financial Statement")',
    sapModule: 'FI (Financial Accounting) — Universal Journal (ACDOCA)',
    title: { vi: 'Bảng cân đối kế toán / Báo cáo kết quả kinh doanh', en: 'Balance Sheet / Income Statement' },
    purpose: {
      vi: 'Báo cáo tài chính tổng hợp dựa trên Financial Statement Version (FSV) — quy tắc nhóm các G/L account vào cấu trúc báo cáo chuẩn (Assets/Liabilities/Equity/Revenue/Expenses).',
      en: 'A consolidated financial report based on a Financial Statement Version (FSV) — the rule set grouping G/L accounts into a standard reporting structure (Assets/Liabilities/Equity/Revenue/Expenses).',
    },
    menuPath: 'Accounting → Financial Accounting → General Ledger → Information System → General Ledger Reports → Balance Sheet/Profit and Loss Statement',
    integration: {
      vi: 'Trong S/4HANA, ACDOCA là NGUỒN DUY NHẤT cho mọi báo cáo FI/CO — không còn các bảng tổng hợp riêng (GLT0, COSP...) như ECC cũ. Mọi con số trên Balance Sheet đều truy vết ngược được tới từng dòng bút toán gốc qua drill-down — đúng triết lý "Universal Journal".',
      en: 'In S/4HANA, ACDOCA is the SINGLE SOURCE for all FI/CO reporting — there are no more separate summary tables (GLT0, COSP...) as in legacy ECC. Every figure on the Balance Sheet can be traced back to its originating line item via drill-down — the core "Universal Journal" principle.',
    },
  },
  FB50: {
    tcode: 'FB50',
    sapModule: 'FI (General Ledger)',
    title: { vi: 'Đăng bút toán sổ cái', en: 'Post General Ledger Journal Entry' },
    purpose: {
      vi: 'Nhập bút toán FI thủ công (không qua MM/SD), dùng cho các giao dịch thuần kế toán (góp vốn, khấu hao, phân bổ chi phí, điều chỉnh cuối kỳ).',
      en: 'Manually enters an FI journal entry (not via MM/SD), used for pure accounting transactions (capital injection, depreciation, cost allocation, period-end adjustments).',
    },
    menuPath: 'Accounting → Financial Accounting → General Ledger → Posting → Enter G/L Account Document',
    integration: {
      vi: 'Nguyên tắc bất biến của kế toán kép: Tổng Nợ phải LUÔN bằng Tổng Có trước khi hệ thống cho phép Post — đây là validation cứng (hard validation) trong mọi client SAP, không thể bỏ qua.',
      en: 'The invariant rule of double-entry bookkeeping: Total Debit must ALWAYS equal Total Credit before the system allows posting — a hard validation in every SAP client, never bypassable.',
    },
  },
};

export function getConcept(key) {
  return CONCEPTS[key] ?? null;
}
