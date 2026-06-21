import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';
import { useT } from '../../hooks/useT';

export default function SalesOrderDetail() {
  const { soId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const so = useSapStore((s) => s.salesOrders.find((o) => o.id === soId));
  const getSoDocumentFlow = useSapStore((s) => s.getSoDocumentFlow);
  const customer = useSapStore((s) => s.customers.find((c) => c.id === so?.customerId));

  if (!so) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        {t('obj_not_found_so')} <code>{soId}</code>.
      </div>
    );
  }

  const flow = getSoDocumentFlow(soId);

  const actions = [];
  if (so.status === 'Confirmed') {
    actions.push({
      label: t('btn_post_billing'),
      icon: 'ti-receipt-2',
      primary: true,
      onClick: () => navigate(`/transaction/VF01?soId=${so.id}`),
    });
  }
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
          { label: isVi ? 'Đơn bán hàng' : 'Sales Orders', path: '/list/salesOrders' },
          { label: so.id },
        ]}
      />
      <ObjectPage
        title={`Sales Order ${so.id}`}
        subtitle={`${so.customerName} · Plant ${so.plant}`}
        status={<StatusBadge status={so.status} />}
        keyFacts={[
          { label: isVi ? 'Vật tư' : 'Material', value: so.materialName },
          { label: isVi ? 'Số lượng' : 'Quantity', value: `${so.quantity} ${so.unit}` },
          { label: isVi ? 'Giá trị' : 'Net Value', value: `${so.netValue.toLocaleString('vi-VN')} VND` },
          { label: isVi ? 'Tồn kho lúc tạo' : 'Stock at creation', value: `${so.availableAtCreation} ${so.unit}` },
          { label: isVi ? 'Ngày tạo' : 'Created', value: new Date(so.createdAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US') },
        ]}
        actions={actions}
      >
        {so.status === 'Backorder' && (
          <ObjectSection title={isVi ? 'Kiểm tra khả dụng (ATP)' : 'ATP Check'}>
            <div className="flex items-start gap-2 text-sm">
              <i className="ti ti-alert-triangle text-[var(--fiori-warning)] text-lg mt-0.5" aria-hidden="true" />
              <p className="text-[var(--fiori-text-secondary)]">
                {isVi ? (
                  <>
                    Tại thời điểm tạo đơn, tồn kho chỉ có <strong>{so.availableAtCreation} {so.unit}</strong> trong khi
                    đơn yêu cầu <strong>{so.quantity} {so.unit}</strong>. Đơn hàng sẽ được xác nhận khi có nhập kho bổ
                    sung qua MIGO.
                  </>
                ) : (
                  <>
                    At order creation, stock was only <strong>{so.availableAtCreation} {so.unit}</strong> while the order
                    requires <strong>{so.quantity} {so.unit}</strong>. The order will be confirmed once more stock arrives
                    via MIGO.
                  </>
                )}
              </p>
            </div>
          </ObjectSection>
        )}

        <ObjectSection title={t('obj_document_flow')}>
          <DocumentFlow flow={flow} />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
