'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TimelineDataPoint {
  timestamp: string;
  count: number;
  label?: string;
}

interface DetectionTimelineProps {
  data: TimelineDataPoint[];
  title?: string;
  height?: number;
}

export function DetectionTimeline({
  data,
  title = 'Detection Timeline',
  height = 300,
}: DetectionTimelineProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-dark-400">No data available for timeline</p>
      </div>
    );
  }

  const formattedData = data.map((point) => ({
    ...point,
    label: point.label || new Date(point.timestamp).toLocaleDateString(),
  }));

  return (
    <div className="card">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
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
            itemStyle={{ color: '#0ea5e9' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0ea5e9"
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            name="Detections"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
