import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { MANUFACTURING_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';

export default function ManufacturingPage() {
  return (
    <div>
      {(DASHBOARD_SECTIONS.manufacturing ?? []).map((sec, i) => (
        <DashboardSection key={i} section={sec} />
      ))}
      {MANUFACTURING_SECTIONS.map((section) => (
        <TileSection key={section.title.vi} section={section} />
      ))}
    </div>
  );
}
