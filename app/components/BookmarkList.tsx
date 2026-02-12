'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from './SupabaseProvider';
import { deleteBookmark } from '../actions/bookmark';
import type { Bookmark } from '@/types';

interface Props {
  userId: string;
  initialBookmarks: Bookmark[];
}

export default function BookmarkList({ userId, initialBookmarks }: Props) {
  const { supabase } = useSupabase();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  useEffect(() => {
    // Subscribe to INSERT and DELETE events on the bookmarks table
    const channel = supabase
      .channel(`bookmarks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) => {
            const inserted = payload.new as Bookmark;
            if (prev.some((bookmark) => bookmark.id === inserted.id)) {
              return prev;
            }
            return [inserted, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const handleDelete = async (id: string) => {
    await deleteBookmark(id);
  };

  if (bookmarks.length === 0) {
    return <p className="text-gray-500">No bookmarks yet. Add one above!</p>;
  }

  return (
    <ul className="space-y-4">
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {bookmark.url}
            </a>
          </div>
          <button
            onClick={() => handleDelete(bookmark.id)}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
