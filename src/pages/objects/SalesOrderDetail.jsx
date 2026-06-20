import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';

export default function SalesOrderDetail() {
  const { soId } = useParams();
  const navigate = useNavigate();
  const so = useSapStore((s) => s.salesOrders.find((o) => o.id === soId));
  const getSoDocumentFlow = useSapStore((s) => s.getSoDocumentFlow);

  if (!so) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        Không tìm thấy Sales Order <code>{soId}</code>.
      </div>
    );
  }

  const flow = getSoDocumentFlow(soId);

  const actions = [];
  if (so.status === 'Confirmed') {
    actions.push({
      label: 'Create Billing Document',
      icon: 'ti-receipt-2',
      primary: true,
      onClick: () => navigate(`/transaction/VF01?soId=${so.id}`),
    });
  }

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: 'Sales', path: '/sales' },
          { label: 'Sales Orders', path: '/list/salesOrders' },
          { label: so.id },
        ]}
      />
      <ObjectPage
        title={`Sales Order ${so.id}`}
        subtitle={`${so.customerName} · Plant ${so.plant}`}
        status={<StatusBadge status={so.status} />}
        keyFacts={[
          { label: 'Material', value: so.materialName },
          { label: 'Quantity', value: `${so.quantity} ${so.unit}` },
          { label: 'Net Value', value: `${so.netValue.toLocaleString('vi-VN')} VND` },
          { label: 'Stock at creation', value: `${so.availableAtCreation} ${so.unit}` },
          { label: 'Created', value: new Date(so.createdAt).toLocaleDateString('vi-VN') },
        ]}
        actions={actions}
      >
        {so.status === 'Backorder' && (
          <ObjectSection title="ATP Check">
            <div className="flex items-start gap-2 text-sm">
              <i className="ti ti-alert-triangle text-[var(--fiori-warning)] text-lg mt-0.5" aria-hidden="true" />
              <p className="text-[var(--fiori-text-secondary)]">
                Tại thời điểm tạo đơn, tồn kho chỉ có <strong>{so.availableAtCreation} {so.unit}</strong> trong khi
                đơn yêu cầu <strong>{so.quantity} {so.unit}</strong>. Đơn hàng sẽ được xác nhận khi có nhập kho bổ
                sung qua MIGO.
              </p>
            </div>
          </ObjectSection>
        )}

        <ObjectSection title="Document Flow">
          <DocumentFlow flow={flow} />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
