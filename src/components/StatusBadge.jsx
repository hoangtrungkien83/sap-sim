import { useT } from '../hooks/useT';

const STATUS_STYLES = {
  // success / positive
  Confirmed: 'bg-green-50 text-green-700 border-green-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
  Posted: 'bg-green-50 text-green-700 border-green-200',
  Billed: 'bg-green-50 text-green-700 border-green-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Accepted: 'bg-green-50 text-green-700 border-green-200',
  'On Track': 'bg-green-50 text-green-700 border-green-200',
  Active: 'bg-green-50 text-green-700 border-green-200',
  Resolved: 'bg-green-50 text-green-700 border-green-200',
  // warning
  Backorder: 'bg-orange-50 text-orange-700 border-orange-200',
  'Partially Delivered': 'bg-orange-50 text-orange-700 border-orange-200',
  Pending: 'bg-orange-50 text-orange-700 border-orange-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  'At Risk': 'bg-orange-50 text-orange-700 border-orange-200',
  Medium: 'bg-orange-50 text-orange-700 border-orange-200',
  // danger
  High: 'bg-red-50 text-red-700 border-red-200',
  Open: 'bg-gray-100 text-gray-700 border-gray-200',
  'Not Started': 'bg-gray-100 text-gray-700 border-gray-200',
  Planning: 'bg-gray-100 text-gray-700 border-gray-200',
  Low: 'bg-gray-100 text-gray-700 border-gray-200',
  Converted: 'bg-green-50 text-green-700 border-green-200',
  'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200',
};

// Map status tiếng Anh (key cố định trong store) sang i18n dict key,
// để badge hiển thị đúng ngôn ngữ thay vì luôn cứng tiếng Anh.
const STATUS_I18N_KEY = {
  Open: 'status_open',
  Confirmed: 'status_confirmed',
  Delivered: 'status_delivered',
  'Partially Delivered': 'status_partially_delivered',
  Posted: 'status_posted',
  Billed: 'status_billed',
  Backorder: 'status_backorder',
  Completed: 'status_completed',
  'In Progress': 'status_in_progress',
  Pending: 'status_pending',
  Accepted: 'status_accepted',
  Active: 'status_active',
  Converted: 'status_converted',
  'On Track': 'status_on_track',
  Resolved: 'status_resolved',
  Scheduled: 'status_scheduled',
  'At Risk': 'status_at_risk',
  Medium: 'status_medium',
  High: 'status_high',
  Low: 'status_low',
  'Not Started': 'status_not_started',
  Planning: 'status_planning',
  'Pending Approval': 'status_pending_approval',
};

export default function StatusBadge({ status }) {
  const { t } = useT();
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
  const i18nKey = STATUS_I18N_KEY[status];
  const label = i18nKey ? t(i18nKey) : status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {label}
    </span>
  );
}
