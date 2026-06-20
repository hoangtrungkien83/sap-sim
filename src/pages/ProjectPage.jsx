import TileSection from '../components/TileSection';
import { PROJECT_SECTIONS } from '../data/launchpadData';

export default function ProjectPage() {
  return (
    <div>
      {PROJECT_SECTIONS.map((section) => (
        <TileSection key={section.title} section={section} />
      ))}
    </div>
  );
}
