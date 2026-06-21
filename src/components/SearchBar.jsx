import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchIndex } from '../data/launchpadData';
import { useT } from '../hooks/useT';

export default function SearchBar({ open, onClose }) {
  const navigate = useNavigate();
  const { t, lang } = useT();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const index = useMemo(() => getSearchIndex(lang), [lang]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const results =
    query.trim().length === 0
      ? []
      : index
          .filter((entry) => entry.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 8);

  const handleSelect = (entry) => {
    handleClose();
    navigate(entry.path);
  };

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/30" onClick={handleClose} aria-label={t('btn_close')} />
      <div className="relative bg-white max-w-xl mx-auto mt-20 rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[var(--fiori-tile-border)] px-4 py-3">
          <i className="ti ti-search text-lg text-[var(--fiori-text-secondary)]" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('shell_search_placeholder')}
            className="flex-1 outline-none text-sm"
          />
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded" aria-label={t('btn_close')}>
            <i className="ti ti-x text-base" aria-hidden="true" />
          </button>
        </div>

        {query.trim().length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-sm text-[var(--fiori-text-secondary)] px-4 py-6 text-center">
                {t('shell_no_results')} &quot;{query}&quot;
              </p>
            ) : (
              results.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleSelect(entry)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--fiori-page-bg)] border-b border-[var(--fiori-tile-border)] last:border-0"
                >
                  <i className={`ti ${entry.icon} text-lg text-[var(--fiori-link)]`} aria-hidden="true" />
                  <div>
                    <p className="text-sm">{entry.title}</p>
                    <p className="text-xs text-[var(--fiori-text-secondary)]">{entry.module}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
