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

export const NAV_TABS = [
  { key: 'home', label: 'My Home', path: '/' },
  { key: 'finance', label: 'Finance', path: '/finance' },
  { key: 'manufacturing', label: 'Manufacturing and Supply Chain', path: '/manufacturing' },
  { key: 'procurement', label: 'Procurement', path: '/procurement' },
  { key: 'project', label: 'Project Management', path: '/project' },
  { key: 'sales', label: 'Sales', path: '/sales' },
  { key: 'other', label: 'Other', path: '/other' },
];

export const PAGE_CARDS = [
  { key: 'finance', label: 'Finance', color: 'blue', path: '/finance' },
  { key: 'manufacturing', label: 'Manufacturing and Supply Chain', color: 'pink', path: '/manufacturing' },
  { key: 'procurement', label: 'Procurement', color: 'orange', path: '/procurement' },
  { key: 'project', label: 'Project Management', color: 'purple', path: '/project' },
  { key: 'sales', label: 'Sales', color: 'red', path: '/sales' },
  { key: 'other', label: 'Other', color: 'teal', path: '/other' },
];

// Finance module sections (theo ảnh đã chụp)
export const FINANCE_SECTIONS = [
  {
    title: 'Financial Reporting',
    tiles: [
      { id: 'balance-sheet', title: 'Balance Sheet/Income Statement', icon: 'ti-report-money', type: 'app', app: 'balance-sheet' },
      { id: 'gl-line-items', title: 'Display Line Items in General Ledger', icon: 'ti-table', type: 'app', app: 'gl-line-items' },
      { id: 'cost-centers', title: 'Cost Centers', subtitle: 'Review Booklet', icon: 'ti-file-analytics', type: 'app', app: 'cost-centers' },
    ],
  },
  {
    title: 'Predictive Accounting',
    tiles: [
      { id: 'sales-acct-overview', title: 'Sales Accounting Overview', icon: 'ti-layout-dashboard', type: 'app', app: 'sales-acct-overview' },
      { id: 'incoming-sales-orders', title: 'Incoming Sales Orders', subtitle: 'Predictive Accounting', icon: 'ti-shopping-cart', type: 'list', list: 'salesOrders' },
      { id: 'gross-margin', title: 'Gross Margin', subtitle: 'Presumed/Actual', icon: 'ti-chart-bar', type: 'app', app: 'gross-margin' },
    ],
  },
  {
    title: 'Accounts Payable',
    tiles: [
      { id: 'manage-supplier-line-items', title: 'Manage Supplier Line Items', icon: 'ti-file-invoice', type: 'list', list: 'invoices' },
      { id: 'ap-overview', title: 'Accounts Payable Overview', icon: 'ti-building-bank', type: 'app', app: 'ap-overview' },
      { id: 'overdue-payables', title: 'Overdue Payables', subtitle: 'Today', kpiKey: 'overduePayables', type: 'kpi' },
      { id: 'cash-discount-utilization', title: 'Cash Discount Utilization', subtitle: 'Today', kpiKey: 'cashDiscountUtilization', type: 'kpi', tone: 'danger' },
      { id: 'manage-payment-blocks', title: 'Manage Payment Blocks', icon: 'ti-mail', type: 'app', app: 'payment-blocks' },
    ],
  },
  {
    title: 'Accounts Receivable',
    tiles: [
      { id: 'manage-customer-line-items', title: 'Manage Customer Line Items', icon: 'ti-user-dollar', type: 'app', app: 'customer-line-items' },
      { id: 'process-receivables', title: 'Process Receivables', icon: 'ti-receipt', type: 'list', list: 'billing' },
      { id: 'total-receivables', title: 'Total Receivables', subtitle: 'Today', kpiKey: 'totalReceivables', type: 'kpi' },
      { id: 'overdue-receivables', title: 'Overdue Receivables', subtitle: 'Today', kpiKey: 'overdueReceivables', type: 'kpi', tone: 'danger' },
    ],
  },
];

