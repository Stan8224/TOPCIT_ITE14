
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase/index';
import BottomNav from '@/components/layout/bottom-nav';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { signOut } from 'firebase/auth';
import Loader from '@/components/common/loader';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const { auth, user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const isLoading = isUserLoading || isUserDocLoading;

  if (isLoading || !user || !userData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader />
      </div>
    );
  }
  
  const userName = `${userData.firstName} ${userData.lastName}`.toUpperCase();


  return (
    <>
      <div className="relative min-h-screen bg-accent text-foreground pb-20">
         <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/30 to-transparent rounded-b-3xl"></div>
        
        <div className="relative p-4 sm:p-6">
           <div className="flex items-center justify-center mb-6">
              <h1 className="text-xl font-headline font-bold text-primary-foreground bg-primary w-fit mx-auto px-6 py-2 rounded-xl">PROFILE</h1>
          </div>

          <div className="relative mt-24 text-center">
            <Avatar className="w-28 h-28 mx-auto absolute -top-20 left-1/2 -translate-x-1/2 border-4 border-white mb-4">
              <AvatarImage src="https://picsum.photos/seed/user-avatar/200" alt={userName} />
              <AvatarFallback>{(userData.firstName?.[0] || '') + (userData.lastName?.[0] || '')}</AvatarFallback>
            </Avatar>
            <div className="bg-secondary rounded-3xl pt-16 p-6 text-secondary-foreground shadow-lg mb-8">
              <h2 className="text-2xl font-bold font-headline tracking-wide text-primary">HI, {userName}!</h2>
              <p className="text-sm font-medium text-muted-foreground mt-1">Level 1</p>
            </div>
          </div>

          <div className="text-center mb-6">
              <h2 className="text-xl font-headline font-bold text-gray-700">BADGES</h2>
          </div>
          
          <div className="bg-background/70 backdrop-blur-sm rounded-3xl p-6 min-h-[120px] flex items-center justify-center mb-8">
            <p className="text-muted-foreground">No badges earned yet.</p>
          </div>

          <div className="text-center">
             <Button
                onClick={handleLogout}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-xl px-12 py-6 h-auto shadow-md"
              >
                LOGOUT
              </Button>
          </div>

        </div>
      </div>
      <BottomNav />
    </>
  );
}
