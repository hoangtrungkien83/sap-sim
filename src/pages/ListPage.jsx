import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../store/sapStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Breadcrumb from '../components/Breadcrumb';
import { useT } from '../hooks/useT';
import { getMaterialName } from '../data/masterData';

// listKey -> { breadcrumb module key, object detail route prefix }
const LIST_META = {
  vendors: { moduleKey: 'nav_procurement', modulePath: '/procurement', objectPath: (row) => `/object/vendor/${row.id}` },
  invoices: { moduleKey: 'nav_procurement', modulePath: '/procurement', objectPath: (row) => `/object/invoice/${row.id}` },
  stock: { moduleKey: 'nav_manufacturing', modulePath: '/manufacturing', objectPath: null },
  pos: { moduleKey: 'nav_procurement', modulePath: '/procurement', objectPath: (row) => `/object/po/${row.id}` },
  salesOrders: { moduleKey: 'nav_sales', modulePath: '/sales', objectPath: (row) => `/object/so/${row.id}` },
  billing: { moduleKey: 'nav_sales', modulePath: '/sales', objectPath: (row) => `/object/billing/${row.id}` },
};

export default function ListPage() {
  const { listKey } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const vendors = useSapStore((s) => s.vendors);
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const stock = useSapStore((s) => s.stock);
  const materials = useSapStore((s) => s.materials);
  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const salesOrders = useSapStore((s) => s.salesOrders);
  const billingDocuments = useSapStore((s) => s.billingDocuments);

  const isVi = lang === 'vi';

  const configs = {
    vendors: {
      title: isVi ? 'Danh sách nhà cung cấp' : 'Display Supplier List',
      icon: 'ti-truck',
      columns: [
        { key: 'id', label: isVi ? 'Mã NCC' : 'Vendor ID', sortable: true },
        { key: 'name', label: isVi ? 'Tên' : 'Name', sortable: true },
        { key: 'country', label: isVi ? 'Quốc gia' : 'Country', sortable: true },
        { key: 'currency', label: isVi ? 'Tiền tệ' : 'Currency', sortable: true },
        { key: 'category', label: isVi ? 'Danh mục' : 'Category', render: (r) => r.category?.[lang] ?? r.category?.vi },
      ],
      rows: vendors,
      empty: isVi ? 'Chưa có nhà cung cấp.' : 'No vendors yet.',
      searchPlaceholder: isVi ? 'Tìm theo tên hoặc mã nhà cung cấp...' : 'Search by vendor name or ID...',
      searchKeys: ['id', 'name', 'country'],
    },
    invoices: {
      title: isVi ? 'Danh sách hóa đơn nhà cung cấp' : 'Supplier Invoices List',
      icon: 'ti-file-invoice',
      columns: [
        { key: 'id', label: isVi ? 'Số hóa đơn' : 'Invoice No.', sortable: true },
        { key: 'vendorName', label: isVi ? 'Nhà cung cấp' : 'Vendor', sortable: true },
        { key: 'poId', label: isVi ? 'Tham chiếu PO' : 'PO Reference', sortable: true },
        { key: 'amount', label: isVi ? 'Số tiền' : 'Amount', sortable: true, render: (r) => `${r.amount.toLocaleString('vi-VN')} ${r.currency}` },
        { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: supplierInvoices,
      empty: isVi ? 'Chưa có hóa đơn nào được ghi nhận. Hãy dùng MIRO để tạo hóa đơn.' : 'No invoices recorded yet. Use MIRO to create one.',
      searchPlaceholder: isVi ? 'Tìm theo số hóa đơn, vendor...' : 'Search by invoice no., vendor...',
    },
    stock: {
      title: isVi ? 'MB52 — Hiển thị tồn kho' : 'MB52 — Display Warehouse Stock',
      icon: 'ti-building-warehouse',
      columns: [
        { key: 'materialId', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        {
          key: 'materialName',
          label: isVi ? 'Diễn giải' : 'Description',
          render: (r) => getMaterialName(materials.find((m) => m.id === r.materialId), lang) || '—',
        },
        { key: 'plant', label: 'Plant', sortable: true },
        { key: 'qty', label: isVi ? 'Số lượng' : 'Quantity', sortable: true, render: (r) => `${r.qty.toLocaleString('vi-VN')} ${r.unit}` },
      ],
      rows: stock.map((s) => ({ ...s, materialName: getMaterialName(materials.find((m) => m.id === s.materialId), lang) })),
      empty: isVi ? 'Không có dữ liệu tồn kho.' : 'No stock data.',
      searchPlaceholder: isVi ? 'Tìm theo mã vật tư...' : 'Search by material code...',
      searchKeys: ['materialId', 'materialName', 'plant'],
    },
    pos: {
      title: isVi ? 'Danh sách đơn đặt hàng' : 'Purchase Order list',
      icon: 'ti-clipboard-list',
      columns: [
        { key: 'id', label: isVi ? 'Số PO' : 'PO Number', sortable: true },
        { key: 'vendorName', label: isVi ? 'Nhà cung cấp' : 'Vendor', sortable: true },
        { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        { key: 'quantity', label: isVi ? 'Số lượng' : 'Quantity', sortable: true, render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'netValue', label: isVi ? 'Giá trị' : 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
        { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: purchaseOrders,
      empty: isVi ? 'Chưa có Purchase Order nào. Hãy dùng ME21N để tạo PO.' : 'No Purchase Orders yet. Use ME21N to create one.',
      searchPlaceholder: isVi ? 'Tìm theo số PO, vendor, vật tư...' : 'Search by PO no., vendor, material...',
    },
    salesOrders: {
      title: isVi ? 'Danh sách đơn bán hàng' : 'Sales Order List',
      icon: 'ti-shopping-cart',
      columns: [
        { key: 'id', label: isVi ? 'Số SO' : 'SO Number', sortable: true },
        { key: 'customerName', label: isVi ? 'Khách hàng' : 'Customer', sortable: true },
        { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        { key: 'quantity', label: isVi ? 'Số lượng' : 'Quantity', sortable: true, render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'netValue', label: isVi ? 'Giá trị' : 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
        { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: salesOrders,
      empty: isVi ? 'Chưa có Sales Order nào. Hãy dùng VA01 để tạo đơn hàng.' : 'No Sales Orders yet. Use VA01 to create one.',
      searchPlaceholder: isVi ? 'Tìm theo số SO, khách hàng...' : 'Search by SO no., customer...',
    },
    billing: {
      title: isVi ? 'Danh sách hóa đơn bán hàng' : 'Billing Documents List',
      icon: 'ti-receipt-2',
      columns: [
        { key: 'id', label: isVi ? 'Số hóa đơn' : 'Billing Doc.', sortable: true },
        { key: 'soId', label: isVi ? 'Tham chiếu SO' : 'SO Reference', sortable: true },
        { key: 'customerName', label: isVi ? 'Khách hàng' : 'Customer', sortable: true },
        { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
        { key: 'netValue', label: isVi ? 'Giá trị' : 'Net Value', sortable: true, render: (r) => `${r.netValue.toLocaleString('vi-VN')} ${r.currency}` },
        { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ],
      rows: billingDocuments,
      empty: isVi ? 'Chưa có hóa đơn bán hàng nào. Hãy dùng VF01 để xuất hóa đơn từ Sales Order đã Confirmed.' : 'No billing documents yet. Use VF01 to bill a Confirmed Sales Order.',
      searchPlaceholder: isVi ? 'Tìm theo số hóa đơn, khách hàng...' : 'Search by billing no., customer...',
    },
  };

  const config = configs[listKey];
  const meta = LIST_META[listKey];

  if (!config) {
    return <div className="text-sm text-[var(--fiori-text-secondary)]">{isVi ? 'Danh sách không tồn tại.' : 'List not found.'}</div>;
  }

  return (
    <div>
      {meta && <Breadcrumb crumbs={[{ label: t(meta.moduleKey), path: meta.modulePath }, { label: config.title }]} />}
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
