import { useState } from 'react';
import { useT } from '../hooks/useT';
import { tr } from '../data/launchpadData';

/**
 * ConceptPanel — lớp giáo dục thuần UI, không đụng tới logic nghiệp vụ.
 *
 * Hiển thị: T-code chuẩn SAP, SAP module sở hữu, mục đích nghiệp vụ,
 * menu path SAP GUI thật, lưu ý tích hợp (integration), và ví dụ bút
 * toán Dr/Cr mẫu nếu có. Mặc định thu gọn để không chiếm chỗ form/bảng
 * chính — người học tự mở khi cần tra cứu.
 *
 * concept: object từ conceptData.js (xem CONCEPTS[key])
 */
export default function ConceptPanel({ concept }) {
  const { lang } = useT();
  const [open, setOpen] = useState(false);
  if (!concept) return null;
  const isVi = lang === 'vi';

  return (
    <div className="bg-blue-50/60 border border-blue-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-blue-50"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-blue-900">
          <i className="ti ti-school text-base" aria-hidden="true" />
          {isVi ? 'Khái niệm SAP' : 'SAP Concept'}
          <code className="text-xs bg-white border border-blue-200 rounded px-1.5 py-0.5 text-blue-800">
            {concept.tcode}
          </code>
        </span>
        <i className={`ti ti-chevron-${open ? 'up' : 'down'} text-blue-700`} aria-hidden="true" />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 text-sm space-y-3 border-t border-blue-200">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 font-medium mb-0.5">
              {isVi ? 'Module SAP' : 'SAP Module'}
            </p>
            <p className="text-[var(--fiori-text-primary)]">{concept.sapModule}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 font-medium mb-0.5">
              {isVi ? 'Mục đích nghiệp vụ' : 'Business Purpose'}
            </p>
            <p className="text-[var(--fiori-text-secondary)]">{tr(concept.purpose, lang)}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 font-medium mb-0.5">
              {isVi ? 'Đường dẫn menu SAP GUI' : 'SAP GUI Menu Path'}
            </p>
            <p className="text-[var(--fiori-text-secondary)] font-mono text-xs leading-relaxed">{concept.menuPath}</p>
          </div>

          {concept.integration && (
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-700 font-medium mb-0.5">
                {isVi ? 'Lưu ý tích hợp / SAP thật' : 'Integration Note / Real SAP'}
              </p>
              <p className="text-[var(--fiori-text-secondary)]">{tr(concept.integration, lang)}</p>
            </div>
          )}

          {concept.sampleEntry && (
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-700 font-medium mb-1">
                {isVi ? 'Bút toán kép mẫu (Dr/Cr)' : 'Sample Double-Entry (Dr/Cr)'}
              </p>
              <table className="w-full text-xs border border-blue-200 rounded overflow-hidden">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="text-left px-2 py-1 font-medium">{isVi ? 'Tài khoản' : 'Account'}</th>
                    <th className="text-right px-2 py-1 font-medium w-16">Dr</th>
                    <th className="text-right px-2 py-1 font-medium w-16">Cr</th>
                  </tr>
                </thead>
                <tbody>
                  {concept.sampleEntry.map((line, i) => (
                    <tr key={i} className="border-t border-blue-100 bg-white">
                      <td className="px-2 py-1">{line.account}</td>
                      <td className="text-right px-2 py-1">{line.dr ? '✓' : ''}</td>
                      <td className="text-right px-2 py-1">{!line.dr ? '✓' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
