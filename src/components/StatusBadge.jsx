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
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
}
