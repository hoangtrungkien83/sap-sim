import TileSection from '../components/TileSection';
import { FINANCE_SECTIONS } from '../data/launchpadData';

export default function FinancePage() {
  return (
    <div>
      {FINANCE_SECTIONS.map((section) => (
        <TileSection key={section.title} section={section} />
      ))}
    </div>
  );
}
