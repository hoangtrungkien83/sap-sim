import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSapStore } from '../store/sapStore';

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  return `${hours} giờ trước`;
}

export default function NotificationPanel({ open, onClose }) {
  const navigate = useNavigate();
  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const salesOrders = useSapStore((s) => s.salesOrders);
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const stock = useSapStore((s) => s.stock);
  const materials = useSapStore((s) => s.materials);

  const notifications = useMemo(() => {
    const items = [];

    // PO vừa tạo trong 24h
    purchaseOrders.slice(0, 3).forEach((po) => {
      items.push({
        id: `po-${po.id}`,
        icon: 'ti-clipboard-list',
        tone: 'default',
        title: `PO ${po.id} đã được tạo`,
        detail: `${po.materialName} · ${po.vendorName}`,
        time: po.createdAt,
        path: '/list/pos',
      });
    });

    // SO backorder cần chú ý
    salesOrders
      .filter((so) => so.status === 'Backorder')
      .forEach((so) => {
        items.push({
          id: `so-${so.id}`,
          icon: 'ti-alert-triangle',
          tone: 'warning',
          title: `SO ${so.id} đang Backorder`,
          detail: `${so.materialName} cho ${so.customerName} — thiếu tồn kho`,
          time: so.createdAt,
          path: '/list/salesOrders',
        });
      });

    // Hóa đơn vừa đăng
    supplierInvoices.slice(0, 2).forEach((inv) => {
      items.push({
        id: `inv-${inv.id}`,
        icon: 'ti-file-dollar',
        tone: 'success',
        title: `Hóa đơn ${inv.id} đã đăng`,
        detail: `${inv.amount.toLocaleString('vi-VN')} VND · ${inv.vendorName}`,
        time: inv.postedAt,
        path: '/list/invoices',
      });
    });

    // Cảnh báo tồn kho thấp (< 20% mốc tham chiếu giả định)
    stock.forEach((s) => {
      const material = materials.find((m) => m.id === s.materialId);
      if (s.qty < 50) {
        items.push({
          id: `stock-${s.materialId}`,
          icon: 'ti-building-warehouse',
          tone: 'warning',
          title: `Tồn kho thấp: ${material?.name ?? s.materialId}`,
          detail: `Chỉ còn ${s.qty} ${s.unit} tại Plant ${s.plant}`,
          time: new Date().toISOString(),
          path: '/list/stock',
        });
      }
    });

    return items.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
  }, [purchaseOrders, salesOrders, supplierInvoices, stock, materials]);

  if (!open) return null;

  const toneColor = {
    default: 'text-[var(--fiori-link)]',
    warning: 'text-[var(--fiori-warning)]',
    success: 'text-[var(--fiori-success)]',
    danger: 'text-[var(--fiori-danger)]',
  };

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/20" onClick={onClose} aria-label="Đóng" />
      <div className="absolute right-3 top-14 bg-white w-96 max-w-[90vw] rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--fiori-tile-border)] px-4 py-3">
          <h2 className="text-sm font-medium">Notifications</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" aria-label="Đóng">
            <i className="ti ti-x text-base" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-[var(--fiori-text-secondary)] px-4 py-8 text-center">
              Chưa có thông báo. Hãy thử tạo PO, Sales Order hoặc đăng hóa đơn.
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  onClose();
                  navigate(n.path);
                }}
                className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[var(--fiori-page-bg)] border-b border-[var(--fiori-tile-border)] last:border-0"
              >
                <i className={`ti ${n.icon} text-lg mt-0.5 ${toneColor[n.tone]}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{n.title}</p>
                  <p className="text-xs text-[var(--fiori-text-secondary)] truncate">{n.detail}</p>
                  <p className="text-xs text-[var(--fiori-text-secondary)] mt-0.5">{timeAgo(n.time)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
