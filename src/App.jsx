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

const TRANSACTIONS = { ME21N, MIGO, MIRO, VA01, VF01 };

function TransactionPage() {
  const { txn } = useParams();
  const Component = TRANSACTIONS[txn];
  if (!Component) {
    return <PlaceholderPage name={`Transaction ${txn} chưa hỗ trợ`} />;
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
          <Route path="/other" element={<PlaceholderPage name="Other" />} />
          <Route path="/transaction/:txn" element={<TransactionPage />} />
          <Route path="/list/:listKey" element={<ListPage />} />
          <Route path="/app/:appKey" element={<AppDetailPage />} />
          <Route path="/object/po/:poId" element={<PurchaseOrderDetail />} />
          <Route path="/object/so/:soId" element={<SalesOrderDetail />} />
          <Route path="/object/invoice/:invoiceId" element={<SupplierInvoiceDetail />} />
          <Route path="/object/billing/:billingId" element={<BillingDocumentDetail />} />
          <Route path="/object/vendor/:vendorId" element={<VendorDetail />} />
        </Routes>
      </FioriShell>
    </BrowserRouter>
  );
}
