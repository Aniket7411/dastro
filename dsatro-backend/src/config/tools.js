/**
 * --- PRODUCTION CONSTANTS ---
 * Exported for use in Services.
 */

export const MOON_PHASES = {
  1: { name: "New Moon", title: "The Visionary", keywords: ["Internalization", "Emergence", "Renewal"], range: [0, 45] },
  2: { name: "Waxing Crescent", title: "The Explorer", keywords: ["Expansion", "Growth", "Struggle"], range: [45, 90] },
  3: { name: "First Quarter", title: "The Builder", keywords: ["Action", "Commitment", "Construction"], range: [90, 135] },
  4: { name: "Waxing Gibbous", title: "The Achiever", keywords: ["Analysis", "Expectancy", "Finality"], range: [135, 180] },
  5: { name: "Full Moon", title: "The Catalyst", keywords: ["Fulfillment", "Integration", "Clarity"], range: [180, 225] },
  6: { name: "Waning Gibbous", title: "The Teacher", keywords: ["Demonstration", "Instruction", "Sharing"], range: [225, 270] },
  7: { name: "Last Quarter", title: "The Reformer", keywords: ["Release", "Courage", "Change"], range: [247.5, 292.5] },
  8: { name: "Balsamic Moon", title: "The Healer", keywords: ["Release", "Completion", "Transition"], range: [315, 360] }
};

export const NUMEROLOGY_DATA = {
  1: { planet: "Sun", sign: "Leo", stones: "Ruby/Rose Quartz", days: "Sunday", color: "Orange, Gold", god: "Surya", mantra: "ॐ सूर्याय नमः", alphabets: "A, I, J, Q, Y", fast: "Sunday", dates: "1, 10, 19, 28", direction: "East" },
  2: { planet: "Moon", sign: "Cancer", stones: "Pearl/Moonstone", days: "Monday", color: "White, Light Blue", god: "Devi Durga", mantra: "ॐ चन्द्राय नमः", alphabets: "B, K, R", fast: "Monday", dates: "2, 11, 20, 29", direction: "Northwest" },
  3: { planet: "Jupiter", sign: "Sagittarius", stones: "Yellow Sapphire", days: "Thursday", color: "Yellow, Golden", god: "Lord Vishnu", mantra: "ॐ बृं बृहस्पतये नमः", alphabets: "C, G, L, S", fast: "Thursday", dates: "3, 12, 21, 30", direction: "Northeast" },
  4: { planet: "Rahu", sign: "Aquarius", stones: "Hessonite (Gomed)", days: "Saturday", color: "Grey, Blue", god: "Lord Ganesha", mantra: "ॐ रां राहवे नमः", alphabets: "D, M, T", fast: "Saturday", dates: "4, 13, 22, 31", direction: "Southwest" },
  5: { planet: "Mercury", sign: "Gemini/Virgo", stones: "Emerald", days: "Wednesday", color: "Green, Light Shades", god: "Lord Ganesha", mantra: "ॐ बुं बुधाय नमः", alphabets: "E, H, N, X", fast: "Wednesday", dates: "5, 14, 23", direction: "North" },
  6: { planet: "Venus", sign: "Taurus/Libra", stones: "Diamond/White Topaz", days: "Friday", color: "White, Pink", god: "Devi Lakshmi", mantra: "ॐ शुं शुक्राय नमः", alphabets: "U, V, W", fast: "Friday", dates: "6, 15, 24", direction: "Southeast" },
  7: { planet: "Ketu", sign: "Pisces", stones: "Cat's Eye", days: "Tuesday", color: "Multicolor", god: "Lord Narasimha", mantra: "ॐ कें केतवे नमः", alphabets: "O, Z", fast: "Tuesday", dates: "7, 16, 25", direction: "Northwest" },
  8: { planet: "Saturn", sign: "Capricorn", stones: "Blue Sapphire", days: "Saturday", color: "Black, Dark Blue", god: "Lord Shani", mantra: "ॐ शं शनैश्चराय नमः", alphabets: "F, P", fast: "Saturday", dates: "8, 17, 26", direction: "West" },
  9: { planet: "Mars", sign: "Aries/Scorpio", stones: "Red Coral", days: "Tuesday", color: "Red, Orange", god: "Lord Hanuman", mantra: "ॐ क्रां क्रीं क्रूं सः भौमाय नमः", alphabets: "I, R", fast: "Tuesday", dates: "9, 18, 27", direction: "South" }
};

