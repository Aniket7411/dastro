import { fieldInput, fieldLabel, fieldHint, btnSecondary } from './courseFormUi';

function ModuleEditor({ module, index, onChange, onRemove }) {
  const lessonsText = Array.isArray(module.lessons) ? module.lessons.join('\n') : '';

  return (
    <div className="rounded-lg border border-site-accent-dark/12 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-site-muted">Module {index + 1}</span>
        <button type="button" className={btnSecondary} onClick={onRemove}>
          Remove
        </button>
      </div>
      <div className="form-group">
        <label className={fieldLabel}>Module title</label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => onChange({ ...module, title: e.target.value })}
          className={fieldInput}
          placeholder="e.g. Module 1 — Planets & Signs"
        />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className={fieldLabel}>Lessons (one per line)</label>
        <textarea
          value={lessonsText}
          onChange={(e) =>
            onChange({
              ...module,
              lessons: e.target.value
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean),
            })
          }
          className={`${fieldInput} min-h-[72px] resize-y`}
          rows={3}
          placeholder={'The 9 planets\nThe 12 zodiac signs'}
        />
      </div>
    </div>
  );
}

function FaqEditor({ faq, index, onChange, onRemove }) {
  return (
    <div className="rounded-lg border border-site-accent-dark/12 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-site-muted">FAQ {index + 1}</span>
        <button type="button" className={btnSecondary} onClick={onRemove}>
          Remove
        </button>
      </div>
      <div className="form-group">
        <label className={fieldLabel}>Question</label>
        <input
          type="text"
          value={faq.question}
          onChange={(e) => onChange({ ...faq, question: e.target.value })}
          className={fieldInput}
        />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className={fieldLabel}>Answer</label>
        <textarea
          value={faq.answer}
          onChange={(e) => onChange({ ...faq, answer: e.target.value })}
          className={`${fieldInput} min-h-[64px] resize-y`}
          rows={2}
        />
      </div>
    </div>
  );
}

export default function CourseExtendedFields({ formData, setFormData, isLive }) {
  const curriculum = formData.curriculum || [];
  const faqs = formData.faqs || [];
  const batch = formData.batchDetails || {};

  const setBatch = (patch) =>
    setFormData((prev) => ({
      ...prev,
      batchDetails: { ...(prev.batchDetails || {}), ...patch },
    }));

  return (
    <div className="flex flex-col gap-4 border-t border-site-accent-dark/10 pt-4">
      <div>
        <h3 className="font-heading text-base font-bold text-site-primary">Curriculum</h3>
        <p className={fieldHint}>Optional modules shown on the course detail page.</p>
        <div className="mt-2 flex flex-col gap-2">
          {curriculum.map((module, index) => (
            <ModuleEditor
              key={index}
              module={module}
              index={index}
              onChange={(next) =>
                setFormData((prev) => {
                  const nextCurriculum = [...(prev.curriculum || [])];
                  nextCurriculum[index] = next;
                  return { ...prev, curriculum: nextCurriculum };
                })
              }
              onRemove={() =>
                setFormData((prev) => ({
                  ...prev,
                  curriculum: (prev.curriculum || []).filter((_, i) => i !== index),
                }))
              }
            />
          ))}
        </div>
        <button
          type="button"
          className={`${btnSecondary} mt-2`}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              curriculum: [...(prev.curriculum || []), { title: '', lessons: [] }],
            }))
          }
        >
          + Add module
        </button>
      </div>

      {isLive ? (
        <div>
          <h3 className="font-heading text-base font-bold text-site-primary">Batch details</h3>
          <p className={fieldHint}>Shown in the Batch details section for live courses.</p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="form-group">
              <label className={fieldLabel}>Start date</label>
              <input
                type="text"
                value={batch.startDate || ''}
                onChange={(e) => setBatch({ startDate: e.target.value })}
                className={fieldInput}
                placeholder="e.g. Rolling batches — 1st of every month"
              />
            </div>
            <div className="form-group">
              <label className={fieldLabel}>Number of classes</label>
              <input
                type="text"
                inputMode="numeric"
                value={batch.classCount || ''}
                onChange={(e) => setBatch({ classCount: e.target.value })}
                className={fieldInput}
                placeholder="e.g. 14"
              />
            </div>
            <div className="form-group">
              <label className={fieldLabel}>Class duration</label>
              <input
                type="text"
                value={batch.classDuration || ''}
                onChange={(e) => setBatch({ classDuration: e.target.value })}
                className={fieldInput}
                placeholder="e.g. 90 minutes"
              />
            </div>
            <div className="form-group">
              <label className={fieldLabel}>Platform</label>
              <input
                type="text"
                value={batch.platform || ''}
                onChange={(e) => setBatch({ platform: e.target.value })}
                className={fieldInput}
                placeholder="e.g. Zoom (recording provided)"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <h3 className="font-heading text-base font-bold text-site-primary">FAQs</h3>
        <p className={fieldHint}>Optional questions shown at the bottom of the course page.</p>
        <div className="mt-2 flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <FaqEditor
              key={index}
              faq={faq}
              index={index}
              onChange={(next) =>
                setFormData((prev) => {
                  const nextFaqs = [...(prev.faqs || [])];
                  nextFaqs[index] = next;
                  return { ...prev, faqs: nextFaqs };
                })
              }
              onRemove={() =>
                setFormData((prev) => ({
                  ...prev,
                  faqs: (prev.faqs || []).filter((_, i) => i !== index),
                }))
              }
            />
          ))}
        </div>
        <button
          type="button"
          className={`${btnSecondary} mt-2`}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              faqs: [...(prev.faqs || []), { question: '', answer: '' }],
            }))
          }
        >
          + Add FAQ
        </button>
      </div>
    </div>
  );
}
