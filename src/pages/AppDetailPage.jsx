import { useParams, useNavigate } from 'react-router-dom';
import { APP_REGISTRY, tr } from '../data/launchpadData';
import { useSapStore } from '../store/sapStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Breadcrumb from '../components/Breadcrumb';
import { useT } from '../hooks/useT';

function StaticTable({ columns, rows, lang }) {
  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
            {columns.map((c, i) => (
              <th key={i} className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">
                {tr(c, lang)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--fiori-tile-border)] last:border-0 hover:bg-[var(--fiori-page-bg)]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">
                  {tr(cell, lang)}
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

function KpiGrid({ items, lang }) {
  const toneClass = {
    danger: 'text-[var(--fiori-danger)]',
    success: 'text-[var(--fiori-success)]',
    warning: 'text-[var(--fiori-warning)]',
    default: 'text-[var(--fiori-text-primary)]',
  };
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-4">
          <p className="text-sm text-[var(--fiori-text-secondary)]">{tr(item.label, lang)}</p>
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
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const financeDocuments = useSapStore((s) => s.financeDocuments);
  if (financeDocuments.length === 0) {
    return (
      <EmptyState
        text={isVi ? 'Chưa có bút toán sổ cái nào. Bút toán sẽ tự sinh khi đăng hóa đơn qua MIRO hoặc VF01.' : 'No GL line items yet. They are auto-generated when posting invoices via MIRO or VF01.'}
        ctaLabel={t('btn_post_invoice')}
        ctaPath="/transaction/MIRO"
      />
    );
  }
  return (
    <StaticTable
      lang={lang}
      columns={[
        isVi ? 'Chứng từ' : 'Document',
        isVi ? 'Loại' : 'Type',
        isVi ? 'Tham chiếu' : 'Reference',
        isVi ? 'Đối tác' : 'Counterparty',
        isVi ? 'Số tiền' : 'Amount',
        isVi ? 'Ngày đăng' : 'Posted At',
      ]}
      rows={financeDocuments.map((d) => [
        d.id,
        d.type,
        d.reference,
        d.vendorName,
        `${d.amount.toLocaleString('vi-VN')} VND`,
        new Date(d.postedAt).toLocaleString(isVi ? 'vi-VN' : 'en-US'),
      ])}
    />
  );
}

function SalesAccountingOverview() {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const salesOrders = useSapStore((s) => s.salesOrders);
  const billingDocuments = useSapStore((s) => s.billingDocuments);
  const totalSO = salesOrders.reduce((sum, s) => sum + s.netValue, 0);
  const totalBilled = billingDocuments.reduce((sum, b) => sum + b.netValue, 0);
  return (
    <div className="space-y-4">
      <KpiGrid
        lang={lang}
        items={[
          { label: isVi ? 'Tổng số đơn bán hàng' : 'Total Sales Orders', value: salesOrders.length },
          { label: isVi ? 'Tổng giá trị SO' : 'Total SO Value', value: `${(totalSO / 1e6).toFixed(1)}M VND` },
          { label: isVi ? 'Số hóa đơn bán hàng' : 'Billing Documents', value: billingDocuments.length },
          { label: isVi ? 'Tổng đã xuất hóa đơn' : 'Total Billed', value: `${(totalBilled / 1e6).toFixed(1)}M VND` },
        ]}
      />
      {salesOrders.length === 0 ? (
        <EmptyState text={isVi ? 'Chưa có Sales Order nào.' : 'No Sales Orders yet.'} ctaLabel={t('btn_create_so')} ctaPath="/transaction/VA01" />
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: isVi ? 'Số SO' : 'SO Number', sortable: true },
            { key: 'customerName', label: isVi ? 'Khách hàng' : 'Customer', sortable: true },
            { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
            { key: 'netValue', label: isVi ? 'Giá trị' : 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
            { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={salesOrders}
          onRowClick={(row) => navigate(`/object/so/${row.id}`)}
          searchPlaceholder={isVi ? 'Tìm SO, khách hàng...' : 'Search SO, customer...'}
        />
      )}
    </div>
  );
}

function GrossMargin() {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const billingDocuments = useSapStore((s) => s.billingDocuments);
  const materials = useSapStore((s) => s.materials);
  if (billingDocuments.length === 0) {
    return (
      <EmptyState
        text={isVi ? 'Chưa có hóa đơn bán hàng nào để tính biên lợi nhuận.' : 'No billing documents yet to calculate margin.'}
        ctaLabel={t('btn_post_billing')}
        ctaPath="/transaction/VF01"
      />
    );
  }
  // Giá vốn lấy từ costPrice thật của từng material (material master), không
  // còn giả định cố định 70% cho mọi vật tư bất kể loại hàng.
  const rows = billingDocuments.map((b) => {
    const material = materials.find((m) => m.id === b.materialId);
    const unitCost = material?.costPrice ?? (b.netValue * 0.7) / b.quantity;
    const cost = unitCost * b.quantity;
    const marginPct = b.netValue === 0 ? '0.0' : (((b.netValue - cost) / b.netValue) * 100).toFixed(1);
    return { ...b, cost, marginPct };
  });
  return (
    <DataTable
      columns={[
        { key: 'id', label: isVi ? 'Hóa đơn' : 'Billing Doc', sortable: true },
        { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        { key: 'netValue', label: isVi ? 'Doanh thu (VND)' : 'Revenue (VND)', sortable: true, render: (r) => r.netValue.toLocaleString('vi-VN') },
        { key: 'cost', label: isVi ? 'Giá vốn (VND)' : 'Cost (VND)', sortable: true, render: (r) => r.cost.toLocaleString('vi-VN') },
        { key: 'marginPct', label: isVi ? 'Biên LN %' : 'Margin %', sortable: true, render: (r) => `${r.marginPct}%` },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/billing/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm hóa đơn bán hàng...' : 'Search billing documents...'}
    />
  );
}

function ApOverview() {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const total = supplierInvoices.reduce((sum, i) => sum + i.amount, 0);
  return (
    <div className="space-y-4">
      <KpiGrid
        lang={lang}
        items={[
          { label: isVi ? 'Hóa đơn đã đăng' : 'Invoices posted', value: supplierInvoices.length },
          { label: isVi ? 'Tổng công nợ phải trả' : 'Total payable', value: `${(total / 1e6).toFixed(1)}M VND` },
        ]}
      />
      {supplierInvoices.length === 0 ? (
        <EmptyState text={isVi ? 'Chưa có hóa đơn nhà cung cấp nào.' : 'No supplier invoices yet.'} ctaLabel={t('btn_post_invoice')} ctaPath="/transaction/MIRO" />
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: isVi ? 'Hóa đơn' : 'Invoice', sortable: true },
            { key: 'vendorName', label: isVi ? 'Nhà cung cấp' : 'Vendor', sortable: true },
            { key: 'amount', label: isVi ? 'Số tiền' : 'Amount', sortable: true, render: (r) => `${r.amount.toLocaleString('vi-VN')} VND` },
            { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={supplierInvoices}
          onRowClick={(row) => navigate(`/object/invoice/${row.id}`)}
          searchPlaceholder={isVi ? 'Tìm hóa đơn, vendor...' : 'Search invoice, vendor...'}
        />
      )}
    </div>
  );
}

function PaymentBlocks() {
  const navigate = useNavigate();
  const { lang } = useT();
  const isVi = lang === 'vi';
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const blocked = supplierInvoices.filter((i) => i.amount > 50000000);
  if (blocked.length === 0) {
    return <EmptyState text={isVi ? 'Không có hóa đơn nào đang bị giữ thanh toán (ngưỡng demo: trên 50 triệu VND).' : 'No invoices on payment block (demo threshold: over 50M VND).'} />;
  }
  return (
    <DataTable
      columns={[
        { key: 'id', label: isVi ? 'Hóa đơn' : 'Invoice', sortable: true },
        { key: 'vendorName', label: isVi ? 'Nhà cung cấp' : 'Vendor', sortable: true },
        { key: 'amount', label: isVi ? 'Số tiền' : 'Amount', sortable: true, render: (r) => `${r.amount.toLocaleString('vi-VN')} VND` },
        { key: 'reason', label: isVi ? 'Lý do chặn' : 'Block Reason', render: () => (isVi ? 'Vượt ngưỡng phê duyệt tự động' : 'Exceeds auto-approval threshold') },
      ]}
      rows={blocked}
      onRowClick={(row) => navigate(`/object/invoice/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm hóa đơn...' : 'Search invoices...'}
    />
  );
}

function CustomerLineItems() {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const billingDocuments = useSapStore((s) => s.billingDocuments);
  if (billingDocuments.length === 0) {
    return <EmptyState text={isVi ? 'Chưa có công nợ khách hàng nào.' : 'No customer receivables yet.'} ctaLabel={t('btn_post_billing')} ctaPath="/transaction/VF01" />;
  }
  return (
    <DataTable
      columns={[
        { key: 'id', label: isVi ? 'Hóa đơn' : 'Billing Doc', sortable: true },
        { key: 'customerName', label: isVi ? 'Khách hàng' : 'Customer', sortable: true },
        { key: 'netValue', label: isVi ? 'Số tiền' : 'Amount', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
        { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      rows={billingDocuments}
      onRowClick={(row) => navigate(`/object/billing/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm theo khách hàng...' : 'Search by customer...'}
    />
  );
}

function PurchaseRequisitions() {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  if (purchaseOrders.length === 0) {
    return <EmptyState text={isVi ? 'Chưa có yêu cầu mua hàng nào.' : 'No purchase requisitions yet.'} ctaLabel={t('btn_create_po')} ctaPath="/transaction/ME21N" />;
  }
  const rows = purchaseOrders.map((p) => ({ ...p, prId: `PR-${p.id.slice(-5)}` }));
  return (
    <DataTable
      columns={[
        { key: 'prId', label: isVi ? 'PR (suy ra từ PO)' : 'PR (derived)', sortable: true },
        { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        { key: 'vendorName', label: isVi ? 'Nhà cung cấp' : 'Vendor', sortable: true },
        { key: 'derivedStatus', label: isVi ? 'Trạng thái' : 'Status', render: () => <StatusBadge status="Converted" /> },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/po/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm theo vật tư, vendor...' : 'Search material, vendor...'}
    />
  );
}

function LegalContracts() {
  const navigate = useNavigate();
  const { lang } = useT();
  const isVi = lang === 'vi';
  const vendors = useSapStore((s) => s.vendors);
  const rows = vendors.map((v, i) => ({ ...v, contractId: `CTR-${1000 + i}` }));
  return (
    <DataTable
      columns={[
        { key: 'contractId', label: isVi ? 'Hợp đồng' : 'Contract', sortable: true },
        { key: 'name', label: isVi ? 'Nhà cung cấp' : 'Vendor', sortable: true },
        { key: 'type', label: isVi ? 'Loại' : 'Type', render: () => (isVi ? 'Hợp đồng khung' : 'Framework Agreement') },
        { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: () => <StatusBadge status="Active" /> },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/vendor/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm theo tên nhà cung cấp...' : 'Search by vendor name...'}
    />
  );
}

function SupplierBalances() {
  const navigate = useNavigate();
  const { lang } = useT();
  const isVi = lang === 'vi';
  const vendors = useSapStore((s) => s.vendors);
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const rows = vendors.map((v) => {
    const total = supplierInvoices.filter((i) => i.vendorId === v.id).reduce((sum, i) => sum + i.amount, 0);
    return { ...v, totalInvoiced: total, openBalance: total * 0.4 };
  });
  return (
    <DataTable
      columns={[
        { key: 'id', label: isVi ? 'Nhà cung cấp' : 'Vendor', sortable: true },
        { key: 'name', label: isVi ? 'Tên' : 'Name', sortable: true },
        { key: 'totalInvoiced', label: isVi ? 'Tổng đã ghi nhận' : 'Total Invoiced', sortable: true, render: (r) => `${r.totalInvoiced.toLocaleString('vi-VN')} VND` },
        { key: 'openBalance', label: isVi ? 'Số dư còn nợ' : 'Open Balance', sortable: true, render: (r) => `${r.openBalance.toLocaleString('vi-VN')} VND` },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/vendor/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm theo tên nhà cung cấp...' : 'Search by vendor name...'}
    />
  );
}

function InspectionLots() {
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const goodsReceipts = useSapStore((s) => s.goodsReceipts);
  if (goodsReceipts.length === 0) {
    return (
      <EmptyState
        text={isVi ? 'Chưa có lô hàng nào cần kiểm tra. Lô kiểm tra sinh ra từ Goods Receipt (MIGO).' : 'No inspection lots yet. Lots are generated from Goods Receipt (MIGO).'}
        ctaLabel={t('btn_post_gr')}
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
        { key: 'lotId', label: isVi ? 'Lô kiểm tra' : 'Inspection Lot', sortable: true },
        { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        { key: 'quantity', label: isVi ? 'Số lượng' : 'Quantity', sortable: true },
        { key: 'plant', label: 'Plant', sortable: true },
        { key: 'decision', label: isVi ? 'Quyết định' : 'Decision', render: (r) => <StatusBadge status={r.decision} /> },
      ]}
      rows={rows}
      searchPlaceholder={isVi ? 'Tìm theo vật tư...' : 'Search by material...'}
    />
  );
}

function FulfillmentIssues() {
  const navigate = useNavigate();
  const { lang } = useT();
  const isVi = lang === 'vi';
  const salesOrders = useSapStore((s) => s.salesOrders);
  const backorders = salesOrders.filter((s) => s.status === 'Backorder');
  if (backorders.length === 0) {
    return <EmptyState text={isVi ? 'Không có Sales Order nào đang gặp vấn đề tồn kho.' : 'No Sales Orders currently facing stock issues.'} />;
  }
  return (
    <DataTable
      columns={[
        { key: 'id', label: isVi ? 'Số SO' : 'SO Number', sortable: true },
        { key: 'customerName', label: isVi ? 'Khách hàng' : 'Customer', sortable: true },
        { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        { key: 'quantity', label: isVi ? 'Số lượng' : 'Quantity', sortable: true, render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'availableAtCreation', label: isVi ? 'Tồn kho lúc tạo' : 'Available at creation', sortable: true, render: (r) => `${r.availableAtCreation} ${r.unit}` },
      ]}
      rows={backorders}
      onRowClick={(row) => navigate(`/object/so/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm theo khách hàng...' : 'Search by customer...'}
    />
  );
}

function TopCustomers() {
  const navigate = useNavigate();
  const { lang } = useT();
  const isVi = lang === 'vi';
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
        { key: 'name', label: isVi ? 'Khách hàng' : 'Customer', sortable: true },
        { key: 'country', label: isVi ? 'Quốc gia' : 'Country', sortable: true },
        { key: 'orderCount', label: isVi ? 'Số đơn' : 'Orders', sortable: true },
        { key: 'total', label: isVi ? 'Tổng giá trị' : 'Total Value', sortable: true, render: (r) => `${r.total.toLocaleString('vi-VN')} VND` },
      ]}
      rows={rows}
      onRowClick={(row) => navigate(`/object/customer/${row.id}`)}
      searchPlaceholder={isVi ? 'Tìm theo tên khách hàng...' : 'Search by customer name...'}
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
  const { lang } = useT();
  const app = APP_REGISTRY[appKey];

  if (!app) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        {lang === 'vi' ? 'Không tìm thấy app' : 'App not found'} <code>{appKey}</code>.
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb crumbs={[{ label: lang === 'vi' ? 'Ứng dụng' : 'Apps' }, { label: tr(app.title, lang) }]} />
      <div className="flex items-center gap-2 mb-1.5">
        <i className={`ti ${app.icon} text-xl text-[var(--fiori-link)]`} aria-hidden="true" />
        <h1 className="text-lg font-medium">{tr(app.title, lang)}</h1>
      </div>
      <p className="text-sm text-[var(--fiori-text-secondary)] mb-4">{tr(app.description, lang)}</p>

      {app.kind === 'static-table' && <StaticTable columns={app.columns} rows={app.rows} lang={lang} />}
      {app.kind === 'static-kpi-grid' && <KpiGrid items={app.items} lang={lang} />}
      {(() => {
        const Renderer = DYNAMIC_RENDERERS[app.kind];
        return Renderer ? <Renderer /> : null;
      })()}
    </div>
  );
}
