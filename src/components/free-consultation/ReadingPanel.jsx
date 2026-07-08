import { Sparkles, Tag } from 'lucide-react';
import { CARD, SECTION_TITLE } from './tokens';

export default function ReadingPanel({ reading, usedFallback }) {
  if (!reading) return null;

  const blocks = [
    {
      title: 'Lucky number & colour',
      content: (
        <p className="font-body text-sm font-bold text-site-primary sm:text-base">
          <span className="text-site-accent-dark">{reading.luckyNumber}</span>
          <span className="mx-2 text-site-muted">|</span>
          <span>{reading.luckyColour}</span>
        </p>
      ),
    },
    { title: 'Your nature', content: reading.nature },
    { title: 'Your current phase', content: reading.currentPhase },
    { title: 'What your full chart will reveal', content: reading.fullChartReveal },
  ];

  return (
    <section className={`${CARD} border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-site-accent-dark/10 pb-3 sm:mb-5 sm:pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles size={16} />
          </span>
          <h2 className={SECTION_TITLE}>Preliminary reading</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {reading.sunSign ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-site-muted ring-1 ring-site-accent-dark/10">
              <Tag size={10} />
              {reading.sunSign}
            </span>
          ) : null}
          {usedFallback ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 font-body text-[10px] font-bold text-amber-800">
              Template reading
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-body text-[10px] font-bold text-emerald-800">
              AI generated
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {blocks.map((block) => (
          <article key={block.title} className="rounded-lg border border-site-accent-dark/8 bg-white/80 p-3.5 sm:p-4">
            <h3 className="mb-2 font-body text-xs font-bold uppercase tracking-wide text-site-accent">
              {block.title}
            </h3>
            <div className="font-body text-sm leading-relaxed text-site-muted sm:text-[0.9375rem]">
              {block.content}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 font-body text-xs leading-relaxed text-site-muted sm:mt-5">
        Read this warmly to the caller, then use the specificity gap to offer a paid consultation,
        demo class, or course.
      </p>
    </section>
  );
}
