import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../store/sapStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Breadcrumb from '../components/Breadcrumb';

// listKey -> { breadcrumb module, object detail route prefix }
const LIST_META = {
  vendors: { module: 'Procurement', modulePath: '/procurement', objectPath: (row) => `/object/vendor/${row.id}` },
  invoices: { module: 'Procurement', modulePath: '/procurement', objectPath: (row) => `/object/invoice/${row.id}` },
  stock: { module: 'Manufacturing and Supply Chain', modulePath: '/manufacturing', objectPath: null },
  pos: { module: 'Procurement', modulePath: '/procurement', objectPath: (row) => `/object/po/${row.id}` },
  salesOrders: { module: 'Sales', modulePath: '/sales', objectPath: (row) => `/object/so/${row.id}` },
  billing: { module: 'Sales', modulePath: '/sales', objectPath: (row) => `/object/billing/${row.id}` },
};

export default function ListPage() {
  const { listKey } = useParams();
  const navigate = useNavigate();
  const vendors = useSapStore((s) => s.vendors);
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const stock = useSapStore((s) => s.stock);
  const materials = useSapStore((s) => s.materials);
  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const salesOrders = useSapStore((s) => s.salesOrders);
  const billingDocuments = useSapStore((s) => s.billingDocuments);

  const configs = {
    vendors: {
      title: 'Display Supplier List',
      icon: 'ti-truck',
      columns: [
        { key: 'id', label: 'Vendor ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'country', label: 'Country', sortable: true },
        { key: 'currency', label: 'Currency', sortable: true },
      ],
      rows: vendors,
      empty: 'Chưa có nhà cung cấp.',
      searchPlaceholder: 'Tìm theo tên hoặc mã nhà cung cấp...',
    },
    invoices: {
      title: 'Supplier Invoices List',
      icon: 'ti-file-invoice',
      columns: [
        { key: 'id', label: 'Invoice No.', sortable: true },
        { key: 'vendorName', label: 'Vendor', sortable: true },
        { key: 'poId', label: 'PO Reference', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true, render: (r) => `${r.amount.toLocaleString('vi-VN')} ${r.currency}` },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: supplierInvoices,
      empty: 'Chưa có hóa đơn nào được ghi nhận. Hãy dùng MIRO để tạo hóa đơn.',
      searchPlaceholder: 'Tìm theo số hóa đơn, vendor...',
    },
    stock: {
      title: 'MB52 — Display Warehouse Stock',
      icon: 'ti-building-warehouse',
      columns: [
        { key: 'materialId', label: 'Material', sortable: true },
        {
          key: 'materialName',
          label: 'Description',
          render: (r) => materials.find((m) => m.id === r.materialId)?.name ?? '—',
        },
        { key: 'plant', label: 'Plant', sortable: true },
        { key: 'qty', label: 'Quantity', sortable: true, render: (r) => `${r.qty.toLocaleString('vi-VN')} ${r.unit}` },
      ],
      rows: stock.map((s) => ({ ...s, materialName: materials.find((m) => m.id === s.materialId)?.name ?? '' })),
      empty: 'Không có dữ liệu tồn kho.',
      searchPlaceholder: 'Tìm theo mã vật tư...',
      searchKeys: ['materialId', 'materialName', 'plant'],
    },
    pos: {
      title: 'Purchase Order list',
      icon: 'ti-clipboard-list',
      columns: [
        { key: 'id', label: 'PO Number', sortable: true },
        { key: 'vendorName', label: 'Vendor', sortable: true },
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true, render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'netValue', label: 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: purchaseOrders,
      empty: 'Chưa có Purchase Order nào. Hãy dùng ME21N để tạo PO.',
      searchPlaceholder: 'Tìm theo số PO, vendor, vật tư...',
    },
    salesOrders: {
      title: 'Sales Order List',
      icon: 'ti-shopping-cart',
      columns: [
        { key: 'id', label: 'SO Number', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true, render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'netValue', label: 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: salesOrders,
      empty: 'Chưa có Sales Order nào. Hãy dùng VA01 để tạo đơn hàng.',
      searchPlaceholder: 'Tìm theo số SO, khách hàng...',
    },
    billing: {
      title: 'Billing Documents List',
      icon: 'ti-receipt-2',
      columns: [
        { key: 'id', label: 'Billing Doc.', sortable: true },
        { key: 'soId', label: 'SO Reference', sortable: true },
        { key: 'customerName', label: 'Customer', sortable: true },
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'netValue', label: 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} ${r.currency}` },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: billingDocuments,
      empty: 'Chưa có hóa đơn bán hàng nào. Hãy dùng VF01 để xuất hóa đơn từ Sales Order đã Confirmed.',
      searchPlaceholder: 'Tìm theo số hóa đơn, khách hàng...',
    },
  };

  const config = configs[listKey];
  const meta = LIST_META[listKey];

  if (!config) {
    return <div className="text-sm text-[var(--fiori-text-secondary)]">Danh sách không tồn tại.</div>;
  }

  return (
    <div>
      {meta && (
        <Breadcrumb crumbs={[{ label: meta.module, path: meta.modulePath }, { label: config.title }]} />
      )}
      <div className="flex items-center gap-2 mb-4">
        <i className={`ti ${config.icon} text-xl text-[var(--fiori-link)]`} aria-hidden="true" />
        <h1 className="text-lg font-medium">{config.title}</h1>
      </div>
      <DataTable
        columns={config.columns}
        rows={config.rows}
        emptyText={config.empty}
        searchPlaceholder={config.searchPlaceholder}
        searchKeys={config.searchKeys}
        onRowClick={meta?.objectPath ? (row) => navigate(meta.objectPath(row)) : undefined}
      />
    </div>
  );
}
