import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { CheckCircle2, Film, Lock, PlayCircle, Trash2, Upload } from 'lucide-react';
import toast from '@/utils/toast';
import { uploadVideo } from '../../utils/uploadMedia';
import {
  btnSecondarySm,
  fieldHint,
  fieldInput,
  fieldLabel,
  queuedRow,
  sectionCard,
} from './courseFormUi';

const emptyIntroForm = () => ({
  title: '',
  bunnyVideoId: '',
  storagePath: '',
  storageBucket: '',
  videoProvider: 'supabase',
});

const emptyLessonForm = () => ({
  title: '',
  bunnyVideoId: '',
  storagePath: '',
  storageBucket: '',
  videoProvider: 'supabase',
});

function buildDraft({
  localId,
  title,
  visibility,
  sortOrder,
  bunnyVideoId,
  storagePath,
  storageBucket,
  file,
  displayLabel,
}) {
  return {
    localId,
    title,
    bunnyVideoId: bunnyVideoId || '',
    videoUrl: bunnyVideoId || '',
    storagePath: storagePath || '',
    storageBucket: storageBucket || '',
    videoProvider: 'supabase',
    visibility,
    sortOrder,
    file: file || null,
    displayLabel,
  };
}

function lessonNumber(videos) {
  return videos.filter((v) => v.visibility !== 'public').length + 1;
}