// Procurement module sections
export const PROCUREMENT_SECTIONS = [
  {
    title: 'Procurement',
    tiles: [
      { id: 'process-pr', title: 'Process Purchase Requisitions', icon: 'ti-shopping-cart', type: 'app', app: 'purchase-requisitions' },
      { id: 'manage-po', title: 'Manage Purchase Orders', icon: 'ti-clipboard-list', type: 'transaction', txn: 'ME21N' },
      { id: 'post-gr', title: 'Post Goods Receipt for Purchasing Document', icon: 'ti-truck-delivery', type: 'transaction', txn: 'MIGO' },
      { id: 'create-supplier-invoice', title: 'Create Supplier Invoice', icon: 'ti-file-dollar', type: 'transaction', txn: 'MIRO' },
      { id: 'supplier-invoices-list', title: 'Supplier Invoices List', icon: 'ti-file-invoice', type: 'list', list: 'invoices' },
      { id: 'monitor-pr-items', title: 'Monitor Purchase Requisition Items', icon: 'ti-list-search', type: 'app', app: 'purchase-requisitions' },
    ],
  },
  {
    title: 'Enterprise Contract Management',
    tiles: [
      { id: 'request-legal-contract', title: 'Request Legal Contract', icon: 'ti-file-plus', type: 'app', app: 'legal-contracts' },
      { id: 'manage-legal-transactions', title: 'Manage Legal Transactions', icon: 'ti-gavel', type: 'app', app: 'legal-contracts' },
      { id: 'manage-legal-documents', title: 'Manage Legal Documents', icon: 'ti-files', type: 'app', app: 'legal-contracts' },
    ],
  },
  {
    title: 'Supplier Accounts',
    tiles: [
      { id: 'manage-supplier-line-items-2', title: 'Manage Supplier Line Items', icon: 'ti-file-invoice', type: 'list', list: 'invoices' },
      { id: 'manage-payment-blocks-2', title: 'Manage Payment Blocks', icon: 'ti-mail', type: 'app', app: 'payment-blocks' },
      { id: 'display-supplier-list', title: 'Display Supplier List', icon: 'ti-truck', type: 'list', list: 'vendors' },
      { id: 'display-supplier-balances', title: 'Display Supplier Balances', icon: 'ti-report-money', type: 'app', app: 'supplier-balances' },
    ],
  },
];

// Manufacturing & Supply Chain module sections
export const MANUFACTURING_SECTIONS = [
  {
    title: 'Quality Management',
    tiles: [
      { id: 'quality-technician-overview', title: 'Quality Technician Overview', icon: 'ti-notebook', type: 'app', app: 'quality-overview' },
      { id: 'manage-inspection-lots', title: 'Manage Inspection Lots', icon: 'ti-search', type: 'app', app: 'inspection-lots' },
      { id: 'record-inspection-results', title: 'Record Inspection Results', icon: 'ti-clipboard-check', type: 'app', app: 'inspection-lots' },
      { id: 'quality-engineer-overview', title: 'Quality Engineer Overview', icon: 'ti-notebook', type: 'app', app: 'quality-overview' },
      { id: 'display-results-history', title: 'Display Results History', icon: 'ti-chart-line', type: 'app', app: 'inspection-lots' },
      { id: 'manage-usage-decisions', title: 'Manage Usage Decisions', icon: 'ti-stamp', type: 'app', app: 'inspection-lots' },
    ],
  },
  {
    title: 'Service and Asset Management',
    tiles: [
      { id: 'create-maintenance-request', title: 'Create Maintenance Request', icon: 'ti-tool', type: 'app', app: 'maintenance-requests' },
      { id: 'screen-maintenance-requests', title: 'Screen Maintenance Requests', value: 18, sub: 'Open', icon: 'ti-clipboard-list', type: 'count', app: 'maintenance-requests' },
      { id: 'find-maintenance-orders', title: 'Find Maintenance Orders', icon: 'ti-search', type: 'app', app: 'maintenance-requests' },
      { id: 'perform-maintenance-jobs', title: 'Perform Maintenance Jobs', value: 0, icon: 'ti-tool', type: 'count', app: 'maintenance-requests' },
      { id: 'manage-in-house-repairs', title: 'Manage In-House Repairs', value: 12, icon: 'ti-settings', type: 'count', app: 'maintenance-requests' },
    ],
  },
];

