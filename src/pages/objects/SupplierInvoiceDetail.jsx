import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';
import ConceptPanel from '../../components/ConceptPanel';
import { useT } from '../../hooks/useT';
import { CONCEPTS } from '../../data/conceptData';

export default function SupplierInvoiceDetail() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const invoice = useSapStore((s) => s.supplierInvoices.find((i) => i.id === invoiceId));
  const getPoDocumentFlow = useSapStore((s) => s.getPoDocumentFlow);
  const vendor = useSapStore((s) => s.vendors.find((v) => v.id === invoice?.vendorId));

  if (!invoice) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        {t('obj_not_found_invoice')} <code>{invoiceId}</code>.
      </div>
    );
  }

  const flow = getPoDocumentFlow(invoice.poId);

  const actions = [
    {
      label: t('btn_view_po'),
      icon: 'ti-clipboard-list',
      primary: true,
      onClick: () => navigate(`/object/po/${invoice.poId}`),
    },
  ];
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
          { label: isVi ? 'Hóa đơn nhà cung cấp' : 'Supplier Invoices', path: '/list/invoices' },
          { label: invoice.id },
        ]}
      />
      <ConceptPanel concept={CONCEPTS.INVOICE_DETAIL} />
      <ObjectPage
        title={`Supplier Invoice ${invoice.id}`}
        subtitle={invoice.vendorName}
        status={<StatusBadge status={invoice.status} />}
        keyFacts={[
          { label: isVi ? 'Tham chiếu PO' : 'PO Reference', value: invoice.poId },
          { label: isVi ? 'Số tiền' : 'Amount', value: `${invoice.amount.toLocaleString('vi-VN')} ${invoice.currency}` },
          { label: isVi ? 'Ngày đăng' : 'Posted', value: new Date(invoice.postedAt).toLocaleString(isVi ? 'vi-VN' : 'en-US') },
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
