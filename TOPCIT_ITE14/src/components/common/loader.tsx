import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Loader = ({ className }: { className?: string }) => {
  return <Loader2 className={cn('h-8 w-8 animate-spin text-accent', className)} />;
};

export default Loader;
