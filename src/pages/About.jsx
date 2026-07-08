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

function About() {
  useEffect(() => {
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <>
      <SEO title={ABOUT_SEO.title} description={ABOUT_SEO.description} url="/about" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
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
