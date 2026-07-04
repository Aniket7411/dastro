import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, GraduationCap } from 'lucide-react';

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

      <div className="container relative text-center">
        <p className="section-subtitle expertise-subtitle mb-2 !text-site-accent">Begin Your Journey</p>
        <h2 id="home-final-cta-heading" className="section-title !text-white">
          Ready to unlock your path with{' '}
          <span
            className="bg-gradient-to-r from-[#f5c98d] to-[#e8a855] bg-clip-text text-transparent"
          >
            astrology?
          </span>
        </h2>
        <p className="section-desc mx-auto mt-3 max-w-xl !text-white/75 sm:mt-4">
          Join thousands of learners and seekers — explore courses or book a personalized consultation today.
        </p>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-site-accent px-6 py-3 text-sm font-bold text-site-primary no-underline shadow-lg transition hover:brightness-110 hover:shadow-xl sm:px-7"
          >
            <GraduationCap className="h-4 w-4" aria-hidden />
            Explore Courses
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            to="/consultations"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 sm:px-7"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            Book Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
