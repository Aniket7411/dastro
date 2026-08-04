import NumerologyTool from '../components/tools/NumerologyTool';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

function Numerology() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SEO
        title="Numerology Consultation & Courses | DS Astro Institute"
        titleIsFull
        description="Discover what your numbers reveal. Expert numerology consultations and courses by celebrity astrologer Damini Shukla. Book your reading today."
        url="/numerology"
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/vedic-numerology-masterclass"
          className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-600"
        >
          Explore the Vedic Numerology Masterclass
        </Link>
      </div>
      <NumerologyTool />
    </div>
  );
}

export default Numerology;
