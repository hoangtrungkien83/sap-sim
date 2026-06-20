import { useNavigate } from 'react-router-dom';
import { KpiTile, NavTile, CountTile } from './Tiles';

export default function TileSection({ section }) {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <h2 className="text-lg font-medium text-[var(--fiori-text-primary)] mb-3">{section.title}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
        {section.tiles.map((tile) => {
          if (tile.type === 'kpi') {
            return (
              <KpiTile
                key={tile.id}
                title={tile.title}
                subtitle={tile.subtitle}
                kpiKey={tile.kpiKey}
                tone={tile.tone}
              />
            );
          }
          if (tile.type === 'count') {
            return (
              <CountTile
                key={tile.id}
                title={tile.title}
                value={tile.value}
                sub={tile.sub}
                icon={tile.icon}
                onClick={() => {}}
              />
            );
          }
          if (tile.type === 'transaction') {
            return (
              <NavTile
                key={tile.id}
                title={tile.title}
                subtitle={tile.txn}
                icon={tile.icon}
                onClick={() => navigate(`/transaction/${tile.txn}`)}
              />
            );
          }
          if (tile.type === 'list') {
            return (
              <NavTile
                key={tile.id}
                title={tile.title}
                icon={tile.icon}
                onClick={() => navigate(`/list/${tile.list}`)}
              />
            );
          }
          return (
            <NavTile key={tile.id} title={tile.title} subtitle={tile.subtitle} icon={tile.icon} onClick={() => {}} />
          );
        })}
      </div>
    </section>
  );
}
