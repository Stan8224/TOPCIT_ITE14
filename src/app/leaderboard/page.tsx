'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/bottom-nav';
import { useFirebase } from '@/firebase/index';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import Loader from '@/components/common/loader';
import Clarity from '@microsoft/clarity';

const projectId = "ugjiip6xda";
Clarity.init(projectId);

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
      <div className="min-h-screen pb-24 bg-[#F2F2F2]">
        
        {/* Yellow Header */}
        <div className="bg-[#F6D85F] text-white text-center py-4 rounded-b-3xl shadow-md">
          <h1 className="text-xl font-bold tracking-wide">LEADERBOARD</h1>
        </div>

        <div className="p-4">
          
          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-10 bg-white shadow rounded-xl border-none"
              />
            </div>

            <Button className="bg-white shadow rounded-xl flex items-center gap-2 border-none">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Filter</span>
            </Button>
          </div>

          {/* Section Title */}
          <h3 className="text-xl font-bold text-gray-700 mb-3">Highest Level</h3>

          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_auto] text-gray-600 font-semibold text-sm px-2 mb-2 gap-x-1">
            <div>Rank</div>
            <div>Username</div>
            <div>Level</div>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-2">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className="grid grid-cols-[auto_1fr_auto] gap-x-6 items-center px-4 py-3 rounded-full bg-[#F9D648] text-gray-900 font-semibold shadow"
              >
                <div className="font-bold">{player.rank}</div>
                <div>{player.username}</div>
                <div>Level {player.level}</div>
              </div>
            ))}

            {/* Highlighted Current User Row */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-3 rounded-full bg-[#F9D648] text-gray-900 font-semibold shadow">
              <div className="font-bold">{currentUser.rank}</div>
              <div>{currentUser.username}</div>
              <div>Level {currentUser.level}</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}