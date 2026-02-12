const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'placeholder-anon-key';

const isHttpUrl = (value: string | undefined) =>
  Boolean(value && /^https?:\/\//.test(value));

export const getSupabaseEnv = () => {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isHttpUrl(supabaseUrl) || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Supabase env vars are missing/invalid. Falling back to placeholder values for local build.'
      );
    }
    supabaseUrl = FALLBACK_SUPABASE_URL;
    supabaseAnonKey = FALLBACK_SUPABASE_ANON_KEY;
  }

  return { supabaseUrl, supabaseAnonKey } as {
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
};
