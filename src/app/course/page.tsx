'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/mock-data';
import { Bookmark, Computer, Database, Pencil, BrainCircuit, Search, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useCollection, useFirebase, useMemoFirebase, setDocumentNonBlocking, useDoc } from '@/firebase/index';
import { collection, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import BottomNav from '@/components/layout/bottom-nav';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/common/loader';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Clarity from '@microsoft/clarity';
import styles from './courses.module.css'; // Import the CSS module

const projectId = "ugjiip6xda"

Clarity.init(projectId);

const iconMap: { [key: string]: React.ElementType } = {
  'Integrative Technologies': Computer,
  'Database and Design': Database,
  'UI/UX Theories and Concepts': Pencil,
  'Software Engineering': BrainCircuit,
};

export default function CoursesPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user]);

  const { data: userData } = useDoc(userDocRef);

  const [filterState, setFilterState] = useState<{ [key: string]: boolean }>(
    courses.reduce((acc, course) => {
      acc[course.title] = true;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  useEffect(() => {
    let newFilteredCourses = courses.filter(course => filterState[course.title]);

    if (searchTerm) {
      newFilteredCourses = newFilteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCourses(newFilteredCourses);
  }, [searchTerm, filterState]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const enrollmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/courseEnrollments`);
  }, [firestore, user]);

  const { data: enrollments } = useCollection(enrollmentsQuery);

  const getCourseProgress = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return { completedModules: 0, totalModules: 0, progress: 0 };

    const enrollment = enrollments?.find(e => e.courseId === courseId.toString());
    const totalModules = course.modules.length;
    const completedModules = enrollment?.completedModules?.length || 0;
    const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    
    return { completedModules, totalModules, progress };
  };

  const handleDisabledCourseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAlert(true);
  };
  
  const handleBookmark = (courseId: number) => {
    if (!userDocRef) return;
    const isBookmarked = userData?.bookmarkedCourses?.includes(courseId.toString());
    
    setDocumentNonBlocking(userDocRef, {
      bookmarkedCourses: isBookmarked ? arrayRemove(courseId.toString()) : arrayUnion(courseId.toString())
    }, { merge: true });
  };
  
  const handleFilterChange = (courseTitle: string) => {
    setFilterState(prevState => ({
      ...prevState,
      [courseTitle]: !prevState[courseTitle]
    }));
  };

  const handleSelectAll = () => {
    setFilterState(prevState => {
        const newState = { ...prevState };
        for (const key in newState) {
            newState[key] = true;
        }
        return newState;
    });
  };

  const handleDeselectAll = () => {
      setFilterState(prevState => {
          const newState = { ...prevState };
          for (const key in newState) {
              newState[key] = false;
          }
          return newState;
      });
  };

  if (isUserLoading || !user) {
    return (
      <div className={styles.loaderOverlay}>
        <Loader />
      </div>
    );
  }

  return (
    <>
    <div className={styles.coursesPage}>
      <div className={styles.gradientBackground}></div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
            <ArrowLeft />
          </Button>
          <h1 className={styles.pageTitle}>Courses</h1>
           <div className={styles.spacer}></div>
        </div>

        <div className={styles.searchFilterContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <Input 
              placeholder="Search" 
              className={styles.searchInput} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={styles.filterButton}>
                <Filter className={styles.filterIcon} />
                <span className={styles.filterButtonText}>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownMenuContent}>
              <DropdownMenuLabel className={styles.dropdownMenuLabel}>Filter by Course</DropdownMenuLabel>
              <DropdownMenuSeparator className={styles.dropdownMenuSeparator} />
              <DropdownMenuItem className={styles.dropdownMenuItem} onSelect={handleSelectAll}>Select All</DropdownMenuItem>
              <DropdownMenuItem className={styles.dropdownMenuItem} onSelect={handleDeselectAll}>Deselect All</DropdownMenuItem>
              <DropdownMenuSeparator className={styles.dropdownMenuSeparator} />
              {courses.map(course => (
                 <DropdownMenuCheckboxItem
                  key={course.id}
                  checked={filterState[course.title]}
                  onCheckedChange={() => handleFilterChange(course.title)}
                  className={styles.dropdownMenuCheckboxItem}
                >
                  {course.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className={styles.coursesGrid}>
          {filteredCourses.map((course) => {
            const Icon = iconMap[course.title] || Computer;
            const { completedModules, totalModules, progress } = getCourseProgress(course.id);
            const isDisabled = course.id !== 1;
            const isBookmarked = userData?.bookmarkedCourses?.includes(course.id.toString());
            
            const cardContent = (
              <CardContent className={styles.courseCardContent}>
                  <div className={`w-28 h-28 shrink-0 rounded-lg flex flex-col items-center justify-center text-center p-2 bg-${course.color}-500/20 text-${course.color}-500`}>
                    <Icon className={styles.courseIcon} />
                    <h3 className={styles.courseIconTitle}>{course.title.replace(' and ', ' & ')}</h3>
                  </div>
                  <div className={styles.courseDetails}>
                    <div>
                      <div className={styles.courseHeader}>
                        <h2 className={styles.courseMainTitle}>{course.title}</h2>
                        <button 
                          className={styles.bookmarkButton}
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            handleBookmark(course.id);
                          }}
                        >
                          <Bookmark className={`${styles.bookmarkIcon} ${isBookmarked ? styles.bookmarkIconActive : ''}`} />
                        </button>
                      </div>
                      <p className={styles.courseDescription}>{course.description}</p>
                    </div>
                    <div className={styles.courseActions}>
                       <Button 
                         size="sm" 
                         className={styles.studyButton} 
                         disabled={isDisabled}
                       >
                         STUDY
                       </Button>
                       <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>{completedModules}/{totalModules} COURSES</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
            );

            return (
              <Card 
                key={course.id} 
                className={`${styles.courseCard} ${isDisabled ? styles.courseCardDisabled : ''}`}
              >
                 {isDisabled ? (
                  <div onClick={handleDisabledCourseClick} className={styles.disabledCourseOverlay}>
                    {cardContent}
                  </div>
                ) : (
                  <Link href={`/course/${course.id}`}>
                    {cardContent}
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className={styles.alertDialogContent}>
          <AlertDialogHeader>
            <AlertDialogTitle className={styles.alertDialogTitle}>Coming Soon!</AlertDialogTitle>
            <AlertDialogDescription className={styles.alertDialogDescription}>
              This course is not yet available. Please check back later!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={styles.alertDialogFooter}>
            <AlertDialogAction 
              onClick={() => setShowAlert(false)}
              className={styles.alertDialogAction}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    <BottomNav />
    </>
  );
}