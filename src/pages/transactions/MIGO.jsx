import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';

export default function MIGO() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetPoId = searchParams.get('poId') || '';

  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const postGoodsReceipt = useSapStore((s) => s.postGoodsReceipt);

  const openPOs = purchaseOrders.filter((p) => p.status !== 'Delivered');
  const [poId, setPoId] = useState(presetPoId || openPOs[0]?.id || '');
  const selectedPo = purchaseOrders.find((p) => p.id === poId);
  const remaining = selectedPo ? selectedPo.quantity - selectedPo.goodsReceived : 0;

  const [quantity, setQuantity] = useState(remaining > 0 ? remaining : 1);
  const [posted, setPosted] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedPo) {
      setError('Vui lòng chọn Purchase Order.');
      return;
    }
    if (Number(quantity) <= 0 || Number(quantity) > remaining) {
      setError(`Số lượng phải từ 1 đến ${remaining} ${selectedPo.unit}.`);
      return;
    }
    const gr = postGoodsReceipt({ poId, quantity });
    setPosted(gr);
  };

  if (openPOs.length === 0 && !posted) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <i className="ti ti-truck-delivery text-xl text-[var(--fiori-link)]" aria-hidden="true" />
          <h1 className="text-lg font-medium">MIGO — Post Goods Receipt</h1>
        </div>
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 text-sm text-[var(--fiori-text-secondary)]">
          Chưa có Purchase Order nào đang mở. Hãy tạo PO trước bằng giao dịch ME21N.
          <div className="mt-3">
            <button
              onClick={() => navigate('/transaction/ME21N')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Tạo Purchase Order (ME21N)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <i className="ti ti-truck-delivery text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h1 className="text-lg font-medium">MIGO — Post Goods Receipt</h1>
      </div>

      {posted ? (
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5">
          <div className="flex items-center gap-2 text-[var(--fiori-success)] mb-3">
            <i className="ti ti-circle-check text-xl" aria-hidden="true" />
            <span className="font-medium">Đã ghi nhận Goods Receipt</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--fiori-text-secondary)]">GR Document</dt>
            <dd className="font-medium">{posted.id}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">PO Reference</dt>
            <dd>{posted.poId}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Material</dt>
            <dd>{posted.materialName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Quantity received</dt>
            <dd>{posted.quantity}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Plant / Stock</dt>
            <dd>{posted.plant} (đã cộng vào MB52)</dd>
          </dl>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate(`/transaction/MIRO?poId=${posted.poId}`)}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Tiếp tục: Create Supplier Invoice (MIRO)
            </button>
            <button
              onClick={() => navigate('/list/stock')}
              className="border border-[var(--fiori-tile-border)] text-sm px-3 py-1.5 rounded hover:bg-gray-50"
            >
              Xem tồn kho (MB52)
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
                setQuantity(po ? po.quantity - po.goodsReceived : 1);
              }}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            >
              {openPOs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.materialName} ({p.vendorName})
                </option>
              ))}
            </select>
          </div>

          {selectedPo && (
            <div className="bg-[var(--fiori-page-bg)] rounded p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--fiori-text-secondary)]">PO Quantity</span>
                <span>{selectedPo.quantity} {selectedPo.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--fiori-text-secondary)]">Already received</span>
                <span>{selectedPo.goodsReceived} {selectedPo.unit}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Remaining</span>
                <span>{remaining} {selectedPo.unit}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Quantity to receive</label>
            <input
              type="number"
              min="1"
              max={remaining}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-[var(--fiori-danger)]">{error}</p>}

          <button
            type="submit"
            className="bg-[var(--fiori-link)] text-white text-sm px-4 py-2 rounded hover:opacity-90"
          >
            Post Goods Receipt
          </button>
        </form>
      )}
    </div>
  );
}
