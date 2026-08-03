'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DistributionDataPoint {
  name: string;
  count: number;
  percentage?: number;
}

interface ObjectDistributionProps {
  data: DistributionDataPoint[];
  title?: string;
  height?: number;
}

export function ObjectDistribution({
  data,
  title = 'Object Distribution',
  height = 300,
}: ObjectDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-dark-400">No data available for distribution</p>
      </div>
    );
  }

  return (
    <div className="card">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} tick={{ fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#f3f4f6' }}
            itemStyle={{ color: '#8b5cf6' }}
            formatter={(value: any) => {
              if (typeof value === 'number') {
                return [value.toFixed(0), 'Count'];
              }
              return value;
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="count" fill="#8b5cf6" name="Count" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
