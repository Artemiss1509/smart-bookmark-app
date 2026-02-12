'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addBookmark(formData: FormData) {
  const supabase = await createClient();

  const url = formData.get('url') as string;
  const title = formData.get('title') as string;

  if (!url || !title) {
    throw new Error('URL and title are required');
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    redirect('/');
  }

  const { error } = await supabase.from('bookmarks').insert({
    user_id: userData.user.id,
    url,
    title,
  });

  if (error) {
    throw new Error(`Failed to add bookmark: ${error.message}`);
  }

  revalidatePath('/');
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    redirect('/');
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id); // extra safety

  if (error) {
    throw new Error(`Failed to delete bookmark: ${error.message}`);
  }

  revalidatePath('/');
}
