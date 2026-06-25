import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { PROCUREMENT_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';
export default function ProcurementPage() {
  return <div>{(DASHBOARD_SECTIONS.procurement??[]).map((s,i)=><DashboardSection key={i} section={s}/>)}{PROCUREMENT_SECTIONS.map(s=><TileSection key={s.title.vi} section={s}/>)}</div>;
}
