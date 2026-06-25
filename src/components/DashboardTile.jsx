import { useNavigate } from 'react-router-dom';
import { useT } from '../hooks/useT';

function tr(val, lang) {
  if (!val) return '';
  return typeof val === 'string' ? val : val[lang] ?? val.vi ?? '';
}
const TONE = { danger:'text-[var(--fiori-danger)]', warn:'text-[var(--fiori-warning)]', good:'text-[var(--fiori-success)]', '':'text-[var(--fiori-text-primary)]' };

function KpiTile({ tile, lang }) {
  const tc = TONE[tile.tone ?? ''];
  return (<>
    <div><p className="text-sm font-medium text-[var(--fiori-text-primary)] leading-tight">{tr(tile.title,lang)}</p>{tile.sub&&<p className="text-xs text-[var(--fiori-link)] mt-0.5">{tr(tile.sub,lang)}</p>}</div>
    <div className="flex items-baseline gap-1 mt-2"><span className={`text-3xl font-light ${tc}`}>{tile.val}</span>{tile.unit&&<span className={`text-sm ${tc}`}>{tile.unit}</span>}</div>
    <div className={`text-2xl mt-auto ${tc}`}><i className={`ti ${tile.icon}`} aria-hidden="true"/></div>
    <div className="flex items-center gap-1 text-xs text-[var(--fiori-text-secondary)] mt-1"><i className="ti ti-refresh text-[10px]" aria-hidden="true"/><span>{tile.ts}</span></div>
  </>);
}
function ChartTile({ tile, lang }) {
  return (<>
    <div><p className="text-sm font-medium text-[var(--fiori-text-primary)] leading-tight">{tr(tile.title,lang)}</p>{tile.sub&&<p className="text-xs text-[var(--fiori-link)] mt-0.5">{tr(tile.sub,lang)}</p>}</div>
    <div className="mt-auto space-y-1.5">{tile.bars.map((b,i)=>(<div key={i} className="flex items-center gap-1.5 text-xs text-[var(--fiori-text-secondary)]"><span className="w-14 shrink-0 truncate text-[11px]">{tr(b.lbl,lang)}</span><div className="flex-1 h-1.5 rounded-full bg-[var(--fiori-page-bg)] overflow-hidden"><div className="h-full rounded-full" style={{width:`${b.pct}%`,background:b.color}}/></div><span className="w-7 text-right text-[11px]">{b.pct}%</span></div>))}</div>
  </>);
}
function ListTile({ tile, lang, onNav }) {
  return (<>
    <p className="text-sm font-medium text-[var(--fiori-text-primary)] leading-tight">{tr(tile.title,lang)}</p>
    <div className="mt-2 space-y-1.5">{tile.links.map((lnk,i)=>(<button key={i} onClick={e=>{e.stopPropagation();onNav(lnk.path);}} className="flex items-center gap-1 text-xs text-[var(--fiori-link)] hover:underline w-full text-left"><i className="ti ti-arrow-right text-[10px]" aria-hidden="true"/>{tr(lnk.label,lang)}</button>))}</div>
  </>);
}
function NewsTile({ tile }) {
  return (<>
    <div className="h-14 rounded flex items-center justify-center text-white text-[10px] font-semibold tracking-widest" style={{background:'linear-gradient(135deg,#1C3F77 0%,#0A66C2 100%)'}} aria-hidden="true">SAP NEWS</div>
    <p className="text-sm font-medium text-[var(--fiori-text-primary)] leading-snug mt-2 flex-1">{typeof tile.title==='string'?tile.title:tile.title?.vi??''}</p>
    <p className="text-xs text-[var(--fiori-text-secondary)] mt-auto flex items-center gap-1"><i className="ti ti-calendar text-[10px]" aria-hidden="true"/>{tile.dt}</p>
  </>);
}
function ProfileTile({ tile, lang }) {
  const ini = tile.name.split(' ').map(w=>w[0]).join('');
  return (<div className="flex flex-col items-center justify-center h-full gap-2 py-2">
    <div className="w-12 h-12 rounded-full bg-[var(--fiori-link)] text-white flex items-center justify-center text-base font-semibold">{ini}</div>
    <p className="text-sm font-medium text-[var(--fiori-text-primary)] text-center">{tile.name}</p>
    <p className="text-xs text-[var(--fiori-text-secondary)] text-center">{tr(tile.role,lang)}</p>
  </div>);
}
function StatusTile({ tile, lang }) {
  return (<>
    <div><p className="text-sm font-medium text-[var(--fiori-text-primary)] leading-tight">{tr(tile.title,lang)}</p>{tile.sub&&<p className="text-xs text-[var(--fiori-link)] mt-0.5">{tr(tile.sub,lang)}</p>}</div>
    <div className="mt-auto h-2.5 rounded-full flex overflow-hidden gap-px">{tile.segments.map((s,i)=>(<div key={i} className="h-full" style={{flex:s.pct,background:s.color}}/>))}</div>
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">{tile.segments.map((s,i)=>(<div key={i} className="flex items-center gap-1 text-[11px] text-[var(--fiori-text-secondary)]"><span className="w-2 h-2 rounded-full shrink-0" style={{background:s.color}} aria-hidden="true"/>{tr(s.lbl,lang)} {s.pct}%</div>))}</div>
  </>);
}

export default function DashboardTile({ tile }) {
  const navigate = useNavigate();
  const { lang } = useT();
  const inner = { kpi:<KpiTile tile={tile} lang={lang}/>, chart:<ChartTile tile={tile} lang={lang}/>, list:<ListTile tile={tile} lang={lang} onNav={navigate}/>, news:<NewsTile tile={tile}/>, profile:<ProfileTile tile={tile} lang={lang}/>, status:<StatusTile tile={tile} lang={lang}/> }[tile.type] ?? null;
  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-3 flex flex-col min-h-[130px] hover:shadow-md hover:border-[var(--fiori-link)] transition-all" role="article" aria-label={typeof tile.title==='string'?tile.title:tile.title?.[lang]??tile.name??''}>
      {inner}
    </div>
  );
}
