import NumerologyTool from '../components/tools/NumerologyTool';
import { useEffect } from 'react';

function Numerology() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <NumerologyTool />
    </div>
  );
}

export default Numerology;
