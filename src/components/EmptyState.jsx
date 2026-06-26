/**
 * EmptyState — empty state kiểu Fiori chuẩn khi tổ hợp filter (Company
 * Code / Ledger / Fiscal Year / Period) không khớp bất kỳ bút toán nào.
 *
 * Đây là pattern UI thật của Fiori List Report khi query trả về 0 dòng —
 * không phải lỗi, chỉ là "không có dữ liệu cho lựa chọn này", kèm gợi ý
 * điều chỉnh filter.
 */
export default function EmptyState({ filters }) {
  return (
    <div className="bg-white border border-[var(--fiori-tile-border)] rounded-lg p-10 flex flex-col items-center text-center">
      <i className="ti ti-database-off text-4xl text-[var(--fiori-text-secondary)] mb-3" aria-hidden="true" />
      <p className="text-sm font-medium text-[var(--fiori-text-primary)]">
        No data found for the selected combination
      </p>
      <p className="text-xs text-[var(--fiori-text-secondary)] mt-1 font-mono">
        Company Code {filters.companyCode} · Ledger {filters.ledger} · FY {filters.fiscalYear} · Period {filters.period}
      </p>
      <p className="text-xs text-[var(--fiori-text-secondary)] mt-3 max-w-sm">
        Try a different Fiscal Year or Company Code — not every period has posted documents in this simulation,
        mirroring real systems where unposted periods return an empty report.
      </p>
    </div>
  );
}
