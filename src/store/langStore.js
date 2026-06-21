import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLangStore = create(
  persist(
    (set) => ({
      lang: 'vi', // 'vi' | 'en'
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ lang: state.lang === 'vi' ? 'en' : 'vi' })),
    }),
    { name: 'sap-sim-lang' }
  )
);
