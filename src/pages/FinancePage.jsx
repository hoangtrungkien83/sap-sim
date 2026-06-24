import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { FINANCE_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';

export default function FinancePage() {
  return (
    <div>
      {(DASHBOARD_SECTIONS.finance ?? []).map((sec, i) => (
        <DashboardSection key={i} section={sec} />
      ))}
      {FINANCE_SECTIONS.map((section) => (
        <TileSection key={section.title.vi} section={section} />
      ))}
    </div>
  );
}
