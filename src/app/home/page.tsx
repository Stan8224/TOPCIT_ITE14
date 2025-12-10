'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFirebase } from '@/firebase/index';
import { useDoc } from '@/firebase/firestore/use-doc';
import { courses } from '@/lib/mock-data';
import { doc } from 'firebase/firestore';
import { BrainCircuit, Computer, Database, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import BottomNav from '@/components/layout/bottom-nav';
import Link from 'next/link';
import Loader from '@/components/common/loader';

const iconMap: { [key: string]: React.ElementType } = {
  'Integrative Technologies': Computer,
  'Database and Design': Database,
  'UI/UX Theories and Concepts': Pencil,
  'Software Engineering': BrainCircuit,
};

// --- FIXED STREAK DAY COMPONENT ---
const StreakDay = ({
  day,
  date,
  active = false,
  current = false
}: {
  day: string;
  date: string;
  active?: boolean;
  current?: boolean;
}) => (
  <div
    className={`text-center rounded-xl p-3 w-16 font-bold shadow 
      ${
        current
          ? 'bg-[#2D7EAE] text-white'
          : active
          ? 'bg-[#85E680] text-gray-800'
          : 'bg-[#D9D9D9] text-gray-700'
      }
    `}
  >
    <div className="text-lg">{date}</div>
    <div className="text-xs font-semibold">{day}</div>
  </div>
);

export default function HomePage() {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const isLoading = isUserLoading || isUserDocLoading;

  if (isLoading || !user || !userData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader />
      </div>
    );
  }

  const userName = `${userData.firstName} ${userData.lastName}`.toUpperCase();

  return (
    <>
      <div className="relative min-h-screen bg-[#F0F7FF] pb-24">

        {/* ----- TOP HEADER BLUE CURVE ----- */}
        <div className="absolute top-0 left-0 right-0 h-44 bg-[#2D7EAE] rounded-b-[40px]" />

        <div className="relative p-4">

          {/* ----- PAGE TITLE ----- */}
          <h1 className="text-center text-xl font-extrabold text-white tracking-wide mt-2">
            HOME
          </h1>

          {/* ----- USER PROFILE CARD ----- */}
          <Card className="bg-[#D2EEFF] rounded-2xl p-5 shadow-xl mt-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="font-extrabold text-lg text-[#2D7EAE]">
                  HI, {userName}!
                </h2>

                <Progress value={50} className="h-2 my-2 bg-white" />

                <p className="text-sm font-bold text-[#2D7EAE]">Level {userData.level || 1}</p>
              </div>

              <Avatar className="w-16 h-16 border-4 border-white shadow-md">
                <AvatarImage src="/avatar.png" alt={userName} />
                <AvatarFallback>
                  {(userData.firstName?.[0] || '') + (userData.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
            </div>
          </Card>

          {/* ----- STREAK CARD ----- */}
          <Card className="rounded-2xl p-4 shadow-xl bg-white text-center">
            <h3 className="font-extrabold text-lg text-gray-800 mb-4">
              YOU'RE ON A 7 DAY STREAK!
            </h3>

            <div className="flex justify-around">
              <StreakDay day="MON" date="13" active />
              <StreakDay day="TUES" date="14" active />
              <StreakDay day="WED" date="15" active />
              <StreakDay day="THURS" date="16" current />
            </div>
          </Card>

          {/* ----- RECENTLY VISITED ----- */}
          <h3 className="text-center font-extrabold text-lg mt-8 mb-4 text-gray-700">
            RECENTLY VISITED
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course) => {
              const Icon = iconMap[course.title] || Computer;

              return (
                <Link href={`/course/${course.id}`} key={course.id}>
                  <Card className="bg-[#23374D] text-white rounded-2xl p-4 h-full flex flex-col justify-between shadow-md">
                    <div>
                      <div className="bg-[#3D4F63] p-3 rounded-lg inline-block mb-2">
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h4 className="font-bold">{course.title}</h4>
                    </div>

                    <div>
                      <Progress value={0} className="h-1.5 my-2 bg-gray-600" />
                      <p className="text-xs font-semibold text-gray-300">
                        0/10 COURSES
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* ----- LEADERBOARD BUTTON ----- */}
          <div className="text-center mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#38C96D] hover:bg-[#2db85f] text-white font-extrabold text-lg px-8 shadow-md"
            >
              <Link href="/leaderboard">VIEW LEADERBOARD</Link>
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}