const CourseInitialVideosPanel = forwardRef(function CourseInitialVideosPanel(_props, ref) {
  const [videos, setVideos] = useState([]);
  const [introForm, setIntroForm] = useState(emptyIntroForm);
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [introUploading, setIntroUploading] = useState(false);
  const [lessonUploading, setLessonUploading] = useState(false);
  const introFileRef = useRef(null);
  const lessonFileRef = useRef(null);

  const openIntroPicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!introUploading) introFileRef.current?.click();
  };

  const openLessonPicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!lessonUploading) lessonFileRef.current?.click();
  };

  const queuedIntro = videos.find((v) => v.visibility === 'public');
  const queuedLessons = videos.filter((v) => v.visibility !== 'public');

  const reset = () => {
    setVideos([]);
    setIntroForm(emptyIntroForm());
    setLessonForm(emptyLessonForm());
    setIntroUploading(false);
    setLessonUploading(false);
  };

  const collectVideos = () => {
    const collected = [...videos];
    const hasIntro = collected.some((v) => v.visibility === 'public');

    if (!hasIntro && introForm.bunnyVideoId) {
      collected.push(
        buildDraft({
          localId: `pending-intro-${Date.now()}`,
          title: introForm.title.trim() || 'Course Introduction',
          visibility: 'public',
          sortOrder: 0,
          bunnyVideoId: introForm.bunnyVideoId,
          storagePath: introForm.storagePath,
          storageBucket: introForm.storageBucket,
          displayLabel: 'Intro video uploaded',
        })
      );
    }

    if (lessonForm.bunnyVideoId && lessonForm.title.trim()) {
      const exists = collected.some(
        (v) => v.visibility !== 'public' && v.title === lessonForm.title.trim()
      );
      if (!exists) {
        collected.push(
          buildDraft({
            localId: `pending-lesson-${Date.now()}`,
            title: lessonForm.title.trim(),
            visibility: 'enrolled',
            sortOrder: collected.filter((v) => v.visibility !== 'public').length,
            bunnyVideoId: lessonForm.bunnyVideoId,
            storagePath: lessonForm.storagePath,
            storageBucket: lessonForm.storageBucket,
            displayLabel: `Video lesson ${lessonNumber(collected)}`,
          })
        );
      }
    }

    return collected.sort((a, b) => {
      if (a.visibility === 'public' && b.visibility !== 'public') return -1;
      if (b.visibility === 'public' && a.visibility !== 'public') return 1;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
  };

  useImperativeHandle(ref, () => ({
    getVideos: collectVideos,
    isUploading: () => introUploading || lessonUploading,
    reset,
  }));

  const uploadFile = async (file, kind) => {
    const maxMb = 500;
    if (file.size > maxMb * 1024 * 1024) {
      throw new Error(`Video must be under ${maxMb} MB`);
    }
    return uploadVideo(file, 'videos');
  };

  const handleIntroFile = async (e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    setIntroUploading(true);
    try {
      const uploaded = await uploadFile(file, 'intro');
      const title = introForm.title.trim() || 'Course Introduction';

      setVideos((current) => {
        if (current.some((v) => v.visibility === 'public')) return current;
        return [
          ...current,
          buildDraft({
            localId: `intro-${Date.now()}`,
            title,
            visibility: 'public',
            sortOrder: 0,
            bunnyVideoId: uploaded.publicUrl,
            storagePath: uploaded.path,
            storageBucket: uploaded.bucket,
            displayLabel: 'Intro video uploaded',
          }),
        ];
      });
      setIntroForm(emptyIntroForm());
      toast.success('Intro video uploaded');
    } catch (err) {
      toast.error(err.message || 'Intro video upload failed');
      e.target.value = '';
    } finally {
      setIntroUploading(false);
    }
  };

  const handleLessonFile = async (e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    setLessonUploading(true);
    try {
      const uploaded = await uploadFile(file, 'lesson');
      const num = lessonNumber(videos);
      const title = lessonForm.title.trim() || `Video lesson ${num}`;

      setVideos((current) => [
        ...current,
        buildDraft({
          localId: `lesson-${Date.now()}-${current.length}`,
          title,
          visibility: 'enrolled',
          sortOrder: current.filter((v) => v.visibility !== 'public').length,
          bunnyVideoId: uploaded.publicUrl,
          storagePath: uploaded.path,
          storageBucket: uploaded.bucket,
          displayLabel: `Video lesson ${num}`,
        }),
      ]);
      setLessonForm(emptyLessonForm());
      toast.success(`Video lesson ${num} uploaded`);
    } catch (err) {
      toast.error(err.message || 'Lesson upload failed');
      e.target.value = '';
    } finally {
      setLessonUploading(false);
    }
  };

  const addLessonFromForm = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (lessonUploading) {
      toast.error('Please wait for the upload to finish.');
      return;
    }
    if (!lessonForm.bunnyVideoId) {
      toast.error('Upload a lesson video file first.');
      return;
    }
    const num = lessonNumber(videos);
    const title = lessonForm.title.trim() || `Video lesson ${num}`;

    setVideos((current) => [
      ...current,
      buildDraft({
        localId: `lesson-${Date.now()}`,
        title,
        visibility: 'enrolled',
        sortOrder: current.filter((v) => v.visibility !== 'public').length,
        bunnyVideoId: lessonForm.bunnyVideoId,
        storagePath: lessonForm.storagePath,
        storageBucket: lessonForm.storageBucket,
        displayLabel: `Video lesson ${num}`,
      }),
    ]);
    setLessonForm(emptyLessonForm());
    toast.success(`Video lesson ${num} added`);
  };

  const removeVideo = (localId) => {
    setVideos((current) => current.filter((v) => v.localId !== localId));
  };

  return (
    <div className="space-y-4 font-body">
      <p className="text-xs leading-relaxed text-slate-500">
        Upload files below — they queue automatically when ready. Intro shows on the public course page; lessons unlock after enrolment approval.
      </p>

      {/* Intro */}
      <div className={sectionCard}>
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <PlayCircle size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900">Introductory video</h4>
            <p className="mt-0.5 text-xs text-slate-500">Optional · 1 max · shown above Overview on the course page</p>
          </div>
        </div>

        {queuedIntro ? (
          <div className={queuedRow}>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{queuedIntro.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={14} aria-hidden />
                {queuedIntro.displayLabel || 'Intro video uploaded'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeVideo(queuedIntro.localId)}
              className="inline-flex items-center gap-1 self-start rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} aria-hidden />
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className={fieldLabel} htmlFor="intro-title">Intro title (optional)</label>
              <input
                id="intro-title"
                type="text"
                value={introForm.title}
                onChange={(e) => setIntroForm((prev) => ({ ...prev, title: e.target.value }))}
                className={fieldInput}
                placeholder="Course Introduction"
                autoComplete="off"
              />
            </div>
            <div>
              <p className={fieldLabel}>Upload intro video</p>
              <button
                type="button"
                onClick={openIntroPicker}
                disabled={introUploading}
                className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-white px-4 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <Upload size={20} className="text-slate-400" aria-hidden />
                <span className="text-sm font-medium text-slate-700">
                  {introUploading ? 'Uploading intro video…' : 'Choose video file'}
                </span>
                <span className="text-xs text-slate-400">MP4, WebM · max 500 MB</span>
              </button>
              <input
                ref={introFileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleIntroFile}
                onClick={(e) => e.stopPropagation()}
                disabled={introUploading}
                tabIndex={-1}
                aria-hidden
              />
            </div>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className={sectionCard}>
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <Lock size={16} aria-hidden />
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900">Main course videos</h4>
            <p className="mt-0.5 text-xs text-slate-500">
              {queuedLessons.length} lesson{queuedLessons.length === 1 ? '' : 's'} queued · unlocked after admin approval
            </p>
          </div>
        </div>

        {queuedLessons.length > 0 && (
          <ul className="mb-4 space-y-2">
            {queuedLessons.map((video, index) => (
              <li key={video.localId} className={queuedRow}>
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{video.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Film size={13} aria-hidden />
                      {video.displayLabel || `Video lesson ${index + 1}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVideo(video.localId)}
                  className="inline-flex items-center gap-1 self-start rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} aria-hidden />
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-3">
          <div>
            <label className={fieldLabel} htmlFor="lesson-title">Lesson title (optional)</label>
            <input
              id="lesson-title"
              type="text"
              value={lessonForm.title}
              onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
              className={fieldInput}
              placeholder={`Video lesson ${lessonNumber(videos)}`}
              autoComplete="off"
            />
            <p className={fieldHint}>Leave blank to use &ldquo;Video lesson {lessonNumber(videos)}&rdquo;</p>
          </div>
          <div>
            <p className={fieldLabel}>Upload lesson video</p>
            <button
              type="button"
              onClick={openLessonPicker}
              disabled={lessonUploading}
              className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-white px-4 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <Upload size={20} className="text-slate-400" aria-hidden />
              <span className="text-sm font-medium text-slate-700">
                {lessonUploading ? 'Uploading lesson…' : 'Choose video file'}
              </span>
              <span className="text-xs text-slate-400">Adds as Video lesson {lessonNumber(videos)}</span>
            </button>
            <input
              ref={lessonFileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleLessonFile}
              onClick={(e) => e.stopPropagation()}
              disabled={lessonUploading}
              tabIndex={-1}
              aria-hidden
            />
          </div>
          {lessonForm.bunnyVideoId && !lessonUploading ? (
            <button type="button" className={btnSecondarySm} onClick={addLessonFromForm}>
              Add queued lesson manually
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default CourseInitialVideosPanel;
