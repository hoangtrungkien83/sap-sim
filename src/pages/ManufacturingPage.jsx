import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { MANUFACTURING_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';
export default function ManufacturingPage() {
  return <div>{(DASHBOARD_SECTIONS.manufacturing??[]).map((s,i)=><DashboardSection key={i} section={s}/>)}{MANUFACTURING_SECTIONS.map(s=><TileSection key={s.title.vi} section={s}/>)}</div>;
}
