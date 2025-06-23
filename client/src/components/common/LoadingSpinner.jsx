import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  fullScreen = false,
  text = 'กำลังโหลด...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
    purple: 'text-purple-600'
  };

  const spinner = (
    <div className="flex flex-col items-center">
      <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && (
        <p className="mt-3 text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

// Skeleton loading component
export const SkeletonLoader = ({ 
  rows = 3, 
  height = 'h-4', 
  className = '' 
}) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className={`bg-gray-200 rounded ${height}`}></div>
    ))}
  </div>
);

// Card skeleton
export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
    <div className="p-4 space-y-3">
      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      <div className="bg-gray-200 h-6 rounded w-1/4"></div>
    </div>
  </div>
);

export default LoadingSpinner;
