// Cấu trúc nav tabs + sections + tiles, mô phỏng theo ảnh chụp
// SAP S/4HANA Cloud Public Edition Fiori Launchpad thực tế.
//
// Mỗi tile có "type" quyết định nơi điều hướng tới:
//   - 'transaction' : mở form giao dịch thật (ME21N, MIGO...) — đã có sẵn
//   - 'list'         : mở bảng danh sách từ store (PO, invoice...) — đã có sẵn
//   - 'kpi'          : tile số liệu trên launchpad, không điều hướng
//   - 'app'          : mở "Generic Fiori App" — list report / object page
//                       được dựng từ appData bên dưới, theo đúng khuôn mẫu
//                       UI mà SAP Fiori thật dùng cho các app display-only.
//   - 'count'        : tile đếm số (giống type 'app' nhưng hiện số ngay trên tile)
//
// title/subtitle là object { vi, en } để hỗ trợ đa ngôn ngữ qua hook useT()
// và hàm tr() (translate-record) export bên dưới.

export function tr(record, lang) {
  if (!record) return '';
  if (typeof record === 'string') return record;
  return record[lang] ?? record.vi ?? '';
}

export const NAV_TABS = [
  { key: 'home', label: { vi: 'Trang chủ', en: 'My Home' }, path: '/' },
  { key: 'finance', label: { vi: 'Tài chính', en: 'Finance' }, path: '/finance' },
  { key: 'manufacturing', label: { vi: 'Sản xuất & Chuỗi cung ứng', en: 'Manufacturing and Supply Chain' }, path: '/manufacturing' },
  { key: 'procurement', label: { vi: 'Mua hàng', en: 'Procurement' }, path: '/procurement' },
  { key: 'project', label: { vi: 'Quản lý dự án', en: 'Project Management' }, path: '/project' },
  { key: 'sales', label: { vi: 'Bán hàng', en: 'Sales' }, path: '/sales' },
  { key: 'other', label: { vi: 'Khác', en: 'Other' }, path: '/other' },
];

export const PAGE_CARDS = [
  { key: 'finance', label: { vi: 'Tài chính', en: 'Finance' }, color: 'blue', path: '/finance' },
  { key: 'manufacturing', label: { vi: 'Sản xuất & Chuỗi cung ứng', en: 'Manufacturing and Supply Chain' }, color: 'pink', path: '/manufacturing' },
  { key: 'procurement', label: { vi: 'Mua hàng', en: 'Procurement' }, color: 'orange', path: '/procurement' },
  { key: 'project', label: { vi: 'Quản lý dự án', en: 'Project Management' }, color: 'purple', path: '/project' },
  { key: 'sales', label: { vi: 'Bán hàng', en: 'Sales' }, color: 'red', path: '/sales' },
  { key: 'other', label: { vi: 'Khác', en: 'Other' }, color: 'teal', path: '/other' },
];

