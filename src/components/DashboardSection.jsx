import DashboardTile from './DashboardTile';
import { useT } from '../hooks/useT';

export default function DashboardSection({ section }) {
  const { lang } = useT();
  const title = typeof section.title === 'string' ? section.title : section.title[lang] ?? section.title.vi;
  return (
    <section className="mb-8">
      <h2 className="text-xs font-medium text-[var(--fiori-text-secondary)] uppercase tracking-wider mb-3">
        {title}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
        {section.tiles.map((tile) => (
          <DashboardTile key={tile.id} tile={tile} />
        ))}
      </div>
    </section>
  );
}
