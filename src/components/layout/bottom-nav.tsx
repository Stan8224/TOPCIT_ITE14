
'use client';

import { cn } from '@/lib/utils';
import { Home, BookOpen, MessageSquare, Settings, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/course', label: 'Learn', icon: BookOpen },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const BottomNav = () => {
  const pathname = usePathname();

  const isNavItemActive = (item: typeof navItems[number]) => {
    if (item.label === 'Learn') {
      return pathname.startsWith('/course') || pathname.startsWith('/module') || pathname.startsWith('/quiz');
    }
    if (item.href === '/home') {
      return pathname === '/home';
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t-2 border-border/10 shadow-lg z-50 rounded-t-2xl">
      <div className="container mx-auto h-full">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item);
            
            return (
              <Link href={item.href} key={item.label} className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors w-16">
                {isActive ? (
                  <div className="bg-primary text-primary-foreground p-3 rounded-full -translate-y-6 shadow-lg shadow-primary/50">
                    <item.icon className="w-7 h-7" />
                  </div>
                ) : (
                  <item.icon className={cn('w-7 h-7')} />
                )}
                <span className={cn('text-xs font-semibold', { 'text-primary': isActive, 'sr-only': isActive })}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