// Finance module sections
export const FINANCE_SECTIONS = [
  {
    title: { vi: 'Báo cáo tài chính', en: 'Financial Reporting' },
    tiles: [
      { id: 'balance-sheet', title: { vi: 'Bảng cân đối kế toán/Báo cáo KQKD', en: 'Balance Sheet/Income Statement' }, icon: 'ti-report-money', type: 'module', module: 'balance-sheet' },
      { id: 'gl-line-items', title: { vi: 'Hiển thị bút toán Sổ cái', en: 'Display Line Items in General Ledger' }, icon: 'ti-table', type: 'app', app: 'gl-line-items' },
      { id: 'cost-centers', title: { vi: 'Trung tâm chi phí', en: 'Cost Centers' }, subtitle: { vi: 'Sổ tổng hợp', en: 'Review Booklet' }, icon: 'ti-file-analytics', type: 'app', app: 'cost-centers' },
    ],
  },
  {
    title: { vi: 'Kế toán dự báo', en: 'Predictive Accounting' },
    tiles: [
      { id: 'sales-acct-overview', title: { vi: 'Tổng quan kế toán bán hàng', en: 'Sales Accounting Overview' }, icon: 'ti-layout-dashboard', type: 'app', app: 'sales-acct-overview' },
      { id: 'incoming-sales-orders', title: { vi: 'Đơn hàng mới về', en: 'Incoming Sales Orders' }, subtitle: { vi: 'Kế toán dự báo', en: 'Predictive Accounting' }, icon: 'ti-shopping-cart', type: 'list', list: 'salesOrders' },
      { id: 'gross-margin', title: { vi: 'Biên lợi nhuận gộp', en: 'Gross Margin' }, subtitle: { vi: 'Dự kiến/Thực tế', en: 'Presumed/Actual' }, icon: 'ti-chart-bar', type: 'app', app: 'gross-margin' },
    ],
  },
  {
    title: { vi: 'Công nợ phải trả', en: 'Accounts Payable' },
    tiles: [
      { id: 'manage-supplier-line-items', title: { vi: 'Quản lý bút toán nhà cung cấp', en: 'Manage Supplier Line Items' }, icon: 'ti-file-invoice', type: 'list', list: 'invoices' },
      { id: 'ap-overview', title: { vi: 'Tổng quan công nợ phải trả', en: 'Accounts Payable Overview' }, icon: 'ti-building-bank', type: 'app', app: 'ap-overview' },
      { id: 'overdue-payables', title: { vi: 'Công nợ quá hạn', en: 'Overdue Payables' }, subtitle: { vi: 'Hôm nay', en: 'Today' }, kpiKey: 'overduePayables', type: 'kpi' },
      { id: 'cash-discount-utilization', title: { vi: 'Tỷ lệ chiết khấu thanh toán', en: 'Cash Discount Utilization' }, subtitle: { vi: 'Hôm nay', en: 'Today' }, kpiKey: 'cashDiscountUtilization', type: 'kpi', tone: 'danger' },
      { id: 'manage-payment-blocks', title: { vi: 'Quản lý chặn thanh toán', en: 'Manage Payment Blocks' }, icon: 'ti-mail', type: 'app', app: 'payment-blocks' },
    ],
  },
  {
    title: { vi: 'Công nợ phải thu', en: 'Accounts Receivable' },
    tiles: [
      { id: 'manage-customer-line-items', title: { vi: 'Quản lý bút toán khách hàng', en: 'Manage Customer Line Items' }, icon: 'ti-user-dollar', type: 'app', app: 'customer-line-items' },
      { id: 'process-receivables', title: { vi: 'Xử lý công nợ phải thu', en: 'Process Receivables' }, icon: 'ti-receipt', type: 'list', list: 'billing' },
      { id: 'total-receivables', title: { vi: 'Tổng công nợ phải thu', en: 'Total Receivables' }, subtitle: { vi: 'Hôm nay', en: 'Today' }, kpiKey: 'totalReceivables', type: 'kpi' },
      { id: 'overdue-receivables', title: { vi: 'Công nợ phải thu quá hạn', en: 'Overdue Receivables' }, subtitle: { vi: 'Hôm nay', en: 'Today' }, kpiKey: 'overdueReceivables', type: 'kpi', tone: 'danger' },
    ],
  },
];

// Procurement module sections
export const PROCUREMENT_SECTIONS = [
  {
    title: { vi: 'Mua hàng', en: 'Procurement' },
    tiles: [
      { id: 'process-pr', title: { vi: 'Xử lý yêu cầu mua hàng', en: 'Process Purchase Requisitions' }, icon: 'ti-shopping-cart', type: 'app', app: 'purchase-requisitions' },
      { id: 'create-po', title: { vi: 'Tạo đơn đặt hàng', en: 'Create Purchase Order' }, icon: 'ti-clipboard-plus', type: 'transaction', txn: 'ME21N' },
      { id: 'manage-po', title: { vi: 'Quản lý đơn đặt hàng', en: 'Manage Purchase Orders' }, icon: 'ti-clipboard-list', type: 'list', list: 'pos' },
      { id: 'post-gr', title: { vi: 'Ghi nhận phiếu nhập kho', en: 'Post Goods Receipt for Purchasing Document' }, icon: 'ti-truck-delivery', type: 'transaction', txn: 'MIGO' },
      { id: 'create-supplier-invoice', title: { vi: 'Tạo hóa đơn nhà cung cấp', en: 'Create Supplier Invoice' }, icon: 'ti-file-dollar', type: 'transaction', txn: 'MIRO' },
      { id: 'supplier-invoices-list', title: { vi: 'Danh sách hóa đơn nhà cung cấp', en: 'Supplier Invoices List' }, icon: 'ti-file-invoice', type: 'list', list: 'invoices' },
      { id: 'monitor-pr-items', title: { vi: 'Theo dõi yêu cầu mua hàng', en: 'Monitor Purchase Requisition Items' }, icon: 'ti-list-search', type: 'app', app: 'purchase-requisitions' },
    ],
  },
  {
    title: { vi: 'Quản lý hợp đồng', en: 'Enterprise Contract Management' },
    tiles: [
      { id: 'request-legal-contract', title: { vi: 'Yêu cầu hợp đồng pháp lý', en: 'Request Legal Contract' }, icon: 'ti-file-plus', type: 'app', app: 'legal-contracts' },
      { id: 'manage-legal-transactions', title: { vi: 'Quản lý giao dịch pháp lý', en: 'Manage Legal Transactions' }, icon: 'ti-gavel', type: 'app', app: 'legal-contracts' },
      { id: 'manage-legal-documents', title: { vi: 'Quản lý văn bản pháp lý', en: 'Manage Legal Documents' }, icon: 'ti-files', type: 'app', app: 'legal-contracts' },
    ],
  },
  {
    title: { vi: 'Tài khoản nhà cung cấp', en: 'Supplier Accounts' },
    tiles: [
      { id: 'manage-supplier-line-items-2', title: { vi: 'Quản lý bút toán nhà cung cấp', en: 'Manage Supplier Line Items' }, icon: 'ti-file-invoice', type: 'list', list: 'invoices' },
      { id: 'manage-payment-blocks-2', title: { vi: 'Quản lý chặn thanh toán', en: 'Manage Payment Blocks' }, icon: 'ti-mail', type: 'app', app: 'payment-blocks' },
      { id: 'display-supplier-list', title: { vi: 'Danh sách nhà cung cấp', en: 'Display Supplier List' }, icon: 'ti-truck', type: 'list', list: 'vendors' },
      { id: 'display-supplier-balances', title: { vi: 'Số dư công nợ nhà cung cấp', en: 'Display Supplier Balances' }, icon: 'ti-report-money', type: 'app', app: 'supplier-balances' },
    ],
  },
];

