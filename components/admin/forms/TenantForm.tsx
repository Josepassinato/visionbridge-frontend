'use client';

import React, { useState } from 'react';
import { Tenant, TenantCreateRequest, TenantUpdateRequest } from '@/lib/admin/api-client';
import { AlertCircle, Loader } from 'lucide-react';

const STORAGE_TYPES = [
  { value: 'local', label: 'Local Filesystem' },
  { value: 'gdrive', label: 'Google Drive' },
  { value: 'dropbox', label: 'Dropbox' },
  { value: 's3', label: 'Amazon S3' },
];

interface TenantFormProps {
  tenant?: Tenant;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export function TenantForm({
  tenant,
  loading = false,
  error,
  onSubmit,
  onCancel,
}: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    email: tenant?.email || '',
    storage_type: (tenant?.storage_type as any) || 'gdrive',
    search_prompt: tenant?.search_prompt || 'Detect all objects in the image',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formData as TenantCreateRequest);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to save tenant');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || submitError) && (
        <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-red-400">Error</p>
            <p className="text-sm text-red-300">{error || submitError}</p>
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="label">Tenant Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Acme Corp"
          className="input"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="label">Contact Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@example.com"
          className="input"
          required
        />
      </div>

      {/* Storage Type */}
      <div>
        <label className="label">Storage Type</label>
        <select
          name="storage_type"
          value={formData.storage_type}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select storage type...</option>
          {STORAGE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-dark-400 mt-1">
          {formData.storage_type === 'gdrive' && 'Connect Google Drive via OAuth'}
          {formData.storage_type === 'dropbox' && 'Connect Dropbox via OAuth'}
          {formData.storage_type === 's3' && 'Provide AWS S3 bucket credentials'}
          {formData.storage_type === 'local' && 'Use local filesystem (development only)'}
        </p>
      </div>

      {/* Search Prompt */}
      <div>
        <label className="label">Search Prompt</label>
        <textarea
          name="search_prompt"
          value={formData.search_prompt}
          onChange={handleChange}
          placeholder="Describe what to detect in images..."
          className="input min-h-24"
          required
        />
        <p className="text-xs text-dark-400 mt-1">
          Natural language prompt sent to Moondream API for image analysis
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-6 border-t border-dark-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || loading}
          className="btn btn-primary flex items-center gap-2"
        >
          {submitting && <Loader size={16} className="animate-spin" />}
          {tenant ? 'Update Tenant' : 'Create Tenant'}
        </button>
      </div>
    </form>
  );
}
