'use client';

import { useSupabase } from './SupabaseProvider';
import { useRouter } from 'next/navigation';

interface AuthButtonProps {
  mode: 'signin' | 'signout';
}

export default function AuthButton({ mode }: AuthButtonProps) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex gap-4">
      {mode === 'signin' ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <button
          onClick={handleSignOut}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Sign out
        </button>
      )}
    </div>
  );
}
