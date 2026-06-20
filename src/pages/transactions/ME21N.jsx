import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import Breadcrumb from '../../components/Breadcrumb';

export default function ME21N() {
  const navigate = useNavigate();
  const vendors = useSapStore((s) => s.vendors);
  const materials = useSapStore((s) => s.materials);
  const createPurchaseOrder = useSapStore((s) => s.createPurchaseOrder);

  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? '');
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? '');
  const [quantity, setQuantity] = useState(10);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');

  const selectedMaterial = materials.find((m) => m.id === materialId);
  const netValue = selectedMaterial ? selectedMaterial.price * Number(quantity || 0) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!quantity || Number(quantity) <= 0) {
      setError('Số lượng phải lớn hơn 0.');
      return;
    }
    const po = createPurchaseOrder({ vendorId, materialId, quantity });
    setCreated(po);
  };

  return (
    <div className="max-w-2xl">
      <Breadcrumb crumbs={[{ label: 'Procurement', path: '/procurement' }, { label: 'ME21N — Create Purchase Order' }]} />
      <div className="flex items-center gap-2 mb-4">
        <i className="ti ti-clipboard-list text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h1 className="text-lg font-medium">ME21N — Create Purchase Order</h1>
      </div>

      {created ? (
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5">
          <div className="flex items-center gap-2 text-[var(--fiori-success)] mb-3">
            <i className="ti ti-circle-check text-xl" aria-hidden="true" />
            <span className="font-medium">Đã tạo Purchase Order thành công</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--fiori-text-secondary)]">PO Number</dt>
            <dd className="font-medium">{created.id}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Vendor</dt>
            <dd>{created.vendorName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Material</dt>
            <dd>{created.materialName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Quantity</dt>
            <dd>{created.quantity} {created.unit}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">Net Value</dt>
            <dd className="font-medium">{created.netValue.toLocaleString('vi-VN')} VND</dd>
          </dl>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate(`/transaction/MIGO?poId=${created.id}`)}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              Tiếp tục: Post Goods Receipt (MIGO)
            </button>
            <button
              onClick={() => setCreated(null)}
              className="border border-[var(--fiori-tile-border)] text-sm px-3 py-1.5 rounded hover:bg-gray-50"
            >
              Tạo PO khác
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 space-y-4">
          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Vendor</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} — {v.name}
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

          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">Quantity ({selectedMaterial?.unit})</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            />
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
            Save Purchase Order
          </button>
        </form>
      )}
    </div>
  );
}
