import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Breadcrumb from '../../components/Breadcrumb';

export default function VendorDetail() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const vendor = useSapStore((s) => s.vendors.find((v) => v.id === vendorId));
  const purchaseOrders = useSapStore((s) => s.purchaseOrders.filter((p) => p.vendorId === vendorId));
  const invoices = useSapStore((s) => s.supplierInvoices.filter((i) => i.vendorId === vendorId));

  if (!vendor) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        Không tìm thấy nhà cung cấp <code>{vendorId}</code>.
      </div>
    );
  }

  const totalPoValue = purchaseOrders.reduce((sum, p) => sum + p.netValue, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: 'Procurement', path: '/procurement' },
          { label: 'Suppliers', path: '/list/vendors' },
          { label: vendor.name },
        ]}
      />
      <ObjectPage
        title={vendor.name}
        subtitle={`Vendor ${vendor.id} · ${vendor.country}`}
        keyFacts={[
          { label: 'Currency', value: vendor.currency },
          { label: 'Purchase Orders', value: purchaseOrders.length },
          { label: 'Total PO Value', value: `${totalPoValue.toLocaleString('vi-VN')} VND` },
          { label: 'Total Invoiced', value: `${totalInvoiced.toLocaleString('vi-VN')} VND` },
        ]}
        actions={[
          {
            label: 'Tạo Purchase Order',
            icon: 'ti-clipboard-list',
            primary: true,
            onClick: () => navigate('/transaction/ME21N'),
          },
        ]}
      >
        <ObjectSection title="Purchase Orders">
          <DataTable
            columns={[
              { key: 'id', label: 'PO Number', sortable: true },
              { key: 'materialName', label: 'Material', sortable: true },
              {
                key: 'netValue',
                label: 'Net Value',
                sortable: true,
                render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND`,
              },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={purchaseOrders}
            onRowClick={(row) => navigate(`/object/po/${row.id}`)}
            searchPlaceholder="Tìm PO..."
            emptyText="Chưa có Purchase Order nào với nhà cung cấp này."
          />
        </ObjectSection>

        <ObjectSection title="Invoices">
          <DataTable
            columns={[
              { key: 'id', label: 'Invoice', sortable: true },
              {
                key: 'amount',
                label: 'Amount',
                sortable: true,
                render: (r) => `${r.amount.toLocaleString('vi-VN')} ${r.currency}`,
              },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={invoices}
            onRowClick={(row) => navigate(`/object/invoice/${row.id}`)}
            searchPlaceholder="Tìm hóa đơn..."
            emptyText="Chưa có hóa đơn nào với nhà cung cấp này."
          />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
