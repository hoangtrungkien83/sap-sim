import { useSapStore } from '../store/sapStore';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const toneClass = {
  danger: 'text-[var(--fiori-danger)]',
  success: 'text-[var(--fiori-success)]',
  warning: 'text-[var(--fiori-warning)]',
  default: 'text-[var(--fiori-text-primary)]',
};

const toneStroke = {
  danger: '#bb0000',
  success: '#107e3e',
  warning: '#df6e0c',
  default: '#0a6ed1',
};

export function KpiTile({ title, subtitle, kpiKey, tone = 'default', updatedAgo = '5m ago' }) {
  const kpi = useSapStore((s) => s.kpis[kpiKey]);
  if (!kpi) return null;

  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer min-h-[120px] flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-medium text-[var(--fiori-text-primary)] leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--fiori-link)] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-end justify-between mt-2 gap-2">
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-medium ${toneClass[tone]}`}>{kpi.value}</span>
          <span className={`text-sm ${toneClass[tone]}`}>{kpi.unit}</span>
        </div>
        {kpi.trend && (
          <div className="w-16 h-8 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpi.trend}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={toneStroke[tone]}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-[var(--fiori-text-secondary)] mt-2">
        <i className="ti ti-refresh text-[11px]" aria-hidden="true" />
        <span>{updatedAgo}</span>
      </div>
    </div>
  );
}

export function NavTile({ title, subtitle, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-4 hover:shadow-md transition-shadow text-left min-h-[120px] flex flex-col justify-between w-full"
    >
      <div>
        <h3 className="text-sm font-medium text-[var(--fiori-text-primary)] leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--fiori-link)] mt-0.5">{subtitle}</p>}
      </div>
      {icon && (
        <div className="text-2xl text-[var(--fiori-text-secondary)] mt-2">
          <i className={`ti ${icon}`} aria-hidden="true" />
        </div>
      )}
    </button>
  );
}

export function CountTile({ title, value, sub, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-4 hover:shadow-md transition-shadow text-left min-h-[120px] flex flex-col justify-between w-full"
    >
      <div>
        <h3 className="text-sm font-medium text-[var(--fiori-text-primary)] leading-tight">{title}</h3>
        {sub && <p className="text-xs text-[var(--fiori-link)] mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-end justify-between mt-2">
        <span className="text-2xl font-medium text-[var(--fiori-text-primary)]">{value}</span>
        {icon && <i className={`ti ${icon} text-xl text-[var(--fiori-text-secondary)]`} aria-hidden="true" />}
      </div>
    </button>
  );
}
