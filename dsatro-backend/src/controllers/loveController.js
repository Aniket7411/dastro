import asyncHandler from 'express-async-handler';

/**
 * Helper to get Zodiac Sign from Date
 */
const getZodiacSign = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

// Simple compatibility matrix (Reduced for brevity but functional)
const COMPATIBILITY_DATA = {
  Aries: { Fire: 90, Earth: 40, Air: 70, Water: 30 },
  Taurus: { Fire: 30, Earth: 90, Air: 40, Water: 80 },
  Gemini: { Fire: 70, Earth: 30, Air: 95, Water: 40 },
  Cancer: { Fire: 20, Earth: 80, Air: 45, Water: 92 },
  Leo: { Fire: 95, Earth: 45, Air: 75, Water: 25 },
  Virgo: { Fire: 35, Earth: 92, Air: 50, Water: 75 },
  Libra: { Fire: 80, Earth: 40, Air: 90, Water: 55 },
  Scorpio: { Fire: 30, Earth: 75, Air: 35, Water: 95 },
  Sagittarius: { Fire: 94, Earth: 30, Air: 85, Water: 40 },
  Capricorn: { Fire: 40, Earth: 95, Air: 35, Water: 80 },
  Aquarius: { Fire: 85, Earth: 50, Air: 92, Water: 30 },
  Pisces: { Fire: 25, Earth: 85, Air: 30, Water: 94 }
};

const getElement = (sign) => {
  if (['Aries', 'Leo', 'Sagittarius'].includes(sign)) return 'Fire';
  if (['Taurus', 'Virgo', 'Capricorn'].includes(sign)) return 'Earth';
  if (['Gemini', 'Libra', 'Aquarius'].includes(sign)) return 'Air';
  return 'Water';
};

/**
 * @desc    Calculate Love Compatibility
 * @route   POST /api/love/calculate
 * @access  Public
 */
export const calculateLoveCompatibility = asyncHandler(async (req, res) => {
  const { name1, dob1, name2, dob2 } = req.body;

  if (!name1 || !dob1 || !name2 || !dob2) {
    res.status(400);
    throw new Error('All partner details are required.');
  }

  const sign1 = getZodiacSign(dob1);
  const sign2 = getZodiacSign(dob2);
  const element1 = getElement(sign1);
  const element2 = getElement(sign2);

  // Core calculation logic
  let baseScore = COMPATIBILITY_DATA[sign1][element2];
  
  // Add some randomization for variation within signs
  const variability = Math.floor(Math.random() * 5);
  const score = Math.min(99, baseScore + variability);

  let message = '';
  if (score > 85) message = "A match made in the heavens. Your connection is celestial and deeply rooted in past-life karma.";
  else if (score > 70) message = "Strong compatibility with room for growth. You complement each other's strengths well.";
  else if (score > 50) message = "Challenging but rewarding. This relationship requires patience and deep communication to thrive.";
  else message = "Opposing energies. While attraction is high, long-term harmony will take significant effort from both sides.";

  res.json({
    success: true,
    result: {
      score,
      signs: { p1: sign1, p2: sign2 },
      elements: { p1: element1, p2: element2 },
      interpretation: message,
      metrics: {
         emotional: Math.min(99, score + (Math.random() * 10 - 5)),
         physical: Math.min(99, score + (Math.random() * 10 - 5)),
         spiritual: Math.min(99, score + (Math.random() * 10 - 5))
      }
    }
  });
});
