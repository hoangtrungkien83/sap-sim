import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import StatusBadge from '../../components/StatusBadge';
import DocumentFlow from '../../components/DocumentFlow';
import Breadcrumb from '../../components/Breadcrumb';

export default function SupplierInvoiceDetail() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const invoice = useSapStore((s) => s.supplierInvoices.find((i) => i.id === invoiceId));
  const getPoDocumentFlow = useSapStore((s) => s.getPoDocumentFlow);

  if (!invoice) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        Không tìm thấy hóa đơn <code>{invoiceId}</code>.
      </div>
    );
  }

  const flow = getPoDocumentFlow(invoice.poId);

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: 'Procurement', path: '/procurement' },
          { label: 'Supplier Invoices', path: '/list/invoices' },
          { label: invoice.id },
        ]}
      />
      <ObjectPage
        title={`Supplier Invoice ${invoice.id}`}
        subtitle={invoice.vendorName}
        status={<StatusBadge status={invoice.status} />}
        keyFacts={[
          { label: 'PO Reference', value: invoice.poId },
          { label: 'Amount', value: `${invoice.amount.toLocaleString('vi-VN')} ${invoice.currency}` },
          { label: 'Posted', value: new Date(invoice.postedAt).toLocaleString('vi-VN') },
        ]}
        actions={[
          {
            label: 'Xem Purchase Order',
            icon: 'ti-clipboard-list',
            onClick: () => navigate(`/object/po/${invoice.poId}`),
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
