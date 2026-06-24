import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { SALES_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';

export default function SalesPage() {
  return (
    <div>
      {(DASHBOARD_SECTIONS.sales ?? []).map((sec, i) => (
        <DashboardSection key={i} section={sec} />
      ))}
      {SALES_SECTIONS.map((section) => (
        <TileSection key={section.title.vi} section={section} />
      ))}
    </div>
  );
}
