import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { PROJECT_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';
export default function ProjectPage() {
  return <div>{(DASHBOARD_SECTIONS.project??[]).map((s,i)=><DashboardSection key={i} section={s}/>)}{PROJECT_SECTIONS.map(s=><TileSection key={s.title.vi} section={s}/>)}</div>;
}
