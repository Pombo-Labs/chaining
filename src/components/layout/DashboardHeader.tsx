'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import type { User } from 'firebase/auth';

interface DashboardHeaderProps {
  user: User | null;
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ 
  user, 
  title = "Chain Builder",
  subtitle 
}: DashboardHeaderProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await signOutUser();
    if (!error) {
      router.push('/');
    }
    setSigningOut(false);
  };

  const defaultSubtitle = user ? `Welcome back, ${user.displayName || user.email?.split('@')[0]}` : 'Loading...';

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-black">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {subtitle || defaultSubtitle}
          </p>
        </div>
        <Button
          onClick={handleSignOut}
          disabled={signingOut || !user}
          variant="outline"
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </header>
  );
}

export default DashboardHeader;
