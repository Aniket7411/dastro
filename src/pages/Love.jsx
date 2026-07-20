import LoveCalculator from '../components/tools/LoveCalculator';
import { useEffect } from 'react';
import SEO from '../components/SEO';

function Love() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="love-page-shell">
      <SEO
        title="Love & Marriage Astrology Consultation | DS Astro Institute"
        titleIsFull
        description="Relationship problems? Get love and marriage astrology solutions from Damini Shukla. Kundli matching, compatibility & remedies. Book a consultation."
        url="/love"
      />
      <LoveCalculator />
    </div>
  );
}

export default Love;
