
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/mock-data';
import { ArrowLeft, Computer, CheckCircle, PlayCircle, History } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
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
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the course you're looking for.</p>
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
  }

  const completedModules = course.modules.filter(m => getModuleStatus(m.id) === 'Finished').length;
  const totalModules = course.modules.length;
  const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/30 to-transparent"></div>
      
      <div className="relative p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/course')}>
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-headline font-semibold uppercase">COURSE</h1>
          <div className="w-10"></div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <Computer className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold">{course.title}</h2>
                <p className="text-sm text-muted-foreground">{completedModules}/{totalModules} Courses</p>
                <Progress value={progress} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {course.modules.map((module, index) => {
            const status = getModuleStatus(module.id);
            return (
            <Card key={module.id} className="bg-card/60 backdrop-blur-sm border-border/30 rounded-xl hover:bg-card/90 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-4xl font-headline font-bold text-muted-foreground/50 w-10 text-center">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="font-headline font-semibold text-lg">{module.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {status === 'Finished' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <p className="text-sm text-muted-foreground">{status}</p>
                  </div>
                </div>
                {status === 'Finished' ? (
                   <Button asChild variant="secondary" size="sm">
                    <Link href={`/quiz/results?module=${module.id}`}>
                      <History className="w-4 h-4 mr-2" />
                      Results
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href={`/module/${module.id}`}>
                      Study
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )})}
        </div>
      </div>
    </div>
  );
}
