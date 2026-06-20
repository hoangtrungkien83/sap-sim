import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Danh sách app nhóm theo module, mô phỏng panel "All My Apps" trong ảnh chụp.
const APP_GROUPS = [
  {
    group: 'Accounts Payable',
    apps: [
      { name: 'Accounts Payable Overview', path: '/app/ap-overview' },
      { name: 'Manage Payment Blocks', path: '/app/payment-blocks' },
      { name: 'Accounts Payable - Supplier Invoice Parking', path: '/transaction/MIRO' },
      { name: 'Accounts Payable - Supplier Invoices', path: '/list/invoices' },
    ],
  },
  {
    group: 'Accounts Receivable',
    apps: [
      { name: 'Manage Customer Line Items', path: '/app/customer-line-items' },
      { name: 'Process Receivables', path: '/list/billing' },
      { name: 'Display Line Items in General Ledger', path: '/app/gl-line-items' },
    ],
  },
  {
    group: 'Procurement',
    apps: [
      { name: 'Manage Purchase Orders (ME21N)', path: '/transaction/ME21N' },
      { name: 'Post Goods Receipt (MIGO)', path: '/transaction/MIGO' },
      { name: 'Display Supplier List', path: '/list/vendors' },
      { name: 'Enterprise Contract Management', path: '/app/legal-contracts' },
      { name: 'Display Supplier Balances', path: '/app/supplier-balances' },
    ],
  },
  {
    group: 'Sales',
    apps: [
      { name: 'Create Sales Order (VA01)', path: '/transaction/VA01' },
      { name: 'Sales Order List', path: '/list/salesOrders' },
      { name: 'Create Billing Documents (VF01)', path: '/transaction/VF01' },
      { name: 'Billing Documents List', path: '/list/billing' },
      { name: 'Top Customers', path: '/app/top-customers' },
    ],
  },
  {
    group: 'Manufacturing & Supply Chain',
    apps: [
      { name: 'EAM - Maintenance Requests', path: '/app/maintenance-requests' },
      { name: 'QM - Inspection Lots', path: '/app/inspection-lots' },
      { name: 'QM - Quality Overview', path: '/app/quality-overview' },
    ],
  },
  {
    group: 'Project Management',
    apps: [
      { name: 'Manage Projects', path: '/app/projects' },
      { name: 'Manage Project Budget', path: '/app/project-budget' },
      { name: 'Track Milestones', path: '/app/milestones' },
    ],
  },
  {
    group: 'Warehouse',
    apps: [{ name: 'WM - Display Warehouse Stock (MB52)', path: '/list/stock' }],
  },
];

export default function AllMyAppsPanel({ open, onClose }) {
  const navigate = useNavigate();
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);

  if (!open) return null;

  const activeGroup = APP_GROUPS[activeGroupIdx];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Đóng"
      />
      <div className="relative bg-white w-full max-w-3xl mx-auto mt-16 rounded-lg shadow-xl flex flex-col max-h-[75vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--fiori-tile-border)] px-4 py-3 shrink-0">
          <h2 className="text-base font-medium">All My Apps</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" aria-label="Đóng">
            <i className="ti ti-x text-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* left: group list */}
          <div className="w-64 border-r border-[var(--fiori-tile-border)] overflow-y-auto shrink-0">
            {APP_GROUPS.map((g, idx) => (
              <button
                key={g.group}
                onClick={() => setActiveGroupIdx(idx)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-[var(--fiori-tile-border)] transition-colors ${
                  idx === activeGroupIdx ? 'bg-[var(--fiori-page-bg)] font-medium' : 'hover:bg-gray-50'
                }`}
              >
                {g.group}
              </button>
            ))}
          </div>

          {/* right: app detail grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-base font-medium mb-3">{activeGroup.group}</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {activeGroup.apps.map((app) => (
                <button
                  key={app.name}
                  onClick={() => {
                    onClose();
                    navigate(app.path);
                  }}
                  className="text-left text-sm text-[var(--fiori-link)] hover:underline"
                >
                  {app.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
