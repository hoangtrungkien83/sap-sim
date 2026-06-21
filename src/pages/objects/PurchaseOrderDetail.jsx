import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';
import { useT } from '../../hooks/useT';

export default function PurchaseOrderDetail() {
  const { poId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const po = useSapStore((s) => s.purchaseOrders.find((p) => p.id === poId));
  const getPoDocumentFlow = useSapStore((s) => s.getPoDocumentFlow);
  const approvePurchaseOrder = useSapStore((s) => s.approvePurchaseOrder);
  // Tìm vendor để liên kết object page Vendor — đây là điểm liên kết
  // module quan trọng: PO Detail có thể nhảy thẳng sang Vendor Detail.
  const vendor = useSapStore((s) => s.vendors.find((v) => v.id === po?.vendorId));

  if (!po) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        {t('obj_not_found_po')} <code>{poId}</code>.
      </div>
    );
  }

  const flow = getPoDocumentFlow(poId);
  const remaining = po.quantity - po.goodsReceived;
  const remainingInvoice = po.goodsReceived * po.netPrice - po.invoiced;
  const isPendingApproval = po.status === 'Pending Approval';

  const actions = [];
  if (isPendingApproval) {
    actions.push({
      label: isVi ? 'Phê duyệt Purchase Order' : 'Approve Purchase Order',
      icon: 'ti-circle-check',
      primary: true,
      onClick: () => approvePurchaseOrder(po.id),
    });
  }
  if (!isPendingApproval && remaining > 0) {
    actions.push({
      label: t('btn_post_gr'),
      icon: 'ti-truck-delivery',
      primary: true,
      onClick: () => navigate(`/transaction/MIGO?poId=${po.id}`),
    });
  }
  if (!isPendingApproval && po.goodsReceived > 0 && remainingInvoice > 0) {
    actions.push({
      label: t('btn_post_invoice'),
      icon: 'ti-file-dollar',
      primary: remaining <= 0,
      onClick: () => navigate(`/transaction/MIRO?poId=${po.id}`),
    });
  }
  if (vendor) {
    actions.push({
      label: isVi ? 'Xem nhà cung cấp' : 'View Vendor',
      icon: 'ti-truck',
      onClick: () => navigate(`/object/vendor/${vendor.id}`),
    });
  }

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: t('nav_procurement'), path: '/procurement' },
          { label: isVi ? 'Đơn đặt hàng' : 'Purchase Orders', path: '/list/pos' },
          { label: po.id },
        ]}
      />
      <ObjectPage
        title={`Purchase Order ${po.id}`}
        subtitle={`${po.vendorName} · Plant ${po.plant}`}
        status={<StatusBadge status={po.status} />}
        keyFacts={[
          { label: isVi ? 'Vật tư' : 'Material', value: po.materialName },
          { label: isVi ? 'Số lượng' : 'Quantity', value: `${po.quantity} ${po.unit}` },
          { label: isVi ? 'Đơn giá' : 'Net Price', value: `${po.netPrice.toLocaleString('vi-VN')} VND/${po.unit}` },
          { label: isVi ? 'Giá trị' : 'Net Value', value: `${po.netValue.toLocaleString('vi-VN')} VND` },
          { label: isVi ? 'Ngày tạo' : 'Created', value: new Date(po.createdAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US') },
        ]}
        actions={actions}
      >
        {isPendingApproval && (
          <ObjectSection title={isVi ? 'Phê duyệt cần thiết' : 'Approval Required'}>
            <div className="flex items-start gap-2 text-sm">
              <i className="ti ti-shield-exclamation text-[var(--fiori-warning)] text-lg mt-0.5" aria-hidden="true" />
              <p className="text-[var(--fiori-text-secondary)]">
                {isVi
                  ? `PO có giá trị vượt ngưỡng phê duyệt tự động (trên 500 triệu VND). Cần phê duyệt trước khi có thể nhận hàng hoặc xuất hóa đơn.`
                  : `This PO exceeds the auto-approval threshold (over 500M VND). Approval is required before goods receipt or invoicing.`}
              </p>
            </div>
          </ObjectSection>
        )}

        <ObjectSection title={isVi ? 'Tiến độ nhận hàng' : 'Goods Receipt Progress'}>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--fiori-text-secondary)]">{isVi ? 'Đã nhận' : 'Received'}</span>
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
              <span className="text-[var(--fiori-text-secondary)]">{isVi ? 'Đã xuất hóa đơn' : 'Invoiced'}</span>
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

        <ObjectSection title={t('obj_document_flow')}>
          <DocumentFlow flow={flow} />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
