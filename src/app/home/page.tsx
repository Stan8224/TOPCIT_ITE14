'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFirebase } from '@/firebase/index';
import { useDoc } from '@/firebase/firestore/use-doc';
import { courses } from '@/lib/mock-data';
import { collection, doc } from 'firebase/firestore';
import { BrainCircuit, Computer, Database, Pencil, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import BottomNav from '@/components/layout/bottom-nav';
import Link from 'next/link';
import Loader from '@/components/common/loader';
import styles from './home.module.css'; // Import the CSS module


const iconMap: { [key: string]: React.ElementType } = {
  'Integrative Technologies': Computer,
  'Database and Design': Database,
  'UI/UX Theories and Concepts': Pencil,
  'Software Engineering': BrainCircuit,
};

const StreakDay = ({ day, date, active, current }: { day: string; date: string; active: boolean, current?: boolean }) => {
  const getDayClass = () => {
    if (current) return `${styles.streakDay} ${styles.streakDayCurrent}`;
    if (active) return `${styles.streakDay} ${styles.streakDayActive}`;
    return `${styles.streakDay} ${styles.streakDayInactive}`;
  };

  return (
    <div className={getDayClass()}>
      <div className={styles.streakDate}>{date}</div>
      <div className={styles.streakDayName}>{day}</div>
    </div>
  );
};

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
      <div className={styles.loaderOverlay}>
        <Loader />
      </div>
    );
  }

  const userName = `${userData.firstName} ${userData.lastName}`.toUpperCase();

  return (
    <>
      <div className={styles.homePage}>
        <div className={styles.gradientBackground}></div>
        
        <div className={styles.content}>
          <div className={styles.header}>
              <div className={styles.headerSpacer}></div>
              <h1 className={styles.pageTitle}>HOME</h1>
              <div className={styles.headerSpacer}></div>
          </div>
        
          <Card className={styles.welcomeCard}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeText}>
                <h2 className={styles.welcomeGreeting}>HI, {userName}!</h2>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '50%' }} />
                </div>
                <p className={styles.levelText}>Level 1</p>
              </div>
              <Avatar className={styles.avatar}>
                <AvatarImage src="https://picsum.photos/seed/user-avatar/200" alt={userName}/>
                <AvatarFallback>
                  {(userData.firstName?.[0] || '') + (userData.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
            </div>
          </Card>

          <Card className={styles.streakCard}>
            <h3 className={styles.streakTitle}>YOU'RE ON A 7 DAY STREAK!</h3>
            <div className={styles.streakDays}>
              <StreakDay day="MON" date="13" active={true} />
              <StreakDay day="TUES" date="14" active={true} />
              <StreakDay day="WED" date="15" active={true} />
              <StreakDay day="THURS" date="16" active={false} current={true}/>
            </div>
          </Card>

          <h3 className={styles.recentlyVisitedTitle}>RECENTLY VISITED</h3>

          <div className={styles.coursesGrid}>
            {courses.slice(0,2).map((course) => {
              const Icon = iconMap[course.title] || Computer;
              const { completedModules, totalModules, progress } = getCourseProgress(course.id);
              
              return (
                <Link href={`/course/${course.id}`} key={course.id} className={styles.courseCard}>
                  <div className={styles.courseCardContent}>
                    <div>
                      <div className={`${styles.courseIconContainer} bg-${course.color}-500/20`}>
                        <Icon className={`${styles.courseIcon} text-${course.color}-500`}/>
                      </div>
                      <h4 className={styles.courseTitle}>{course.title}</h4>
                    </div>
                    <div>
                      <div className={styles.courseProgressBar}>
                        <div 
                          className={styles.courseProgressFill} 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className={styles.courseProgressText}>
                        {completedModules}/{totalModules} COURSES
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className={styles.leaderboardButtonContainer}>
            <Button asChild size="lg" className={styles.leaderboardButton}>
              <Link href="/leaderboard">VIEW LEADERBOARD</Link>
            </Button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}