// Manufacturing & Supply Chain module sections
export const MANUFACTURING_SECTIONS = [
  {
    title: { vi: 'Quản lý chất lượng', en: 'Quality Management' },
    tiles: [
      { id: 'quality-technician-overview', title: { vi: 'Tổng quan KTV chất lượng', en: 'Quality Technician Overview' }, icon: 'ti-notebook', type: 'app', app: 'quality-overview' },
      { id: 'manage-inspection-lots', title: { vi: 'Quản lý lô kiểm tra', en: 'Manage Inspection Lots' }, icon: 'ti-search', type: 'app', app: 'inspection-lots' },
      { id: 'record-inspection-results', title: { vi: 'Ghi nhận kết quả kiểm tra', en: 'Record Inspection Results' }, icon: 'ti-clipboard-check', type: 'app', app: 'inspection-lots' },
      { id: 'quality-engineer-overview', title: { vi: 'Tổng quan kỹ sư chất lượng', en: 'Quality Engineer Overview' }, icon: 'ti-notebook', type: 'app', app: 'quality-overview' },
      { id: 'display-results-history', title: { vi: 'Lịch sử kết quả kiểm tra', en: 'Display Results History' }, icon: 'ti-chart-line', type: 'app', app: 'inspection-lots' },
      { id: 'manage-usage-decisions', title: { vi: 'Quản lý quyết định sử dụng', en: 'Manage Usage Decisions' }, icon: 'ti-stamp', type: 'app', app: 'inspection-lots' },
    ],
  },
  {
    title: { vi: 'Dịch vụ & Quản lý tài sản', en: 'Service and Asset Management' },
    tiles: [
      { id: 'create-maintenance-request', title: { vi: 'Tạo yêu cầu bảo trì', en: 'Create Maintenance Request' }, icon: 'ti-tool', type: 'app', app: 'maintenance-requests' },
      { id: 'screen-maintenance-requests', title: { vi: 'Sàng lọc yêu cầu bảo trì', en: 'Screen Maintenance Requests' }, value: 18, sub: { vi: 'Đang mở', en: 'Open' }, icon: 'ti-clipboard-list', type: 'count', app: 'maintenance-requests' },
      { id: 'find-maintenance-orders', title: { vi: 'Tìm lệnh bảo trì', en: 'Find Maintenance Orders' }, icon: 'ti-search', type: 'app', app: 'maintenance-requests' },
      { id: 'perform-maintenance-jobs', title: { vi: 'Thực hiện công việc bảo trì', en: 'Perform Maintenance Jobs' }, value: 0, icon: 'ti-tool', type: 'count', app: 'maintenance-requests' },
      { id: 'manage-in-house-repairs', title: { vi: 'Quản lý sửa chữa nội bộ', en: 'Manage In-House Repairs' }, value: 12, icon: 'ti-settings', type: 'count', app: 'maintenance-requests' },
    ],
  },
];

