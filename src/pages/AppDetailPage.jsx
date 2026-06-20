import { useParams, useNavigate } from 'react-router-dom';
import { APP_REGISTRY } from '../data/launchpadData';
import { useSapStore } from '../store/sapStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Breadcrumb from '../components/Breadcrumb';

function StaticTable({ columns, rows }) {
  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
            {columns.map((c) => (
              <th key={c} className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--fiori-tile-border)] last:border-0 hover:bg-[var(--fiori-page-bg)]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ text, ctaLabel, ctaPath }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-8 text-center">
      <i className="ti ti-inbox text-3xl text-[var(--fiori-text-secondary)] mb-2" aria-hidden="true" />
      <p className="text-sm text-[var(--fiori-text-secondary)]">{text}</p>
      {ctaLabel && ctaPath && (
        <button
          onClick={() => navigate(ctaPath)}
          className="mt-3 bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

function KpiGrid({ items }) {
  const toneClass = {
    danger: 'text-[var(--fiori-danger)]',
    success: 'text-[var(--fiori-success)]',
    warning: 'text-[var(--fiori-warning)]',
    default: 'text-[var(--fiori-text-primary)]',
  };
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-4">
          <p className="text-sm text-[var(--fiori-text-secondary)]">{item.label}</p>
          <p className={`text-2xl font-medium mt-1 ${toneClass[item.tone] ?? toneClass.default}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Dynamic content renderers, theo từng "kind" trong APP_REGISTRY ──
// Mọi bảng liên kết tới entity thật (PO/SO/Invoice/Billing/Vendor) đều
// dùng DataTable (sort + search) và onRowClick để mở Object Page chi tiết.

function FiDocuments() {
  const financeDocuments = useSapStore((s) => s.financeDocuments);
  if (financeDocuments.length === 0) {
    return (
      <EmptyState
        text="Chưa có bút toán sổ cái nào. Bút toán sẽ tự sinh khi đăng hóa đơn qua MIRO hoặc VF01."
        ctaLabel="Tạo hóa đơn nhà cung cấp (MIRO)"
        ctaPath="/transaction/MIRO"
      />
    );
  }
  return (
    <StaticTable
      columns={['Document', 'Type', 'Reference', 'Counterparty', 'Amount', 'Posted At']}
      rows={financeDocuments.map((d) => [
        d.id,
        d.type,
        d.reference,
        d.vendorName,
        `${d.amount.toLocaleString('vi-VN')} VND`,
        new Date(d.postedAt).toLocaleString('vi-VN'),
      ])}
    />
  );
}

function SalesAccountingOverview() {
  const navigate = useNavigate();
  const salesOrders = useSapStore((s) => s.salesOrders);
  const billingDocuments = useSapStore((s) => s.billingDocuments);
  const totalSO = salesOrders.reduce((sum, s) => sum + s.netValue, 0);
  const totalBilled = billingDocuments.reduce((sum, b) => sum + b.netValue, 0);
  return (
    <div className="space-y-4">
      <KpiGrid
        items={[
          { label: 'Total Sales Orders', value: salesOrders.length },
          { label: 'Total SO Value', value: `${(totalSO / 1e6).toFixed(1)}M VND` },
          { label: 'Billing Documents', value: billingDocuments.length },
          { label: 'Total Billed', value: `${(totalBilled / 1e6).toFixed(1)}M VND` },
        ]}
      />
      {salesOrders.length === 0 ? (
        <EmptyState text="Chưa có Sales Order nào." ctaLabel="Tạo Sales Order (VA01)" ctaPath="/transaction/VA01" />
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'SO Number', sortable: true },
            { key: 'customerName', label: 'Customer', sortable: true },
            { key: 'materialName', label: 'Material', sortable: true },
            { key: 'netValue', label: 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={salesOrders}
          onRowClick={(row) => navigate(`/object/so/${row.id}`)}
          searchPlaceholder="Tìm SO, khách hàng..."
        />
      )}
    </div>
  );
}

function GrossMargin() {
  const navigate = useNavigate();
  const billingDocuments = useSapStore((s) => s.billingDocuments);
  if (billingDocuments.length === 0) {
    return (
      <EmptyState
        text="Chưa có hóa đơn bán hàng nào để tính biên lợi nhuận."
        ctaLabel="Xuất hóa đơn (VF01)"
        ctaPath="/transaction/VF01"
      />
    );
  }
  // Giả định giá vốn = 70% giá bán cho mục đích demo
  const rows = billingDocuments.map((b) => ({
    ...b,
    cost: b.netValue * 0.7,
    marginPct: (((b.netValue - b.netValue * 0.7) / b.netValue) * 100).toFixed(1),
  }));
  return (
    <DataTable
      columns={[
        { key: 'id', label: 'Billing Doc', sortable: true },
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'netValue', label: 'Revenue (VND)', sortable: true, render: (r) => r.netValue.toLocaleString('vi-VN') },
        { key: 'cost', label: 'Est. Cost (VND)', sortable: true, render: (r) => r.cost.toLocaleString('vi-VN') },
        { key: 'marginPct', label: 'Margin %', sortable: true, render: (r) => `${r.marginPct}%` },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/billing/${row.id}`)}
      searchPlaceholder="Tìm hóa đơn bán hàng..."
    />
  );
}

function ApOverview() {
  const navigate = useNavigate();
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const total = supplierInvoices.reduce((sum, i) => sum + i.amount, 0);
  return (
    <div className="space-y-4">
      <KpiGrid
        items={[
          { label: 'Invoices posted', value: supplierInvoices.length },
          { label: 'Total payable', value: `${(total / 1e6).toFixed(1)}M VND` },
        ]}
      />
      {supplierInvoices.length === 0 ? (
        <EmptyState text="Chưa có hóa đơn nhà cung cấp nào." ctaLabel="Tạo hóa đơn (MIRO)" ctaPath="/transaction/MIRO" />
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'Invoice', sortable: true },
            { key: 'vendorName', label: 'Vendor', sortable: true },
            { key: 'amount', label: 'Amount', sortable: true, render: (r) => `${r.amount.toLocaleString('vi-VN')} VND` },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={supplierInvoices}
          onRowClick={(row) => navigate(`/object/invoice/${row.id}`)}
          searchPlaceholder="Tìm hóa đơn, vendor..."
        />
      )}
    </div>
  );
}

