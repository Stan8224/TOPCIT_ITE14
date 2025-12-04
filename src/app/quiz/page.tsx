
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { quizQuestions } from '@/lib/mock-data';
import { submitQuiz } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, arrayUnion, collection } from 'firebase/firestore';

type AnswerExplanation = {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

const createQuizSchema = (questions: typeof quizQuestions) => {
  const schemaObject = questions.reduce((acc, q) => {
    acc[q.id] = z.string({ required_error: 'Please select an answer.' });
    return acc;
  }, {} as Record<string, z.ZodString>);
  return z.object(schemaObject);
};

type QuizFormData = z.infer<ReturnType<typeof createQuizSchema>>;

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('module');
  const questions = quizQuestions.filter(q => q.moduleId === Number(moduleId)); 

  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ overallScore: number; results: AnswerExplanation[] } | null>(null);

  const quizSchema = createQuizSchema(questions);
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {},
  });

  const currentQuestion = questions[currentStep];

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    const result = await submitQuiz(data, questions);
    setIsSubmitting(false);

    if (result.success && result.overallScore !== undefined && result.results) {
      setQuizResult({ overallScore: result.overallScore, results: result.results });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Could not submit your quiz.',
      });
    }
  };

  const handleFinishQuiz = () => {
    if (!firestore || !user || !moduleId || !quizResult) return;

    const course = questions.find(q => q.moduleId === parseInt(moduleId))?.courseId;
    if (!course) return;

    // Save quiz attempt
    const attemptRef = doc(collection(firestore, `users/${user.uid}/quizAttempts`));
    setDocumentNonBlocking(attemptRef, {
      moduleId,
      score: quizResult.overallScore,
      results: quizResult.results,
      createdAt: serverTimestamp(),
    }, {});


    // Update course enrollment
    const enrollmentRef = doc(firestore, `users/${user.uid}/courseEnrollments`, course.toString());
    setDocumentNonBlocking(enrollmentRef, {
      courseId: course.toString(),
      completedModules: arrayUnion(parseInt(moduleId)),
      lastActivity: serverTimestamp(),
    }, { merge: true });

    router.push(`/course/${course}`);
  };


  const handleNext = async () => {
    const isValid = await form.trigger(currentQuestion.id as any);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
    if (!moduleId || questions.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
        <p className="text-muted-foreground mb-8">There are no questions for this module yet.</p>
        <Button asChild>
          <Link href="/course">Go to Courses</Link>
        </Button>
      </div>
    );
  }


  if (isSubmitting) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold font-headline mb-2">Grading your quiz...</h2>
        <p className="text-muted-foreground">Please wait while we analyze your answers.</p>
      </div>
    );
  }
  
  if (quizResult) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-3xl mx-auto bg-card/80 border-primary/20 rounded-2xl mb-8">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Quiz Results</CardTitle>
            <CardDescription>You scored</CardDescription>
            <p className="text-5xl font-bold text-primary">{quizResult.overallScore}%</p>
          </CardHeader>
        </Card>
        
        <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-headline font-bold">Review Your Answers</h2>
            {quizResult.results.map((res, index) => (
                <Card key={res.questionId} className="bg-card/60 border-border/30 rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-start">
                            <span className="flex-1">Question {index + 1}</span>
                            {res.isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-green-500 shrink-0"/>
                            ) : (
                                <XCircle className="w-6 h-6 text-red-500 shrink-0"/>
                            )}
                        </CardTitle>
                        <p className="text-base text-foreground pt-2">{res.question}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-muted-foreground">Your Answer:</p>
                            <p className={`pl-4 py-1 rounded ${res.isCorrect ? 'text-green-400' : 'text-red-400'}`}>{res.userAnswer}</p>
                        </div>
                        {!res.isCorrect && (
                            <div>
                                <p className="font-semibold text-muted-foreground">Correct Answer:</p>
                                <p className="text-green-400 pl-4 py-1">{res.correctAnswer}</p>
                            </div>
                        )}
                         <div>
                            <p className="font-semibold text-muted-foreground">Explanation:</p>
                            <p className="text-foreground/90 pl-4 py-1">{res.explanation}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="text-center mt-8 flex flex-col items-center gap-4">
            <Button onClick={handleFinishQuiz} size="lg" className="rounded-full">Finish & Save Progress</Button>
            <Button variant="link" asChild><Link href="/">Back to Home</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="max-w-3xl mx-auto mb-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Module
          </Button>
        </div>
      <Card className="max-w-3xl mx-auto bg-card/80 rounded-2xl border-border/30">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <Progress value={((currentStep + 1) / questions.length) * 100} className="mb-4 h-2" />
              <CardTitle className="font-headline text-2xl">
                Question {currentStep + 1} of {questions.length}
              </CardTitle>
              <CardDescription className="text-lg pt-4 text-foreground">{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name={currentQuestion.id as any}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        {currentQuestion.options.map((option) => (
                          <FormItem key={option.id} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-transparent bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 transition-all">
                            <FormControl>
                              <RadioGroupItem value={option.text} id={option.id} />
                            </FormControl>
                            <Label htmlFor={option.id} className="font-normal flex-1 cursor-pointer text-base text-foreground">
                              {option.text}
                            </Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="pt-2" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
                Previous
              </Button>
              {currentStep < questions.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Quiz
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
