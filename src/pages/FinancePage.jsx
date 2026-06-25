import TileSection from '../components/TileSection';
import DashboardSection from '../components/DashboardSection';
import { FINANCE_SECTIONS } from '../data/launchpadData';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';
export default function FinancePage() {
  return <div>{(DASHBOARD_SECTIONS.finance??[]).map((s,i)=><DashboardSection key={i} section={s}/>)}{FINANCE_SECTIONS.map(s=><TileSection key={s.title.vi} section={s}/>)}</div>;
}
