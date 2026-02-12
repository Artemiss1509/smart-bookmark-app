import { createClient } from '@/lib/supabase/server';
import AuthButton from './components/AuthButton';
import AddBookmarkForm from './components/AddBookmarkForm';
import BookmarkList from './components/BookmarkList';
import type { Bookmark } from '@/types';

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    // Not logged in – show sign-in button
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-8">Smart Bookmark App</h1>
        <p className="text-lg mb-8">
          Please sign in with Google to manage your bookmarks.
        </p>
        <AuthButton mode="signin" />
      </div>
    );
  }

  // User is logged in – fetch their bookmarks
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', data.user.id)
    .order('created_at', { ascending: false });

  if (bookmarksError) {
    console.error('Error fetching bookmarks:', bookmarksError);
    // fallback to empty array
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <AuthButton mode="signout" />
      </div>

      <AddBookmarkForm />
      <BookmarkList
        userId={data.user.id}
        initialBookmarks={(bookmarks as Bookmark[]) || []}
      />
    </div>
  );
}
