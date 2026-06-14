import API_BASE from './api';

const parseResponse = async (res) => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text };
  }
};

const postFile = async ({ endpoint, file, folder, token }) => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/upload/${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await parseResponse(res);
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }

  return data;
};

/** Upload course thumbnail via backend → Supabase → returns public URL */
export const uploadImage = async (file, folder = 'thumbnails') => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Admin login required to upload images.');

  const data = await postFile({ endpoint: 'image', file, folder, token });
  return data.publicUrl || data.url;
};

/** Upload course video via backend → Supabase */
export const uploadVideo = async (file, folder = 'videos') => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Admin login required to upload videos.');

  const data = await postFile({ endpoint: 'video', file, folder, token });
  const publicUrl = data.publicUrl || data.videoUrl || data.url;

  return {
    publicUrl,
    path: data.path,
    bucket: data.bucket,
  };
};

/** Upload job applicant resume via backend → Supabase */
export const uploadResume = async (file) => {
  const data = await postFile({ endpoint: 'resume', file });
  return data.resumeUrl || data.publicUrl || data.url;
};

/** Check if backend Supabase storage is configured */
export const fetchUploadStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/upload/status`);
    const data = await parseResponse(res);
    if (!res.ok || !data.success) {
      return { ready: false, bucket: '', issues: ['Could not reach upload status endpoint'] };
    }

    return {
      ready: !!data.configured,
      bucket: data.bucket || '',
      issues: data.configured ? [] : ['Backend Supabase is not configured. Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET to backend .env'],
    };
  } catch {
    return { ready: false, bucket: '', issues: ['Upload API is unreachable'] };
  }
};

export const isSupabaseReady = () => true;
