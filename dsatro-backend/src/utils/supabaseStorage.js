import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
export const SUPABASE_STORAGE_BUCKET = (process.env.SUPABASE_STORAGE_BUCKET || 'course-images').trim();

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export const isSupabaseConfigured = () => !!(supabaseAdmin && SUPABASE_STORAGE_BUCKET);

const getMissingSupabaseEnvVars = () => {
  const missing = [];
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!SUPABASE_STORAGE_BUCKET) missing.push('SUPABASE_STORAGE_BUCKET');
  return missing;
};

/**
 * Verify Supabase Storage env vars and that the configured bucket is reachable.
 */
export const checkSupabaseConnection = async () => {
  const missing = getMissingSupabaseEnvVars();
  if (missing.length) {
    throw new Error(`Missing ${missing.join(', ')} in backend .env`);
  }

  const { data, error } = await supabaseAdmin.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .list('', { limit: 1 });

  if (error) {
    throw new Error(error.message || 'Could not access Supabase storage bucket');
  }

  const maxVideoMb = Number(process.env.SUPABASE_MAX_VIDEO_MB) || 500;

  return {
    bucket: SUPABASE_STORAGE_BUCKET,
    objectCount: data?.length ?? 0,
    uploads: {
      images: 'thumbnails (max 5 MB)',
      videos: `videos (max ${maxVideoMb} MB)`,
      resumes: 'resumes (PDF/DOC/DOCX, max 5 MB)',
    },
  };
};

const sanitizeFilename = (name = 'file') => name.replace(/[^a-zA-Z0-9._-]/g, '_');

/**
 * Upload a file buffer to Supabase Storage using the service role key.
 */
export const uploadBufferToSupabase = async ({
  buffer,
  filename,
  mimetype,
  folder = 'uploads',
  bucket = SUPABASE_STORAGE_BUCKET,
}) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured on the server. Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET to backend .env');
  }

  const path = `${folder}/${Date.now()}_${sanitizeFilename(filename)}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: mimetype || 'application/octet-stream',
      upsert: false,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(error.message || 'Supabase upload failed');
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error('Could not build public URL for uploaded file');
  }

  return {
    publicUrl: data.publicUrl,
    path,
    bucket,
  };
};

/**
 * Derive storage object path from a Supabase public URL.
 */
export const extractPathFromPublicUrl = (publicUrl, bucket = SUPABASE_STORAGE_BUCKET) => {
  if (!publicUrl || typeof publicUrl !== 'string') return '';
  const marker = `/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return '';
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
};

/**
 * Generate a time-limited signed URL for a stored file.
 * Falls back to null if Supabase is not configured or path is missing.
 */
export const createSignedUrl = async (path, bucket = SUPABASE_STORAGE_BUCKET, expiresInSeconds = 3600) => {
  if (!supabaseAdmin || !path) return null;
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
};

/**
 * Remove a file from Supabase Storage.
 */
export const deleteFromSupabase = async ({ path, bucket = SUPABASE_STORAGE_BUCKET }) => {
  if (!path) return false;
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured on the server');
  }

  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(error.message || 'Supabase delete failed');
  }

  return true;
};
