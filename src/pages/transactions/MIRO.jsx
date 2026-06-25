import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import Breadcrumb from '../../components/Breadcrumb';
import ConceptPanel from '../../components/ConceptPanel';
import { useT } from '../../hooks/useT';
import { CONCEPTS } from '../../data/conceptData';

export default function MIRO() {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const [searchParams] = useSearchParams();
  const presetPoId = searchParams.get('poId') || '';

  const purchaseOrders = useSapStore((s) => s.purchaseOrders);
  const postSupplierInvoice = useSapStore((s) => s.postSupplierInvoice);

  // 3-way match: chỉ PO đã có Goods Receipt VÀ còn giá trị chưa xuất hóa đơn
  // mới được phép đưa vào MIRO — đúng nguyên tắc đối chiếu PO/GR/Invoice của SAP.
  const invoiceablePOs = purchaseOrders.filter((p) => {
    const receivedValue = p.goodsReceived * p.netPrice;
    return p.goodsReceived > 0 && p.invoiced < receivedValue;
  });
  const [poId, setPoId] = useState(presetPoId || invoiceablePOs[0]?.id || '');
  const selectedPo = purchaseOrders.find((p) => p.id === poId);
  const receivedValue = selectedPo ? selectedPo.goodsReceived * selectedPo.netPrice : 0;
  const maxInvoiceable = selectedPo ? receivedValue - selectedPo.invoiced : 0;
  const suggestedAmount = maxInvoiceable;

  const [amount, setAmount] = useState(suggestedAmount);
  const [posted, setPosted] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedPo) {
      setError(isVi ? 'Vui lòng chọn Purchase Order.' : 'Please select a Purchase Order.');
      return;
    }
    if (Number(amount) <= 0) {
      setError(isVi ? 'Số tiền hóa đơn phải lớn hơn 0.' : 'Invoice amount must be greater than 0.');
      return;
    }
    // 3-way match: chặn xuất hóa đơn vượt giá trị đã nhận hàng trừ đã xuất trước đó
    if (Number(amount) > maxInvoiceable) {
      setError(
        isVi
          ? `Số tiền vượt giá trị cho phép. Tối đa có thể xuất: ${maxInvoiceable.toLocaleString('vi-VN')} VND (theo giá trị đã nhận hàng).`
          : `Amount exceeds the allowed value. Maximum invoiceable: ${maxInvoiceable.toLocaleString('vi-VN')} VND (based on goods received).`
      );
      return;
    }
    const invoice = postSupplierInvoice({ poId, amount });
    setPosted(invoice);
  };

  if (invoiceablePOs.length === 0 && !posted) {
    return (
      <div className="max-w-2xl">
        <Breadcrumb crumbs={[{ label: t('nav_procurement'), path: '/procurement' }, { label: 'MIRO' }]} />
        <div className="flex items-center gap-2 mb-4">
          <i className="ti ti-file-dollar text-xl text-[var(--fiori-link)]" aria-hidden="true" />
          <h1 className="text-lg font-medium">{isVi ? 'MIRO — Tạo hóa đơn nhà cung cấp' : 'MIRO — Create Supplier Invoice'}</h1>
        </div>
        <ConceptPanel concept={CONCEPTS.MIRO} />
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5 text-sm text-[var(--fiori-text-secondary)]">
          {isVi ? 'Chưa có PO nào đã nhận hàng (Goods Receipt). Cần thực hiện MIGO trước khi xuất hóa đơn.' : 'No PO with Goods Receipt yet. Run MIGO first before invoicing.'}
          <div className="mt-3">
            <button
              onClick={() => navigate('/transaction/MIGO')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              {t('btn_post_gr')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Breadcrumb crumbs={[{ label: t('nav_procurement'), path: '/procurement' }, { label: 'MIRO' }]} />
      <div className="flex items-center gap-2 mb-4">
        <i className="ti ti-file-dollar text-xl text-[var(--fiori-link)]" aria-hidden="true" />
        <h1 className="text-lg font-medium">{isVi ? 'MIRO — Tạo hóa đơn nhà cung cấp' : 'MIRO — Create Supplier Invoice'}</h1>
      </div>

      <ConceptPanel concept={CONCEPTS.MIRO} />

      {posted ? (
        <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-5">
          <div className="flex items-center gap-2 text-[var(--fiori-success)] mb-3">
            <i className="ti ti-circle-check text-xl" aria-hidden="true" />
            <span className="font-medium">{isVi ? 'Đã ghi nhận hóa đơn nhà cung cấp' : 'Supplier invoice posted'}</span>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--fiori-text-secondary)]">{isVi ? 'Chứng từ hóa đơn' : 'Invoice Document'}</dt>
            <dd className="font-medium">{posted.id}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">{isVi ? 'Tham chiếu PO' : 'PO Reference'}</dt>
            <dd>{posted.poId}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">{isVi ? 'Nhà cung cấp' : 'Vendor'}</dt>
            <dd>{posted.vendorName}</dd>
            <dt className="text-[var(--fiori-text-secondary)]">{isVi ? 'Số tiền' : 'Amount'}</dt>
            <dd className="font-medium">{posted.amount.toLocaleString('vi-VN')} {posted.currency}</dd>
          </dl>
          <p className="text-xs text-[var(--fiori-text-secondary)] mt-3">
            {isVi
              ? 'Bút toán FI đã được tạo tự động và sẽ xuất hiện trong Finance > Accounts Payable.'
              : 'An FI document has been auto-generated and will appear under Finance > Accounts Payable.'}
          </p>
          <div className="mt-2 bg-[var(--fiori-page-bg)] rounded p-2.5 text-xs font-mono">
            <div>Dr {CONCEPTS.MIRO.sampleEntry[0].account}</div>
            <div>Cr {CONCEPTS.MIRO.sampleEntry[1].account}</div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate('/finance')}
              className="bg-[var(--fiori-link)] text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
            >
              {t('btn_view_ap')}
            </button>
            <button
              onClick={() => navigate('/list/invoices')}
              className="border border-[var(--fiori-tile-border)] text-sm px-3 py-1.5 rounded hover:bg-gray-50"
            >
              {t('btn_view_invoices')}
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
                <span className="text-[var(--fiori-text-secondary)]">{isVi ? 'Đã nhận hàng' : 'Goods received'}</span>
                <span>{selectedPo.goodsReceived} {selectedPo.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--fiori-text-secondary)]">{isVi ? 'Giá trị đã nhận' : 'Received value'}</span>
                <span>{receivedValue.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--fiori-text-secondary)]">{isVi ? 'Đã xuất hóa đơn' : 'Already invoiced'}</span>
                <span>{selectedPo.invoiced.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between font-medium pt-1 border-t border-[var(--fiori-tile-border)]">
                <span>{isVi ? 'Tối đa có thể xuất' : 'Max invoiceable'}</span>
                <span>{maxInvoiceable.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-[var(--fiori-text-secondary)] mb-1">
              {isVi ? 'Số tiền hóa đơn (VND)' : 'Invoice amount (VND)'}
            </label>
            <input
              type="number"
              min="1"
              max={maxInvoiceable}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-[var(--fiori-tile-border)] rounded px-3 py-2 text-sm"
            />
            <p className="text-xs text-[var(--fiori-text-secondary)] mt-1">
              {isVi
                ? '3-way match: số tiền không được vượt giá trị hàng đã nhận theo PO.'
                : '3-way match: amount cannot exceed the value of goods received against the PO.'}
            </p>
          </div>

          {error && <p className="text-sm text-[var(--fiori-danger)]">{error}</p>}

          <button
            type="submit"
            className="bg-[var(--fiori-link)] text-white text-sm px-4 py-2 rounded hover:opacity-90"
          >
            {isVi ? 'Ghi nhận hóa đơn' : 'Post Invoice'}
          </button>
        </form>
      )}
    </div>
  );
}
