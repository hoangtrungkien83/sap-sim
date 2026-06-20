import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';

export default function BillingDocumentDetail() {
  const { billingId } = useParams();
  const navigate = useNavigate();
  const billing = useSapStore((s) => s.billingDocuments.find((b) => b.id === billingId));
  const getSoDocumentFlow = useSapStore((s) => s.getSoDocumentFlow);

  if (!billing) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        Không tìm thấy chứng từ <code>{billingId}</code>.
      </div>
    );
  }

  const flow = getSoDocumentFlow(billing.soId);

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: 'Sales', path: '/sales' },
          { label: 'Billing Documents', path: '/list/billing' },
          { label: billing.id },
        ]}
      />
      <ObjectPage
        title={`Billing Document ${billing.id}`}
        subtitle={billing.customerName}
        status={<StatusBadge status={billing.status} />}
        keyFacts={[
          { label: 'SO Reference', value: billing.soId },
          { label: 'Material', value: billing.materialName },
          { label: 'Net Value', value: `${billing.netValue.toLocaleString('vi-VN')} ${billing.currency}` },
          { label: 'Posted', value: new Date(billing.postedAt).toLocaleString('vi-VN') },
        ]}
        actions={[
          {
            label: 'Xem Sales Order',
            icon: 'ti-shopping-cart',
            onClick: () => navigate(`/object/so/${billing.soId}`),
          },
        ]}
      >
        <ObjectSection title="Document Flow">
          <DocumentFlow flow={flow} />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
