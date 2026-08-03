'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { TenantForm } from '@/components/admin/forms/TenantForm';
import { apiClient, TenantCreateRequest } from '@/lib/admin/api-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function NewTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: TenantCreateRequest) => {
    setLoading(true);
    setError(null);

    try {
      // Note: Storage config will be populated via OAuth flow in FASE 2
      // For MVP, we store an empty config and update it after OAuth
      const tenantData = {
        ...data,
        storage_config: {}, // Empty for now - populated by OAuth flow
      };

      await apiClient.createTenant(tenantData);
      router.push('/admin/tenants');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to create tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost p-2"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="section-title">New Tenant</h1>
            <p className="text-dark-400">Create a new tenant and configure their storage</p>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <TenantForm
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/tenants')}
          />
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> After creating the tenant, you'll configure storage credentials
            via OAuth. Storage configuration is currently a placeholder and will be populated in
            FASE 2 when OAuth flows are integrated.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
