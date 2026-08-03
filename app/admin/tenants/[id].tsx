'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { TenantForm } from '@/components/admin/forms/TenantForm';
import { apiClient, TenantUpdateRequest } from '@/lib/admin/api-client';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronLeft, Loader } from 'lucide-react';

export default function TenantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | undefined>();

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await apiClient.getTenant(tenantId);
        setTenant(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load tenant');
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  const handleSubmit = async (data: TenantUpdateRequest) => {
    setUpdateError(undefined);
    try {
      await apiClient.updateTenant(tenantId, data);
      const updated = await apiClient.getTenant(tenantId);
      setTenant(updated);
      router.push('/admin/tenants');
      router.refresh();
    } catch (err: any) {
      setUpdateError(err?.message || 'Failed to update tenant');
      throw err;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="btn btn-ghost p-2">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="section-title">
              {loading ? 'Loading...' : tenant?.name || 'Tenant'}
            </h1>
            <p className="text-dark-400">
              {loading ? 'Fetching tenant details...' : 'Edit tenant configuration'}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="card bg-red-900 bg-opacity-20 border border-red-700 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card text-center py-12">
            <Loader className="animate-spin mx-auto mb-3" size={32} />
            <p className="text-dark-400">Loading tenant details...</p>
          </div>
        )}

        {/* Form */}
        {!loading && tenant && (
          <div className="card">
            <TenantForm
              tenant={tenant}
              error={updateError}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/admin/tenants')}
            />
          </div>
        )}

        {/* Storage Config Info */}
        {!loading && tenant && (
          <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Storage Type:</strong> {tenant.storage_type}
              <br />
              <strong>Created:</strong> {new Date(tenant.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
