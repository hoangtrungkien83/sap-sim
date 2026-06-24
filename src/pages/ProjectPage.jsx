import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { PROJECT_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';

export default function ProjectPage() {
  return (
    <div>
      {(DASHBOARD_SECTIONS.project ?? []).map((sec, i) => (
        <DashboardSection key={i} section={sec} />
      ))}
      {PROJECT_SECTIONS.map((section) => (
        <TileSection key={section.title.vi} section={section} />
      ))}
    </div>
  );
}
