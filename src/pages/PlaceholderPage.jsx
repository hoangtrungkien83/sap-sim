import { useT } from '../hooks/useT';

export default function PlaceholderPage({ name }) {
  const { lang } = useT();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <i className="ti ti-tools text-4xl text-[var(--fiori-text-secondary)] mb-3" aria-hidden="true" />
      <h2 className="text-lg font-medium text-[var(--fiori-text-primary)]">{name}</h2>
      <p className="text-sm text-[var(--fiori-text-secondary)] mt-1">
        {lang === 'vi' ? 'Module này sẽ được xây dựng ở phiên bản tiếp theo.' : 'This module will be available in a future release.'}
      </p>
    </div>
  );
}
