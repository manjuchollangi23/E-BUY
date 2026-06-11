import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1, className = '' }) => {
  const skeletons = Array(count).fill(0);

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {skeletons.map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-800 skeleton-pulse"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
        <div className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 skeleton-pulse"></div>
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-3/4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Card
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {skeletons.map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-1/3"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-3/4"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded skeleton-pulse w-1/4"></div>
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full skeleton-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
