
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowLeft, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/bottom-nav';
import { useFirebase } from '@/firebase/index';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import Loader from '@/components/common/loader';

const leaderboardData = [
  { rank: 1, username: 'Al Beback', level: 98 },
  { rank: 2, username: 'Bill Board', level: 96 },
  { rank: 3, username: 'Chris P. Bacon', level: 95 },
  { rank: 4, username: 'Anna Sthesia', level: 89 },
  { rank: 5, username: 'Warren Peace', level: 87 },
  { rank: 6, username: 'Dee Zaster', level: 84 },
  { rank: 7, username: 'Terry Aki', level: 82 },
  { rank: 8, username: 'Neil Down', level: 77 },
  { rank: 9, username: 'Ben Dover', level: 77 },
  { rank: 10, username: 'Barry Cade', level: 74 },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, isUserLoading, firestore } = useFirebase();

  const userDocRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isUserDocLoading;

  if (isLoading || !user || !userData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader />
      </div>
    );
  }

  const currentUser = {
    rank: '##',
    username: `${userData.firstName} ${userData.lastName}`,
    level: 1,
  };


  return (
    <>
      <div className="relative min-h-screen pb-20 bg-[#FCEEEE]">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/30 to-transparent rounded-b-3xl"></div>
        
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
                <ArrowLeft />
            </Button>
            <h1 className="text-xl font-headline font-bold text-primary-foreground bg-primary w-fit mx-auto px-6 py-2 rounded-xl">LEADERBOARD</h1>
            <div className="w-10"></div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search" className="pl-10 bg-white border-gray-300 rounded-lg backdrop-blur-sm" />
            </div>
            <Button variant="outline" className="bg-white border-gray-300 rounded-lg backdrop-blur-sm">
              <Filter className="w-5 h-5" />
              <span className="ml-2">Filter</span>
            </Button>
          </div>
          
          <div className='p-4 rounded-xl bg-white/50 backdrop-blur-sm'>

            <h3 className="text-xl font-bold mb-4 text-gray-800">Highest Level</h3>

            <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2 items-center text-sm font-semibold text-gray-600 px-4 mb-2">
                <div>Rank</div>
                <div>Username</div>
                <div>Level</div>
            </div>

            <div className="space-y-2">
              {leaderboardData.map((user) => (
                <div key={user.rank} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 p-3 rounded-lg bg-primary/10 text-primary-foreground font-semibold">
                  <div className="font-bold text-primary">#{user.rank}</div>
                  <div className="text-secondary">{user.username}</div>
                  <div className="text-secondary">Level {user.level}</div>
                </div>
              ))}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 p-3 rounded-lg bg-[#F9A826] text-white font-semibold shadow-md">
                  <div className="font-bold">{currentUser.rank}</div>
                  <div>{currentUser.username}</div>
                  <div>Level {currentUser.level}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
