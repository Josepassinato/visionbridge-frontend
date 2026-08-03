'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { DataTable, Column } from '@/components/admin/shared/DataTable';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useTenantsPolling } from '@/lib/admin/polling-hook';
import { apiClient, AdjustmentRequest } from '@/lib/admin/api-client';
import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AdjustmentApprovalDialog } from '@/components/admin/forms/AdjustmentApprovalDialog';

interface AdjustmentRequestWithTenant extends AdjustmentRequest {
  tenant_name: string;
}

const columns: Column<AdjustmentRequestWithTenant>[] = [
  {
    key: 'tenant_name',
    label: 'Tenant',
    sortable: true,
  },
  {
    key: 'request_text',
    label: 'Request',
    sortable: false,
    render: (value) => (
      <span className="text-sm max-w-xs truncate" title={value}>
        {value}
      </span>
    ),
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

export default function AdjustmentRequestsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('pending');
  const [requests, setRequests] = useState<AdjustmentRequestWithTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdjustmentRequestWithTenant | null>(null);
  const [dialogMode, setDialogMode] = useState<'approve' | 'reject' | null>(null);

  const { data: tenantsData, loading: tenantsLoading } = useTenantsPolling(1);

  useEffect(() => {
    const loadRequests = async () => {
      if (!tenantsData?.tenants) return;

      setLoading(true);
      try {
        const { requests: data } = await apiClient.listAdjustmentRequests(
          page,
          20,
          status !== 'all' ? status : undefined
        );

        const withTenants = data.map((req) => {
          const tenant = tenantsData.tenants.find((t) => t.id === req.tenant_id);
          return {
            ...req,
            tenant_name: tenant?.name || 'Unknown',
          };
        });

        setRequests(withTenants);
      } catch (err) {
        console.error('Failed to load adjustment requests:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [page, status, tenantsData]);

  const handleApprove = async (notes: string) => {
    if (!selectedRequest) return;

    try {
      await apiClient.approveAdjustmentRequest(selectedRequest.id, notes);
      setDialogMode(null);
      setSelectedRequest(null);
      // Reload
      setPage(1);
      const { requests: data } = await apiClient.listAdjustmentRequests(
        1,
        20,
        status !== 'all' ? status : undefined
      );
      const withTenants = data.map((req) => {
        const tenant = tenantsData?.tenants.find((t) => t.id === req.tenant_id);
        return {
          ...req,
          tenant_name: tenant?.name || 'Unknown',
        };
      });
      setRequests(withTenants);
    } catch (err) {
      console.error('Failed to approve request:', err);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (notes: string) => {
    if (!selectedRequest) return;

    try {
      await apiClient.rejectAdjustmentRequest(selectedRequest.id, notes);
      setDialogMode(null);
      setSelectedRequest(null);
      // Reload
      setPage(1);
      const { requests: data } = await apiClient.listAdjustmentRequests(
        1,
        20,
        status !== 'all' ? status : undefined
      );
      const withTenants = data.map((req) => {
        const tenant = tenantsData?.tenants.find((t) => t.id === req.tenant_id);
        return {
          ...req,
          tenant_name: tenant?.name || 'Unknown',
        };
      });
      setRequests(withTenants);
    } catch (err) {
      console.error('Failed to reject request:', err);
      alert('Failed to reject request');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Adjustment Requests</h1>
            <p className="text-dark-400">Review and approve customer adjustment requests</p>
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
          <label className="label">Filter by Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="input max-w-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="implemented">Implemented</option>
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
                    {row.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRequest(row);
                            setDialogMode('approve');
                          }}
                          className="btn btn-sm bg-green-900 text-green-300 hover:bg-green-800 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(row);
                            setDialogMode('reject');
                          }}
                          className="btn btn-sm bg-red-900 text-red-300 hover:bg-red-800 flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    )}
                    {row.status !== 'pending' && (
                      <button
                        disabled
                        className="btn btn-sm btn-secondary opacity-50 cursor-not-allowed"
                      >
                        {row.status === 'approved' ? 'Approved' : row.status === 'rejected' ? 'Rejected' : 'Implemented'}
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            data={requests}
            loading={loading || tenantsLoading}
            rowKey="id"
          />

          {!loading && requests.length === 0 && (
            <div className="card text-center py-12">
              <AlertCircle className="mx-auto mb-3 text-dark-400" size={32} />
              <p className="text-dark-400">No requests found</p>
              <p className="text-sm text-dark-500 mt-1">
                {status === 'pending'
                  ? 'All pending requests have been processed'
                  : 'No requests match the current filter'}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && requests.length > 0 && (
          <div className="grid-auto">
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Total Requests</p>
              <p className="text-2xl font-bold">{requests.length}</p>
            </div>
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Status: {status}</p>
              <p className="text-2xl font-bold capitalize">{requests.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Approval Dialog */}
      {selectedRequest && dialogMode && (
        <AdjustmentApprovalDialog
          request={selectedRequest}
          mode={dialogMode}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={() => {
            setDialogMode(null);
            setSelectedRequest(null);
          }}
        />
      )}
    </AdminLayout>
  );
}
