'use client';

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: any;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  rowKey: keyof T;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  error,
  sortBy,
  sortOrder = 'asc',
  onSort,
  onRowClick,
  rowKey,
}: DataTableProps<T>) {
  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-400 mb-2">Error loading data</p>
        <p className="text-dark-400 text-sm">{error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  if (loading && data.length === 0) {
    return (
      <div className="card">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-dark-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-dark-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="table-header">
            {columns.map((column) => (
              <th key={String(column.key)} className="table-cell font-semibold text-dark-300">
                <button
                  onClick={() => {
                    if (column.sortable && onSort) {
                      onSort(String(column.key));
                    }
                  }}
                  className={`flex items-center gap-2 ${
                    column.sortable ? 'cursor-pointer hover:text-dark-50' : ''
                  }`}
                >
                  {column.label}
                  {column.sortable && sortBy === String(column.key) && (
                    sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row[rowKey])}
              className="table-row"
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="table-cell">
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
