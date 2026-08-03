'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useHealthPolling, useTenantsPolling } from '@/lib/admin/polling-hook';
import { AlertCircle, CheckCircle, Activity, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { data: health, loading: healthLoading, error: healthError } = useHealthPolling(5000);
  const { data: tenantsData, loading: tenantsLoading } = useTenantsPolling(1, 10000);

  const tenantCount = tenantsData?.total || 0;
  const totalFiles = tenantsData?.tenants.reduce((sum) => sum + 1, 0) || 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-dark-400">
            Real-time monitoring of VisionBridge platform
          </p>
        </div>

        {/* System Health */}
        <div className="section">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="grid-auto">
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">API Status</p>
                  <p className="text-2xl font-bold">
                    {healthLoading ? '...' : health?.checks.api === 'healthy' ? '✓' : '✗'}
                  </p>
                </div>
                {health?.checks.api === 'healthy' ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <AlertCircle className="text-red-500" />
                )}
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Database</p>
                  <p className="text-2xl font-bold">
                    {healthLoading ? '...' : health?.checks.database === 'healthy' ? '✓' : '✗'}
                  </p>
                </div>
                {health?.checks.database === 'healthy' ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <AlertCircle className="text-red-500" />
                )}
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Celery Worker</p>
                  <p className="text-2xl font-bold">
                    {healthLoading ? '...' : health?.checks.celery_worker === 'running' ? '✓' : '✗'}
                  </p>
                </div>
                {health?.checks.celery_worker === 'running' ? (
                  <Activity className="text-green-500" />
                ) : (
                  <AlertCircle className="text-red-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="section">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid-auto">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Total Tenants</p>
                  <p className="text-3xl font-bold">{tenantsLoading ? '...' : tenantCount}</p>
                </div>
                <Users className="text-primary-500" size={32} />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Files Processed</p>
                  <p className="text-3xl font-bold">{tenantsLoading ? '...' : totalFiles}</p>
                </div>
                <Activity className="text-primary-500" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tenants */}
        <div className="section">
          <h2 className="text-xl font-semibold mb-4">Recent Tenants</h2>
          <div className="card">
            {tenantsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-dark-700 rounded animate-pulse" />
                ))}
              </div>
            ) : tenantsData?.tenants.length === 0 ? (
              <p className="text-dark-400 text-center py-8">No tenants yet</p>
            ) : (
              <div className="space-y-3">
                {tenantsData?.tenants.slice(0, 5).map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-700 transition-colors">
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-dark-400">{tenant.email}</p>
                    </div>
                    <StatusBadge status={tenant.storage_type} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
