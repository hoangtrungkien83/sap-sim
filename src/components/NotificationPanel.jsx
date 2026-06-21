import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSapStore } from '../store/sapStore';
import { useT } from '../hooks/useT';
import { getMaterialName } from '../data/masterData';

function timeAgo(isoString, isVi) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return isVi ? 'vừa xong' : 'just now';
  if (mins < 60) return isVi ? `${mins} phút trước` : `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return isVi ? `${hours} giờ trước` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return isVi ? `${days} ngày trước` : `${days}d ago`;
}

export default function NotificationPanel({ open, onClose }) {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const salesOrders = useSapStore((s) => s.salesOrders);
  const supplierInvoices = useSapStore((s) => s.supplierInvoices);
  const stock = useSapStore((s) => s.stock);
  const materials = useSapStore((s) => s.materials);

  const notifications = useMemo(() => {
    const items = [];

    // PO vừa tạo gần đây
    purchaseOrders.slice(0, 3).forEach((po) => {
      items.push({
        id: `po-${po.id}`,
        icon: 'ti-clipboard-list',
        tone: 'default',
        title: isVi ? `PO ${po.id} đã được tạo` : `PO ${po.id} created`,
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
          title: isVi ? `SO ${so.id} đang Backorder` : `SO ${so.id} is Backorder`,
          detail: isVi
            ? `${so.materialName} cho ${so.customerName} — thiếu tồn kho`
            : `${so.materialName} for ${so.customerName} — insufficient stock`,
          time: so.createdAt,
          path: '/list/salesOrders',
        });
      });

    // SO vừa được tự động xác nhận từ Backorder (sau khi MIGO bổ sung kho)
    salesOrders
      .filter((so) => so.confirmedAt)
      .forEach((so) => {
        items.push({
          id: `so-confirmed-${so.id}`,
          icon: 'ti-circle-check',
          tone: 'success',
          title: isVi ? `SO ${so.id} đã tự động Confirmed` : `SO ${so.id} auto-confirmed`,
          detail: isVi
            ? `Đủ tồn kho cho ${so.customerName} sau khi nhập hàng`
            : `Stock now sufficient for ${so.customerName} after goods receipt`,
          time: so.confirmedAt,
          path: `/object/so/${so.id}`,
        });
      });

    // Hóa đơn vừa đăng
    supplierInvoices.slice(0, 2).forEach((inv) => {
      items.push({
        id: `inv-${inv.id}`,
        icon: 'ti-file-dollar',
        tone: 'success',
        title: isVi ? `Hóa đơn ${inv.id} đã đăng` : `Invoice ${inv.id} posted`,
        detail: `${inv.amount.toLocaleString('vi-VN')} VND · ${inv.vendorName}`,
        time: inv.postedAt,
        path: '/list/invoices',
      });
    });

    // Cảnh báo tồn kho thấp
    stock.forEach((s) => {
      const material = materials.find((m) => m.id === s.materialId);
      const materialName = getMaterialName(material, lang) || s.materialId;
      if (s.qty < 50) {
        items.push({
          id: `stock-${s.materialId}`,
          icon: 'ti-building-warehouse',
          tone: 'warning',
          title: isVi ? `Tồn kho thấp: ${materialName}` : `Low stock: ${materialName}`,
          detail: isVi ? `Chỉ còn ${s.qty} ${s.unit} tại Plant ${s.plant}` : `Only ${s.qty} ${s.unit} left at Plant ${s.plant}`,
          time: new Date().toISOString(),
          path: '/list/stock',
        });
      }
    });

    return items.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
  }, [purchaseOrders, salesOrders, supplierInvoices, stock, materials, lang, isVi]);

  if (!open) return null;

  const toneColor = {
    default: 'text-[var(--fiori-link)]',
    warning: 'text-[var(--fiori-warning)]',
    success: 'text-[var(--fiori-success)]',
    danger: 'text-[var(--fiori-danger)]',
  };

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/20" onClick={onClose} aria-label={t('btn_close')} />
      <div className="absolute right-3 top-14 bg-white w-96 max-w-[90vw] rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--fiori-tile-border)] px-4 py-3">
          <h2 className="text-sm font-medium">{t('shell_notifications')}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" aria-label={t('btn_close')}>
            <i className="ti ti-x text-base" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-[var(--fiori-text-secondary)] px-4 py-8 text-center">
              {t('shell_no_notifications')}
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
                  <p className="text-xs text-[var(--fiori-text-secondary)] mt-0.5">{timeAgo(n.time, isVi)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
