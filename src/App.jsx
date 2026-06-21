import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import FioriShell from './components/FioriShell';
import MyHomePage from './pages/MyHomePage';
import FinancePage from './pages/FinancePage';
import ProcurementPage from './pages/ProcurementPage';
import ManufacturingPage from './pages/ManufacturingPage';
import SalesPage from './pages/SalesPage';
import ProjectPage from './pages/ProjectPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ListPage from './pages/ListPage';
import AppDetailPage from './pages/AppDetailPage';
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
  if (!Component) {
    return <PlaceholderPage name={lang === 'vi' ? `Giao dịch ${txn} chưa hỗ trợ` : `Transaction ${txn} not supported`} />;
  }
  return <Component />;
}

function OtherPage() {
  const lang = useLangStore((s) => s.lang);
  return <PlaceholderPage name={tr(NAV_TABS[6].label, lang)} />;
}

function ModulePage() {
  const { moduleKey } = useParams();
  const lang = useLangStore((s) => s.lang);
  const Component = MODULES[moduleKey];
  if (!Component) {
    return <PlaceholderPage name={lang === 'vi' ? `Module ${moduleKey} chưa hỗ trợ` : `Module ${moduleKey} not supported`} />;
  }
  return <Component />;
}

export default function App() {
  return (
    <BrowserRouter>
      <FioriShell>
        <Routes>
          <Route path="/" element={<MyHomePage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/manufacturing" element={<ManufacturingPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/other" element={<OtherPage />} />
          <Route path="/transaction/:txn" element={<TransactionPage />} />
          <Route path="/list/:listKey" element={<ListPage />} />
          <Route path="/app/:appKey" element={<AppDetailPage />} />
          <Route path="/module/:moduleKey" element={<ModulePage />} />
          <Route path="/object/po/:poId" element={<PurchaseOrderDetail />} />
          <Route path="/object/so/:soId" element={<SalesOrderDetail />} />
          <Route path="/object/invoice/:invoiceId" element={<SupplierInvoiceDetail />} />
          <Route path="/object/billing/:billingId" element={<BillingDocumentDetail />} />
          <Route path="/object/vendor/:vendorId" element={<VendorDetail />} />
          <Route path="/object/customer/:customerId" element={<CustomerDetail />} />
        </Routes>
      </FioriShell>
    </BrowserRouter>
  );
}
