import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Danh sách app nhóm theo module, mô phỏng panel "All My Apps" trong ảnh chụp.
const APP_GROUPS = [
  {
    group: 'Accounts Payable',
    apps: [
      { name: 'Accounts Payable - Analytics', path: '/finance' },
      { name: 'Accounts Payable - Document Display', path: '/finance' },
      { name: 'Accounts Payable - Operational Processing', path: '/finance' },
      { name: 'Accounts Payable - Supplier Invoice Parking', path: '/transaction/MIRO' },
      { name: 'Accounts Payable - Supplier Invoices', path: '/list/invoices' },
    ],
  },
  {
    group: 'Accounts Receivable',
    apps: [
      { name: 'Accounts Receivable - Analytics', path: '/finance' },
      { name: 'Accounts Receivable - Collections', path: '/finance' },
      { name: 'Accounts Receivable - Dispute Resolution', path: '/finance' },
      { name: 'Accounts Receivable - Document Display', path: '/finance' },
    ],
  },
  {
    group: 'Procurement',
    apps: [
      { name: 'Procurement - Purchase Orders', path: '/transaction/ME21N' },
      { name: 'Procurement - Goods Receipt', path: '/transaction/MIGO' },
      { name: 'Procurement - Supplier List', path: '/list/vendors' },
      { name: 'Procurement - Contract Management', path: '/procurement' },
    ],
  },
  {
    group: 'Sales',
    apps: [
      { name: 'Sales - Create Sales Order', path: '/transaction/VA01' },
      { name: 'Sales - Order List', path: '/list/salesOrders' },
      { name: 'Sales - Billing Documents', path: '/sales' },
    ],
  },
  {
    group: 'Manufacturing & Supply Chain',
    apps: [
      { name: 'EAM - Maintenance Job Lists', path: '/manufacturing' },
      { name: 'EAM - Maintenance Orders Display', path: '/manufacturing' },
      { name: 'EAM - Maintenance Orders Management', path: '/manufacturing' },
      { name: 'EAM - Maintenance Request', path: '/manufacturing' },
      { name: 'QM - Inspection Lots', path: '/manufacturing' },
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
