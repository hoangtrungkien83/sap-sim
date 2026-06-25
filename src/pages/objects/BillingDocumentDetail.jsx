import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';
import ConceptPanel from '../../components/ConceptPanel';
import { useT } from '../../hooks/useT';
import { CONCEPTS } from '../../data/conceptData';

export default function BillingDocumentDetail() {
  const { billingId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const billing = useSapStore((s) => s.billingDocuments.find((b) => b.id === billingId));
  const getSoDocumentFlow = useSapStore((s) => s.getSoDocumentFlow);
  const customer = useSapStore((s) => s.customers.find((c) => c.id === billing?.customerId));

  if (!billing) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        {isVi ? 'Không tìm thấy chứng từ' : 'Document not found'} <code>{billingId}</code>.
      </div>
    );
  }

  const flow = getSoDocumentFlow(billing.soId);

  const actions = [
    {
      label: t('btn_view_so'),
      icon: 'ti-shopping-cart',
      primary: true,
      onClick: () => navigate(`/object/so/${billing.soId}`),
    },
  ];
  if (customer) {
    actions.push({
      label: isVi ? 'Xem khách hàng' : 'View Customer',
      icon: 'ti-user',
      onClick: () => navigate(`/object/customer/${customer.id}`),
    });
  }

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: t('nav_sales'), path: '/sales' },
          { label: isVi ? 'Hóa đơn bán hàng' : 'Billing Documents', path: '/list/billing' },
          { label: billing.id },
        ]}
      />
      <ConceptPanel concept={CONCEPTS.BILLING_DETAIL} />
      <ObjectPage
        title={`Billing Document ${billing.id}`}
        subtitle={billing.customerName}
        status={<StatusBadge status={billing.status} />}
        keyFacts={[
          { label: isVi ? 'Tham chiếu SO' : 'SO Reference', value: billing.soId },
          { label: isVi ? 'Vật tư' : 'Material', value: billing.materialName },
          { label: isVi ? 'Giá trị' : 'Net Value', value: `${billing.netValue.toLocaleString('vi-VN')} ${billing.currency}` },
          { label: isVi ? 'Ngày đăng' : 'Posted', value: new Date(billing.postedAt).toLocaleString(isVi ? 'vi-VN' : 'en-US') },
        ]}
        actions={actions}
      >
        <ObjectSection title={t('obj_document_flow')}>
          <DocumentFlow flow={flow} />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
