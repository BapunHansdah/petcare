import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages = [];
  
  // Always show first page
  if (totalPages > 0) pages.push(1);
  
  // Add ellipsis and pages around current page
  if (currentPage > 3) pages.push('ellipsis');
  
  // Add pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (pages[pages.length - 1] !== i - 1 && pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
    pages.push(i);
  }
  
  // Add ellipsis before last page
  if (currentPage < totalPages - 2 && totalPages > 1) {
    if (pages[pages.length - 1] !== totalPages - 1 && pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }
  
  // Always show last page if there is more than one page
  if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
  
  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2"
      >
        <ChevronLeft size={16} />
      </Button>
      
      {pages.map((page, index) => (
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(Number(page))}
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}