import TileSection from '../components/TileSection';
import { SALES_SECTIONS } from '../data/launchpadData';

export default function SalesPage() {
  return (
    <div>
      {SALES_SECTIONS.map((section) => (
        <TileSection key={section.title} section={section} />
      ))}
    </div>
  );
}
