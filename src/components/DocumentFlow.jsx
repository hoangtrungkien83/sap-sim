const TYPE_ICON = {
  'Purchase Order': 'ti-clipboard-list',
  'Goods Receipt': 'ti-truck-delivery',
  'Supplier Invoice': 'ti-file-dollar',
  'Sales Order': 'ti-shopping-cart',
  'Billing Document': 'ti-receipt-2',
  'FI Document': 'ti-report-money',
};

export default function DocumentFlow({ flow }) {
  if (!flow || flow.length === 0) {
    return <p className="text-sm text-[var(--fiori-text-secondary)]">Chưa có chứng từ liên quan.</p>;
  }

  return (
    <ol className="relative border-l-2 border-[var(--fiori-tile-border)] ml-2 space-y-5">
      {flow.map((doc, i) => (
        <li key={`${doc.type}-${doc.id}`} className="ml-5">
          <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-[var(--fiori-link)] ring-4 ring-white">
            <i className={`ti ${TYPE_ICON[doc.type] ?? 'ti-file'} text-[8px] text-white`} aria-hidden="true" />
          </span>
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div>
              <p className="text-sm font-medium text-[var(--fiori-text-primary)]">{doc.type}</p>
              <p className="text-xs text-[var(--fiori-text-secondary)]">
                {doc.id} · {doc.status}
              </p>
            </div>
            <span className="text-xs text-[var(--fiori-text-secondary)]">
              {new Date(doc.date).toLocaleString('vi-VN')}
            </span>
          </div>
          {i === flow.length - 1 && (
            <span className="inline-block mt-1 text-xs text-[var(--fiori-link)] font-medium">● Trạng thái hiện tại</span>
          )}
        </li>
      ))}
    </ol>
  );
}
