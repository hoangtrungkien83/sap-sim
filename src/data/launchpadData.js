// Cấu trúc nav tabs + sections + tiles, mô phỏng theo ảnh chụp
// SAP S/4HANA Cloud Public Edition Fiori Launchpad thực tế.

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
      { id: 'balance-sheet', title: 'Balance Sheet/Income Statement', icon: 'ti-report-money', type: 'nav' },
      { id: 'gl-line-items', title: 'Display Line Items in General Ledger', icon: 'ti-table', type: 'nav' },
      { id: 'cost-centers', title: 'Cost Centers', subtitle: 'Review Booklet', icon: 'ti-file-analytics', type: 'nav' },
    ],
  },
  {
    title: 'Predictive Accounting',
    tiles: [
      { id: 'sales-acct-overview', title: 'Sales Accounting Overview', icon: 'ti-layout-dashboard', type: 'nav' },
      { id: 'incoming-sales-orders', title: 'Incoming Sales Orders', subtitle: 'Predictive Accounting', icon: 'ti-shopping-cart', type: 'nav' },
      { id: 'gross-margin', title: 'Gross Margin', subtitle: 'Presumed/Actual', icon: 'ti-chart-bar', type: 'nav' },
    ],
  },
  {
    title: 'Accounts Payable',
    tiles: [
      { id: 'manage-supplier-line-items', title: 'Manage Supplier Line Items', icon: 'ti-file-invoice', type: 'nav' },
      { id: 'ap-overview', title: 'Accounts Payable Overview', icon: 'ti-building-bank', type: 'nav' },
      { id: 'overdue-payables', title: 'Overdue Payables', subtitle: 'Today', kpiKey: 'overduePayables', type: 'kpi' },
      { id: 'cash-discount-utilization', title: 'Cash Discount Utilization', subtitle: 'Today', kpiKey: 'cashDiscountUtilization', type: 'kpi', tone: 'danger' },
      { id: 'manage-payment-blocks', title: 'Manage Payment Blocks', icon: 'ti-mail', type: 'nav' },
    ],
  },
  {
    title: 'Accounts Receivable',
    tiles: [
      { id: 'manage-customer-line-items', title: 'Manage Customer Line Items', icon: 'ti-user-dollar', type: 'nav' },
      { id: 'process-receivables', title: 'Process Receivables', icon: 'ti-receipt', type: 'nav' },
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
      { id: 'process-pr', title: 'Process Purchase Requisitions', icon: 'ti-shopping-cart', type: 'nav' },
      { id: 'manage-po', title: 'Manage Purchase Orders', icon: 'ti-clipboard-list', type: 'transaction', txn: 'ME21N' },
      { id: 'post-gr', title: 'Post Goods Receipt for Purchasing Document', icon: 'ti-truck-delivery', type: 'transaction', txn: 'MIGO' },
      { id: 'create-supplier-invoice', title: 'Create Supplier Invoice', icon: 'ti-file-dollar', type: 'transaction', txn: 'MIRO' },
      { id: 'supplier-invoices-list', title: 'Supplier Invoices List', icon: 'ti-file-invoice', type: 'list', list: 'invoices' },
      { id: 'monitor-pr-items', title: 'Monitor Purchase Requisition Items', icon: 'ti-list-search', type: 'nav' },
    ],
  },
  {
    title: 'Enterprise Contract Management',
    tiles: [
      { id: 'request-legal-contract', title: 'Request Legal Contract', icon: 'ti-file-plus', type: 'nav' },
      { id: 'manage-legal-transactions', title: 'Manage Legal Transactions', icon: 'ti-gavel', type: 'nav' },
      { id: 'manage-legal-documents', title: 'Manage Legal Documents', icon: 'ti-files', type: 'nav' },
    ],
  },
  {
    title: 'Supplier Accounts',
    tiles: [
      { id: 'manage-supplier-line-items-2', title: 'Manage Supplier Line Items', icon: 'ti-file-invoice', type: 'nav' },
      { id: 'manage-payment-blocks-2', title: 'Manage Payment Blocks', icon: 'ti-mail', type: 'nav' },
      { id: 'display-supplier-list', title: 'Display Supplier List', icon: 'ti-truck', type: 'list', list: 'vendors' },
      { id: 'display-supplier-balances', title: 'Display Supplier Balances', icon: 'ti-report-money', type: 'nav' },
    ],
  },
];

// Manufacturing & Supply Chain module sections
export const MANUFACTURING_SECTIONS = [
  {
    title: 'Quality Management',
    tiles: [
      { id: 'quality-technician-overview', title: 'Quality Technician Overview', icon: 'ti-notebook', type: 'nav' },
      { id: 'manage-inspection-lots', title: 'Manage Inspection Lots', icon: 'ti-search', type: 'nav' },
      { id: 'record-inspection-results', title: 'Record Inspection Results', icon: 'ti-clipboard-check', type: 'nav' },
      { id: 'quality-engineer-overview', title: 'Quality Engineer Overview', icon: 'ti-notebook', type: 'nav' },
      { id: 'display-results-history', title: 'Display Results History', icon: 'ti-chart-line', type: 'nav' },
      { id: 'manage-usage-decisions', title: 'Manage Usage Decisions', icon: 'ti-stamp', type: 'nav' },
    ],
  },
  {
    title: 'Service and Asset Management',
    tiles: [
      { id: 'create-maintenance-request', title: 'Create Maintenance Request', icon: 'ti-tool', type: 'nav' },
      { id: 'screen-maintenance-requests', title: 'Screen Maintenance Requests', value: 18, sub: 'Open', icon: 'ti-clipboard-list', type: 'count' },
      { id: 'find-maintenance-orders', title: 'Find Maintenance Orders', icon: 'ti-search', type: 'nav' },
      { id: 'perform-maintenance-jobs', title: 'Perform Maintenance Jobs', value: 0, icon: 'ti-tool', type: 'count' },
      { id: 'manage-in-house-repairs', title: 'Manage In-House Repairs', value: 12, icon: 'ti-settings', type: 'count' },
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
      { id: 'manage-sales-orders', title: 'Manage Sales Orders', icon: 'ti-clipboard-list', type: 'nav' },
      { id: 'sales-order-fulfillment', title: 'Sales Order Fulfillment', subtitle: 'Issues', icon: 'ti-truck', type: 'nav' },
    ],
  },
  {
    title: 'Billing',
    tiles: [
      { id: 'create-billing-doc', title: 'Create Billing Documents', icon: 'ti-receipt-2', type: 'nav' },
      { id: 'billing-doc-list', title: 'Billing Documents List', icon: 'ti-files', type: 'nav' },
      { id: 'incoming-sales-orders-2', title: 'Incoming Sales Orders', subtitle: 'Predictive Accounting', icon: 'ti-shopping-cart', type: 'nav' },
    ],
  },
  {
    title: 'Sales Analytics',
    tiles: [
      { id: 'sales-overview', title: 'Sales Overview', icon: 'ti-chart-bar', type: 'nav' },
      { id: 'gross-margin-sales', title: 'Gross Margin', subtitle: 'Presumed/Actual', icon: 'ti-chart-line', type: 'nav' },
      { id: 'top-customers', title: 'Top Customers', icon: 'ti-users', type: 'nav' },
    ],
  },
];

export const STOCK_LIST_TITLE = 'MB52 — Display Warehouse Stock';
