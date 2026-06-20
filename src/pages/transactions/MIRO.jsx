import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';

export default function MIRO() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetPoId = searchParams.get('poId') || '';

  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const postSupplierInvoice = useSapStore((s) => s.postSupplierInvoice);

  const invoiceablePOs = purchaseOrders.filter((p) => p.goodsReceived > p.invoiced * 0 && p.goodsReceived > 0);
  const [poId, setPoId] = useState(presetPoId || invoiceablePOs[0]?.id || '');
  const selectedPo = purchaseOrders.find((p) => p.id === poId);
  const suggestedAmount = selectedPo ? selectedPo.goodsReceived * selectedPo.netPrice - selectedPo.invoiced : 0;

  const [amount, setAmount] = useState(suggestedAmount);
  const [posted, setPosted] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedPo) {
      setError('Vui lòng chọn Purchase Order.');
      return;
    }
    if (Number(amount) <= 0) {
      setError('Số tiền hóa đơn phải lớn hơn 0.');
      return;
    }
    const invoice = postSupplierInvoice({ poId, amount });
    setPosted(invoice);
  };

  if (invoiceablePOs.length === 0 && !posted) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <i className="ti ti-file-dollar text-xl text-[var(--fiori-link)]" aria-hidden="true" />
          <h1 className="text-lg font-medium">MIRO — Create Supplier Invoice</h1>
        </div>
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 text-sm text-[var(--fiori-text-secondary)]">
          Chưa có PO nào đã nhận hàng (Goods Receipt). Cần thực hiện MIGO trước khi xuất hóa đơn.
          <div className="mt-3">
            <button
              onClick={() => navigate('/transaction/MIGO')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Post Goods Receipt (MIGO)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <i className="ti ti-file-dollar text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h1 className="text-lg font-medium">MIRO — Create Supplier Invoice</h1>
      </div>

      {posted ? (
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5">
          <div className="flex items-center gap-2 text-[var(--fiori-success)] mb-3">
            <i className="ti ti-circle-check text-xl" aria-hidden="true" />
            <span className="font-medium">Đã ghi nhận hóa đơn nhà cung cấp</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--fiori-text-secondary)]">Invoice Document</dt>
            <dd className="font-medium">{posted.id}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">PO Reference</dt>
            <dd>{posted.poId}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Vendor</dt>
            <dd>{posted.vendorName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Amount</dt>
            <dd className="font-medium">{posted.amount.toLocaleString('vi-VN')} {posted.currency}</dd>
          </dl>
          <p className="text-xs text-[var(--fiori-text-secondary)] mt-3">
            Bút toán FI đã được tạo tự động và sẽ xuất hiện trong Finance &gt; Accounts Payable.
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate('/finance')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Xem Accounts Payable
            </button>
            <button
              onClick={() => navigate('/list/invoices')}
              className="border border-[var(--fiori-tile-border)] text-sm px-3 py-1.5 rounded hover:bg-gray-50"
            >
              Danh sách hóa đơn
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 space-y-4">
          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Purchase Order</label>
            <select
              value={poId}
              onChange={(e) => {
                setPoId(e.target.value);
                const po = purchaseOrders.find((p) => p.id === e.target.value);
                setAmount(po ? po.goodsReceived * po.netPrice - po.invoiced : 0);
              }}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            >
              {invoiceablePOs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.materialName} ({p.vendorName})
                </option>
              ))}
            </select>
          </div>

          {selectedPo && (
            <div className="bg-[var(--fiori-page-bg)] rounded p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--fiori-text-secondary)]">Goods received</span>
                <span>{selectedPo.goodsReceived} {selectedPo.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--fiori-text-secondary)]">Already invoiced</span>
                <span>{selectedPo.invoiced.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Invoice amount (VND)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-[var(--fiori-danger)]">{error}</p>}

          <button
            type="submit"
            className="bg-[var(--fiori-link)] text-white text-sm px-4 py-2 rounded hover:opacity-90"
          >
            Post Invoice
          </button>
        </form>
      )}
    </div>
  );
}
