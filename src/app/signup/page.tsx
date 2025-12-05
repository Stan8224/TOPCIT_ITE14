
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    birthday: z.string().min(1, 'Birthday is required'),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number'),
    address: z.string().min(1, 'Address is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { auth, firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      birthday: '',
      phoneNumber: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/course');
    }
  }, [user, isUserLoading, router]);

  const handleSignUp = async (data: SignupFormData) => {
    if (!auth || !firestore) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const newUser = userCredential.user;

      if (newUser) {
        const userDocRef = doc(firestore, 'users', newUser.uid);
        const userData = {
          id: newUser.uid,
          firstName: data.firstName,
          middleName: data.middleName || '',
          lastName: data.lastName,
          birthday: data.birthday,
          phoneNumber: data.phoneNumber,
          address: data.address,
          email: data.email,
        };
        // This will not block and handles errors via the global error handler
        setDocumentNonBlocking(userDocRef, userData, {});
      }
    } catch (error) {
      console.error('Signup Error:', error);
      // You could use a toast notification here to show the error to the user
    }
  };

  if (isUserLoading || user) {
    return <div className="fixed inset-0 bg-background z-50" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary">
      <div className="flex h-1/4 items-center justify-center text-center text-foreground">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Sign Up</h1>
      </div>
      <div className="flex-1 rounded-t-[3rem] bg-background p-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="-mt-16 mb-8 flex justify-center">
            <div className="rounded-2xl bg-primary px-12 py-3 text-center text-primary-foreground shadow-lg">
              <h2 className="text-xl font-bold">CREATE ACCOUNT</h2>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignUp)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          {...field}
                          className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <Input
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute inset-y-0 right-0 h-full px-3 text-gray-600 hover:bg-transparent"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...field}
                            className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute inset-y-0 right-0 h-full px-3 text-gray-600 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-lg font-bold text-primary-foreground shadow-md hover:bg-primary/90"
                disabled={form.formState.isSubmitting}
              >
                SIGN UP
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
