import React from 'react';

const ZODIAC_MAP = {
  'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
  'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

const PLANET_SYMBOLS = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me', 
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke', 'Asc': 'As'
};

function KundaliChart({ planets, ascendantSign }) {
  const ascSignNum = ZODIAC_MAP[ascendantSign];

  // Map planets to houses (1-12)
  const housePlanets = Array.from({ length: 12 }, () => []);
  planets?.forEach(p => {
    if (housePlanets[p.house - 1]) {
      housePlanets[p.house - 1].push(p);
    }
  });

  const getSignNumAtHouse = (houseNum) => {
    let num = (ascSignNum + houseNum - 1) % 12;
    return num === 0 ? 12 : num;
  };

  return (
    <div className="kundali-chart-wrapper shadow-lg p-3 rounded bg-dark-glass">
      <svg viewBox="0 0 400 400" className="w-100">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,106,0,0.1)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,106,0,0.02)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Outer Border */}
        <rect x="5" y="5" width="390" height="390" fill="url(#chartGradient)" stroke="#ff6a00" strokeWidth="2" rx="10" />
        
        {/* Diamond Grid */}
        <line x1="5" y1="5" x2="395" y2="395" stroke="#ff6a00" strokeWidth="1" opacity="0.4" />
        <line x1="395" y1="5" x2="5" y2="395" stroke="#ff6a00" strokeWidth="1" opacity="0.4" />
        <polygon points="200,5 395,200 200,395 5,200" fill="none" stroke="#ff6a00" strokeWidth="1.5" />

        {/* House Sign Numbers & Planets */}
        {renderHouse(1, 200, 160, getSignNumAtHouse(1), housePlanets[0])}
        {renderHouse(2, 130, 70, getSignNumAtHouse(2), housePlanets[1])}
        {renderHouse(3, 70, 130, getSignNumAtHouse(3), housePlanets[2])}
        {renderHouse(4, 160, 200, getSignNumAtHouse(4), housePlanets[3])}
        {renderHouse(5, 70, 270, getSignNumAtHouse(5), housePlanets[4])}
        {renderHouse(6, 130, 330, getSignNumAtHouse(6), housePlanets[5])}
        {renderHouse(7, 200, 240, getSignNumAtHouse(7), housePlanets[6])}
        {renderHouse(8, 270, 330, getSignNumAtHouse(8), housePlanets[7])}
        {renderHouse(9, 330, 270, getSignNumAtHouse(9), housePlanets[8])}
        {renderHouse(10, 240, 200, getSignNumAtHouse(10), housePlanets[9])}
        {renderHouse(11, 330, 130, getSignNumAtHouse(11), housePlanets[10])}
        {renderHouse(12, 270, 70, getSignNumAtHouse(12), housePlanets[11])}
      </svg>
    </div>
  );
}

function renderHouse(num, x, y, signNum, planets) {
  return (
    <g>
      {/* Sign Number */}
      <text x={x} y={y + 15} textAnchor="middle" fill="#ff6a00" fontSize="14" fontWeight="bold" opacity="0.7">
        {signNum}
      </text>
      {/* Planets */}
      <text x={x} y={y - 5} textAnchor="middle" fill="white" fontSize="10">
        {planets?.map((p, i) => (
          <tspan key={i} dx={i === 0 ? 0 : 5}>
            {PLANET_SYMBOLS[p.name] || p.name.substring(0, 2)}
            {p.isRetrograde ? '°' : ''}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export default KundaliChart;
