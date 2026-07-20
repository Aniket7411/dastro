import NumerologyTool from '../components/tools/NumerologyTool';
import { useEffect } from 'react';
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
      <NumerologyTool />
    </div>
  );
}

export default Numerology;
