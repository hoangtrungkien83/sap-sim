import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Breadcrumb from '../../components/Breadcrumb';
import ConceptPanel from '../../components/ConceptPanel';
import { useT } from '../../hooks/useT';
import { CONCEPTS } from '../../data/conceptData';

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const customer = useSapStore((s) => s.customers.find((c) => c.id === customerId));
  // .filter() bên trong selector Zustand tạo array mới mỗi lần gọi → rủi ro
  // vòng lặp re-render (giống lỗi getKpis ở Tiles.jsx). Subscribe vào mảng
  // gốc (reference ổn định, chỉ đổi khi set() thật sự chạy) rồi filter ở
  // ngoài, trong thân component.
  const allSalesOrders = useSapStore((s) => s.salesOrders);
  const allBillingDocuments = useSapStore((s) => s.billingDocuments);
  const salesOrders = allSalesOrders.filter((o) => o.customerId === customerId);
  const billingDocuments = allBillingDocuments.filter((b) => b.customerId === customerId);

  if (!customer) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        {t('obj_not_found_customer')} <code>{customerId}</code>.
      </div>
    );
  }

  const totalSoValue = salesOrders.reduce((sum, s) => sum + s.netValue, 0);
  const totalBilled = billingDocuments.reduce((sum, b) => sum + b.netValue, 0);

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: t('nav_sales'), path: '/sales' },
          { label: isVi ? 'Khách hàng' : 'Customers', path: '/app/top-customers' },
          { label: customer.name },
        ]}
      />
      <ConceptPanel concept={CONCEPTS.CUSTOMER_DETAIL} />
      <ObjectPage
        title={customer.name}
        subtitle={`${isVi ? 'Khách hàng' : 'Customer'} ${customer.id} · ${customer.country}`}
        keyFacts={[
          { label: isVi ? 'Ngành nghề' : 'Industry', value: customer.industry?.[lang] ?? customer.industry?.vi ?? '—' },
          { label: isVi ? 'Số đơn hàng' : 'Sales Orders', value: salesOrders.length },
          { label: isVi ? 'Tổng giá trị SO' : 'Total SO Value', value: `${totalSoValue.toLocaleString('vi-VN')} VND` },
          { label: isVi ? 'Tổng đã xuất hóa đơn' : 'Total Billed', value: `${totalBilled.toLocaleString('vi-VN')} VND` },
        ]}
        actions={[
          {
            label: t('btn_create_so'),
            icon: 'ti-shopping-cart-plus',
            primary: true,
            onClick: () => navigate('/transaction/VA01'),
          },
        ]}
      >
        <ObjectSection title={isVi ? 'Đơn bán hàng' : 'Sales Orders'}>
          <DataTable
            columns={[
              { key: 'id', label: isVi ? 'Số SO' : 'SO Number', sortable: true },
              { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
              {
                key: 'netValue',
                label: isVi ? 'Giá trị' : 'Net Value',
                sortable: true,
                render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND`,
              },
              { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={salesOrders}
            onRowClick={(row) => navigate(`/object/so/${row.id}`)}
            searchPlaceholder={isVi ? 'Tìm SO...' : 'Search SO...'}
            emptyText={isVi ? 'Chưa có Sales Order nào với khách hàng này.' : 'No Sales Orders for this customer yet.'}
          />
        </ObjectSection>

        <ObjectSection title={isVi ? 'Hóa đơn bán hàng' : 'Billing Documents'}>
          <DataTable
            columns={[
              { key: 'id', label: isVi ? 'Hóa đơn' : 'Billing Doc', sortable: true },
              {
                key: 'netValue',
                label: isVi ? 'Giá trị' : 'Amount',
                sortable: true,
                render: (r) => `${r.netValue.toLocaleString('vi-VN')} ${r.currency}`,
              },
              { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={billingDocuments}
            onRowClick={(row) => navigate(`/object/billing/${row.id}`)}
            searchPlaceholder={isVi ? 'Tìm hóa đơn...' : 'Search invoices...'}
            emptyText={isVi ? 'Chưa có hóa đơn nào với khách hàng này.' : 'No billing documents for this customer yet.'}
          />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
