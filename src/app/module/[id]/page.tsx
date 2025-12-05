
'use client';

import { useParams, useRouter } from 'next/navigation';
import { courses } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, arrayUnion } from 'firebase/firestore';

export default function ModulePage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = Number(params.id);
  const { firestore, user } = useFirebase();

  let course;
  let module;
  let moduleIndex = -1;

  for (const c of courses) {
    const foundModuleIndex = c.modules.findIndex((m) => m.id === moduleId);
    if (foundModuleIndex !== -1) {
      course = c;
      module = c.modules[foundModuleIndex];
      moduleIndex = foundModuleIndex;
      break;
    }
  }

  const isLastModule = course ? moduleIndex === course.modules.length - 1 : false;

  if (!module || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Module not found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the module you're looking for.</p>
        <Button asChild>
          <Link href="/course">Go back to courses</Link>
        </Button>
      </div>
    );
  }

  const handleFinishModule = () => {
    if (!firestore || !user || !course) return;
    
    const enrollmentRef = doc(firestore, `users/${user.uid}/courseEnrollments`, course.id.toString());
    setDocumentNonBlocking(enrollmentRef, {
      courseId: course.id.toString(),
      completedModules: arrayUnion(moduleId),
      lastActivity: serverTimestamp(),
    }, { merge: true });

    router.push(`/course/${course.id}`);
  };


  const nextModule = !isLastModule && moduleIndex !== -1 && course && moduleIndex < course.modules.length - 1 
    ? course.modules[moduleIndex + 1] 
    : null;

  return (
    <div className="relative min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-headline font-semibold uppercase">{module.title}</h1>
        <div className="w-10"></div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-primary/20 rounded-2xl overflow-hidden mb-8">
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-start gap-4">
                 <div className="bg-muted p-3 rounded-lg">
                    <BookOpen className="w-8 h-8 text-primary" />
                 </div>
                 <span>{module.title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base text-muted-foreground prose max-w-none">
          {module.content.map((item, index) => {
            if (item.type === 'header') {
              return <h3 key={index} className="text-xl font-headline font-semibold text-foreground pt-4">{item.text}</h3>;
            }
            if (item.type === 'list') {
              return (
                <ul key={index} className="space-y-2 list-none pl-0">
                  {item.items?.map((listItem, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                        <span>{listItem}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (item.text || '').split('\n').map((paragraph, pIndex) => (
              <p key={`${index}-${pIndex}`} className="whitespace-pre-line">{paragraph}</p>
            ));
          })}
        </CardContent>
      </Card>
      
      {moduleId !== 1 && (
        <div className="text-center">
          {isLastModule ? (
            <Button size="lg" onClick={handleFinishModule} className="rounded-full font-bold text-lg">
                Finish
            </Button>
          ) : (
            <Button size="lg" asChild className="rounded-full font-bold text-lg">
              <Link href={`/quiz?module=${module.id}`}>Start Quiz</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
