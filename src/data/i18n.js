// ─────────────────────────────────────────────────────────────
// i18n dictionary — toàn bộ chuỗi UI tĩnh (label, button, breadcrumb,
// section title, status...). Dữ liệu nghiệp vụ động (tên vendor,
// material...) được dịch riêng trong masterData.js vì gắn với data,
// không phải UI chrome.
// ─────────────────────────────────────────────────────────────

export const dict = {
  // ── Shell / nav ──
  nav_home: { vi: 'Trang chủ', en: 'My Home' },
  nav_finance: { vi: 'Tài chính', en: 'Finance' },
  nav_manufacturing: { vi: 'Sản xuất & Chuỗi cung ứng', en: 'Manufacturing and Supply Chain' },
  nav_procurement: { vi: 'Mua hàng', en: 'Procurement' },
  nav_project: { vi: 'Quản lý dự án', en: 'Project Management' },
  nav_sales: { vi: 'Bán hàng', en: 'Sales' },
  nav_other: { vi: 'Khác', en: 'Other' },
  shell_search_placeholder: { vi: 'Tìm app, transaction, danh sách...', en: 'Find app, transaction, list...' },
  shell_no_results: { vi: 'Không tìm thấy kết quả cho', en: 'No results found for' },
  shell_notifications: { vi: 'Thông báo', en: 'Notifications' },
  shell_no_notifications: {
    vi: 'Chưa có thông báo. Hãy thử tạo PO, Sales Order hoặc đăng hóa đơn.',
    en: 'No notifications yet. Try creating a PO, Sales Order, or posting an invoice.',
  },
  shell_all_my_apps: { vi: 'Tất cả ứng dụng', en: 'All My Apps' },
  shell_recap: { vi: 'Tóm tắt', en: 'Recap' },
  shell_home_settings: { vi: 'Cài đặt trang chủ', en: 'My Home Settings' },
  shell_reset_demo: { vi: 'Đặt lại demo', en: 'Reset Demo' },
  shell_reset_confirm: {
    vi: 'Xóa toàn bộ dữ liệu demo (PO, hóa đơn, đơn hàng...) và khôi phục về trạng thái ban đầu?',
    en: 'Clear all demo data (PO, invoices, orders...) and restore to initial state?',
  },
  shell_greeting: { vi: 'Chào bạn, chào mừng quay lại!', en: 'Hi there, welcome back!' },
  shell_pages: { vi: 'Trang', en: 'Pages' },
  shell_insights_tiles: { vi: 'Thẻ thông tin nhanh', en: 'Insights Tiles' },

  // ── Common buttons / actions ──
  btn_back: { vi: 'Quay lại', en: 'Back' },
  btn_close: { vi: 'Đóng', en: 'Close' },
  btn_save: { vi: 'Lưu', en: 'Save' },
  btn_cancel: { vi: 'Hủy', en: 'Cancel' },
  btn_continue: { vi: 'Tiếp tục', en: 'Continue' },
  btn_view_list: { vi: 'Xem danh sách', en: 'View list' },
  btn_create_another: { vi: 'Tạo mới khác', en: 'Create another' },
  btn_view_po: { vi: 'Xem Purchase Order', en: 'View Purchase Order' },
  btn_view_so: { vi: 'Xem Sales Order', en: 'View Sales Order' },
  btn_view_ap: { vi: 'Xem Accounts Payable', en: 'View Accounts Payable' },
  btn_view_ar: { vi: 'Xem Accounts Receivable', en: 'View Accounts Receivable' },
  btn_view_stock: { vi: 'Xem tồn kho (MB52)', en: 'View stock (MB52)' },
  btn_view_invoices: { vi: 'Danh sách hóa đơn', en: 'Invoice list' },
  btn_view_billing: { vi: 'Danh sách hóa đơn bán hàng', en: 'Billing document list' },
  btn_create_po: { vi: 'Tạo Purchase Order (ME21N)', en: 'Create Purchase Order (ME21N)' },
  btn_create_so: { vi: 'Tạo Sales Order (VA01)', en: 'Create Sales Order (VA01)' },
  btn_post_gr: { vi: 'Post Goods Receipt (MIGO)', en: 'Post Goods Receipt (MIGO)' },
  btn_post_invoice: { vi: 'Tạo hóa đơn (MIRO)', en: 'Create invoice (MIRO)' },
  btn_post_billing: { vi: 'Xuất hóa đơn (VF01)', en: 'Create billing (VF01)' },

  // ── DataTable ──
  table_search: { vi: 'Tìm kiếm...', en: 'Search...' },
  table_items_of: { vi: 'mục', en: 'items' },
  table_no_results: { vi: 'Không tìm thấy kết quả cho', en: 'No results found for' },

  // ── Status values ──
  status_open: { vi: 'Mở', en: 'Open' },
  status_confirmed: { vi: 'Đã xác nhận', en: 'Confirmed' },
  status_delivered: { vi: 'Đã giao', en: 'Delivered' },
  status_partially_delivered: { vi: 'Giao một phần', en: 'Partially Delivered' },
  status_posted: { vi: 'Đã đăng', en: 'Posted' },
  status_billed: { vi: 'Đã xuất hóa đơn', en: 'Billed' },
  status_backorder: { vi: 'Chờ hàng', en: 'Backorder' },
  status_completed: { vi: 'Hoàn thành', en: 'Completed' },
  status_in_progress: { vi: 'Đang xử lý', en: 'In Progress' },
  status_pending: { vi: 'Đang chờ', en: 'Pending' },
  status_accepted: { vi: 'Đã chấp nhận', en: 'Accepted' },
  status_active: { vi: 'Đang hoạt động', en: 'Active' },
  status_converted: { vi: 'Đã chuyển đổi', en: 'Converted' },
  status_on_track: { vi: 'Đúng tiến độ', en: 'On Track' },
  status_resolved: { vi: 'Đã giải quyết', en: 'Resolved' },
  status_scheduled: { vi: 'Đã lên lịch', en: 'Scheduled' },
  status_at_risk: { vi: 'Có rủi ro', en: 'At Risk' },
  status_medium: { vi: 'Trung bình', en: 'Medium' },
  status_high: { vi: 'Cao', en: 'High' },
  status_low: { vi: 'Thấp', en: 'Low' },
  status_not_started: { vi: 'Chưa bắt đầu', en: 'Not Started' },
  status_planning: { vi: 'Lập kế hoạch', en: 'Planning' },
  status_pending_approval: { vi: 'Chờ phê duyệt', en: 'Pending Approval' },

  // ── Finance module ──
  fin_financial_reporting: { vi: 'Báo cáo tài chính', en: 'Financial Reporting' },
  fin_predictive_accounting: { vi: 'Kế toán dự báo', en: 'Predictive Accounting' },
  fin_accounts_payable: { vi: 'Công nợ phải trả', en: 'Accounts Payable' },
  fin_accounts_receivable: { vi: 'Công nợ phải thu', en: 'Accounts Receivable' },

  // ── Procurement module ──
  proc_procurement: { vi: 'Mua hàng', en: 'Procurement' },
  proc_contract_mgmt: { vi: 'Quản lý hợp đồng', en: 'Enterprise Contract Management' },
  proc_supplier_accounts: { vi: 'Tài khoản nhà cung cấp', en: 'Supplier Accounts' },

  // ── Manufacturing module ──
  mfg_quality_mgmt: { vi: 'Quản lý chất lượng', en: 'Quality Management' },
  mfg_service_asset: { vi: 'Dịch vụ & Tài sản', en: 'Service and Asset Management' },

  // ── Sales module ──
  sales_order_mgmt: { vi: 'Quản lý đơn hàng', en: 'Order Management' },
  sales_billing: { vi: 'Xuất hóa đơn', en: 'Billing' },
  sales_analytics: { vi: 'Phân tích bán hàng', en: 'Sales Analytics' },

  // ── Project module ──
  proj_planning: { vi: 'Lập kế hoạch dự án', en: 'Project Planning' },
  proj_execution: { vi: 'Thực thi dự án', en: 'Project Execution' },
  proj_financials: { vi: 'Tài chính dự án', en: 'Project Financials' },

  // ── Object Page common labels ──
  obj_key_facts: { vi: 'Thông tin chính', en: 'Key Facts' },
  obj_document_flow: { vi: 'Luồng chứng từ', en: 'Document Flow' },
  obj_current_status: { vi: 'Trạng thái hiện tại', en: 'Current Status' },
  obj_not_found_po: { vi: 'Không tìm thấy Purchase Order', en: 'Purchase Order not found' },
  obj_not_found_so: { vi: 'Không tìm thấy Sales Order', en: 'Sales Order not found' },
  obj_not_found_invoice: { vi: 'Không tìm thấy hóa đơn', en: 'Invoice not found' },
  obj_not_found_vendor: { vi: 'Không tìm thấy nhà cung cấp', en: 'Vendor not found' },
  obj_not_found_material: { vi: 'Không tìm thấy vật tư', en: 'Material not found' },
  obj_not_found_customer: { vi: 'Không tìm thấy khách hàng', en: 'Customer not found' },

  // ── Master data pages ──
  master_vendor_title: { vi: 'Hồ sơ nhà cung cấp', en: 'Vendor Master' },
  master_material_title: { vi: 'Hồ sơ vật tư', en: 'Material Master' },
  master_customer_title: { vi: 'Hồ sơ khách hàng', en: 'Customer Master' },
  master_basic_data: { vi: 'Dữ liệu cơ bản', en: 'Basic Data' },
  master_purchasing_data: { vi: 'Dữ liệu mua hàng', en: 'Purchasing Data' },
  master_sales_data: { vi: 'Dữ liệu bán hàng', en: 'Sales Data' },
  master_related_transactions: { vi: 'Giao dịch liên quan', en: 'Related Transactions' },
};

export function t(key, lang) {
  return dict[key]?.[lang] ?? dict[key]?.vi ?? key;
}
