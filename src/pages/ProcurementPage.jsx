import TileSection from '../components/TileSection';
import { PROCUREMENT_SECTIONS } from '../data/launchpadData';

export default function ProcurementPage() {
  return (
    <div>
      {PROCUREMENT_SECTIONS.map((section) => (
        <TileSection key={section.title.vi} section={section} />
      ))}
    </div>
  );
}
