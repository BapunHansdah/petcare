import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-gray-200',
        className
      )}
    />
  );
}

export function PatientCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          
          <div className="border-t border-gray-100 pt-2 mt-2 space-y-2">
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}