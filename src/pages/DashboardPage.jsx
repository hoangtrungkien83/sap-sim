import { useMemo } from 'react';
import DashboardSection from '../components/DashboardSection';
import { DASHBOARD_SECTIONS } from '../data/dashboardData';

export default function DashboardPage({ tabKey }) {
  const sections = useMemo(() => DASHBOARD_SECTIONS[tabKey] ?? [], [tabKey]);
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <i className="ti ti-layout-dashboard text-4xl text-[var(--fiori-text-secondary)] mb-3" aria-hidden="true" />
        <p className="text-sm text-[var(--fiori-text-secondary)]">Không có dữ liệu dashboard.</p>
      </div>
    );
  }
  return (
    <div>
      {sections.map((section, i) => (
        <DashboardSection key={i} section={section} />
      ))}
    </div>
  );
}
