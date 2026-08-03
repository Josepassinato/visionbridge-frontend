'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface AnalysisResultViewerProps {
  data: Record<string, any>;
  maxHeight?: string;
}

export function AnalysisResultViewer({ data, maxHeight = 'max-h-96' }: AnalysisResultViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-dark-300 hover:text-dark-50 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Hide' : 'Show'} Raw JSON
        </button>
        <button
          onClick={handleCopy}
          className="btn btn-sm btn-ghost flex items-center gap-2"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {expanded && (
        <div className={`${maxHeight} overflow-auto bg-dark-900 rounded-lg border border-dark-700 p-4`}>
          <pre className="font-mono text-xs text-dark-300 whitespace-pre-wrap break-words">
            {jsonString}
          </pre>
        </div>
      )}

      {!expanded && (
        <div className="bg-dark-900 rounded-lg border border-dark-700 p-3">
          <p className="text-xs text-dark-500 font-mono">
            {data.summary || 'No summary available'}
          </p>
        </div>
      )}
    </div>
  );
}
