import { useNavigate } from 'react-router-dom';
import { PAGE_CARDS, tr } from '../data/launchpadData';
import { KpiTile, CountTile } from '../components/Tiles';
import { useSapStore } from '../store/sapStore';
import { useT } from '../hooks/useT';
import DashboardSection from '../components/DashboardSection';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';

const cardColor = {
  blue: 'bg-blue-600', pink: 'bg-pink-600', orange: 'bg-orange-600',
  purple: 'bg-purple-700', red: 'bg-red-700', teal: 'bg-teal-600',
};

export default function MyHomePage() {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const resetStore = useSapStore((s) => s.resetStore);

  const today = new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleReset = () => {
    if (window.confirm(t('shell_reset_confirm'))) resetStore();
  };

  return (
    <div>
      {/* ── Dashboard KPI tiles (MỚI) ── */}
      {(DASHBOARD_SECTIONS.home ?? []).map((sec, i) => (
        <DashboardSection key={i} section={sec} />
      ))}

      {/* ── Greeting banner (NGUYÊN XI) ── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-blue-100">{today}</p>
          <h1 className="text-xl font-medium mt-1">{t('shell_greeting')}</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="bg-white/15 hover:bg-white/25 text-sm px-3 py-1.5 rounded transition-colors">{t('shell_recap')}</button>
          <button className="bg-white/15 hover:bg-white/25 text-sm px-3 py-1.5 rounded transition-colors">{t('shell_home_settings')}</button>
          <button
            onClick={handleReset}
            className="bg-white/15 hover:bg-white/25 text-sm px-3 py-1.5 rounded transition-colors flex items-center gap-1"
            title={t('shell_reset_confirm')}
          >
            <i className="ti ti-refresh-dot text-sm" aria-hidden="true" />
            {t('shell_reset_demo')}
          </button>
        </div>
      </div>

      {/* ── Pages cards grid (NGUYÊN XI) ── */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-[var(--fiori-text-primary)] mb-3">{t('shell_pages')}</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {PAGE_CARDS.map((card) => (
            <button
              key={card.key}
              onClick={() => navigate(card.path)}
              className={`${cardColor[card.color]} text-white rounded-lg p-4 h-24 flex flex-col justify-between text-left hover:opacity-90 transition-opacity`}
            >
              <i className="ti ti-layout-grid text-lg" aria-hidden="true" />
              <span className="text-sm font-medium leading-tight">{tr(card.label, lang)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Insights tiles (NGUYÊN XI) ── */}
      <section>
        <h2 className="text-lg font-medium text-[var(--fiori-text-primary)] mb-3">{t('shell_insights_tiles')} (4)</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
          <CountTile
            title={lang === 'vi' ? 'Quản lý bút toán nhà cung cấp' : 'Manage Supplier Line Items'}
            value="" icon="ti-file-invoice"
            onClick={() => navigate('/list/invoices')}
          />
          <CountTile
            title={lang === 'vi' ? 'Phân tích thanh toán NCC' : 'Supplier Payment Analysis'}
            sub={lang === 'vi' ? 'Thanh toán đang mở' : 'Open Payments'}
            value={0} icon="ti-cash"
            onClick={() => navigate('/app/payment-blocks')}
          />
          <KpiTile
            title={lang === 'vi' ? 'Phân tích xử lý hóa đơn' : 'Invoice Processing Analysis'}
            subtitle={lang === 'vi' ? 'Hôm nay' : 'Today'}
            kpiKey="overduePayables"
          />
          <KpiTile
            title={lang === 'vi' ? 'Tổng quan công nợ phải trả' : 'Accounts Payable Overview'}
            kpiKey="cashDiscountUtilization"
          />
        </div>
      </section>
    </div>
  );
}
