import TileSection from '../components/TileSection';
import { MANUFACTURING_SECTIONS } from '../data/launchpadData';

export default function ManufacturingPage() {
  return (
    <div>
      {MANUFACTURING_SECTIONS.map((section) => (
        <TileSection key={section.title} section={section} />
      ))}
    </div>
  );
}
