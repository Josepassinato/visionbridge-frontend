'use client';

import React, { useState } from 'react';
import { AdjustmentRequest } from '@/lib/admin/api-client';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

interface AdjustmentApprovalDialogProps {
  request: AdjustmentRequest & { tenant_name?: string };
  mode: 'approve' | 'reject';
  onApprove: (notes: string) => Promise<void>;
  onReject: (notes: string) => Promise<void>;
  onCancel: () => void;
}

export function AdjustmentApprovalDialog({
  request,
  mode,
  onApprove,
  onReject,
  onCancel,
}: AdjustmentApprovalDialogProps) {
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      setError('Admin notes are required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (mode === 'approve') {
        await onApprove(notes);
      } else {
        await onReject(notes);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to process request');
      setSubmitting(false);
    }
  };

  const isApprove = mode === 'approve';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {isApprove ? (
            <CheckCircle className="text-green-400 flex-shrink-0" size={28} />
          ) : (
            <XCircle className="text-red-400 flex-shrink-0" size={28} />
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {isApprove ? 'Approve Request' : 'Reject Request'}
            </h2>
            <p className="text-sm text-dark-400 mt-1">
              {isApprove
                ? 'This will approve the customer adjustment request.'
                : 'This will reject the customer adjustment request.'}
            </p>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-dark-700 rounded-lg p-4 mb-6 space-y-3">
          <div>
            <p className="text-xs text-dark-400 uppercase font-semibold">Tenant</p>
            <p className="text-sm font-medium">{request.tenant_name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-xs text-dark-400 uppercase font-semibold">Request</p>
            <p className="text-sm">{request.request_text}</p>
          </div>
          <div>
            <p className="text-xs text-dark-400 uppercase font-semibold">Created</p>
            <p className="text-sm">{new Date(request.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-3 mb-6 flex gap-2">
            <AlertCircle className="text-red-400 flex-shrink-0" size={18} />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Admin Notes */}
        <div className="mb-6">
          <label className="label">
            {isApprove ? 'Approval Notes' : 'Rejection Reason'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setError(null);
            }}
            placeholder={
              isApprove
                ? 'Enter approval notes (what changes will be made)...'
                : 'Enter rejection reason (why this request is denied)...'
            }
            className="input min-h-24"
            disabled={submitting}
          />
          <p className="text-xs text-dark-400 mt-1">
            These notes will be stored in the audit log and may be shared with the customer.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-6 border-t border-dark-700">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !notes.trim()}
            className={`btn flex items-center gap-2 ${
              isApprove
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {submitting && <Loader size={16} className="animate-spin" />}
            {isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}
