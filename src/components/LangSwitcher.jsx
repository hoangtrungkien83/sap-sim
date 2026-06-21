import { useLangStore } from '../store/langStore';

export default function LangSwitcher() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);

  return (
    <div className="flex items-center rounded overflow-hidden border border-white/20 text-xs">
      <button
        onClick={() => setLang('vi')}
        className={`px-2 py-1 transition-colors ${lang === 'vi' ? 'bg-white text-[#354a5f] font-medium' : 'text-white hover:bg-white/10'}`}
        aria-pressed={lang === 'vi'}
      >
        VI
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 transition-colors ${lang === 'en' ? 'bg-white text-[#354a5f] font-medium' : 'text-white hover:bg-white/10'}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
