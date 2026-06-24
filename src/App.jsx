import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import FioriDashboardShell from './components/FioriDashboardShell';
import DashboardPage from './pages/DashboardPage';
import ListPage from './pages/ListPage';
import AppDetailPage from './pages/AppDetailPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { useLangStore } from './store/langStore';
import { NAV_TABS, tr } from './data/launchpadData';
import ME21N from './pages/transactions/ME21N';
import MIGO from './pages/transactions/MIGO';
import MIRO from './pages/transactions/MIRO';
import VA01 from './pages/transactions/VA01';
import VF01 from './pages/transactions/VF01';
import PurchaseOrderDetail from './pages/objects/PurchaseOrderDetail';
import SalesOrderDetail from './pages/objects/SalesOrderDetail';
import SupplierInvoiceDetail from './pages/objects/SupplierInvoiceDetail';
import BillingDocumentDetail from './pages/objects/BillingDocumentDetail';
import VendorDetail from './pages/objects/VendorDetail';
import CustomerDetail from './pages/objects/CustomerDetail';
import BalanceSheetModule from './modules/BalanceSheetModule';

const TRANSACTIONS = { ME21N, MIGO, MIRO, VA01, VF01 };
const MODULES = { 'balance-sheet': BalanceSheetModule };

function TransactionPage() {
  const { txn } = useParams();
  const lang = useLangStore((s) => s.lang);
  const Component = TRANSACTIONS[txn];
  if (!Component) return <PlaceholderPage name={lang === 'vi' ? `Giao dịch ${txn} chưa hỗ trợ` : `Transaction ${txn} not supported`} />;
  return <Component />;
}

function ModulePage() {
  const { moduleKey } = useParams();
  const lang = useLangStore((s) => s.lang);
  const Component = MODULES[moduleKey];
  if (!Component) return <PlaceholderPage name={lang === 'vi' ? `Module ${moduleKey} chưa hỗ trợ` : `Module ${moduleKey} not supported`} />;
  return <Component />;
}

function OtherPage() {
  const lang = useLangStore((s) => s.lang);
  return <PlaceholderPage name={tr(NAV_TABS[6].label, lang)} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <FioriDashboardShell>
        <Routes>
          {/* ── Dashboard pages — mỗi module render DashboardPage ── */}
          <Route path="/"              element={<DashboardPage tabKey="home"          />} />
          <Route path="/finance"       element={<DashboardPage tabKey="finance"       />} />
          <Route path="/procurement"   element={<DashboardPage tabKey="procurement"   />} />
          <Route path="/manufacturing" element={<DashboardPage tabKey="manufacturing" />} />
          <Route path="/sales"         element={<DashboardPage tabKey="sales"         />} />
          <Route path="/project"       element={<DashboardPage tabKey="project"       />} />
          <Route path="/other"         element={<OtherPage />} />

          {/* ── Transactions & Lists ── */}
          <Route path="/transaction/:txn" element={<TransactionPage />} />
          <Route path="/list/:listKey"    element={<ListPage />} />
          <Route path="/app/:appKey"      element={<AppDetailPage />} />
          <Route path="/module/:moduleKey" element={<ModulePage />} />

          {/* ── Object Pages ── */}
          <Route path="/object/po/:poId"             element={<PurchaseOrderDetail />} />
          <Route path="/object/so/:soId"             element={<SalesOrderDetail />} />
          <Route path="/object/invoice/:invoiceId"   element={<SupplierInvoiceDetail />} />
          <Route path="/object/billing/:billingId"   element={<BillingDocumentDetail />} />
          <Route path="/object/vendor/:vendorId"     element={<VendorDetail />} />
          <Route path="/object/customer/:customerId" element={<CustomerDetail />} />
        </Routes>
      </FioriDashboardShell>
    </BrowserRouter>
  );
}
