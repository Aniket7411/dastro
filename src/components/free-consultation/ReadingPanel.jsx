import { useState } from 'react';
import { Languages, Moon, Sparkles } from 'lucide-react';
import ReadingReportActions from './ReadingReportActions';
import { getRashiHi } from '../../utils/rashi';
import {
  DESK_CARD_READING,
  DESK_INNER,
  DESK_INNER_SAGE,
  DESK_MUTED,
  DESK_SECTION_TITLE,
} from './tokens';

const LANG_OPTIONS = [
  { id: 'both', label: 'EN + हिंदी' },
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
];

function pickText(reading, enKey, hiKey, legacyKey, lang) {
  const en = reading[enKey] || reading[legacyKey] || '';
  const hi = reading[hiKey] || '';
  if (lang === 'en') return en;
  if (lang === 'hi') return hi || en;
  return { en, hi };
}

function BilingualBlock({ titleEn, titleHi, en, hi, lang, isHiSection = false }) {
  const showEn = lang === 'both' || lang === 'en';
  const showHi = lang === 'both' || lang === 'hi';
  const hasHi = Boolean(hi?.trim());

  if (!en?.trim() && !hasHi) return null;

  return (
    <article className={`${DESK_INNER_SAGE} p-3 sm:p-3.5`}>
      <h3 className="mb-2 font-body text-[11px] font-bold uppercase tracking-wide text-[#000]">
        {lang === 'hi' && isHiSection ? titleHi : titleEn}
      </h3>

      {showEn && en?.trim() ? (
        <div className={showHi && hasHi && lang === 'both' ? 'mb-2.5 border-b border-[#ccc] pb-2.5' : ''}>
          {lang === 'both' ? (
            <p className="mb-1 font-body text-[10px] font-bold uppercase tracking-wide text-[#444]">English</p>
          ) : null}
          <p className="font-body text-[13px] leading-relaxed text-[#000] sm:text-sm">{en}</p>
        </div>
      ) : null}

      {showHi && hasHi ? (
        <div>
          {lang === 'both' ? (
            <p className="mb-1 font-body text-[10px] font-bold uppercase tracking-wide text-[#444]">हिंदी</p>
          ) : null}
          <p className="font-['IBM_Plex_Sans_Devanagari',sans-serif] text-[14px] leading-relaxed text-[#000] sm:text-[15px]">
            {hi}
          </p>
        </div>
      ) : null}
    </article>
  );
}

export default function ReadingPanel({ reading, usedFallback, lead }) {
  const [lang, setLang] = useState('both');

  if (!reading) return null;

  const rashiHi = reading.rashiHi || getRashiHi(reading.sunSign);
  const gender = lead?.gender || '';
  const natureTitle = gender === 'Female' ? 'Her nature' : gender === 'Male' ? 'His nature' : 'Your nature';
  const phaseTitle = gender === 'Female' ? 'Her current phase' : gender === 'Male' ? 'His current phase' : 'Your current phase';
  const chartTitle = gender === 'Female'
    ? 'What her chart will reveal'
    : gender === 'Male'
      ? 'What his chart will reveal'
      : 'What your chart will reveal';

  const nature = pickText(reading, 'natureEn', 'natureHi', 'nature', lang);
  const phase = pickText(reading, 'currentPhaseEn', 'currentPhaseHi', 'currentPhase', lang);
  const reveal = pickText(reading, 'fullChartRevealEn', 'fullChartRevealHi', 'fullChartReveal', lang);

  const natureEn = typeof nature === 'string' ? nature : nature.en;
  const natureHi = typeof nature === 'string' ? reading.natureHi : nature.hi;
  const phaseEn = typeof phase === 'string' ? phase : phase.en;
  const phaseHi = typeof phase === 'string' ? reading.currentPhaseHi : phase.hi;
  const revealEn = typeof reveal === 'string' ? reveal : reveal.en;
  const revealHi = typeof reveal === 'string' ? reading.fullChartRevealHi : reveal.hi;

  return (
    <section className={`${DESK_CARD_READING} flex flex-col gap-2.5`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ccc] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#000] bg-[#fff] text-[#000]">
            <Sparkles size={14} />
          </span>
          <div>
            <h2 className={DESK_SECTION_TITLE}>Preliminary reading</h2>
            <p className={`font-body text-[10px] ${DESK_MUTED}`}>Read to caller in their preferred language</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {usedFallback ? (
            <span className="rounded-md border border-[#000] bg-[#fff] px-2 py-0.5 font-body text-[9px] font-bold text-[#000]">
              Template
            </span>
          ) : (
            <span className="rounded-md border border-[#000] bg-[#000] px-2 py-0.5 font-body text-[9px] font-bold text-[#fff]">
              AI
            </span>
          )}
        </div>
      </div>

      {reading.sunSign ? (
        <div className={`${DESK_INNER} flex flex-wrap items-center gap-2 px-3 py-2`}>
          <Moon size={14} className="shrink-0 text-[#000]" aria-hidden />
          <div className="leading-tight">
            <p className="font-body text-[10px] font-bold uppercase tracking-wide text-[#444]">Rashi (सूर्य राशि)</p>
            <p className="font-body text-sm font-bold text-[#000]">
              {reading.sunSign}
              {rashiHi ? (
                <span className="ml-2 font-['IBM_Plex_Sans_Devanagari',sans-serif] font-semibold text-[#444]">
                  {rashiHi}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className={`${DESK_INNER} flex flex-wrap items-center gap-2 px-3 py-2`}>
          <span className="font-body text-[10px] font-bold uppercase tracking-wide text-[#444]">Lucky colour</span>
          <span className="font-body text-xs font-bold text-[#000]">
            {reading.luckyColour || '—'}
            {reading.luckyColourHi ? (
              <span className="ml-1.5 font-['IBM_Plex_Sans_Devanagari',sans-serif] font-semibold text-[#444]">
                ({reading.luckyColourHi})
              </span>
            ) : null}
          </span>
        </div>

        <div className={`${DESK_INNER} inline-flex items-center gap-1 p-0.5`}>
          <Languages size={12} className="ml-1.5 shrink-0 text-[#444]" aria-hidden />
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLang(opt.id)}
              className={`rounded-md px-2 py-1 font-body text-[10px] font-bold transition sm:text-[11px] ${
                lang === opt.id
                  ? 'bg-[#000] text-[#fff]'
                  : 'text-[#000] hover:bg-[#f5f5f5]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:gap-2.5">
        <BilingualBlock titleEn={natureTitle} titleHi="आपका स्वभाव" en={natureEn} hi={natureHi} lang={lang} />
        <BilingualBlock titleEn={phaseTitle} titleHi="आपका वर्तमान चरण" en={phaseEn} hi={phaseHi} lang={lang} />
        <BilingualBlock
          titleEn={chartTitle}
          titleHi="पूरी कुंडली क्या बताएगी"
          en={revealEn}
          hi={revealHi}
          lang={lang}
          isHiSection
        />
      </div>

      {lead ? (
        <div className="mt-0.5">
          <ReadingReportActions lead={lead} reading={reading} />
        </div>
      ) : null}

      <p className={`font-body text-[10px] leading-snug sm:text-[11px] ${DESK_MUTED}`}>
        Read warmly in English or Hindi, then offer paid consultation, demo class, or course.
      </p>
    </section>
  );
}
