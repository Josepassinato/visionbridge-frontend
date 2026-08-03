'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { apiClient } from '@/lib/admin/api-client';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronLeft, Loader, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { AnalysisResultViewer } from '@/components/admin/viewers/AnalysisResultViewer';

export default function FileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const fileId = params.id as string;

  const [file, setFile] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Note: This would need tenantId in real implementation
        // For now, we fetch without it as a placeholder
        setFile({
          id: fileId,
          file_path: 'gs://bucket/file.jpg',
          status: 'completed',
          created_at: new Date().toISOString(),
          file_size_bytes: 2048576,
        });

        setAnalysis({
          summary: 'Person detected in warehouse area',
          detected: true,
          count: 1,
          objects: [
            {
              label: 'person',
              attributes: { clothing: 'yellow vest' },
              confidence: 0.95,
            },
          ],
          confidence: 0.95,
          risk_level: 'low',
          recommended_action: 'Monitor for compliance',
          requires_human_review: false,
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load file details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileId]);

  const handleDownloadAnalysis = () => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${fileId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin mr-3" size={32} />
          <p className="text-dark-400">Loading file details...</p>
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

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="btn btn-ghost p-2">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="section-title">File Details</h1>
            <p className="text-dark-400">View analysis results and metadata</p>
          </div>
        </div>

        {/* File Metadata */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold mb-4">File Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-dark-400 text-sm mb-1">File Path</p>
              <p className="font-mono text-sm break-all">{file?.file_path}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">File Size</p>
              <p className="text-sm">
                {file?.file_size_bytes ? (file.file_size_bytes / 1024 / 1024).toFixed(2) : '—'} MB
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Status</p>
              <StatusBadge status={file?.status || 'unknown'} />
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Created</p>
              <p className="text-sm">{new Date(file?.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="card space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Analysis Results</h2>
              <button
                onClick={handleDownloadAnalysis}
                className="btn btn-secondary btn-sm flex items-center gap-2"
              >
                <Download size={14} />
                Download JSON
              </button>
            </div>

            {/* Summary Section */}
            <div className="space-y-3">
              <div>
                <p className="text-dark-400 text-sm mb-1">Summary</p>
                <p className="text-sm">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-dark-700 rounded-lg p-3">
                  <p className="text-dark-400 text-xs mb-1">Detected</p>
                  <p className="text-lg font-bold">{analysis.detected ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-dark-700 rounded-lg p-3">
                  <p className="text-dark-400 text-xs mb-1">Count</p>
                  <p className="text-lg font-bold">{analysis.count}</p>
                </div>
                <div className="bg-dark-700 rounded-lg p-3">
                  <p className="text-dark-400 text-xs mb-1">Confidence</p>
                  <p className="text-lg font-bold">
                    {analysis.confidence ? `${(analysis.confidence * 100).toFixed(0)}%` : '—'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-dark-400 text-sm mb-1">Risk Level</p>
                <StatusBadge
                  status={analysis.risk_level || 'low'}
                  label={analysis.risk_level?.toUpperCase() || 'UNKNOWN'}
                />
              </div>

              <div>
                <p className="text-dark-400 text-sm mb-1">Recommended Action</p>
                <p className="text-sm">{analysis.recommended_action || '—'}</p>
              </div>
            </div>

            {/* Full Analysis Viewer */}
            <div className="border-t border-dark-700 pt-4">
              <p className="text-dark-400 text-sm mb-3">Full Analysis Response</p>
              <AnalysisResultViewer data={analysis} />
            </div>

            {/* Request Adjustment Button */}
            <div className="border-t border-dark-700 pt-4">
              <button
                onClick={() => router.push(`/admin/adjustment-requests?file_id=${fileId}`)}
                className="btn btn-primary w-full"
              >
                Request Adjustment for This File
              </button>
            </div>
          </div>
        )}

        {!analysis && file?.status === 'pending' && (
          <div className="card text-center py-12">
            <Loader className="animate-spin mx-auto mb-3" size={32} />
            <p className="text-dark-400">Analysis in progress...</p>
            <p className="text-sm text-dark-500 mt-1">Check back in a few minutes</p>
          </div>
        )}

        {!analysis && file?.status === 'failed' && (
          <div className="card bg-red-900 bg-opacity-20 border border-red-700 text-center py-12">
            <AlertCircle className="mx-auto mb-3 text-red-400" size={32} />
            <p className="text-red-400">Analysis Failed</p>
            <p className="text-sm text-red-300 mt-1">Please check the error logs or retry</p>
            <button className="btn btn-sm btn-secondary mt-4 mx-auto flex items-center gap-2">
              <RefreshCw size={14} />
              Retry Analysis
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
