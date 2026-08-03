'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { DataTable, Column } from '@/components/admin/shared/DataTable';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useTenantsPolling } from '@/lib/admin/polling-hook';
import { apiClient, TenantReport } from '@/lib/admin/api-client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RefreshCw, Download, Eye, Loader } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface ReportWithTenant extends TenantReport {
  tenant_name: string;
}

const columns: Column<ReportWithTenant>[] = [
  {
    key: 'tenant_name',
    label: 'Tenant',
    sortable: true,
  },
  {
    key: 'period_start',
    label: 'Period',
    render: (_, row) => (
      <span className="text-sm">
        {format(new Date(row.period_start), 'MMM d')} - {format(new Date(row.period_end), 'MMM d')}
      </span>
    ),
  },
  {
    key: 'total_files',
    label: 'Files',
    render: (value) => <span className="font-mono">{value}</span>,
  },
  {
    key: 'successful_analyses',
    label: 'Success',
    render: (value) => <span className="text-green-400 font-medium">{value}</span>,
  },
  {
    key: 'failed_analyses',
    label: 'Failed',
    render: (value) => <span className="text-red-400 font-medium">{value}</span>,
  },
  {
    key: 'created_at',
    label: 'Generated',
    render: (value) => formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportWithTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<string>('all');

  const { data: tenantsData, loading: tenantsLoading } = useTenantsPolling(1);

  useEffect(() => {
    const loadReports = async () => {
      if (!tenantsData?.tenants) return;

      setLoading(true);
      try {
        const allReports: ReportWithTenant[] = [];

        for (const tenant of tenantsData.tenants) {
          if (selectedTenant !== 'all' && tenant.id !== selectedTenant) continue;

          try {
            const { reports: tenantReports } = await apiClient.listReports(tenant.id, 1);
            allReports.push(
              ...tenantReports.map((r) => ({
                ...r,
                tenant_name: tenant.name,
              }))
            );
          } catch (err) {
            console.warn(`Failed to load reports for tenant ${tenant.id}:`, err);
          }
        }

        setReports(allReports.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [selectedTenant, tenantsData]);

  const handleViewReport = (report: ReportWithTenant) => {
    router.push(`/admin/reports/${report.id}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Reports</h1>
            <p className="text-dark-400">View consolidated analysis reports</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <label className="label">Filter by Tenant</label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="input max-w-xs"
          >
            <option value="all">All Tenants</option>
            {tenantsData?.tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div>
          <DataTable
            columns={[
              ...columns,
              {
                key: 'id',
                label: 'Actions',
                render: (_, row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewReport(row)}
                      className="btn btn-sm btn-secondary flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-ghost flex items-center gap-1"
                      title="Download (coming soon)"
                      disabled
                    >
                      <Download size={14} />
                    </button>
                  </div>
                ),
              },
            ]}
            data={reports}
            loading={loading || tenantsLoading}
            rowKey="id"
          />

          {!loading && reports.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-dark-400">No reports found</p>
              <p className="text-sm text-dark-500 mt-1">
                Reports will appear here as they are generated
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && reports.length > 0 && (
          <div className="grid-auto">
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Total Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Total Files Analyzed</p>
              <p className="text-2xl font-bold">
                {reports.reduce((sum, r) => sum + r.total_files, 0)}
              </p>
            </div>
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.round(
                  (reports.reduce((sum, r) => sum + r.successful_analyses, 0) /
                    reports.reduce((sum, r) => sum + r.total_files, 0)) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