function PaymentBlocks() {
  const navigate = useNavigate();
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  // Mô phỏng: hóa đơn > 50 triệu VND tự động bị block chờ phê duyệt
  const blocked = supplierInvoices.filter((i) => i.amount > 50000000);
  if (blocked.length === 0) {
    return <EmptyState text="Không có hóa đơn nào đang bị giữ thanh toán (ngưỡng demo: trên 50 triệu VND)." />;
  }
  return (
    <DataTable
      columns={[
        { key: 'id', label: 'Invoice', sortable: true },
        { key: 'vendorName', label: 'Vendor', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true, render: (r) => `${r.amount.toLocaleString('vi-VN')} VND` },
        { key: 'reason', label: 'Block Reason', render: () => 'Vượt ngưỡng phê duyệt tự động' },
      ]}
      rows={blocked}
      onRowClick={(row) => navigate(`/object/invoice/${row.id}`)}
      searchPlaceholder="Tìm hóa đơn..."
    />
  );
}

function CustomerLineItems() {
  const navigate = useNavigate();
  const billingDocuments = useSapStore((s) => s.billingDocuments);
  if (billingDocuments.length === 0) {
    return <EmptyState text="Chưa có công nợ khách hàng nào." ctaLabel="Xuất hóa đơn (VF01)" ctaPath="/transaction/VF01" />;
  }
  return (
    <DataTable
      columns={[
        { key: 'id', label: 'Billing Doc', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'netValue', label: 'Amount', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      rows={billingDocuments}
      onRowClick={(row) => navigate(`/object/billing/${row.id}`)}
      searchPlaceholder="Tìm theo khách hàng..."
    />
  );
}

function PurchaseRequisitions() {
  const navigate = useNavigate();
  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  // Mô phỏng: mỗi PO coi như xuất phát từ 1 PR đã được duyệt và convert
  if (purchaseOrders.length === 0) {
    return <EmptyState text="Chưa có yêu cầu mua hàng nào." ctaLabel="Tạo Purchase Order (ME21N)" ctaPath="/transaction/ME21N" />;
  }
  const rows = purchaseOrders.map((p) => ({ ...p, prId: `PR-${p.id.slice(-5)}` }));
  return (
    <DataTable
      columns={[
        { key: 'prId', label: 'PR (derived)', sortable: true },
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'vendorName', label: 'Vendor', sortable: true },
        { key: 'derivedStatus', label: 'Status', render: () => <StatusBadge status="Converted" /> },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/po/${row.id}`)}
      searchPlaceholder="Tìm theo vật tư, vendor..."
    />
  );
}

function LegalContracts() {
  const navigate = useNavigate();
  const vendors = useSapStore((s) => s.vendors);
  const rows = vendors.map((v, i) => ({ ...v, contractId: `CTR-${1000 + i}` }));
  return (
    <DataTable
      columns={[
        { key: 'contractId', label: 'Contract', sortable: true },
        { key: 'name', label: 'Vendor', sortable: true },
        { key: 'type', label: 'Type', render: () => 'Framework Agreement' },
        { key: 'status', label: 'Status', render: () => <StatusBadge status="Active" /> },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/vendor/${row.id}`)}
      searchPlaceholder="Tìm theo tên nhà cung cấp..."
    />
  );
}

function SupplierBalances() {
  const navigate = useNavigate();
  const vendors = useSapStore((s) => s.vendors);
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const rows = vendors.map((v) => {
    const total = supplierInvoices.filter((i) => i.vendorId === v.id).reduce((sum, i) => sum + i.amount, 0);
    return { ...v, totalInvoiced: total, openBalance: total * 0.4 };
  });
  return (
    <DataTable
      columns={[
        { key: 'id', label: 'Vendor', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'totalInvoiced', label: 'Total Invoiced', sortable: true, render: (r) => `${r.totalInvoiced.toLocaleString('vi-VN')} VND` },
        { key: 'openBalance', label: 'Open Balance', sortable: true, render: (r) => `${r.openBalance.toLocaleString('vi-VN')} VND` },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/vendor/${row.id}`)}
      searchPlaceholder="Tìm theo tên nhà cung cấp..."
    />
  );
}

function InspectionLots() {
  const goodsReceipts = useSapStore((s) => s.goodsReceipts);
  if (goodsReceipts.length === 0) {
    return (
      <EmptyState
        text="Chưa có lô hàng nào cần kiểm tra. Lô kiểm tra sinh ra từ Goods Receipt (MIGO)."
        ctaLabel="Post Goods Receipt (MIGO)"
        ctaPath="/transaction/MIGO"
      />
    );
  }
  const rows = goodsReceipts.map((g, i) => ({
    ...g,
    lotId: `IL-${100000 + i}`,
    decision: i % 3 === 0 ? 'Pending' : 'Accepted',
  }));
  return (
    <DataTable
      columns={[
        { key: 'lotId', label: 'Inspection Lot', sortable: true },
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true },
        { key: 'plant', label: 'Plant', sortable: true },
        { key: 'decision', label: 'Decision', render: (r) => <StatusBadge status={r.decision} /> },
      ]}
      rows={rows}
      searchPlaceholder="Tìm theo vật tư..."
    />
  );
}

function FulfillmentIssues() {
  const navigate = useNavigate();
  const salesOrders = useSapStore((s) => s.salesOrders);
  const backorders = salesOrders.filter((s) => s.status === 'Backorder');
  if (backorders.length === 0) {
    return <EmptyState text="Không có Sales Order nào đang gặp vấn đề tồn kho." />;
  }
  return (
    <DataTable
      columns={[
        { key: 'id', label: 'SO Number', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true, render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'availableAtCreation', label: 'Available khi tạo', sortable: true, render: (r) => `${r.availableAtCreation} ${r.unit}` },
      ]}
      rows={backorders}
      onRowClick={(row) => navigate(`/object/so/${row.id}`)}
      searchPlaceholder="Tìm theo khách hàng..."
    />
  );
}

function TopCustomers() {
  const salesOrders = useSapStore((s) => s.salesOrders);
  const customers = useSapStore((s) => s.customers);
  const rows = customers
    .map((c) => {
      const orders = salesOrders.filter((s) => s.customerId === c.id);
      const total = orders.reduce((sum, s) => sum + s.netValue, 0);
      return { ...c, orderCount: orders.length, total };
    })
    .sort((a, b) => b.total - a.total);
  return (
    <DataTable
      columns={[
        { key: 'name', label: 'Customer', sortable: true },
        { key: 'country', label: 'Country', sortable: true },
        { key: 'orderCount', label: 'Orders', sortable: true },
        { key: 'total', label: 'Total Value', sortable: true, render: (r) => `${r.total.toLocaleString('vi-VN')} VND` },
      ]}
      rows={rows}
      searchPlaceholder="Tìm theo tên khách hàng..."
    />
  );
}

const DYNAMIC_RENDERERS = {
  'fi-documents': FiDocuments,
  'sales-overview': SalesAccountingOverview,
  'gross-margin': GrossMargin,
  'ap-overview': ApOverview,
  'payment-blocks': PaymentBlocks,
  'customer-line-items': CustomerLineItems,
  'purchase-requisitions': PurchaseRequisitions,
  'legal-contracts': LegalContracts,
  'supplier-balances': SupplierBalances,
  'inspection-lots': InspectionLots,
  'fulfillment-issues': FulfillmentIssues,
  'top-customers': TopCustomers,
};

export default function AppDetailPage() {
  const { appKey } = useParams();
  const app = APP_REGISTRY[appKey];

  if (!app) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        Không tìm thấy app <code>{appKey}</code>.
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb crumbs={[{ label: 'Apps' }, { label: app.title }]} />
      <div className="flex items-center gap-2 mb-1.5">
        <i className={`ti ${app.icon} text-xl text-[var(--fiori-link)]`} aria-hidden="true" />
        <h1 className="text-lg font-medium">{app.title}</h1>
      </div>
      <p className="text-sm text-[var(--fiori-text-secondary)] mb-4">{app.description}</p>

      {app.kind === 'static-table' && <StaticTable columns={app.columns} rows={app.rows} />}
      {app.kind === 'static-kpi-grid' && <KpiGrid items={app.items} />}
      {(() => {
        const Renderer = DYNAMIC_RENDERERS[app.kind];
        return Renderer ? <Renderer /> : null;
      })()}
    </div>
  );
}
