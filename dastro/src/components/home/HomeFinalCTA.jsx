import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, GraduationCap } from 'lucide-react';
import {
  SITE_BAND,
  SITE_BAND_BODY,
  SITE_BAND_TITLE,
  SITE_BTN_COPPER_LG,
  SITE_BTN_TONAL_ON_DARK_LG,
  TW_KICKER,
} from '../../utils/siteTokens';

export default function HomeFinalCTA() {
  return (
    <section
      className="relative overflow-hidden bg-site-primary py-[clamp(2.75rem,6vw,4rem)]"
      aria-labelledby="home-final-cta-heading"
    >
      <div
        className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-site-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-site-accent/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />

      <div className={`container relative ${SITE_BAND} !mx-auto !max-w-[90rem] !border-0 !bg-transparent !p-0 !shadow-none`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className={`${TW_KICKER} mb-2 !text-site-gold`}>Begin Your Journey</p>
          <h2 id="home-final-cta-heading" className={SITE_BAND_TITLE}>
            Ready to unlock your path with{' '}
            <span className="text-site-accent">astrology?</span>
          </h2>
          <p className={`${SITE_BAND_BODY} mt-3 sm:mt-4`}>
          Join thousands of learners and seekers — explore courses or book a personalized consultation today.
          </p>

          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
          <Link to="/courses" className={`${SITE_BTN_COPPER_LG} !no-underline`}>
            <GraduationCap className="h-4 w-4" aria-hidden />
            Explore Courses
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to="/consultations" className={`${SITE_BTN_TONAL_ON_DARK_LG} !no-underline`}>
            <Calendar className="h-4 w-4" aria-hidden />
            Book Consultation
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
