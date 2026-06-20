import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import Breadcrumb from '../../components/Breadcrumb';

export default function VF01() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetSoId = searchParams.get('soId') || '';

  const salesOrders = useSapStore((s) => s.salesOrders);
  const createBillingDocument = useSapStore((s) => s.createBillingDocument);

  const billableSOs = salesOrders.filter((s) => s.status === 'Confirmed');
  const [soId, setSoId] = useState(presetSoId || billableSOs[0]?.id || '');
  const selectedSo = salesOrders.find((s) => s.id === soId);

  const [posted, setPosted] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedSo) {
      setError('Vui lòng chọn Sales Order.');
      return;
    }
    const billing = createBillingDocument({ soId });
    if (!billing) {
      setError('Sales Order này không thể xuất hóa đơn (chưa Confirmed hoặc đã Billed).');
      return;
    }
    setPosted(billing);
  };

  if (billableSOs.length === 0 && !posted) {
    return (
      <div className="max-w-2xl">
        <Breadcrumb crumbs={[{ label: 'Sales', path: '/sales' }, { label: 'VF01 — Create Billing Document' }]} />
        <div className="flex items-center gap-2 mb-4">
          <i className="ti ti-receipt-2 text-xl text-[var(--fiori-link)]" aria-hidden="true" />
          <h1 className="text-lg font-medium">VF01 — Create Billing Document</h1>
        </div>
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 text-sm text-[var(--fiori-text-secondary)]">
          Chưa có Sales Order nào ở trạng thái Confirmed để xuất hóa đơn. Đơn Backorder cần đủ
          hàng (qua MIGO) hoặc tạo SO mới với đủ tồn kho.
          <div className="mt-3">
            <button
              onClick={() => navigate('/transaction/VA01')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Tạo Sales Order (VA01)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Breadcrumb crumbs={[{ label: 'Sales', path: '/sales' }, { label: 'VF01 — Create Billing Document' }]} />
      <div className="flex items-center gap-2 mb-4">
        <i className="ti ti-receipt-2 text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h1 className="text-lg font-medium">VF01 — Create Billing Document</h1>
      </div>

      {posted ? (
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5">
          <div className="flex items-center gap-2 text-[var(--fiori-success)] mb-3">
            <i className="ti ti-circle-check text-xl" aria-hidden="true" />
            <span className="font-medium">Đã xuất hóa đơn bán hàng</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--fiori-text-secondary)]">Billing Document</dt>
            <dd className="font-medium">{posted.id}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">SO Reference</dt>
            <dd>{posted.soId}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Customer</dt>
            <dd>{posted.customerName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Material</dt>
            <dd>{posted.materialName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Net Value</dt>
            <dd className="font-medium">{posted.netValue.toLocaleString('vi-VN')} {posted.currency}</dd>
          </dl>
          <p className="text-xs text-[var(--fiori-text-secondary)] mt-3">
            Bút toán FI (Customer Invoice) đã được tạo tự động — xem trong Finance &gt; Accounts Receivable.
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate('/finance')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Xem Accounts Receivable
            </button>
            <button
              onClick={() => navigate('/list/billing')}
              className="border border-[var(--fiori-tile-border)] text-sm px-3 py-1.5 rounded hover:bg-gray-50"
            >
              Danh sách hóa đơn bán hàng
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 space-y-4">
          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Sales Order (Confirmed)</label>
            <select
              value={soId}
              onChange={(e) => setSoId(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            >
              {billableSOs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.materialName} ({s.customerName})
                </option>
              ))}
            </select>
          </div>

          {selectedSo && (
            <div className="bg-[var(--fiori-page-bg)] rounded p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--fiori-text-secondary)]">Quantity</span>
                <span>{selectedSo.quantity} {selectedSo.unit}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net Value sẽ xuất hóa đơn</span>
                <span>{selectedSo.netValue.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-[var(--fiori-danger)]">{error}</p>}

          <button
            type="submit"
            className="bg-[var(--fiori-link)] text-white text-sm px-4 py-2 rounded hover:opacity-90"
          >
            Post Billing Document
          </button>
        </form>
      )}
    </div>
  );
}
