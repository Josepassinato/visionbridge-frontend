'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { DataTable, Column } from '@/components/admin/shared/DataTable';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useTenantsPolling } from '@/lib/admin/polling-hook';
import { apiClient, ProcessedFile } from '@/lib/admin/api-client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RefreshCw, Eye, Loader } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FileWithTenant extends ProcessedFile {
  tenant_name: string;
}

const columns: Column<FileWithTenant>[] = [
  {
    key: 'file_path',
    label: 'File',
    sortable: true,
    render: (value) => {
      const filename = value.split('/').pop();
      return <span className="font-mono text-sm truncate" title={value}>{filename}</span>;
    },
  },
  {
    key: 'tenant_name',
    label: 'Tenant',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => <StatusBadge status={value} />,
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (value) => formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

export default function FilesPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<string>('all');

  const { data: tenantsData, loading: tenantsLoading } = useTenantsPolling(1);

  useEffect(() => {
    const loadFiles = async () => {
      if (!tenantsData?.tenants) return;

      setLoading(true);
      try {
        const allFiles: FileWithTenant[] = [];

        for (const tenant of tenantsData.tenants) {
          if (selectedTenant !== 'all' && tenant.id !== selectedTenant) continue;

          const { files: tenantFiles } = await apiClient.listFiles(tenant.id, 1, 100);
          allFiles.push(
            ...tenantFiles.map((f) => ({
              ...f,
              tenant_name: tenant.name,
            }))
          );
        }

        setFiles(allFiles.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      } catch (err) {
        console.error('Failed to load files:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [selectedTenant, tenantsData]);

  const handleViewAnalysis = (file: FileWithTenant) => {
    // Navigate to file detail page (to be implemented in FASE 2)
    router.push(`/admin/files/${file.id}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Files</h1>
            <p className="text-dark-400">
              Browse all processed files across tenants
            </p>
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
                  <button
                    onClick={() => handleViewAnalysis(row)}
                    className="btn btn-sm btn-secondary flex items-center gap-1"
                  >
                    <Eye size={14} />
                    View
                  </button>
                ),
              },
            ]}
            data={files}
            loading={loading || tenantsLoading}
            rowKey="id"
          />

          {!loading && files.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-dark-400">No files found</p>
              <p className="text-sm text-dark-500 mt-1">
                Files will appear here as they are processed
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && files.length > 0 && (
          <div className="grid-auto">
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Total Files</p>
              <p className="text-2xl font-bold">{files.length}</p>
            </div>
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-400">
                {files.filter((f) => f.status === 'completed').length}
              </p>
            </div>
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {files.filter((f) => f.status === 'pending').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