// Sales module sections
export const SALES_SECTIONS = [
  {
    title: 'Order Management',
    tiles: [
      { id: 'create-sales-order', title: 'Create Sales Order', icon: 'ti-shopping-cart-plus', type: 'transaction', txn: 'VA01' },
      { id: 'sales-order-list', title: 'Sales Order List', icon: 'ti-list-details', type: 'list', list: 'salesOrders' },
      { id: 'manage-sales-orders', title: 'Manage Sales Orders', icon: 'ti-clipboard-list', type: 'list', list: 'salesOrders' },
      { id: 'sales-order-fulfillment', title: 'Sales Order Fulfillment', subtitle: 'Issues', icon: 'ti-truck', type: 'app', app: 'fulfillment-issues' },
    ],
  },
  {
    title: 'Billing',
    tiles: [
      { id: 'create-billing-doc', title: 'Create Billing Documents', icon: 'ti-receipt-2', type: 'transaction', txn: 'VF01' },
      { id: 'billing-doc-list', title: 'Billing Documents List', icon: 'ti-files', type: 'list', list: 'billing' },
      { id: 'incoming-sales-orders-2', title: 'Incoming Sales Orders', subtitle: 'Predictive Accounting', icon: 'ti-shopping-cart', type: 'list', list: 'salesOrders' },
    ],
  },
  {
    title: 'Sales Analytics',
    tiles: [
      { id: 'sales-overview', title: 'Sales Overview', icon: 'ti-chart-bar', type: 'app', app: 'sales-overview' },
      { id: 'gross-margin-sales', title: 'Gross Margin', subtitle: 'Presumed/Actual', icon: 'ti-chart-line', type: 'app', app: 'gross-margin' },
      { id: 'top-customers', title: 'Top Customers', icon: 'ti-users', type: 'app', app: 'top-customers' },
    ],
  },
];

// Project Management module sections (PS)
export const PROJECT_SECTIONS = [
  {
    title: 'Project Planning',
    tiles: [
      { id: 'create-project', title: 'Create Project', icon: 'ti-folder-plus', type: 'app', app: 'projects' },
      { id: 'manage-projects', title: 'Manage Projects', icon: 'ti-list-details', type: 'app', app: 'projects' },
      { id: 'project-overview', title: 'Project Overview', icon: 'ti-layout-dashboard', type: 'app', app: 'projects' },
      { id: 'wbs-elements', title: 'Manage WBS Elements', icon: 'ti-sitemap', type: 'app', app: 'wbs-elements' },
    ],
  },
  {
    title: 'Project Execution',
    tiles: [
      { id: 'confirm-activities', title: 'Confirm Activities', icon: 'ti-checkbox', type: 'app', app: 'activities' },
      { id: 'project-issues', title: 'Manage Project Issues', subtitle: 'Open', icon: 'ti-alert-circle', type: 'count', value: 3, app: 'project-issues' },
      { id: 'milestones', title: 'Track Milestones', icon: 'ti-flag', type: 'app', app: 'milestones' },
    ],
  },
  {
    title: 'Project Financials',
    tiles: [
      { id: 'project-budget', title: 'Manage Project Budget', icon: 'ti-cash', type: 'app', app: 'project-budget' },
      { id: 'project-actuals', title: 'Project Actuals vs Plan', icon: 'ti-chart-line', type: 'app', app: 'project-budget' },
      { id: 'cost-forecast', title: 'Cost Forecast', subtitle: 'Available Amount', icon: 'ti-report-money', type: 'app', app: 'project-budget' },
    ],
  },
];

export const STOCK_LIST_TITLE = 'MB52 — Display Warehouse Stock';

