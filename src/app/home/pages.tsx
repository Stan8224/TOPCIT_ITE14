
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { courses } from '@/lib/mock-data';
import { collection, doc } from 'firebase/firestore';
import { BrainCircuit, Computer, Database, Pencil, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import BottomNav from '@/components/layout/bottom-nav';
import Link from 'next/link';
import Loader from '@/components/common/loader';

const iconMap: { [key: string]: React.ElementType } = {
  'Integrative Technologies': Computer,
  'Database and Design': Database,
  'UI/UX Theories and Concepts': Pencil,
  'Software Engineering': BrainCircuit,
};

const StreakDay = ({ day, date, active, current }: { day: string; date: string; active: boolean, current?: boolean }) => (
  <div className={`text-center rounded-lg p-2 w-16 ${active ? 'bg-green-300' : 'bg-gray-200'} ${current ? 'bg-primary text-primary-foreground' : ''}`}>
    <div className="font-bold text-lg">{date}</div>
    <div className="text-xs font-semibold">{day}</div>
  </div>
);

export default function HomePage() {
  const { auth, user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const enrollmentsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/courseEnrollments`);
  }, [firestore, user]);


  const getCourseProgress = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return { completedModules: 0, totalModules: 0, progress: 0 };

    const totalModules = course.modules.length;
    const completedModules = 0; // Hardcoded for now
    const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    
    return { completedModules, totalModules, progress };
  };

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

  const userName = `${userData.firstName} ${userData.lastName}`.toUpperCase();

  return (
    <>
      <div className="relative min-h-screen bg-[#FCEEEE] pb-20">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/30 to-transparent rounded-b-3xl"></div>
        
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-6">
              <div className="w-10"></div>
              <h1 className="text-xl font-headline font-bold text-primary-foreground bg-primary w-fit mx-auto px-6 py-2 rounded-xl">HOME</h1>
              <div className="w-10"></div>
          </div>
        
           <Card className="bg-secondary rounded-2xl p-4 shadow-lg mb-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="font-bold text-lg text-primary">HI, {userName}!</h2>
                <Progress value={50} className="h-2 my-1" />
                <p className="text-sm font-semibold text-muted-foreground">Level 1</p>
              </div>
              <Avatar className="w-16 h-16 border-4 border-white ml-4">
                <AvatarImage src="https://picsum.photos/seed/user-avatar/200" alt={userName}/>
                <AvatarFallback>{(userData.firstName?.[0] || '') + (userData.lastName?.[0] || '')}</AvatarFallback>
              </Avatar>
            </div>
          </Card>

          <Card className="rounded-2xl p-4 shadow-lg mb-6 text-center bg-card">
            <h3 className="font-bold text-lg mb-4">YOU'RE ON A 7 DAY STREAK!</h3>
            <div className="flex justify-around">
              <StreakDay day="MON" date="13" active={true} />
              <StreakDay day="TUES" date="14" active={true} />
              <StreakDay day="WED" date="15" active={true} />
              <StreakDay day="THURS" date="16" active={false} current={true}/>
            </div>
          </Card>

          <h3 className="text-center font-bold text-lg my-4 text-gray-700">RECENTLY VISITED</h3>

          <div className="grid grid-cols-2 gap-4">
            {courses.slice(0,2).map((course) => {
              const Icon = iconMap[course.title] || Computer;
              const { completedModules, totalModules, progress } = getCourseProgress(course.id);
              return (
              <Link href={`/course/${course.id}`} key={course.id}>
                <Card className={`bg-${course.color}-500/20 rounded-2xl p-4 h-full flex flex-col justify-between`}>
                    <div>
                        <div className={`p-3 rounded-lg inline-block bg-background/50 mb-2`}>
                            <Icon className={`w-8 h-8 text-${course.color}-500`}/>
                        </div>
                        <h4 className="font-bold text-foreground">{course.title}</h4>
                    </div>
                    <div>
                        <Progress value={progress} className="h-1.5 my-2" />
                        <p className="text-xs text-muted-foreground font-semibold">{completedModules}/{totalModules} COURSES</p>
                    </div>
                </Card>
              </Link>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="rounded-full bg-green-400 hover:bg-green-500 text-white font-bold text-lg">
              <Link href="/leaderboard">VIEW LEADERBOARD</Link>
            </Button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
