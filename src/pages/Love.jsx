import LoveCalculator from '../components/tools/LoveCalculator';
import { useEffect } from 'react';

function Love() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="love-page-shell">
      <LoveCalculator />
    </div>
  );
}

export default Love;