// ─────────────────────────────────────────────────────────────
// APP_REGISTRY: định nghĩa nội dung cho mỗi "Generic Fiori App"
// (các tile type: 'app'). Mỗi app có dạng List Report chuẩn Fiori:
// tiêu đề, mô tả ngắn, cột bảng, và nguồn dữ liệu lấy từ store
// hoặc dữ liệu tĩnh mô phỏng (cho các nghiệp vụ chưa có transaction
// thật, ví dụ Balance Sheet, Cost Centers...).
// ─────────────────────────────────────────────────────────────
export const APP_REGISTRY = {
  'balance-sheet': {
    title: 'Balance Sheet/Income Statement',
    icon: 'ti-report-money',
    description: 'Báo cáo tài chính tổng hợp theo kỳ kế toán hiện tại.',
    kind: 'static-table',
    columns: ['Account', 'Description', 'Current Period', 'Prior Period'],
    rows: [
      ['100000', 'Cash and Cash Equivalents', '12,450,000,000', '10,820,000,000'],
      ['120000', 'Accounts Receivable', '270,000,000,000', '255,000,000,000'],
      ['200000', 'Inventory', '84,300,000,000', '79,100,000,000'],
      ['300000', 'Accounts Payable', '40,640,000,000', '38,200,000,000'],
      ['400000', 'Revenue', '512,000,000,000', '478,500,000,000'],
      ['500000', 'Cost of Goods Sold', '341,000,000,000', '318,900,000,000'],
    ],
  },
  'gl-line-items': {
    title: 'Display Line Items in General Ledger',
    icon: 'ti-table',
    description: 'Danh sách bút toán sổ cái tổng hợp, bao gồm cả các chứng từ FI tự sinh từ giao dịch MIRO/VF01.',
    kind: 'fi-documents',
  },
  'cost-centers': {
    title: 'Cost Centers — Review Booklet',
    icon: 'ti-file-analytics',
    description: 'Tổng hợp chi phí theo trung tâm chi phí (cost center) trong kỳ hiện tại.',
    kind: 'static-table',
    columns: ['Cost Center', 'Name', 'Plan', 'Actual', 'Variance'],
    rows: [
      ['CC-1010', 'Production Plant 1010', '8,500,000,000', '8,120,000,000', '-380,000,000'],
      ['CC-2010', 'Warehouse & Logistics', '3,200,000,000', '3,450,000,000', '+250,000,000'],
      ['CC-3010', 'Sales & Distribution', '2,100,000,000', '1,980,000,000', '-120,000,000'],
      ['CC-4010', 'General Administration', '1,500,000,000', '1,520,000,000', '+20,000,000'],
    ],
  },
  'sales-acct-overview': {
    title: 'Sales Accounting Overview',
    icon: 'ti-layout-dashboard',
    description: 'Tổng quan kế toán bán hàng — đối chiếu giữa Sales Order đã tạo và Billing Document đã đăng.',
    kind: 'sales-overview',
  },
  'gross-margin': {
    title: 'Gross Margin — Presumed/Actual',
    icon: 'ti-chart-bar',
    description: 'So sánh biên lợi nhuận gộp dự kiến và thực tế dựa trên các hóa đơn bán hàng đã đăng.',
    kind: 'gross-margin',
  },
  'ap-overview': {
    title: 'Accounts Payable Overview',
    icon: 'ti-building-bank',
    description: 'Tổng quan công nợ phải trả, tổng hợp từ các hóa đơn nhà cung cấp đã đăng qua MIRO.',
    kind: 'ap-overview',
  },
  'payment-blocks': {
    title: 'Manage Payment Blocks',
    icon: 'ti-mail',
    description: 'Danh sách hóa đơn đang bị giữ thanh toán (payment block) do vượt ngưỡng hoặc cần phê duyệt.',
    kind: 'payment-blocks',
  },
  'customer-line-items': {
    title: 'Manage Customer Line Items',
    icon: 'ti-user-dollar',
    description: 'Chi tiết công nợ phải thu theo từng khách hàng, tổng hợp từ Billing Document.',
    kind: 'customer-line-items',
  },
  'purchase-requisitions': {
    title: 'Purchase Requisitions',
    icon: 'ti-shopping-cart',
    description: 'Yêu cầu mua hàng nội bộ — các yêu cầu đã được chuyển thành Purchase Order sẽ hiển thị trạng thái Converted.',
    kind: 'purchase-requisitions',
  },
  'legal-contracts': {
    title: 'Enterprise Contract Management',
    icon: 'ti-gavel',
    description: 'Hợp đồng pháp lý với nhà cung cấp, liên kết theo từng vendor trong hệ thống.',
    kind: 'legal-contracts',
  },
  'supplier-balances': {
    title: 'Display Supplier Balances',
    icon: 'ti-report-money',
    description: 'Số dư công nợ hiện tại theo từng nhà cung cấp, tính từ các hóa đơn đã đăng trừ đi giả định đã thanh toán 60%.',
    kind: 'supplier-balances',
  },
  'quality-overview': {
    title: 'Quality Overview',
    icon: 'ti-notebook',
    description: 'Tổng quan chất lượng — số lô kiểm tra đang mở và tỷ lệ đạt/không đạt trong 30 ngày gần nhất.',
    kind: 'static-kpi-grid',
    items: [
      { label: 'Inspection lots open', value: '26', tone: 'default' },
      { label: 'Pass rate (30 days)', value: '94.2%', tone: 'success' },
      { label: 'Usage decisions pending', value: '4', tone: 'warning' },
      { label: 'Reinspections required', value: '2', tone: 'danger' },
    ],
  },
  'inspection-lots': {
    title: 'Manage Inspection Lots',
    icon: 'ti-search',
    description: 'Danh sách lô hàng đang chờ kiểm tra chất lượng, sinh ra từ các Goods Receipt (MIGO) gần nhất.',
    kind: 'inspection-lots',
  },
  'maintenance-requests': {
    title: 'Maintenance Requests',
    icon: 'ti-tool',
    description: 'Yêu cầu bảo trì thiết bị tại các plant sản xuất.',
    kind: 'static-table',
    columns: ['Request', 'Equipment', 'Plant', 'Priority', 'Status'],
    rows: [
      ['MR-90001', 'Conveyor Belt A12', '1010', 'High', 'Open'],
      ['MR-90002', 'Crane STS-03', '1010', 'Medium', 'In Progress'],
      ['MR-90003', 'Forklift FL-08', '1010', 'Low', 'Open'],
      ['MR-90004', 'Cold Storage Unit 2', '1010', 'High', 'Scheduled'],
    ],
  },
  'fulfillment-issues': {
    title: 'Sales Order Fulfillment Issues',
    icon: 'ti-truck',
    description: 'Các Sales Order đang gặp vấn đề về tồn kho (Backorder) cần xử lý.',
    kind: 'fulfillment-issues',
  },
  'sales-overview': {
    title: 'Sales Overview',
    icon: 'ti-chart-bar',
    description: 'Tổng quan hoạt động bán hàng — số đơn, doanh thu, và phân bổ theo khách hàng.',
    kind: 'sales-overview',
  },
  'top-customers': {
    title: 'Top Customers',
    icon: 'ti-users',
    description: 'Xếp hạng khách hàng theo tổng giá trị Sales Order đã tạo.',
    kind: 'top-customers',
  },
  'projects': {
    title: 'Manage Projects',
    icon: 'ti-list-details',
    description: 'Danh sách dự án đang triển khai (dữ liệu mẫu cho mục đích demo).',
    kind: 'static-table',
    columns: ['Project', 'Name', 'Manager', 'Status', '% Complete'],
    rows: [
      ['PRJ-001', 'Mở rộng kho Plant 1010', 'Nguyễn Văn A', 'In Progress', '62%'],
      ['PRJ-002', 'Triển khai SAP S/4HANA', 'Trần Thị B', 'In Progress', '38%'],
      ['PRJ-003', 'Tối ưu chuỗi cung ứng Q3', 'Lê Văn C', 'Planning', '10%'],
    ],
  },
  'wbs-elements': {
    title: 'Manage WBS Elements',
    icon: 'ti-sitemap',
    description: 'Cấu trúc phân rã công việc (Work Breakdown Structure) cho các dự án đang triển khai.',
    kind: 'static-table',
    columns: ['WBS Element', 'Description', 'Project', 'Budget'],
    rows: [
      ['1.1', 'Khảo sát & thiết kế', 'PRJ-001', '1,200,000,000'],
      ['1.2', 'Thi công xây dựng', 'PRJ-001', '8,500,000,000'],
      ['2.1', 'Cấu hình hệ thống', 'PRJ-002', '2,400,000,000'],
      ['2.2', 'Đào tạo người dùng', 'PRJ-002', '600,000,000'],
    ],
  },
  'activities': {
    title: 'Confirm Activities',
    icon: 'ti-checkbox',
    description: 'Xác nhận tiến độ các hoạt động trong dự án (dữ liệu mẫu).',
    kind: 'static-table',
    columns: ['Activity', 'WBS', 'Planned Hours', 'Actual Hours', 'Status'],
    rows: [
      ['ACT-001', '1.1', '160', '142', 'Completed'],
      ['ACT-002', '1.2', '800', '510', 'In Progress'],
      ['ACT-003', '2.1', '240', '90', 'In Progress'],
    ],
  },
  'project-issues': {
    title: 'Manage Project Issues',
    icon: 'ti-alert-circle',
    description: 'Vấn đề phát sinh trong quá trình triển khai dự án cần xử lý.',
    kind: 'static-table',
    columns: ['Issue', 'Project', 'Severity', 'Status'],
    rows: [
      ['ISS-01', 'PRJ-001', 'High', 'Open'],
      ['ISS-02', 'PRJ-002', 'Medium', 'Open'],
      ['ISS-03', 'PRJ-002', 'Low', 'Resolved'],
    ],
  },
  'milestones': {
    title: 'Track Milestones',
    icon: 'ti-flag',
    description: 'Các mốc quan trọng trong tiến độ dự án.',
    kind: 'static-table',
    columns: ['Milestone', 'Project', 'Due Date', 'Status'],
    rows: [
      ['Go-Live Phase 1', 'PRJ-002', '2026-08-15', 'On Track'],
      ['Hoàn thành thi công', 'PRJ-001', '2026-09-30', 'At Risk'],
      ['Nghiệm thu cuối kỳ', 'PRJ-003', '2026-12-01', 'Not Started'],
    ],
  },
  'project-budget': {
    title: 'Manage Project Budget',
    icon: 'ti-cash',
    description: 'Ngân sách dự án — kế hoạch so với thực chi.',
    kind: 'static-table',
    columns: ['Project', 'Budget', 'Committed', 'Actual', 'Available'],
    rows: [
      ['PRJ-001', '9,700,000,000', '7,200,000,000', '6,800,000,000', '2,900,000,000'],
      ['PRJ-002', '3,000,000,000', '2,400,000,000', '1,950,000,000', '1,050,000,000'],
      ['PRJ-003', '1,800,000,000', '300,000,000', '180,000,000', '1,620,000,000'],
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// SEARCH_INDEX: danh sách phẳng tất cả tile có thể điều hướng,
// dùng cho thanh search trên FioriShell.
// ─────────────────────────────────────────────────────────────
function tilesToSearchEntries(sections, modulePath, moduleLabel) {
  const entries = [];
  sections.forEach((section) => {
    section.tiles.forEach((tile) => {
      let path = modulePath;
      if (tile.type === 'transaction') path = `/transaction/${tile.txn}`;
      else if (tile.type === 'list') path = `/list/${tile.list}`;
      else if (tile.type === 'app' || tile.type === 'count') path = `/app/${tile.app}`;
      entries.push({
        id: `${moduleLabel}-${tile.id}`,
        title: tile.title,
        module: moduleLabel,
        path,
        icon: tile.icon || 'ti-app-window',
      });
    });
  });
  return entries;
}

export function getSearchIndex() {
  return [
    ...tilesToSearchEntries(FINANCE_SECTIONS, '/finance', 'Finance'),
    ...tilesToSearchEntries(PROCUREMENT_SECTIONS, '/procurement', 'Procurement'),
    ...tilesToSearchEntries(MANUFACTURING_SECTIONS, '/manufacturing', 'Manufacturing and Supply Chain'),
    ...tilesToSearchEntries(SALES_SECTIONS, '/sales', 'Sales'),
    ...tilesToSearchEntries(PROJECT_SECTIONS, '/project', 'Project Management'),
  ];
}
