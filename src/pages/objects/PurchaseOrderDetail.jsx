import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';

export default function PurchaseOrderDetail() {
  const { poId } = useParams();
  const navigate = useNavigate();
  const po = useSapStore((s) => s.purchaseOrders.find((p) => p.id === poId));
  const getPoDocumentFlow = useSapStore((s) => s.getPoDocumentFlow);

  if (!po) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        Không tìm thấy Purchase Order <code>{poId}</code>.
      </div>
    );
  }

  const flow = getPoDocumentFlow(poId);
  const remaining = po.quantity - po.goodsReceived;
  const remainingInvoice = po.goodsReceived * po.netPrice - po.invoiced;

  const actions = [];
  if (remaining > 0) {
    actions.push({
      label: 'Post Goods Receipt',
      icon: 'ti-truck-delivery',
      primary: true,
      onClick: () => navigate(`/transaction/MIGO?poId=${po.id}`),
    });
  }
  if (po.goodsReceived > 0 && remainingInvoice > 0) {
    actions.push({
      label: 'Create Supplier Invoice',
      icon: 'ti-file-dollar',
      primary: remaining <= 0,
      onClick: () => navigate(`/transaction/MIRO?poId=${po.id}`),
    });
  }

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: 'Procurement', path: '/procurement' },
          { label: 'Purchase Orders', path: '/list/pos' },
          { label: po.id },
        ]}
      />
      <ObjectPage
        title={`Purchase Order ${po.id}`}
        subtitle={`${po.vendorName} · Plant ${po.plant}`}
        status={<StatusBadge status={po.status} />}
        keyFacts={[
          { label: 'Material', value: po.materialName },
          { label: 'Quantity', value: `${po.quantity} ${po.unit}` },
          { label: 'Net Price', value: `${po.netPrice.toLocaleString('vi-VN')} VND/${po.unit}` },
          { label: 'Net Value', value: `${po.netValue.toLocaleString('vi-VN')} VND` },
          { label: 'Created', value: new Date(po.createdAt).toLocaleDateString('vi-VN') },
        ]}
        actions={actions}
      >
        <ObjectSection title="Goods Receipt Progress">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--fiori-text-secondary)]">Received</span>
              <span className="font-medium">
                {po.goodsReceived} / {po.quantity} {po.unit}
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--fiori-page-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--fiori-link)]"
                style={{ width: `${Math.min(100, (po.goodsReceived / po.quantity) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-[var(--fiori-text-secondary)]">Invoiced</span>
              <span className="font-medium">
                {po.invoiced.toLocaleString('vi-VN')} / {po.netValue.toLocaleString('vi-VN')} VND
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--fiori-page-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--fiori-success)]"
                style={{ width: `${Math.min(100, (po.invoiced / po.netValue) * 100)}%` }}
              />
            </div>
          </div>
        </ObjectSection>

        <ObjectSection title="Document Flow">
          <DocumentFlow flow={flow} />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
