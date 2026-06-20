export default function PlaceholderPage({ name }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <i className="ti ti-tools text-4xl text-[var(--fiori-text-secondary)] mb-3" aria-hidden="true" />
      <h2 className="text-lg font-medium text-[var(--fiori-text-primary)]">{name}</h2>
      <p className="text-sm text-[var(--fiori-text-secondary)] mt-1">
        Module này sẽ được xây dựng ở Phase tiếp theo.
      </p>
    </div>
  );
}
