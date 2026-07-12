import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import {
  AboutHero,
  AboutDamini,
  AboutSciences,
  AboutStats,
  AboutOfferings,
  AboutAudience,
  AboutTrust,
  AboutFaq,
  AboutCta,
  ABOUT_SEO,
  ABOUT_FAQ,
} from '../components/about/AboutSections';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ABOUT_FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

// sameAs (social/press links) intentionally omitted until confirmed — see SEO_Copy_Facts_To_Confirm.docx
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Damini Shukla',
  jobTitle: 'Astrologer',
  description:
    'Celebrity Vedic astrologer, tarot reader, and founder of DS Astro Institute with 10+ years of experience.',
  image: 'https://dsastroinstitute.com/images/damini.webp',
  url: 'https://dsastroinstitute.com/about',
  worksFor: {
    '@type': 'EducationalOrganization',
    name: 'DS Astro Institute',
  },
};

function About() {
  useEffect(() => {
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <>
      <SEO title={ABOUT_SEO.title} description={ABOUT_SEO.description} url="/about" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <AboutHero />
      <AboutDamini />
      <AboutSciences />
      <AboutStats />
      <AboutOfferings />
      <AboutAudience />
      <AboutTrust />
      <AboutFaq />
      <AboutCta />
    </>
  );
}

export default About;
