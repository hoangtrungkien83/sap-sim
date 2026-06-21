import { useLangStore } from '../store/langStore';
import { t } from '../data/i18n';

/**
 * useT() trả về hàm dịch gắn sẵn ngôn ngữ hiện tại, và chính ngôn ngữ đó.
 * Dùng trong component: const { t, lang } = useT();  ...  t('btn_save')
 */
export function useT() {
  const lang = useLangStore((s) => s.lang);
  return { t: (key) => t(key, lang), lang };
}
