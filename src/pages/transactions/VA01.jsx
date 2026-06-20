import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';

export default function VA01() {
  const navigate = useNavigate();
  const customers = useSapStore((s) => s.customers);
  const materials = useSapStore((s) => s.materials);
  const stock = useSapStore((s) => s.stock);
  const createSalesOrder = useSapStore((s) => s.createSalesOrder);

  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? '');
  const [quantity, setQuantity] = useState(5);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');

  const selectedMaterial = materials.find((m) => m.id === materialId);
  const stockEntry = stock.find((s) => s.materialId === materialId && s.plant === '1010');
  const available = stockEntry ? stockEntry.qty : 0;
  const netValue = selectedMaterial ? selectedMaterial.price * Number(quantity || 0) : 0;
  const willBackorder = Number(quantity || 0) > available;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!quantity || Number(quantity) <= 0) {
      setError('Số lượng phải lớn hơn 0.');
      return;
    }
    const so = createSalesOrder({ customerId, materialId, quantity });
    setCreated(so);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <i className="ti ti-shopping-cart-plus text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h1 className="text-lg font-medium">VA01 — Create Sales Order</h1>
      </div>

      {created ? (
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5">
          <div
            className={`flex items-center gap-2 mb-3 ${
              created.status === 'Confirmed' ? 'text-[var(--fiori-success)]' : 'text-[var(--fiori-warning)]'
            }`}
          >
            <i
              className={`ti ${created.status === 'Confirmed' ? 'ti-circle-check' : 'ti-alert-triangle'} text-xl`}
              aria-hidden="true"
            />
            <span className="font-medium">
              {created.status === 'Confirmed' ? 'Đã tạo Sales Order — ATP confirmed' : 'Sales Order tạo thành công — Backorder (thiếu tồn kho)'}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--fiori-text-secondary)]">SO Number</dt>
            <dd className="font-medium">{created.id}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Customer</dt>
            <dd>{created.customerName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Material</dt>
            <dd>{created.materialName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Quantity</dt>
            <dd>{created.quantity} {created.unit}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Stock available khi tạo</dt>
            <dd>{created.availableAtCreation} {created.unit}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Net Value</dt>
            <dd className="font-medium">{created.netValue.toLocaleString('vi-VN')} VND</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Status</dt>
            <dd>{created.status}</dd>
          </dl>
          {created.status === 'Backorder' && (
            <p className="text-xs text-[var(--fiori-warning)] mt-3">
              Tồn kho không đủ tại thời điểm tạo đơn. Đơn hàng sẽ được giao khi có hàng nhập thêm qua MIGO.
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate('/list/salesOrders')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Xem danh sách Sales Order
            </button>
            <button
              onClick={() => setCreated(null)}
              className="border border-[var(--fiori-tile-border)] text-sm px-3 py-1.5 rounded hover:bg-gray-50"
            >
              Tạo đơn khác
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 space-y-4">
          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Material</label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.name} ({m.price.toLocaleString('vi-VN')} VND/{m.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[var(--fiori-page-bg)] rounded p-3 flex justify-between text-sm">
            <span className="text-[var(--fiori-text-secondary)]">Available stock (Plant 1010)</span>
            <span className="font-medium">{available} {selectedMaterial?.unit}</span>
          </div>

          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Quantity ({selectedMaterial?.unit})</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            />
            {willBackorder && (
              <p className="text-xs text-[var(--fiori-warning)] mt-1 flex items-center gap-1">
                <i className="ti ti-alert-triangle" aria-hidden="true" />
                Số lượng vượt tồn kho — đơn sẽ ở trạng thái Backorder.
              </p>
            )}
          </div>

          <div className="bg-[var(--fiori-page-bg)] rounded p-3 flex justify-between text-sm">
            <span className="text-[var(--fiori-text-secondary)]">Net Value</span>
            <span className="font-medium">{netValue.toLocaleString('vi-VN')} VND</span>
          </div>

          {error && <p className="text-sm text-[var(--fiori-danger)]">{error}</p>}

          <button
            type="submit"
            className="bg-[var(--fiori-link)] text-white text-sm px-4 py-2 rounded hover:opacity-90"
          >
            Save Sales Order
          </button>
        </form>
      )}
    </div>
  );
}
