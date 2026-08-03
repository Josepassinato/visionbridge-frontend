'use client';

import { AdminLayout } from '@/components/admin/layouts/AdminLayout';
import { useHealthPolling } from '@/lib/admin/polling-hook';
import { CheckCircle, AlertCircle, Activity, Server } from 'lucide-react';

export default function SettingsPage() {
  const { data: health, loading } = useHealthPolling(5000);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="section-title">Settings</h1>
          <p className="text-dark-400">System configuration and status</p>
        </div>

        {/* System Status */}
        <div className="section">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-3">
            {health && (
              <>
                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server size={20} className="text-dark-400" />
                    <span>API Server</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {health.checks.api === 'healthy' ? (
                      <>
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-sm text-green-400">Healthy</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-sm text-red-400">Unhealthy</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server size={20} className="text-dark-400" />
                    <span>Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {health.checks.database === 'healthy' ? (
                      <>
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-sm text-green-400">Healthy</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-sm text-red-400">Unhealthy</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server size={20} className="text-dark-400" />
                    <span>Redis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {health.checks.redis === 'healthy' ? (
                      <>
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-sm text-green-400">Healthy</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-sm text-red-400">Unhealthy</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={20} className="text-dark-400" />
                    <span>Celery Worker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {health.checks.celery_worker === 'running' ? (
                      <>
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-sm text-green-400">Running</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-sm text-red-400">Stopped</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={20} className="text-dark-400" />
                    <span>Celery Beat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {health.checks.celery_beat === 'running' ? (
                      <>
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-sm text-green-400">Running</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={20} className="text-red-500" />
                        <span className="text-sm text-red-400">Stopped</span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {loading && (
              <div className="card text-center py-8">
                <p className="text-dark-400">Loading system status...</p>
              </div>
            )}
          </div>
        </div>

        {/* Configuration */}
        <div className="section">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="card space-y-4">
            <div>
              <label className="label">API Base URL</label>
              <input
                type="text"
                value={process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18088'}
                disabled
                className="input bg-dark-700 cursor-not-allowed"
              />
              <p className="text-xs text-dark-400 mt-1">Set in environment variables</p>
            </div>

            <div>
              <label className="label">Environment</label>
              <input
                type="text"
                value={process.env.NODE_ENV || 'development'}
                disabled
                className="input bg-dark-700 cursor-not-allowed"
              />
            </div>

            <div className="pt-4 border-t border-dark-700">
              <p className="text-sm text-dark-400">
                To update settings, modify your environment variables and restart the application.
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="section">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="card space-y-2">
            <p className="text-sm">
              <span className="text-dark-400">Application:</span>
              <span className="ml-2 font-medium">VisionBridge Admin Dashboard</span>
            </p>
            <p className="text-sm">
              <span className="text-dark-400">Version:</span>
              <span className="ml-2 font-mono">0.1.0</span>
            </p>
            <p className="text-sm">
              <span className="text-dark-400">Framework:</span>
              <span className="ml-2 font-medium">Next.js 16 + React 19</span>
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
