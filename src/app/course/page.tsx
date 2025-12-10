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

    setDocumentNonBlocking(
      userDocRef,
      {
        bookmarkedCourses: isBookmarked
          ? arrayRemove(courseId.toString())
          : arrayUnion(courseId.toString())
      },
      { merge: true }
    );
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
      for (const key in newState) newState[key] = true;
      return newState;
    });
  };

  const handleDeselectAll = () => {
    setFilterState(prevState => {
      const newState = { ...prevState };
      for (const key in newState) newState[key] = false;
      return newState;
    });
  };

  if (isUserLoading || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-[#F2F4F7] text-foreground p-4 sm:p-6 pb-20">
        <div className="absolute top-0 left-0 right-0 h-40 bg-[#33C27F] rounded-b-3xl"></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft />
            </Button>
            <h1 className="text-xl font-headline font-semibold uppercase text-white">Courses</h1>
            <div className="w-10"></div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search"
                className="pl-10 bg-white shadow-sm border border-gray-200 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white shadow-sm border border-gray-200 rounded-xl">
                  <Filter className="w-5 h-5" />
                  <span className="ml-2">Filter</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSelectAll}>Select All</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDeselectAll}>Deselect All</DropdownMenuItem>
                <DropdownMenuSeparator />

                {courses.map(course => (
                  <DropdownMenuCheckboxItem
                    key={course.id}
                    checked={filterState[course.title]}
                    onCheckedChange={() => handleFilterChange(course.title)}
                  >
                    {course.title}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const Icon = iconMap[course.title] || Computer;
              const { completedModules, totalModules, progress } = getCourseProgress(course.id);

              const isDisabled = course.id !== 1;
              const isBookmarked = userData?.bookmarkedCourses?.includes(course.id.toString());

              const cardContent = (
                <CardContent className="p-4 flex gap-4">
                  {/* ICON BOX */}
                  <div className="w-24 h-24 shrink-0 rounded-xl flex flex-col items-center justify-center p-3 bg-[#1F7AE0] text-white">
                    <Icon className="w-10 h-10 mb-2" />
                    <h3 className="font-headline font-semibold text-xs leading-tight text-white">
                      {course.title.replace(' and ', ' & ')}
                    </h3>
                  </div>

                  {/* TEXT & ACTIONS */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h2 className="font-headline font-bold text-lg">{course.title}</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBookmark(course.id); }}
                        >
                          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-[#33C27F] fill-[#33C27F]' : 'text-gray-500'}`} />
                        </Button>
                      </div>

                      <p className="text-xs text-gray-600 mb-3">{course.description}</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full sm:w-auto rounded-full bg-[#33C27F] hover:bg-[#28A96C] text-white font-bold"
                        disabled={isDisabled}
                      >
                        STUDY
                      </Button>

                      <div className="flex items-center gap-2 text-xs">
                        <Progress value={progress} className="h-1 bg-gray-300 rounded-full flex-1" />
                        <span className="text-gray-500 text-xs">
                          {completedModules}/{totalModules} COURSES
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              );

              return (
                <Card
                  key={course.id}
                  className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-opacity ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isDisabled ? (
                    <div onClick={handleDisabledCourseClick}>{cardContent}</div>
                  ) : (
                    <Link href={`/course/${course.id}`}>{cardContent}</Link>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Coming Soon!</AlertDialogTitle>
            <AlertDialogDescription>
              This course is not yet available. Please check back later!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </>
  );
}