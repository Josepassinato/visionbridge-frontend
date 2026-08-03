'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SuccessRateGaugeProps {
  successCount: number;
  failureCount: number;
  title?: string;
  height?: number;
}

export function SuccessRateGauge({
  successCount,
  failureCount,
  title = 'Success Rate',
  height = 300,
}: SuccessRateGaugeProps) {
  const total = successCount + failureCount;
  const successRate = total > 0 ? (successCount / total) * 100 : 0;

  const data = [
    { name: 'Successful', value: successCount, color: '#10b981' },
    { name: 'Failed', value: failureCount, color: '#ef4444' },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="card space-y-6">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}

      {/* Big Success Rate Display */}
      <div className="text-center">
        <div className="inline-block relative">
          <div className="text-5xl font-bold text-green-400">{successRate.toFixed(1)}%</div>
          <p className="text-dark-400 text-sm mt-2">of {total} analyses successful</p>
        </div>
      </div>

      {/* Pie Chart */}
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#f3f4f6' }}
              formatter={(value: any) => {
                const pct = ((value / total) * 100).toFixed(1);
                return [`${value} (${pct}%)`, 'Count'];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12">
          <p className="text-dark-400">No data available</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-700">
        <div className="bg-dark-700 rounded-lg p-3">
          <p className="text-xs text-dark-400 uppercase font-semibold mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-400">{successCount}</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-3">
          <p className="text-xs text-dark-400 uppercase font-semibold mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-400">{failureCount}</p>
        </div>
      </div>
    </div>
  );
}
