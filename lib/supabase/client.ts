import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './config';

export const createClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
