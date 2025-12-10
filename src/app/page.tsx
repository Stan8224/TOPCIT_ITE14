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
import styles from './login.module.css';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/home');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      await initiateEmailSignIn(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      // You could add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return <div className={styles.loadingOverlay} />;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginHeader}>
        <h1 className={styles.loginTitle}>Login</h1>
      </div>
      <div className={styles.loginContent}>
        <div className={styles.loginContainer}>
          <div className={styles.welcomeBanner}>
            <div className={styles.welcomeBox}>
              <h2 className={styles.welcomeText}>WELCOME BACK!</h2>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <Label htmlFor="email" className={styles.formLabel}>Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="janesmarie2345@slu.edu.ph" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <Label htmlFor="password" className={styles.formLabel}>Password</Label>
              <div className={styles.passwordInputWrapper}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.formInput} ${styles.passwordInput}`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={styles.passwordToggleButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              <div className={styles.forgotPasswordLink}>
                <Link href="#" className={styles.forgotPasswordText}>
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>
          </form>

          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine}></div>
          </div>

          <div className={styles.socialButtonsContainer}>
            <Button 
              variant="outline" 
              size="icon" 
              className={styles.socialButton}
              disabled={isLoading}
            >
              <GoogleIcon className={styles.googleIcon} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className={styles.socialButton}
              disabled={isLoading}
            >
              <FacebookIcon className={styles.facebookIcon} />
            </Button>
          </div>

          <p className={styles.signupContainer}>
            Don't have an account?{' '}
            <Link href="/signup" className={styles.signupLink}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}