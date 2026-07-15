import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { PAGE_WRAP } from '../consultation/tokens';
import HomeSectionHeader from './HomeSectionHeader';

const FAQS = [
  {
    q: 'Can I learn astrology online without any prior knowledge?',
    a: 'Yes. Our beginner courses start from the absolute basics of Vedic astrology — no prior knowledge needed. Live classes, recorded lessons, and mentor support make learning easy at any age.',
  },
  {
    q: 'Will I get a certificate after completing the course?',
    a: 'Yes, every student receives a certification from DS Astro Institute on successful course completion, which you can use to start your own astrology practice.',
  },
  {
    q: 'How do online astrology consultations work?',
    a: 'Book a slot, share your birth details (date, time, and place of birth), and connect with our astrologer by call or video at your chosen time. You receive detailed analysis and personalized remedies.',
  },
  {
    q: 'Are the courses in Hindi or English?',
    a: "Our courses and consultations are available in both Hindi and English, so you can learn and consult in the language you're most comfortable with.",
  },
  {
    q: 'How accurate are the predictions?',
    a: 'Our analysis is based on classical Vedic astrology principles with precise astronomical calculations of your birth chart, backed by 20+ years of consultation experience.',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function HomeFAQSection() {
  return (
    <section
      className="border-t border-site-accent-dark/8 bg-site-bg py-[clamp(2.5rem,5vw,3.5rem)]"
      aria-labelledby="home-faq-heading"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>
      <div className={PAGE_WRAP}>
        <HomeSectionHeader
          id="home-faq-heading"
          kicker="Got Questions?"
          title="Frequently Asked"
          titleHighlight="Questions"
          showAccent
        />

        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-site-border bg-site-surface px-4 py-3.5 open:shadow-[0_4px_16px_rgba(51,37,26,0.06)] sm:px-5 sm:py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-[15px] font-semibold text-site-text marker:content-none sm:text-base">
                {q}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-site-accent-dark transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="m-0 mt-3 font-body text-sm leading-relaxed text-site-muted sm:text-[15px]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
