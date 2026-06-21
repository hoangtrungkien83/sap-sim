import { useParams, useNavigate } from 'react-router-dom';
import { useSapStore } from '../../store/sapStore';
import ObjectPage, { ObjectSection } from '../../components/ObjectPage';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Breadcrumb from '../../components/Breadcrumb';
import { useT } from '../../hooks/useT';

export default function VendorDetail() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useT();
  const isVi = lang === 'vi';
  const vendor = useSapStore((s) => s.vendors.find((v) => v.id === vendorId));
  // Subscribe vào mảng gốc rồi filter ngoài selector — tránh tạo array mới
  // mỗi lần selector chạy (xem chú thích chi tiết trong CustomerDetail.jsx).
  const allPurchaseOrders = useSapStore((s) => s.purchaseOrders);
  const allInvoices = useSapStore((s) => s.supplierInvoices);
  const purchaseOrders = allPurchaseOrders.filter((p) => p.vendorId === vendorId);
  const invoices = allInvoices.filter((i) => i.vendorId === vendorId);

  if (!vendor) {
    return (
      <div className="text-sm text-[var(--fiori-text-secondary)]">
        {t('obj_not_found_vendor')} <code>{vendorId}</code>.
      </div>
    );
  }

  const totalPoValue = purchaseOrders.reduce((sum, p) => sum + p.netValue, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: t('nav_procurement'), path: '/procurement' },
          { label: isVi ? 'Nhà cung cấp' : 'Suppliers', path: '/list/vendors' },
          { label: vendor.name },
        ]}
      />
      <ObjectPage
        title={vendor.name}
        subtitle={`${isVi ? 'Nhà cung cấp' : 'Vendor'} ${vendor.id} · ${vendor.country}`}
        keyFacts={[
          { label: isVi ? 'Tiền tệ' : 'Currency', value: vendor.currency },
          { label: isVi ? 'Danh mục' : 'Category', value: vendor.category?.[lang] ?? vendor.category?.vi ?? '—' },
          { label: isVi ? 'Số đơn đặt hàng' : 'Purchase Orders', value: purchaseOrders.length },
          { label: isVi ? 'Tổng giá trị PO' : 'Total PO Value', value: `${totalPoValue.toLocaleString('vi-VN')} VND` },
          { label: isVi ? 'Tổng đã ghi nhận' : 'Total Invoiced', value: `${totalInvoiced.toLocaleString('vi-VN')} VND` },
        ]}
        actions={[
          {
            label: t('btn_create_po'),
            icon: 'ti-clipboard-list',
            primary: true,
            onClick: () => navigate('/transaction/ME21N'),
          },
        ]}
      >
        <ObjectSection title={isVi ? 'Đơn đặt hàng' : 'Purchase Orders'}>
          <DataTable
            columns={[
              { key: 'id', label: isVi ? 'Số PO' : 'PO Number', sortable: true },
              { key: 'materialName', label: isVi ? 'Vật tư' : 'Material', sortable: true },
              {
                key: 'netValue',
                label: isVi ? 'Giá trị' : 'Net Value',
                sortable: true,
                render: (r) => `${r.netValue.toLocaleString('vi-VN')} VND`,
              },
              { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={purchaseOrders}
            onRowClick={(row) => navigate(`/object/po/${row.id}`)}
            searchPlaceholder={isVi ? 'Tìm PO...' : 'Search PO...'}
            emptyText={isVi ? 'Chưa có Purchase Order nào với nhà cung cấp này.' : 'No Purchase Orders for this vendor yet.'}
          />
        </ObjectSection>

        <ObjectSection title={isVi ? 'Hóa đơn' : 'Invoices'}>
          <DataTable
            columns={[
              { key: 'id', label: isVi ? 'Hóa đơn' : 'Invoice', sortable: true },
              {
                key: 'amount',
                label: isVi ? 'Số tiền' : 'Amount',
                sortable: true,
                render: (r) => `${r.amount.toLocaleString('vi-VN')} ${r.currency}`,
              },
              { key: 'status', label: isVi ? 'Trạng thái' : 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={invoices}
            onRowClick={(row) => navigate(`/object/invoice/${row.id}`)}
            searchPlaceholder={isVi ? 'Tìm hóa đơn...' : 'Search invoices...'}
            emptyText={isVi ? 'Chưa có hóa đơn nào với nhà cung cấp này.' : 'No invoices for this vendor yet.'}
          />
        </ObjectSection>
      </ObjectPage>
    </div>
  );
}
