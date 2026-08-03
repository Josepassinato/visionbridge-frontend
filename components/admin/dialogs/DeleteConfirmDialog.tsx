'use client';

import React from 'react';
import { AlertCircle, Loader } from 'lucide-react';

interface DeleteConfirmDialogProps {
  title: string;
  message: string;
  itemName: string;
  loading?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  title,
  message,
  itemName,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [confirming, setConfirming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete');
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-sm w-full">
        <div className="flex items-start gap-4 mb-4">
          <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-dark-400 mt-1">{message}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-dark-700 rounded-lg p-4 mb-6">
          <p className="text-sm">
            <span className="text-dark-400">Item: </span>
            <span className="font-mono font-semibold text-white">{itemName}</span>
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={confirming || loading}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming || loading}
            className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            {confirming && <Loader size={16} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
