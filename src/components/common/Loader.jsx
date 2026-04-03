import React from 'react';

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-6 space-y-4 ${className}`}>
      <div className="skeleton h-4 w-1/3 rounded-lg" />
      <div className="skeleton h-8 w-2/3 rounded-lg" />
      <div className="skeleton h-3 w-1/2 rounded-lg" />
    </div>
  );
}

export function SkeletonChart({ className = '' }) {
  return (
    <div className={`glass-card p-6 space-y-3 ${className}`}>
      <div className="skeleton h-4 w-1/4 rounded-lg" />
      <div className="skeleton h-56 w-full rounded-xl mt-4" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded-lg" />
        <div className="skeleton h-2 w-1/4 rounded" />
      </div>
      <div className="skeleton h-4 w-20 rounded-lg" />
    </div>
  );
}

export default function Loader({ type = 'spinner' }) {
  if (type === 'spinner') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-400 animate-spin" />
        </div>
      </div>
    );
  }
  return null;
}
