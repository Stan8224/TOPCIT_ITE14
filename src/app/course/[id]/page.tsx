'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/mock-data';
import { ArrowLeft, Computer, CheckCircle, PlayCircle, History } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase/index';
import { collection } from 'firebase/firestore';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);
  const course = courses.find((c) => c.id === courseId);
  const { firestore, user } = useFirebase();

  const enrollmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/courseEnrollments`);
  }, [firestore, user]);

  const { data: enrollments } = useCollection(enrollmentsQuery);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-[#F2F4F7]">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <p className="text-gray-600 mb-8">We couldn't find the course you're looking for.</p>
        <Button asChild>
          <Link href="/home">Go back to courses</Link>
        </Button>
      </div>
    );
  }

  const getModuleStatus = (moduleId: number) => {
    const enrollment = enrollments?.find(e => e.courseId === course.id.toString());
    if (enrollment?.completedModules?.includes(moduleId)) {
      return 'Finished';
    }
    return 'Ongoing';
  };

  const completedModules = course.modules.filter(m => getModuleStatus(m.id) === 'Finished').length;
  const totalModules = course.modules.length;
  const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <div className="relative min-h-screen bg-[#F2F4F7]">

      {/* HEADER BLUE BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-[#1C79A3] rounded-b-3xl"></div>

      <div className="relative px-4 sm:pt-2 sm:px-6 text-white">

        {/* TOP NAV */}
        <div className="flex items-center mt-0 !mt-0">
          <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/course')}
          className="text-white"
          >
          <ArrowLeft />
          </Button>
          </div>

        {/* SPACE BETWEEN HEADER AND MODULES */}
        <div className="h-12"></div>

        {/* COURSE HEADER CARD */}
        <Card className="bg-[#1C79A3] text-white rounded-3xl shadow-lg overflow-hidden mb-8 border-none">
          <CardContent className="p-6 flex items-center gap-4">

            <div className="bg-[#0E5F80] p-4 rounded-lg">
              <Computer className="w-10 h-10 text-white" />
            </div>

            <div>
              <h2 className="font-headline text-2xl font-bold">{course.title}</h2>
              <p className="opacity-90">{completedModules}/{totalModules}</p>

              <Progress 
                value={progress} 
                className="mt-2 h-2 bg-[#0E5F80] [&>div]:bg-[#2CC0FF]"
              />
            </div>

          </CardContent>
        </Card>

        {/* MODULES */}
        <div className="space-y-4">
          {course.modules.map((module, index) => {
            const status = getModuleStatus(module.id);

            return (
              <Card 
                key={module.id} 
                className={`rounded-xl shadow transition ${status === 'Finished' ? 'bg-white' : 'bg-[#C7DDF0]'}`}
              >
                <CardContent className="p-4 flex items-center gap-4">

                  {/* MODULE NUMBER */}
                  <div className="text-4xl font-bold w-14 text-center text-[#1C4E73]">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                  {/* MODULE DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[#0B2E46]">{module.title}</h3>

                    <div className="flex items-center gap-2 mt-1 text-[#3D5166]">
                      {status === 'Finished' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-blue-600" />
                      )}
                      <p className="text-sm">{status}</p>
                    </div>
                  </div>

                  {/* BUTTON */}
                  {status === 'Finished' ? (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/quiz?module=${module.id}`}>
                        <History className="w-4 h-4 mr-2" />
                        View Quiz
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="bg-[#1C79A3] hover:bg-[#16688A] text-white">
                      <Link href={`/module/${module.id}`}>Study</Link>
                    </Button>
                  )}

                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}