export const ZODIAC_DATA = {
  'Aries':       { symbol: '♈', element: 'Fire',  quality: 'Cardinal', ruler: 'Mars',    dates: 'Mar 21 – Apr 19', description: 'Confident, fiery, and energetic. A natural-born leader who charges forward with passion.',  traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic'], compatible: ['Leo', 'Sagittarius', 'Gemini'], lucky: [1, 8, 17], color: 'Red' },
  'Taurus':      { symbol: '♉', element: 'Earth', quality: 'Fixed',    ruler: 'Venus',   dates: 'Apr 20 – May 20', description: 'Reliable, patient, and practical. You value stability, beauty, and lasting comfort.',           traits: ['Reliable', 'Patient', 'Practical', 'Devoted'],      compatible: ['Virgo', 'Capricorn', 'Cancer'], lucky: [2, 6, 9], color: 'Green' },
  'Gemini':      { symbol: '♊', element: 'Air',   quality: 'Mutable',  ruler: 'Mercury', dates: 'May 21 – Jun 20', description: 'Adaptable, outgoing, and intelligent. A social butterfly with a curious, multifaceted mind.',    traits: ['Adaptable', 'Outgoing', 'Intelligent', 'Witty'],    compatible: ['Libra', 'Aquarius', 'Aries'],  lucky: [3, 7, 12], color: 'Yellow' },
  'Cancer':      { symbol: '♋', element: 'Water', quality: 'Cardinal', ruler: 'Moon',    dates: 'Jun 21 – Jul 22', description: 'Compassionate, intuitive, and protective. Family is your greatest source of strength.',          traits: ['Compassionate', 'Intuitive', 'Loyal', 'Protective'], compatible: ['Scorpio', 'Pisces', 'Taurus'],  lucky: [2, 7, 11], color: 'Silver' },
  'Leo':         { symbol: '♌', element: 'Fire',  quality: 'Fixed',    ruler: 'Sun',     dates: 'Jul 23 – Aug 22', description: 'Charismatic, generous, and proud. You shine naturally and love being in the spotlight.',          traits: ['Charismatic', 'Generous', 'Creative', 'Warm'],      compatible: ['Aries', 'Sagittarius', 'Gemini'], lucky: [1, 3, 10], color: 'Gold' },
  'Virgo':       { symbol: '♍', element: 'Earth', quality: 'Mutable',  ruler: 'Mercury', dates: 'Aug 23 – Sep 22', description: 'Analytical, hard-working, and kind. You strive for perfection and have an eye for detail.',     traits: ['Analytical', 'Precise', 'Reliable', 'Modest'],      compatible: ['Taurus', 'Capricorn', 'Cancer'], lucky: [5, 14, 23], color: 'Navy' },
  'Libra':       { symbol: '♎', element: 'Air',   quality: 'Cardinal', ruler: 'Venus',   dates: 'Sep 23 – Oct 22', description: 'Diplomatic, artistic, and fair-minded. You seek balance, harmony, and beauty in all things.',   traits: ['Diplomatic', 'Fair-minded', 'Social', 'Gracious'],  compatible: ['Gemini', 'Aquarius', 'Leo'],   lucky: [4, 6, 13], color: 'Pink' },
  'Scorpio':     { symbol: '♏', element: 'Water', quality: 'Fixed',    ruler: 'Mars',    dates: 'Oct 23 – Nov 21', description: 'Passionate, brave, and magnetic. You dive deep into everything, with an aura of mystery.',      traits: ['Passionate', 'Brave', 'Stubborn', 'Magnetic'],      compatible: ['Cancer', 'Pisces', 'Virgo'],   lucky: [8, 11, 18], color: 'Crimson' },
  'Sagittarius': { symbol: '♐', element: 'Fire',  quality: 'Mutable',  ruler: 'Jupiter', dates: 'Nov 22 – Dec 21', description: 'Optimistic, freedom-loving, and adventurous. You seek meaning through travel and philosophy.',   traits: ['Optimistic', 'Adventurous', 'Honest', 'Restless'],  compatible: ['Aries', 'Leo', 'Aquarius'],    lucky: [3, 9, 27], color: 'Purple' },
  'Capricorn':   { symbol: '♑', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn',  dates: 'Dec 22 – Jan 19', description: 'Disciplined, serious, and ambitious. You pursue long-term goals with relentless tenacity.',     traits: ['Disciplined', 'Responsible', 'Ambitious', 'Loyal'], compatible: ['Taurus', 'Virgo', 'Scorpio'],  lucky: [4, 8, 13], color: 'Brown' },
  'Aquarius':    { symbol: '♒', element: 'Air',   quality: 'Fixed',    ruler: 'Saturn',  dates: 'Jan 20 – Feb 18', description: 'Progressive, original, and independent. A deep thinker and visionary humanitarian.',            traits: ['Progressive', 'Original', 'Independent', 'Visionary'], compatible: ['Gemini', 'Libra', 'Sagittarius'], lucky: [4, 7, 11], color: 'Electric Blue' },
  'Pisces':      { symbol: '♓', element: 'Water', quality: 'Mutable',  ruler: 'Jupiter', dates: 'Feb 19 – Mar 20', description: 'Compassionate, artistic, and deeply intuitive. You feel everything with great empathy.',        traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle'],  compatible: ['Cancer', 'Scorpio', 'Capricorn'], lucky: [3, 9, 12], color: 'Sea Green' }
};
