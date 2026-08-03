'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { DataTable, Column } from '@/components/admin/shared/DataTable';
import { apiClient, AuditLogEntry } from '@/lib/admin/api-client';
import { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const columns: Column<AuditLogEntry>[] = [
  {
    key: 'actor',
    label: 'Actor',
    sortable: true,
  },
  {
    key: 'action',
    label: 'Action',
    sortable: true,
    render: (value) => <span className="font-mono text-sm">{value}</span>,
  },
  {
    key: 'entity_type',
    label: 'Entity Type',
    sortable: true,
    render: (value) => <span className="text-sm">{value}</span>,
  },
  {
    key: 'entity_id',
    label: 'Entity ID',
    render: (value) => <span className="font-mono text-xs truncate" title={value}>{value}</span>,
  },
  {
    key: 'timestamp',
    label: 'Timestamp',
    sortable: true,
    render: (value) => formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
];

interface ExpandableAuditLog extends AuditLogEntry {
  expanded?: boolean;
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState<string>('all');
  const [actor, setActor] = useState<string>('all');
  const [logs, setLogs] = useState<ExpandableAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        // Mock data - in real app, fetch from API
        const mockLogs: ExpandableAuditLog[] = [
          {
            id: '1',
            actor: 'admin@example.com',
            action: 'create',
            entity_type: 'tenant',
            entity_id: 'tenant-123',
            timestamp: new Date(Date.now() - 60000).toISOString(),
            details: { name: 'New Tenant', email: 'tenant@example.com' },
          },
          {
            id: '2',
            actor: 'admin@example.com',
            action: 'update',
            entity_type: 'tenant',
            entity_id: 'tenant-123',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            details: { field: 'search_prompt', old_value: 'Detect people', new_value: 'Detect people and vehicles' },
          },
          {
            id: '3',
            actor: 'admin@example.com',
            action: 'approve',
            entity_type: 'adjustment_request',
            entity_id: 'request-456',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            details: { request: 'Increase sensitivity', notes: 'Approved - will implement in next release' },
          },
          {
            id: '4',
            actor: 'admin@example.com',
            action: 'reject',
            entity_type: 'adjustment_request',
            entity_id: 'request-789',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            details: { request: 'Change storage', notes: 'Not feasible at this time' },
          },
          {
            id: '5',
            actor: 'system',
            action: 'generate',
            entity_type: 'report',
            entity_id: 'report-101',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            details: { period: '24h', files_analyzed: 45 },
          },
        ];

        setLogs(
          mockLogs.filter((log) => {
            if (entityType !== 'all' && log.entity_type !== entityType) return false;
            if (actor !== 'all' && log.actor !== actor) return false;
            return true;
          })
        );
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [page, entityType, actor]);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const uniqueActors = ['all', ...new Set(logs.map((l) => l.actor))];
  const uniqueEntityTypes = ['all', ...new Set(logs.map((l) => l.entity_type))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Audit Logs</h1>
            <p className="text-dark-400">View all administrative actions and changes</p>
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
        <div className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Filter by Entity Type</label>
              <select
                value={entityType}
                onChange={(e) => {
                  setEntityType(e.target.value);
                  setPage(1);
                }}
                className="input"
              >
                {uniqueEntityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Filter by Actor</label>
              <select
                value={actor}
                onChange={(e) => {
                  setActor(e.target.value);
                  setPage(1);
                }}
                className="input"
              >
                {uniqueActors.map((act) => (
                  <option key={act} value={act}>
                    {act === 'all' ? 'All Actors' : act}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-auto">
          {loading ? (
            <div className="space-y-3 py-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-dark-700 rounded animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-400">No audit logs found</p>
              <p className="text-sm text-dark-500 mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id}>
                  <button
                    onClick={() => handleToggleExpand(log.id)}
                    className="w-full text-left p-4 hover:bg-dark-700 transition-colors rounded-lg flex items-center justify-between group"
                  >
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <div className="truncate">
                        <p className="text-sm font-medium">{log.actor}</p>
                      </div>
                      <div className="truncate">
                        <p className="text-sm text-dark-400">{log.action.toUpperCase()}</p>
                      </div>
                      <div className="truncate">
                        <p className="text-sm text-dark-400">{log.entity_type}</p>
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-mono text-dark-500">{log.entity_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-dark-400">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {expandedId === log.id ? (
                      <ChevronUp size={18} className="text-dark-400 ml-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-dark-400 ml-4 flex-shrink-0 group-hover:text-dark-300" />
                    )}
                  </button>

                  {/* Expanded Details */}
                  {expandedId === log.id && (
                    <div className="px-4 pb-4 bg-dark-700 rounded-lg mx-4 mb-2">
                      <div className="bg-dark-800 rounded p-4">
                        <p className="text-xs text-dark-400 uppercase font-semibold mb-2">Details</p>
                        <pre className="text-xs text-dark-300 overflow-x-auto font-mono bg-dark-900 p-3 rounded">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && logs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Total Actions</p>
              <p className="text-2xl font-bold">{logs.length}</p>
            </div>
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Unique Actors</p>
              <p className="text-2xl font-bold">{uniqueActors.filter((a) => a !== 'all').length}</p>
            </div>
            <div className="card">
              <p className="text-dark-400 text-sm mb-1">Entity Types</p>
              <p className="text-2xl font-bold">{uniqueEntityTypes.filter((t) => t !== 'all').length}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
