'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { DetectionTimeline } from '@/components/admin/charts/DetectionTimeline';
import { ObjectDistribution } from '@/components/admin/charts/ObjectDistribution';
import { SuccessRateGauge } from '@/components/admin/charts/SuccessRateGauge';
import { AnalysisResultViewer } from '@/components/admin/viewers/AnalysisResultViewer';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronLeft, Loader, AlertCircle, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Mock data - in real app, fetch from API
        setReport({
          id: reportId,
          tenant_id: 'tenant-123',
          tenant_name: 'Test Tenant',
          period_start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          period_end: new Date().toISOString(),
          total_files: 45,
          successful_analyses: 43,
          failed_analyses: 2,
          findings: {
            total_objects: 127,
            by_type: {
              person: 45,
              vehicle: 32,
              equipment: 28,
              other: 22,
            },
            high_confidence: 89,
            medium_confidence: 28,
            low_confidence: 10,
            by_hour: [
              { timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), count: 12 },
              { timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), count: 15 },
              { timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(), count: 18 },
              { timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), count: 14 },
              { timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(), count: 20 },
              { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), count: 16 },
              { timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(), count: 22 },
              { timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), count: 10 },
            ],
          },
          created_at: new Date().toISOString(),
          delivery_status: 'sent',
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleDownloadCSV = () => {
    if (!report) return;

    const headers = ['Metric', 'Value'];
    const rows = [
      ['Report ID', report.id],
      ['Tenant', report.tenant_name],
      ['Period', `${format(new Date(report.period_start), 'MMM d, HH:mm')} - ${format(new Date(report.period_end), 'MMM d, HH:mm')}`],
      ['Total Files', report.total_files],
      ['Successful Analyses', report.successful_analyses],
      ['Failed Analyses', report.failed_analyses],
      ['Success Rate', `${((report.successful_analyses / report.total_files) * 100).toFixed(1)}%`],
      ['Total Objects Detected', report.findings.total_objects],
      ['Generated', format(new Date(report.created_at), 'MMM d, yyyy HH:mm:ss')],
    ];

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${reportId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin mr-3" size={32} />
          <p className="text-dark-400">Loading report details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="btn btn-ghost p-2">
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="card bg-red-900 bg-opacity-20 border border-red-700">
            <AlertCircle className="text-red-400 mb-2" size={24} />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout>
        <div className="card text-center py-12">
          <AlertCircle className="mx-auto mb-3 text-dark-400" size={32} />
          <p className="text-dark-400">Report not found</p>
        </div>
      </AdminLayout>
    );
  }

  const successRate = (report.successful_analyses / report.total_files) * 100;

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="btn btn-ghost p-2">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="section-title">Report Details</h1>
              <p className="text-dark-400">{report.tenant_name}</p>
            </div>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {/* Report Metadata */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold mb-4">Report Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-dark-400 text-sm mb-1">Period</p>
              <p className="text-sm">
                {format(new Date(report.period_start), 'MMM d, HH:mm')}
                <br />
                to {format(new Date(report.period_end), 'MMM d, HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Generated</p>
              <p className="text-sm">{format(new Date(report.created_at), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Status</p>
              <StatusBadge status={report.delivery_status} />
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Files Analyzed</p>
              <p className="text-sm font-mono">{report.total_files}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-dark-400 text-sm mb-2">Total Files</p>
            <p className="text-3xl font-bold">{report.total_files}</p>
          </div>
          <div className="card">
            <p className="text-dark-400 text-sm mb-2">Successful</p>
            <p className="text-3xl font-bold text-green-400">{report.successful_analyses}</p>
          </div>
          <div className="card">
            <p className="text-dark-400 text-sm mb-2">Failed</p>
            <p className="text-3xl font-bold text-red-400">{report.failed_analyses}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Success Rate Gauge */}
          <SuccessRateGauge
            successCount={report.successful_analyses}
            failureCount={report.failed_analyses}
          />

          {/* Timeline Chart */}
          {report.findings?.by_hour && (
            <DetectionTimeline
              data={report.findings.by_hour.map((point: any) => ({
                timestamp: point.timestamp,
                count: point.count,
                label: format(new Date(point.timestamp), 'HH:mm'),
              }))}
              title="Detections by Hour"
            />
          )}

          {/* Distribution Chart */}
          {report.findings?.by_type && (
            <ObjectDistribution
              data={Object.entries(report.findings.by_type).map(([name, count]: any) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                count,
              }))}
              title="Objects by Type"
            />
          )}
        </div>

        {/* Findings Summary */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold mb-4">Findings Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">Total Objects</p>
              <p className="text-2xl font-bold">{report.findings.total_objects}</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">High Confidence</p>
              <p className="text-2xl font-bold text-green-400">{report.findings.high_confidence}</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">Medium Confidence</p>
              <p className="text-2xl font-bold text-yellow-400">{report.findings.medium_confidence}</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">Low Confidence</p>
              <p className="text-2xl font-bold text-orange-400">{report.findings.low_confidence}</p>
            </div>
          </div>
        </div>

        {/* Raw Data */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold mb-4">Raw Data</h2>
          <AnalysisResultViewer data={report.findings} maxHeight="max-h-64" />
        </div>
      </div>
    </AdminLayout>
  );
}
