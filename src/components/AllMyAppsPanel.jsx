import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useT';

// Danh sách app nhóm theo module, mô phỏng panel "All My Apps" trong ảnh chụp.
// name là object { vi, en } để hỗ trợ đa ngôn ngữ.
const APP_GROUPS = [
  {
    group: { vi: 'Công nợ phải trả', en: 'Accounts Payable' },
    apps: [
      { name: { vi: 'Tổng quan công nợ phải trả', en: 'Accounts Payable Overview' }, path: '/app/ap-overview' },
      { name: { vi: 'Quản lý chặn thanh toán', en: 'Manage Payment Blocks' }, path: '/app/payment-blocks' },
      { name: { vi: 'Tạo hóa đơn nhà cung cấp (MIRO)', en: 'Create Supplier Invoice (MIRO)' }, path: '/transaction/MIRO' },
      { name: { vi: 'Danh sách hóa đơn nhà cung cấp', en: 'Supplier Invoices List' }, path: '/list/invoices' },
    ],
  },
  {
    group: { vi: 'Công nợ phải thu', en: 'Accounts Receivable' },
    apps: [
      { name: { vi: 'Quản lý bút toán khách hàng', en: 'Manage Customer Line Items' }, path: '/app/customer-line-items' },
      { name: { vi: 'Xử lý công nợ phải thu', en: 'Process Receivables' }, path: '/list/billing' },
      { name: { vi: 'Khách hàng hàng đầu', en: 'Top Customers' }, path: '/app/top-customers' },
      { name: { vi: 'Hiển thị bút toán Sổ cái', en: 'Display Line Items in General Ledger' }, path: '/app/gl-line-items' },
    ],
  },
  {
    group: { vi: 'Mua hàng', en: 'Procurement' },
    apps: [
      { name: { vi: 'Quản lý đơn đặt hàng (ME21N)', en: 'Manage Purchase Orders (ME21N)' }, path: '/transaction/ME21N' },
      { name: { vi: 'Ghi nhận nhập kho (MIGO)', en: 'Post Goods Receipt (MIGO)' }, path: '/transaction/MIGO' },
      { name: { vi: 'Danh sách nhà cung cấp', en: 'Display Supplier List' }, path: '/list/vendors' },
      { name: { vi: 'Quản lý hợp đồng', en: 'Enterprise Contract Management' }, path: '/app/legal-contracts' },
      { name: { vi: 'Số dư công nợ nhà cung cấp', en: 'Display Supplier Balances' }, path: '/app/supplier-balances' },
    ],
  },
  {
    group: { vi: 'Bán hàng', en: 'Sales' },
    apps: [
      { name: { vi: 'Tạo đơn bán hàng (VA01)', en: 'Create Sales Order (VA01)' }, path: '/transaction/VA01' },
      { name: { vi: 'Danh sách đơn bán hàng', en: 'Sales Order List' }, path: '/list/salesOrders' },
      { name: { vi: 'Tạo hóa đơn bán hàng (VF01)', en: 'Create Billing Documents (VF01)' }, path: '/transaction/VF01' },
      { name: { vi: 'Danh sách hóa đơn bán hàng', en: 'Billing Documents List' }, path: '/list/billing' },
      { name: { vi: 'Vấn đề thực hiện đơn hàng', en: 'Fulfillment Issues' }, path: '/app/fulfillment-issues' },
    ],
  },
  {
    group: { vi: 'Sản xuất & Chuỗi cung ứng', en: 'Manufacturing & Supply Chain' },
    apps: [
      { name: { vi: 'EAM - Yêu cầu bảo trì', en: 'EAM - Maintenance Requests' }, path: '/app/maintenance-requests' },
      { name: { vi: 'QM - Lô kiểm tra', en: 'QM - Inspection Lots' }, path: '/app/inspection-lots' },
      { name: { vi: 'QM - Tổng quan chất lượng', en: 'QM - Quality Overview' }, path: '/app/quality-overview' },
    ],
  },
  {
    group: { vi: 'Quản lý dự án', en: 'Project Management' },
    apps: [
      { name: { vi: 'Quản lý dự án', en: 'Manage Projects' }, path: '/app/projects' },
      { name: { vi: 'Quản lý ngân sách dự án', en: 'Manage Project Budget' }, path: '/app/project-budget' },
      { name: { vi: 'Theo dõi mốc tiến độ', en: 'Track Milestones' }, path: '/app/milestones' },
    ],
  },
  {
    group: { vi: 'Kho vận', en: 'Warehouse' },
    apps: [{ name: { vi: 'WM - Hiển thị tồn kho (MB52)', en: 'WM - Display Warehouse Stock (MB52)' }, path: '/list/stock' }],
  },
];

export default function AllMyAppsPanel({ open, onClose }) {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);

  if (!open) return null;

  const activeGroup = APP_GROUPS[activeGroupIdx];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label={t('btn_close')}
      />
      <div className="relative bg-white w-full max-w-3xl mx-auto mt-16 rounded-lg shadow-xl flex flex-col max-h-[75vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--fiori-tile-border)] px-4 py-3 shrink-0">
          <h2 className="text-base font-medium">{t('shell_all_my_apps')}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" aria-label={t('btn_close')}>
            <i className="ti ti-x text-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* left: group list */}
          <div className="w-64 border-r border-[var(--fiori-tile-border)] overflow-y-auto shrink-0">
            {APP_GROUPS.map((g, idx) => (
              <button
                key={g.group.vi}
                onClick={() => setActiveGroupIdx(idx)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-[var(--fiori-tile-border)] transition-colors ${
                  idx === activeGroupIdx ? 'bg-[var(--fiori-page-bg)] font-medium' : 'hover:bg-gray-50'
                }`}
              >
                {g.group[lang] ?? g.group.vi}
              </button>
            ))}
          </div>

          {/* right: app detail grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-base font-medium mb-3">{activeGroup.group[lang] ?? activeGroup.group.vi}</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {activeGroup.apps.map((app) => (
                <button
                  key={app.name.vi}
                  onClick={() => {
                    onClose();
                    navigate(app.path);
                  }}
                  className="text-left text-sm text-[var(--fiori-link)] hover:underline"
                >
                  {app.name[lang] ?? app.name.vi}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
