import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const isValidSupabaseUrl = (url) => /^https:\/\/.+\.supabase\.co\/?$/i.test(url);

// Will be null until URL + key are valid
const supabase = isValidSupabaseUrl(SUPABASE_URL) && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

export const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'course-images';
export const SUPABASE_VIDEO_BUCKET = import.meta.env.VITE_SUPABASE_VIDEO_BUCKET || SUPABASE_BUCKET;

/** Human-readable config status for admin UI */
export const getSupabaseConfigStatus = () => {
  const bucket = SUPABASE_BUCKET;
  const issues = [];

  if (!SUPABASE_URL) {
    issues.push('VITE_SUPABASE_URL is missing');
  } else if (!isValidSupabaseUrl(SUPABASE_URL)) {
    if (SUPABASE_URL.startsWith('sb_publishable_')) {
      issues.push('VITE_SUPABASE_URL has a publishable key — use your Project URL (https://xxxx.supabase.co)');
    } else {
      issues.push('VITE_SUPABASE_URL must look like https://YOUR_REF.supabase.co');
    }
  }

  if (!SUPABASE_KEY) {
    issues.push('VITE_SUPABASE_ANON_KEY is missing');
  } else if (SUPABASE_KEY.startsWith('sb_secret_')) {
    issues.push('VITE_SUPABASE_ANON_KEY must be the anon/publishable key — never the secret key in frontend');
  }

  if (!bucket) {
    issues.push('VITE_SUPABASE_BUCKET is missing');
  }

  return {
    ready: issues.length === 0 && !!supabase,
    bucket,
    urlConfigured: !!SUPABASE_URL,
    keyConfigured: !!SUPABASE_KEY,
    urlValid: isValidSupabaseUrl(SUPABASE_URL),
    issues,
  };
};

export default supabase;
