import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { SALES_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';
export default function SalesPage() {
  return <div>{(DASHBOARD_SECTIONS.sales??[]).map((s,i)=><DashboardSection key={i} section={s}/>)}{SALES_SECTIONS.map(s=><TileSection key={s.title.vi} section={s}/>)}</div>;
}
