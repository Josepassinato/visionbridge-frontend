'use client';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

const STATUS_CLASSES: Record<StatusType, string> = {
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  error: 'badge badge-error',
  info: 'badge badge-info',
  pending: 'bg-dark-700 text-dark-300',
};

const STATUS_LABELS: Record<string, StatusType> = {
  'completed': 'success',
  'success': 'success',
  'completed_analyses': 'success',
  'processing': 'info',
  'pending': 'pending',
  'failed': 'error',
  'error': 'error',
  'warning': 'warning',
  'healthy': 'success',
  'degraded': 'warning',
  'unhealthy': 'error',
  'running': 'success',
  'not_running': 'error',
};

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  const statusType = STATUS_LABELS[status.toLowerCase()] || 'info';
  const displayLabel = label || status;

  return <span className={STATUS_CLASSES[statusType]}>{displayLabel}</span>;
}
