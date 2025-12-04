
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useFirebase } from '@/firebase/index';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.417 9.562C34.643 6.048 29.643 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691c-1.959 3.25-3.061 6.966-3.061 10.999c0 4.033 1.102 7.749 3.061 10.999L12.7 30.565C11.087 27.917 10 24.961 10 21.999c0-2.962 1.087-5.918 2.7-8.565L6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.417 9.562C34.643 6.048 29.643 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 48 48">
    <path
      fill="#039be5"
      d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20s20-8.95 20-20S35.05 4 24 4zm4.5 14H26v-2c0-1.1.9-2 2-2h2V8h-3c-3.31 0-6 2.69-6 6v4h-3v4h3v10h4V26h3l1-4z"
    />
  </svg>
);

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/home');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      initiateEmailSignIn(auth, email, password);
    }
  };
  
  if (isUserLoading || user) {
    return <div className="fixed inset-0 bg-background z-50" />;
  }

  return (
    <div className="flex h-screen flex-col bg-secondary">
      <div className="flex h-1/4 items-center justify-center text-center text-foreground">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Login</h1>
      </div>
      <div className="flex-1 rounded-t-[3rem] bg-background p-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="-mt-16 mb-8 flex justify-center">
            <div className="rounded-2xl bg-primary px-12 py-3 text-center text-primary-foreground shadow-lg">
              <h2 className="text-xl font-bold">WELCOME BACK!</h2>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="janesmarie2345@slu.edu.ph" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border-2 border-primary/20 bg-white/50 px-4 py-3 text-lg backdrop-blur-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password"className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="text-right">
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-lg bg-primary py-3 text-lg font-bold text-primary-foreground shadow-md hover:bg-primary/90">
              LOGIN
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-4 shrink text-sm font-medium text-gray-600">OR</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="flex justify-center gap-6">
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2 border-gray-300 bg-white shadow-sm">
              <GoogleIcon className="h-7 w-7" />
            </Button>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2 border-gray-300 bg-white shadow-sm">
              <FacebookIcon className="h-10 w-10" />
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
