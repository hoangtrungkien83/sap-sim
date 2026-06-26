import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────
// FINANCE CONTEXT STORE — global filter state cho Company Code / Ledger /
// Fiscal Year / Period.
//
// Đây là "global functional key" theo đúng khái niệm SAP: trong SAP GUI
// thật, Company Code + Fiscal Year + Period là context xuyên suốt mọi
// report FI (Balance Sheet, Income Statement, Journal Entries, Line Items)
// — người dùng KHÔNG chọn lại context này ở mỗi report, nó được giữ ở
// global session/parameter ID (vd parameter BUK cho Company Code).
//
// Store này mô phỏng đúng hành vi đó: bất kỳ module nào (Balance Sheet,
// Income Statement, Journal Entries Overview, hoặc tương lai mở rộng sang
// MM/SD report) đều đọc/ghi CÙNG MỘT state này qua useFinanceContext().
//
// QUAN TRỌNG: store này KHÔNG chứa dữ liệu nghiệp vụ (ACDOCA), chỉ chứa
// bộ lọc đang active + cờ "đã bấm Go chưa". Dữ liệu thật nằm ở mockData.js
// và được mỗi module tự query dựa theo activeFilters ở đây.
// ─────────────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  companyCode: '1010',
  ledger: '0L',
  fiscalYear: '2026',
  period: '012',
};

export const useFinanceContext = create(
  persist(
    (set, get) => ({
      // Bộ lọc đang được người dùng chỉnh trong FilterBar (chưa "Go").
      draftFilters: { ...DEFAULT_FILTERS },

      // Bộ lọc đã được xác nhận bằng nút "Go" — đây là context THẬT mà
      // mọi module (Balance Sheet/Income Statement/Journal Entries) dùng
      // để query mockData. Tách riêng draft/active mô phỏng đúng hành vi
      // SAP GUI: đổi dropdown chưa làm gì cả, phải bấm "Go"/Enter mới
      // submit request lên server (ở đây là "fetch" mockData).
      activeFilters: { ...DEFAULT_FILTERS },

      // true trong lúc "fetch" giả lập (để hiện loading spinner) — phục vụ
      // cảm giác thực tế khi bấm Go, không phải đổi tức thì như trước.
      isLoading: false,

      setDraftFilter: (key, value) =>
        set((state) => ({ draftFilters: { ...state.draftFilters, [key]: value } })),

      setDraftFilters: (patch) =>
        set((state) => ({ draftFilters: { ...state.draftFilters, ...patch } })),

      // go(): mô phỏng việc bấm nút "Go" — copy draftFilters sang
      // activeFilters sau một khoảng delay giả lập network round-trip.
      // Trả về Promise để component gọi có thể await nếu cần.
      go: () => {
        set({ isLoading: true });
        return new Promise((resolve) => {
          setTimeout(() => {
            set((state) => ({
              activeFilters: { ...state.draftFilters },
              isLoading: false,
            }));
            resolve(get().activeFilters);
          }, 450); // delay ngắn, đủ để thấy loading nhưng không gây khó chịu
        });
      },

      resetFilters: () =>
        set({ draftFilters: { ...DEFAULT_FILTERS }, activeFilters: { ...DEFAULT_FILTERS } }),
    }),
    { name: 'sap-sim-finance-context' }
  )
);