// Sales module sections
export const SALES_SECTIONS = [
  {
    title: { vi: 'Quản lý đơn hàng', en: 'Order Management' },
    tiles: [
      { id: 'create-sales-order', title: { vi: 'Tạo đơn bán hàng', en: 'Create Sales Order' }, icon: 'ti-shopping-cart-plus', type: 'transaction', txn: 'VA01' },
      { id: 'sales-order-list', title: { vi: 'Danh sách đơn bán hàng', en: 'Sales Order List' }, icon: 'ti-list-details', type: 'list', list: 'salesOrders' },
      { id: 'manage-sales-orders', title: { vi: 'Quản lý đơn bán hàng', en: 'Manage Sales Orders' }, icon: 'ti-clipboard-list', type: 'list', list: 'salesOrders' },
      { id: 'sales-order-fulfillment', title: { vi: 'Thực hiện đơn hàng', en: 'Sales Order Fulfillment' }, subtitle: { vi: 'Vấn đề phát sinh', en: 'Issues' }, icon: 'ti-truck', type: 'app', app: 'fulfillment-issues' },
    ],
  },
  {
    title: { vi: 'Xuất hóa đơn', en: 'Billing' },
    tiles: [
      { id: 'create-billing-doc', title: { vi: 'Tạo hóa đơn bán hàng', en: 'Create Billing Documents' }, icon: 'ti-receipt-2', type: 'transaction', txn: 'VF01' },
      { id: 'billing-doc-list', title: { vi: 'Danh sách hóa đơn bán hàng', en: 'Billing Documents List' }, icon: 'ti-files', type: 'list', list: 'billing' },
      { id: 'incoming-sales-orders-2', title: { vi: 'Đơn hàng mới về', en: 'Incoming Sales Orders' }, subtitle: { vi: 'Kế toán dự báo', en: 'Predictive Accounting' }, icon: 'ti-shopping-cart', type: 'list', list: 'salesOrders' },
    ],
  },
  {
    title: { vi: 'Phân tích bán hàng', en: 'Sales Analytics' },
    tiles: [
      { id: 'sales-overview', title: { vi: 'Tổng quan bán hàng', en: 'Sales Overview' }, icon: 'ti-chart-bar', type: 'app', app: 'sales-overview' },
      { id: 'gross-margin-sales', title: { vi: 'Biên lợi nhuận gộp', en: 'Gross Margin' }, subtitle: { vi: 'Dự kiến/Thực tế', en: 'Presumed/Actual' }, icon: 'ti-chart-line', type: 'app', app: 'gross-margin' },
      { id: 'top-customers', title: { vi: 'Khách hàng hàng đầu', en: 'Top Customers' }, icon: 'ti-users', type: 'app', app: 'top-customers' },
    ],
  },
];

// Project Management module sections (PS)
export const PROJECT_SECTIONS = [
  {
    title: { vi: 'Lập kế hoạch dự án', en: 'Project Planning' },
    tiles: [
      { id: 'create-project', title: { vi: 'Tạo dự án', en: 'Create Project' }, icon: 'ti-folder-plus', type: 'app', app: 'projects' },
      { id: 'manage-projects', title: { vi: 'Quản lý dự án', en: 'Manage Projects' }, icon: 'ti-list-details', type: 'app', app: 'projects' },
      { id: 'project-overview', title: { vi: 'Tổng quan dự án', en: 'Project Overview' }, icon: 'ti-layout-dashboard', type: 'app', app: 'projects' },
      { id: 'wbs-elements', title: { vi: 'Quản lý cấu trúc WBS', en: 'Manage WBS Elements' }, icon: 'ti-sitemap', type: 'app', app: 'wbs-elements' },
    ],
  },
  {
    title: { vi: 'Thực thi dự án', en: 'Project Execution' },
    tiles: [
      { id: 'confirm-activities', title: { vi: 'Xác nhận hoạt động', en: 'Confirm Activities' }, icon: 'ti-checkbox', type: 'app', app: 'activities' },
      { id: 'project-issues', title: { vi: 'Quản lý vấn đề dự án', en: 'Manage Project Issues' }, subtitle: { vi: 'Đang mở', en: 'Open' }, icon: 'ti-alert-circle', type: 'count', value: 3, app: 'project-issues' },
      { id: 'milestones', title: { vi: 'Theo dõi mốc tiến độ', en: 'Track Milestones' }, icon: 'ti-flag', type: 'app', app: 'milestones' },
    ],
  },
  {
    title: { vi: 'Tài chính dự án', en: 'Project Financials' },
    tiles: [
      { id: 'project-budget', title: { vi: 'Quản lý ngân sách dự án', en: 'Manage Project Budget' }, icon: 'ti-cash', type: 'app', app: 'project-budget' },
      { id: 'project-actuals', title: { vi: 'Thực chi so với kế hoạch', en: 'Project Actuals vs Plan' }, icon: 'ti-chart-line', type: 'app', app: 'project-budget' },
      { id: 'cost-forecast', title: { vi: 'Dự báo chi phí', en: 'Cost Forecast' }, subtitle: { vi: 'Số tiền khả dụng', en: 'Available Amount' }, icon: 'ti-report-money', type: 'app', app: 'project-budget' },
    ],
  },
];

