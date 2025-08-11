import React, { Suspense } from 'react';
import './LazyLoader.css';
import LoadingSpinner from './LoadingSpinner';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback 
}) => {
  const defaultFallback = (
    <div className="lazy-loader-fallback">
      <LoadingSpinner />
      <p>Loading...</p>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoader; 