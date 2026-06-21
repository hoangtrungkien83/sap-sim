import { useNavigate } from 'react-router-dom';
import { KpiTile, NavTile, CountTile } from './Tiles';
import { useT } from '../hooks/useT';
import { tr } from '../data/launchpadData';

export default function TileSection({ section }) {
  const navigate = useNavigate();
  const { lang } = useT();

  return (
    <section className="mb-8">
      <h2 className="text-lg font-medium text-[var(--fiori-text-primary)] mb-3">{tr(section.title, lang)}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
        {section.tiles.map((tile) => {
          const title = tr(tile.title, lang);
          const subtitle = tr(tile.subtitle, lang);

          if (tile.type === 'kpi') {
            return (
              <KpiTile
                key={tile.id}
                title={title}
                subtitle={subtitle}
                kpiKey={tile.kpiKey}
                tone={tile.tone}
              />
            );
          }
          if (tile.type === 'count') {
            return (
              <CountTile
                key={tile.id}
                title={title}
                value={tile.value}
                sub={tr(tile.sub, lang)}
                icon={tile.icon}
                onClick={() => navigate(`/app/${tile.app}`)}
              />
            );
          }
          if (tile.type === 'app') {
            return (
              <NavTile
                key={tile.id}
                title={title}
                subtitle={subtitle}
                icon={tile.icon}
                onClick={() => navigate(`/app/${tile.app}`)}
              />
            );
          }
          if (tile.type === 'module') {
            return (
              <NavTile
                key={tile.id}
                title={title}
                subtitle={subtitle}
                icon={tile.icon}
                onClick={() => navigate(`/module/${tile.module}`)}
              />
            );
          }
          if (tile.type === 'transaction') {
            return (
              <NavTile
                key={tile.id}
                title={title}
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
                title={title}
                icon={tile.icon}
                onClick={() => navigate(`/list/${tile.list}`)}
              />
            );
          }
          return <NavTile key={tile.id} title={title} subtitle={subtitle} icon={tile.icon} onClick={() => {}} />;
        })}
      </div>
    </section>
  );
}
