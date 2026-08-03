'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { DataTable, Column } from '@/components/admin/shared/DataTable';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useTenantsPolling } from '@/lib/admin/polling-hook';
import { apiClient, Tenant } from '@/lib/admin/api-client';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/dialogs/DeleteConfirmDialog';
import { formatDistanceToNow } from 'date-fns';

const columns: Column<Tenant>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (value) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'storage_type',
    label: 'Storage',
    render: (value) => <StatusBadge status={value} />,
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (value) => formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

export default function TenantsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, refetch } = useTenantsPolling(page);

  const handleCreate = () => {
    router.push('/admin/tenants/new');
  };

  const handleEdit = (tenant: Tenant) => {
    router.push(`/admin/tenants/${tenant.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await apiClient.deleteTenant(deleteTarget.id);
      setDeleteTarget(null);
      await refetch();
    } catch (err) {
      console.error('Failed to delete tenant:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Tenants</h1>
            <p className="text-dark-400">Manage client tenants and their configurations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refetch}
              disabled={loading}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={handleCreate} className="btn btn-primary flex items-center gap-2">
              <Plus size={16} />
              New Tenant
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-4">
          <DataTable
            columns={[
              ...columns,
              {
                key: 'id',
                label: 'Actions',
                render: (_, row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="btn btn-sm btn-secondary flex items-center gap-1"
                      title="Edit tenant"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(row)}
                      className="btn btn-sm bg-red-900 text-red-300 hover:bg-red-800 flex items-center gap-1"
                      title="Delete tenant"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.tenants || []}
            loading={loading}
            error={error}
            rowKey="id"
          />

          {/* Pagination */}
          {data && data.total > 0 && (
            <div className="flex items-center justify-between text-sm text-dark-400">
              <span>
                Showing {(page - 1) * (data.limit || 10) + 1} to{' '}
                {Math.min(page * (data.limit || 10), data.total)} of {data.total} tenants
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn btn-sm btn-secondary"
                >
                  Previous
                </button>
                <span className="px-3 py-2">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!data?.tenants || data.tenants.length < (data.limit || 10)}
                  className="btn btn-sm btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          title="Delete Tenant"
          message="This action cannot be undone. All associated files and reports will be permanently deleted."
          itemName={deleteTarget.name}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
