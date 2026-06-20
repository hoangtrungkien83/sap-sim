import { useNavigate } from 'react-router-dom';
import { PAGE_CARDS } from '../data/launchpadData';
import { KpiTile, CountTile } from '../components/Tiles';
import { useSapStore } from '../store/sapStore';

const cardColor = {
  blue: 'bg-blue-600',
  pink: 'bg-pink-600',
  orange: 'bg-orange-600',
  purple: 'bg-purple-700',
  red: 'bg-red-700',
  teal: 'bg-teal-600',
};

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function MyHomePage() {
  const navigate = useNavigate();
  const resetStore = useSapStore((s) => s.resetStore);

  const handleReset = () => {
    if (window.confirm('Xóa toàn bộ dữ liệu demo (PO, hóa đơn, đơn hàng...) và khôi phục về trạng thái ban đầu?')) {
      resetStore();
    }
  };

  return (
    <div>
      {/* Greeting banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-100">{today}</p>
          <h1 className="text-xl font-medium mt-1">Chào bạn, chào mừng quay lại!</h1>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/15 hover:bg-white/25 text-sm px-3 py-1.5 rounded transition-colors">
            Recap
          </button>
          <button className="bg-white/15 hover:bg-white/25 text-sm px-3 py-1.5 rounded transition-colors">
            My Home Settings
          </button>
          <button
            onClick={handleReset}
            className="bg-white/15 hover:bg-white/25 text-sm px-3 py-1.5 rounded transition-colors flex items-center gap-1"
            title="Xóa dữ liệu demo và khôi phục trạng thái ban đầu"
          >
            <i className="ti ti-refresh-dot text-sm" aria-hidden="true" />
            Reset Demo
          </button>
        </div>
      </div>

      {/* Pages cards grid */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-[var(--fiori-text-primary)] mb-3">Pages</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {PAGE_CARDS.map((card) => (
            <button
              key={card.key}
              onClick={() => navigate(card.path)}
              className={`${cardColor[card.color]} text-white rounded-lg p-4 h-24 flex flex-col justify-between text-left hover:opacity-90 transition-opacity`}
            >
              <i className="ti ti-layout-grid text-lg" aria-hidden="true" />
              <span className="text-sm font-medium leading-tight">{card.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Insights tiles */}
      <section>
        <h2 className="text-lg font-medium text-[var(--fiori-text-primary)] mb-3">Insights Tiles (4)</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
          <CountTile title="Manage Supplier Line Items" value="" icon="ti-file-invoice" onClick={() => {}} />
          <CountTile
            title="Supplier Payment Analysis"
            sub="Open Payments"
            value={0}
            icon="ti-cash"
            onClick={() => {}}
          />
          <KpiTile title="Invoice Processing Analysis" subtitle="Today" kpiKey="overduePayables" />
          <KpiTile title="Accounts Payable Overview" kpiKey="cashDiscountUtilization" />
        </div>
      </section>
    </div>
  );
}