export const STOCK_LIST_TITLE = { vi: 'MB52 — Hiển thị tồn kho', en: 'MB52 — Display Warehouse Stock' };

// ─────────────────────────────────────────────────────────────
// APP_REGISTRY: định nghĩa nội dung cho mỗi "Generic Fiori App"
// (các tile type: 'app'). title/description song ngữ; static-table
// rows giữ dữ liệu thô (số liệu không cần dịch), columns song ngữ.
// ─────────────────────────────────────────────────────────────
export const APP_REGISTRY = {
  'gl-line-items': {
    title: { vi: 'Hiển thị bút toán Sổ cái', en: 'Display Line Items in General Ledger' },
    icon: 'ti-table',
    description: { vi: 'Danh sách bút toán sổ cái tổng hợp, bao gồm cả các chứng từ FI tự sinh từ giao dịch MIRO/VF01.', en: 'Consolidated general ledger line items, including FI documents auto-generated from MIRO/VF01.' },
    kind: 'fi-documents',
  },
  'cost-centers': {
    title: { vi: 'Trung tâm chi phí — Sổ tổng hợp', en: 'Cost Centers — Review Booklet' },
    icon: 'ti-file-analytics',
    description: { vi: 'Tổng hợp chi phí theo trung tâm chi phí (cost center) trong kỳ hiện tại.', en: 'Cost summary by cost center for the current period.' },
    kind: 'static-table',
    columns: [
      { vi: 'Mã TT chi phí', en: 'Cost Center' },
      { vi: 'Tên', en: 'Name' },
      { vi: 'Kế hoạch', en: 'Plan' },
      { vi: 'Thực tế', en: 'Actual' },
      { vi: 'Chênh lệch', en: 'Variance' },
    ],
    rows: [
      ['CC-1010', { vi: 'Nhà máy sản xuất 1010', en: 'Production Plant 1010' }, '8,500,000,000', '8,120,000,000', '-380,000,000'],
      ['CC-2010', { vi: 'Kho vận & Logistics', en: 'Warehouse & Logistics' }, '3,200,000,000', '3,450,000,000', '+250,000,000'],
      ['CC-3010', { vi: 'Bán hàng & Phân phối', en: 'Sales & Distribution' }, '2,100,000,000', '1,980,000,000', '-120,000,000'],
      ['CC-4010', { vi: 'Hành chính tổng hợp', en: 'General Administration' }, '1,500,000,000', '1,520,000,000', '+20,000,000'],
    ],
  },
  'sales-acct-overview': {
    title: { vi: 'Tổng quan kế toán bán hàng', en: 'Sales Accounting Overview' },
    icon: 'ti-layout-dashboard',
    description: { vi: 'Tổng quan kế toán bán hàng — đối chiếu giữa Sales Order đã tạo và Billing Document đã đăng.', en: 'Sales accounting overview — reconciliation between created Sales Orders and posted Billing Documents.' },
    kind: 'sales-overview',
  },
  'gross-margin': {
    title: { vi: 'Biên lợi nhuận gộp — Dự kiến/Thực tế', en: 'Gross Margin — Presumed/Actual' },
    icon: 'ti-chart-bar',
    description: { vi: 'So sánh biên lợi nhuận gộp dự kiến và thực tế dựa trên các hóa đơn bán hàng đã đăng.', en: 'Compares presumed vs actual gross margin based on posted billing documents.' },
    kind: 'gross-margin',
  },
  'ap-overview': {
    title: { vi: 'Tổng quan công nợ phải trả', en: 'Accounts Payable Overview' },
    icon: 'ti-building-bank',
    description: { vi: 'Tổng quan công nợ phải trả, tổng hợp từ các hóa đơn nhà cung cấp đã đăng qua MIRO.', en: 'Accounts payable overview, aggregated from supplier invoices posted via MIRO.' },
    kind: 'ap-overview',
  },
  'payment-blocks': {
    title: { vi: 'Quản lý chặn thanh toán', en: 'Manage Payment Blocks' },
    icon: 'ti-mail',
    description: { vi: 'Danh sách hóa đơn đang bị giữ thanh toán (payment block) do vượt ngưỡng hoặc cần phê duyệt.', en: 'List of invoices on payment block due to threshold or approval requirements.' },
    kind: 'payment-blocks',
  },
  'customer-line-items': {
    title: { vi: 'Quản lý bút toán khách hàng', en: 'Manage Customer Line Items' },
    icon: 'ti-user-dollar',
    description: { vi: 'Chi tiết công nợ phải thu theo từng khách hàng, tổng hợp từ Billing Document.', en: 'Receivable details by customer, aggregated from Billing Documents.' },
    kind: 'customer-line-items',
  },
  'purchase-requisitions': {
    title: { vi: 'Yêu cầu mua hàng', en: 'Purchase Requisitions' },
    icon: 'ti-shopping-cart',
    description: { vi: 'Yêu cầu mua hàng nội bộ — các yêu cầu đã được chuyển thành Purchase Order sẽ hiển thị trạng thái Converted.', en: 'Internal purchase requisitions — requests already converted to a Purchase Order show status Converted.' },
    kind: 'purchase-requisitions',
  },
  'legal-contracts': {
    title: { vi: 'Quản lý hợp đồng', en: 'Enterprise Contract Management' },
    icon: 'ti-gavel',
    description: { vi: 'Hợp đồng pháp lý với nhà cung cấp, liên kết theo từng vendor trong hệ thống.', en: 'Legal contracts with suppliers, linked to each vendor in the system.' },
    kind: 'legal-contracts',
  },
  'supplier-balances': {
    title: { vi: 'Số dư công nợ nhà cung cấp', en: 'Display Supplier Balances' },
    icon: 'ti-report-money',
    description: { vi: 'Số dư công nợ hiện tại theo từng nhà cung cấp, tính từ các hóa đơn đã đăng trừ đi giả định đã thanh toán 60%.', en: 'Current outstanding balance per supplier, calculated from posted invoices assuming 60% already paid.' },
    kind: 'supplier-balances',
  },
  'quality-overview': {
    title: { vi: 'Tổng quan chất lượng', en: 'Quality Overview' },
    icon: 'ti-notebook',
    description: { vi: 'Tổng quan chất lượng — số lô kiểm tra đang mở và tỷ lệ đạt/không đạt trong 30 ngày gần nhất.', en: 'Quality overview — open inspection lots and pass/fail rate over the last 30 days.' },
    kind: 'static-kpi-grid',
    items: [
      { label: { vi: 'Lô đang chờ kiểm tra', en: 'Inspection lots open' }, value: '26', tone: 'default' },
      { label: { vi: 'Tỷ lệ đạt (30 ngày)', en: 'Pass rate (30 days)' }, value: '94.2%', tone: 'success' },
      { label: { vi: 'Quyết định sử dụng chờ duyệt', en: 'Usage decisions pending' }, value: '4', tone: 'warning' },
      { label: { vi: 'Cần kiểm tra lại', en: 'Reinspections required' }, value: '2', tone: 'danger' },
    ],
  },
  'inspection-lots': {
    title: { vi: 'Quản lý lô kiểm tra', en: 'Manage Inspection Lots' },
    icon: 'ti-search',
    description: { vi: 'Danh sách lô hàng đang chờ kiểm tra chất lượng, sinh ra từ các Goods Receipt (MIGO) gần nhất.', en: 'Lots pending quality inspection, generated from recent Goods Receipts (MIGO).' },
    kind: 'inspection-lots',
  },
  'maintenance-requests': {
    title: { vi: 'Yêu cầu bảo trì', en: 'Maintenance Requests' },
    icon: 'ti-tool',
    description: { vi: 'Yêu cầu bảo trì thiết bị tại các plant sản xuất.', en: 'Equipment maintenance requests across production plants.' },
    kind: 'static-table',
    columns: [
      { vi: 'Yêu cầu', en: 'Request' },
      { vi: 'Thiết bị', en: 'Equipment' },
      { vi: 'Plant', en: 'Plant' },
      { vi: 'Ưu tiên', en: 'Priority' },
      { vi: 'Trạng thái', en: 'Status' },
    ],
    rows: [
      ['MR-90001', 'Conveyor Belt A12', '1010', { vi: 'Cao', en: 'High' }, { vi: 'Đang mở', en: 'Open' }],
      ['MR-90002', 'Crane STS-03', '1010', { vi: 'Trung bình', en: 'Medium' }, { vi: 'Đang xử lý', en: 'In Progress' }],
      ['MR-90003', 'Forklift FL-08', '1010', { vi: 'Thấp', en: 'Low' }, { vi: 'Đang mở', en: 'Open' }],
      ['MR-90004', 'Cold Storage Unit 2', '1020', { vi: 'Cao', en: 'High' }, { vi: 'Đã lên lịch', en: 'Scheduled' }],
    ],
  },
  'fulfillment-issues': {
    title: { vi: 'Vấn đề thực hiện đơn hàng', en: 'Sales Order Fulfillment Issues' },
    icon: 'ti-truck',
    description: { vi: 'Các Sales Order đang gặp vấn đề về tồn kho (Backorder) cần xử lý.', en: 'Sales Orders currently facing stock issues (Backorder) requiring action.' },
    kind: 'fulfillment-issues',
  },
  'sales-overview': {
    title: { vi: 'Tổng quan bán hàng', en: 'Sales Overview' },
    icon: 'ti-chart-bar',
    description: { vi: 'Tổng quan hoạt động bán hàng — số đơn, doanh thu, và phân bổ theo khách hàng.', en: 'Sales activity overview — order count, revenue, and customer distribution.' },
    kind: 'sales-overview',
  },
  'top-customers': {
    title: { vi: 'Khách hàng hàng đầu', en: 'Top Customers' },
    icon: 'ti-users',
    description: { vi: 'Xếp hạng khách hàng theo tổng giá trị Sales Order đã tạo.', en: 'Customer ranking by total Sales Order value created.' },
    kind: 'top-customers',
  },
  'projects': {
    title: { vi: 'Quản lý dự án', en: 'Manage Projects' },
    icon: 'ti-list-details',
    description: { vi: 'Danh sách dự án đang triển khai (dữ liệu mẫu cho mục đích demo).', en: 'List of ongoing projects (sample data for demo purposes).' },
    kind: 'static-table',
    columns: [
      { vi: 'Dự án', en: 'Project' },
      { vi: 'Tên', en: 'Name' },
      { vi: 'Quản lý', en: 'Manager' },
      { vi: 'Trạng thái', en: 'Status' },
      { vi: '% Hoàn thành', en: '% Complete' },
    ],
    rows: [
      ['PRJ-001', { vi: 'Mở rộng kho Plant 1010', en: 'Expand Warehouse Plant 1010' }, 'Nguyễn Văn A', { vi: 'Đang xử lý', en: 'In Progress' }, '62%'],
      ['PRJ-002', { vi: 'Triển khai SAP S/4HANA', en: 'SAP S/4HANA Implementation' }, 'Trần Thị B', { vi: 'Đang xử lý', en: 'In Progress' }, '38%'],
      ['PRJ-003', { vi: 'Tối ưu chuỗi cung ứng Q3', en: 'Q3 Supply Chain Optimization' }, 'Lê Văn C', { vi: 'Lập kế hoạch', en: 'Planning' }, '10%'],
    ],
  },
  'wbs-elements': {
    title: { vi: 'Quản lý cấu trúc WBS', en: 'Manage WBS Elements' },
    icon: 'ti-sitemap',
    description: { vi: 'Cấu trúc phân rã công việc (Work Breakdown Structure) cho các dự án đang triển khai.', en: 'Work Breakdown Structure for ongoing projects.' },
    kind: 'static-table',
    columns: [
      { vi: 'Mã WBS', en: 'WBS Element' },
      { vi: 'Diễn giải', en: 'Description' },
      { vi: 'Dự án', en: 'Project' },
      { vi: 'Ngân sách', en: 'Budget' },
    ],
    rows: [
      ['1.1', { vi: 'Khảo sát & thiết kế', en: 'Survey & Design' }, 'PRJ-001', '1,200,000,000'],
      ['1.2', { vi: 'Thi công xây dựng', en: 'Construction' }, 'PRJ-001', '8,500,000,000'],
      ['2.1', { vi: 'Cấu hình hệ thống', en: 'System Configuration' }, 'PRJ-002', '2,400,000,000'],
      ['2.2', { vi: 'Đào tạo người dùng', en: 'User Training' }, 'PRJ-002', '600,000,000'],
    ],
  },
  'activities': {
    title: { vi: 'Xác nhận hoạt động', en: 'Confirm Activities' },
    icon: 'ti-checkbox',
    description: { vi: 'Xác nhận tiến độ các hoạt động trong dự án (dữ liệu mẫu).', en: 'Confirm progress of project activities (sample data).' },
    kind: 'static-table',
    columns: [
      { vi: 'Hoạt động', en: 'Activity' },
      { vi: 'WBS', en: 'WBS' },
      { vi: 'Giờ kế hoạch', en: 'Planned Hours' },
      { vi: 'Giờ thực tế', en: 'Actual Hours' },
      { vi: 'Trạng thái', en: 'Status' },
    ],
    rows: [
      ['ACT-001', '1.1', '160', '142', { vi: 'Hoàn thành', en: 'Completed' }],
      ['ACT-002', '1.2', '800', '510', { vi: 'Đang xử lý', en: 'In Progress' }],
      ['ACT-003', '2.1', '240', '90', { vi: 'Đang xử lý', en: 'In Progress' }],
    ],
  },
  'project-issues': {
    title: { vi: 'Quản lý vấn đề dự án', en: 'Manage Project Issues' },
    icon: 'ti-alert-circle',
    description: { vi: 'Vấn đề phát sinh trong quá trình triển khai dự án cần xử lý.', en: 'Issues arising during project implementation that require action.' },
    kind: 'static-table',
    columns: [
      { vi: 'Vấn đề', en: 'Issue' },
      { vi: 'Dự án', en: 'Project' },
      { vi: 'Mức độ', en: 'Severity' },
      { vi: 'Trạng thái', en: 'Status' },
    ],
    rows: [
      ['ISS-01', 'PRJ-001', { vi: 'Cao', en: 'High' }, { vi: 'Đang mở', en: 'Open' }],
      ['ISS-02', 'PRJ-002', { vi: 'Trung bình', en: 'Medium' }, { vi: 'Đang mở', en: 'Open' }],
      ['ISS-03', 'PRJ-002', { vi: 'Thấp', en: 'Low' }, { vi: 'Đã giải quyết', en: 'Resolved' }],
    ],
  },
  'milestones': {
    title: { vi: 'Theo dõi mốc tiến độ', en: 'Track Milestones' },
    icon: 'ti-flag',
    description: { vi: 'Các mốc quan trọng trong tiến độ dự án.', en: 'Key milestones in project progress.' },
    kind: 'static-table',
    columns: [
      { vi: 'Mốc tiến độ', en: 'Milestone' },
      { vi: 'Dự án', en: 'Project' },
      { vi: 'Hạn hoàn thành', en: 'Due Date' },
      { vi: 'Trạng thái', en: 'Status' },
    ],
    rows: [
      [{ vi: 'Go-Live Giai đoạn 1', en: 'Go-Live Phase 1' }, 'PRJ-002', '2026-08-15', { vi: 'Đúng tiến độ', en: 'On Track' }],
      [{ vi: 'Hoàn thành thi công', en: 'Construction Complete' }, 'PRJ-001', '2026-09-30', { vi: 'Có rủi ro', en: 'At Risk' }],
      [{ vi: 'Nghiệm thu cuối kỳ', en: 'Final Acceptance' }, 'PRJ-003', '2026-12-01', { vi: 'Chưa bắt đầu', en: 'Not Started' }],
    ],
  },
  'project-budget': {
    title: { vi: 'Quản lý ngân sách dự án', en: 'Manage Project Budget' },
    icon: 'ti-cash',
    description: { vi: 'Ngân sách dự án — kế hoạch so với thực chi.', en: 'Project budget — plan vs actual spending.' },
    kind: 'static-table',
    columns: [
      { vi: 'Dự án', en: 'Project' },
      { vi: 'Ngân sách', en: 'Budget' },
      { vi: 'Đã cam kết', en: 'Committed' },
      { vi: 'Thực chi', en: 'Actual' },
      { vi: 'Còn khả dụng', en: 'Available' },
    ],
    rows: [
      ['PRJ-001', '9,700,000,000', '7,200,000,000', '6,800,000,000', '2,900,000,000'],
      ['PRJ-002', '3,000,000,000', '2,400,000,000', '1,950,000,000', '1,050,000,000'],
      ['PRJ-003', '1,800,000,000', '300,000,000', '180,000,000', '1,620,000,000'],
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// SEARCH_INDEX: danh sách phẳng tất cả tile có thể điều hướng,
// dùng cho thanh search trên FioriShell. Trả title theo lang.
// ─────────────────────────────────────────────────────────────
function tilesToSearchEntries(sections, modulePath, moduleLabel, lang) {
  const entries = [];
  sections.forEach((section) => {
    section.tiles.forEach((tile) => {
      let path = modulePath;
      if (tile.type === 'transaction') path = `/transaction/${tile.txn}`;
      else if (tile.type === 'list') path = `/list/${tile.list}`;
      else if (tile.type === 'app' || tile.type === 'count') path = `/app/${tile.app}`;
      else if (tile.type === 'module') path = `/module/${tile.module}`;
      entries.push({
        id: `${moduleLabel}-${tile.id}`,
        title: tr(tile.title, lang),
        module: moduleLabel,
        path,
        icon: tile.icon || 'ti-app-window',
      });
    });
  });
  return entries;
}

export function getSearchIndex(lang = 'vi') {
  return [
    ...tilesToSearchEntries(FINANCE_SECTIONS, '/finance', tr(NAV_TABS[1].label, lang), lang),
    ...tilesToSearchEntries(PROCUREMENT_SECTIONS, '/procurement', tr(NAV_TABS[3].label, lang), lang),
    ...tilesToSearchEntries(MANUFACTURING_SECTIONS, '/manufacturing', tr(NAV_TABS[2].label, lang), lang),
    ...tilesToSearchEntries(SALES_SECTIONS, '/sales', tr(NAV_TABS[5].label, lang), lang),
    ...tilesToSearchEntries(PROJECT_SECTIONS, '/project', tr(NAV_TABS[4].label, lang), lang),
  ];
}
