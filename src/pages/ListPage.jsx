import { useParams } from 'react-router-dom';
import { useSapStore } from '../store/sapStore';

function Table({ columns, rows, emptyText }) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-8 text-center text-sm text-[var(--fiori-text-secondary)]">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--fiori-tile-border)] bg-[var(--fiori-page-bg)]">
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-2 font-medium text-[var(--fiori-text-secondary)]">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--fiori-tile-border)] last:border-0 hover:bg-[var(--fiori-page-bg)]">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ListPage() {
  const { listKey } = useParams();
  const vendors = useSapStore((s) => s.vendors);
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const stock = useSapStore((s) => s.stock);
  const materials = useSapStore((s) => s.materials);
  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const salesOrders = useSapStore((s) => s.salesOrders);

  const configs = {
    vendors: {
      title: 'Display Supplier List',
      icon: 'ti-truck',
      columns: [
        { key: 'id', label: 'Vendor ID' },
        { key: 'name', label: 'Name' },
        { key: 'country', label: 'Country' },
        { key: 'currency', label: 'Currency' },
      ],
      rows: vendors,
      empty: 'Chưa có nhà cung cấp.',
    },
    invoices: {
      title: 'Supplier Invoices List',
      icon: 'ti-file-invoice',
      columns: [
        { key: 'id', label: 'Invoice No.' },
        { key: 'vendorName', label: 'Vendor' },
        { key: 'poId', label: 'PO Reference' },
        { key: 'amount', label: 'Amount', render: (r) => `${r.amount.toLocaleString('vi-VN')} ${r.currency}` },
        { key: 'status', label: 'Status' },
      ],
      rows: supplierInvoices,
      empty: 'Chưa có hóa đơn nào được ghi nhận. Hãy dùng MIRO để tạo hóa đơn.',
    },
    stock: {
      title: 'MB52 — Display Warehouse Stock',
      icon: 'ti-building-warehouse',
      columns: [
        { key: 'materialId', label: 'Material' },
        {
          key: 'materialName',
          label: 'Description',
          render: (r) => materials.find((m) => m.id === r.materialId)?.name ?? '—',
        },
        { key: 'plant', label: 'Plant' },
        { key: 'qty', label: 'Quantity', render: (r) => `${r.qty.toLocaleString('vi-VN')} ${r.unit}` },
      ],
      rows: stock,
      empty: 'Không có dữ liệu tồn kho.',
    },
    pos: {
      title: 'Purchase Order list',
      icon: 'ti-clipboard-list',
      columns: [
        { key: 'id', label: 'PO Number' },
        { key: 'vendorName', label: 'Vendor' },
        { key: 'materialName', label: 'Material' },
        { key: 'quantity', label: 'Quantity', render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'status', label: 'Status' },
      ],
      rows: purchaseOrders,
      empty: 'Chưa có Purchase Order nào. Hãy dùng ME21N để tạo PO.',
    },
    salesOrders: {
      title: 'Sales Order List',
      icon: 'ti-shopping-cart',
      columns: [
        { key: 'id', label: 'SO Number' },
        { key: 'customerName', label: 'Customer' },
        { key: 'materialName', label: 'Material' },
        { key: 'quantity', label: 'Quantity', render: (r) => `${r.quantity} ${r.unit}` },
        { key: 'netValue', label: 'Net Value', render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND` },
        {
          key: 'status',
          label: 'Status',
          render: (r) => (
            <span
              className={
                r.status === 'Confirmed'
                  ? 'text-[var(--fiori-success)]'
                  : 'text-[var(--fiori-warning)]'
              }
            >
              {r.status}
            </span>
          ),
        },
      ],
      rows: salesOrders,
      empty: 'Chưa có Sales Order nào. Hãy dùng VA01 để tạo đơn hàng.',
    },
  };

  const config = configs[listKey];
  if (!config) {
    return <div className="text-sm text-[var(--fiori-text-secondary)]">Danh sách không tồn tại.</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <i className={`ti ${config.icon} text-xl text-[var(--fiori-link)]`} aria-hidden="true" />
        <h1 className="text-lg font-medium">{config.title}</h1>
      </div>
      <Table columns={config.columns} rows={config.rows} emptyText={config.empty} />
    </div>
  );
}
