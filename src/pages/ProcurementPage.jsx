import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { PROCUREMENT_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';

export default function ProcurementPage() {
  return (
    <div>
      {(DASHBOARD_SECTIONS.procurement ?? []).map((sec, i) => (
        <DashboardSection key={i} section={sec} />
      ))}
      {PROCUREMENT_SECTIONS.map((section) => (
        <TileSection key={section.title.vi} section={section} />
      ))}
    </div>
  );
}
