import dns from 'node:dns';
import mongoose from 'mongoose';
import Course from './src/models/Course.js';
import CourseCategory from './src/models/CourseCategory.js';
import { slugify } from './src/utils/slugify.js';
import './src/config/env.js';

// Some local networks/routers resolve normal DNS fine but fail on the SRV lookup
// that `mongodb+srv://` needs. Forcing a public resolver here fixes that without
// touching system-wide DNS settings.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const CATEGORIES = [
  { name: 'Vedic Astrology',   slug: 'vedic-astrology',   sortOrder: 1 },
  { name: 'KP Astrology',      slug: 'kp-astrology',      sortOrder: 2 },
  { name: 'Tarot',             slug: 'tarot',             sortOrder: 3 },
  { name: 'Numerology',        slug: 'numerology',        sortOrder: 4 },
  { name: 'Palmistry',         slug: 'palmistry',         sortOrder: 5 },
  { name: 'Lal Kitab',         slug: 'lal-kitab',         sortOrder: 6 },
  { name: 'Face Reading',      slug: 'face-reading',      sortOrder: 7 },
  { name: 'Graphology',        slug: 'graphology',        sortOrder: 8 },
  { name: 'Spiritual Remedies',slug: 'spiritual-remedies',sortOrder: 9 },
  { name: 'Crystal Healing',   slug: 'crystal-healing',   sortOrder: 10 },
  { name: 'Vastu',             slug: 'vastu',             sortOrder: 11 },
];

const COURSES = [
  /* ───────────────────────────────────────────────────────────
   * LIVE — FOUNDATION
   * ─────────────────────────────────────────────────────────── */

  /* 1. BASIC VEDIC NUMEROLOGY  (Live · Foundation) */
  {
    title: 'Basic Vedic Numerology',
    slug: 'basic-vedic-numerology',
    category: 'Numerology',
    tier: 'Foundation',
    courseType: 'Live',
    level: 'Beginner',
    price: 5999,
    mrp: 8499,
    validityDays: 0,
    duration: '12 classes · ~18 hrs · 4–6 wks',
    modulesCount: 4,
    description:
      'Learn to read anyone\'s life through their date of birth — from Mulank and Bhagyank to the Lo Shu grid and name vibrations.',
    longDesc:
      'Learn to read anyone\'s life through their date of birth. This live beginner cohort takes you from zero to confidently calculating and interpreting core numbers, the Lo Shu grid and name vibrations — the fastest occult skill to learn and start using on family, friends and clients.',
    topics: [
      'Introduction to Vedic numerology and the power of numbers',
      'Calculating your Mulank (birth number) and Bhagyank (destiny number)',
      'Meaning and personality of numbers 1–9',
      'Planets and their number associations',
      'Name numerology — how names shape outcomes',
      'Lo Shu grid basics — plotting and reading the grid',
      'Missing numbers and repeating numbers in a chart',
      'Lucky numbers, colours, dates and directions',
      'Mobile number and vehicle number analysis',
      'Compatibility between numbers — relationships and partnerships',
      'Simple numerology remedies',
      'Practice sessions — reading real charts + certification assessment',
    ],
    learningOutcomes: [
      'Calculate all core numerology numbers from name and date of birth',
      'Interpret Life Path, Destiny, Soul Urge and Personality numbers',
      'Read personal year cycles for timing guidance',
      'Offer basic numerology consultations confidently',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations of Numerology', lessons: ['Origins & systems', 'Number meanings 1–9 + master numbers', 'Calculation basics'] },
      { title: 'Module 2 — Numbers from Date of Birth', lessons: ['Life Path Number', 'Birth Day Number', 'Karmic debt numbers'] },
      { title: 'Module 3 — Numbers from Name', lessons: ['Destiny Number', 'Soul Urge Number', 'Personality Number'] },
      { title: 'Module 4 — Cycles & Practice', lessons: ['Personal Year cycles', 'Compatibility reading', 'Live practice charts'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 12,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Do I need any prior knowledge?', answer: 'No. This course starts from zero and builds up step by step.' },
      { question: 'Are classes recorded?', answer: 'Yes, every live session is recorded and shared within 24 hours.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified numerologist with hands-on consultation experience.', image: '' },
    isActive: true,
  },

  /* 2. VEDIC ASTROLOGY FOUNDATION  (Live · Foundation) */
  {
    title: 'Vedic Astrology Foundation Course',
    slug: 'vedic-astrology-foundation',
    category: 'Vedic Astrology',
    tier: 'Foundation',
    courseType: 'Live',
    level: 'Beginner',
    price: 6999,
    mrp: 9999,
    validityDays: 0,
    duration: '10–12 wks · ~24 hrs',
    modulesCount: 8,
    description:
      'Start your journey into Vedic Jyotish from scratch. This course covers the complete foundation — planets, signs, houses, and basic chart reading — taught live by a certified practitioner.',
    longDesc:
      'Vedic Astrology (Jyotish) is the ancient Indian science of light that helps decode your destiny through planetary positions at the time of birth. This live, instructor-led course is designed for complete beginners who want to learn Jyotish from the ground up. Over 10–12 weeks you will build a rock-solid foundation in planetary nature, zodiac signs, the 12 houses, aspects, and divisional charts — and begin reading birth charts confidently by the end of Module 8.',
    topics: [
      'Introduction to Vedic Astrology & its history',
      'The 9 Grahas (planets) and their significations',
      'Rashis (zodiac signs) — qualities and ruling lords',
      '12 Bhavas (houses) and their meanings',
      'Nakshatras — the 27 lunar mansions',
      'Planetary aspects (Drishti)',
      'Lagna (Ascendant) and its importance',
      'Basics of Dasha systems (Vimshottari)',
    ],
    learningOutcomes: [
      'Read and interpret a basic Vedic birth chart (Kundali)',
      'Identify the role of each planet in a horoscope',
      'Understand house significations and planetary relationships',
      'Cast a birth chart using software',
      'Perform basic predictive analysis using Vimshottari Dasha',
    ],
    curriculum: [
      { title: 'Module 1 — Introduction to Jyotish', lessons: ['History & purpose of Vedic Astrology', 'Difference between Vedic & Western astrology', 'Overview of the Panchanga', 'Introduction to software tools'] },
      { title: 'Module 2 — The Planets (Grahas)', lessons: ['Sun, Moon & their significance', 'Mars, Mercury, Jupiter', 'Venus, Saturn, Rahu & Ketu', 'Exaltation, debilitation & own sign'] },
      { title: 'Module 3 — Zodiac Signs (Rashis)', lessons: ['The 12 Rashis and their qualities', 'Movable, fixed & dual signs', 'Fiery, earthy, airy & watery signs', 'Rashi lords and their effects'] },
      { title: 'Module 4 — The 12 Houses (Bhavas)', lessons: ['First to fourth houses in depth', 'Fifth to eighth houses', 'Ninth to twelfth houses', 'Kendras, Trikonas & Dusthanas'] },
      { title: 'Module 5 — Nakshatras', lessons: ['The 27 Nakshatras overview', 'Nakshatra lords & Padas', 'Importance in Muhurtha & compatibility', 'Practical mapping on charts'] },
      { title: 'Module 6 — Aspects & Conjunctions', lessons: ['Graha Drishti (planetary sight)', 'Special aspects of Mars, Jupiter & Saturn', 'Conjunction effects', 'Natural vs temporal malefics'] },
      { title: 'Module 7 — Dasha System', lessons: ['Vimshottari Dasha introduction', 'Calculating Dasha balance at birth', 'Antardasha (sub-periods)', 'Simple predictions from Dashas'] },
      { title: 'Module 8 — Chart Reading Practice', lessons: ['Reading Lagna chart step by step', 'Case study — 3 real charts', 'Common planetary combinations (Yogas)', 'Final assessment & doubt clearing'] },
    ],
    batchDetails: {
      startDate: 'Rolling Batches — Next batch starts 1st of every month',
      classCount: 32,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Do I need any prior knowledge?', answer: 'No. This course is designed for absolute beginners. We start from zero.' },
      { question: 'Are classes recorded?', answer: 'Yes. Every live session is recorded and shared within 24 hours so you never miss a class.' },
      { question: 'What language are classes conducted in?', answer: 'Classes are conducted in Hindi with English terminology where needed.' },
      { question: 'Is there a doubt-clearing session?', answer: 'Yes — a dedicated Q&A session is held every two weeks.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified Vedic Astrologer with 10+ years of teaching experience.', image: '' },
    isActive: true,
  },

  /* 3. BASIC VEDIC ASTROLOGY  (Live · Foundation) */
  {
    title: 'Basic Vedic Astrology',
    slug: 'basic-vedic-astrology',
    category: 'Vedic Astrology',
    tier: 'Foundation',
    courseType: 'Live',
    level: 'Beginner',
    price: 6999,
    mrp: 9999,
    validityDays: 0,
    duration: '14 classes · ~22 hrs · 6–7 wks',
    modulesCount: 4,
    description:
      'The perfect starting point for anyone who wants to genuinely learn astrology — open any birth chart and read planets, houses, dashas and basic yogas.',
    longDesc:
      'The perfect starting point for anyone who wants to genuinely learn astrology, not just consume it. In 14 live classes you learn to open any birth chart and read planets, houses, dashas and basic yogas with a clear step-by-step method — taught live so every doubt gets answered.',
    topics: [
      'What is Jyotish — history, logic and scope of Vedic astrology',
      'The zodiac: 12 rashis and their nature',
      'The 9 grahas (planets) — significations and karakatvas',
      'The 12 houses (bhavas) and what each governs',
      'Reading a birth chart — North and South Indian formats',
      'Planetary strengths: exaltation, debilitation, own sign, combustion',
      'Aspects (drishti) of planets',
      'Nakshatras — the 27 lunar mansions, an introduction',
      'Introduction to Vimshottari dasha system',
      'Benefic and malefic planets for each ascendant',
      'Basic yoga combinations every beginner must know',
      'Transit basics — Saturn, Jupiter and Rahu-Ketu movement',
      'Putting it together: step-by-step chart analysis method',
      'Live chart practice + certification assessment',
    ],
    learningOutcomes: [
      'Understand the core building blocks of a Vedic birth chart',
      'Identify basic planetary strengths and weaknesses',
      'Read simple predictions from a chart',
    ],
    curriculum: [
      { title: 'Module 1 — Planets & Signs', lessons: ['The 9 planets', 'The 12 zodiac signs', 'Own sign, exaltation & debilitation'] },
      { title: 'Module 2 — Houses', lessons: ['The 12 houses', 'Kendras & Trikonas', 'House significations'] },
      { title: 'Module 3 — Chart Reading Basics', lessons: ['Casting a chart', 'Combining planet + sign + house', 'Practice examples'] },
      { title: 'Module 4 — Dasha & Prediction Basics', lessons: ['Vimshottari Dasha intro', 'Simple predictive rules', 'Live Q&A & assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 14,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'How is this different from the Foundation Course?', answer: 'This is a shorter, more compact introduction covering the essentials in fewer classes.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified Vedic Astrologer specialising in beginner-friendly teaching.', image: '' },
    isActive: true,
  },

  /* ───────────────────────────────────────────────────────────
   * LIVE — SPECIALIST
   * ─────────────────────────────────────────────────────────── */

  /* 4. FACE READING  (Live · Specialist) */
  {
    title: 'Face Reading',
    slug: 'face-reading',
    category: 'Face Reading',
    tier: 'Specialist',
    courseType: 'Live',
    level: 'Intermediate',
    price: 8999,
    mrp: 12999,
    validityDays: 0,
    duration: '16 classes · ~24 hrs · 7–8 wks',
    modulesCount: 4,
    description:
      'Read personality, nature, luck and career from any face — no birth details needed. A rare, high-demand skill for consultants, HR and matchmakers.',
    longDesc:
      'Read personality, nature, luck and career from any face — no birth details needed. A rare, high-demand skill taught live: by the end you can profile a person within minutes of meeting them, making this invaluable for consultants, HR professionals, business owners and matchmakers.',
    topics: [
      'Introduction to Samudrik Shastra and the science of face reading',
      'The three zones of the face and what each reveals',
      'Face shapes and core personality types',
      'Forehead — intelligence, career and early life',
      'Eyebrows — temperament, relationships and drive',
      'Eyes — the windows to nature, honesty and emotion',
      'Nose — wealth, ambition and mid-life fortune',
      'Lips and mouth — communication, love and appetite for life',
      'Chin and jaw — willpower, stamina and later life',
      'Ears — longevity, wisdom and childhood influences',
      'Moles, marks and lines on the face — their hidden meanings',
      'Reading luck periods from facial regions',
      'Face reading for hiring, business and negotiation',
      'Face reading in matchmaking and relationships',
      'Combining features into a complete personality profile',
      'Live practice on real faces + certification assessment',
    ],
    learningOutcomes: [
      'Classify face shapes and their personality implications',
      'Read individual features for character and fortune',
      'Offer structured face-reading consultations',
    ],
    curriculum: [
      { title: 'Module 1 — Face Shapes', lessons: ['The core face shapes', 'Personality traits by shape', 'Case studies'] },
      { title: 'Module 2 — Facial Features', lessons: ['Forehead & eyebrows', 'Eyes & nose', 'Lips, chin & ears'] },
      { title: 'Module 3 — Fortune & Timing', lessons: ['Twelve palaces of the face', 'Reading luck periods', 'Career indicators'] },
      { title: 'Module 4 — Professional Practice', lessons: ['Structuring a reading', 'Live practice sessions', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 16,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Is this a well-known system?', answer: 'Face Reading is a niche, low-competition skill, giving you a strong point of differentiation as a practitioner.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Face reading specialist with cross-training in physiognomy traditions.', image: '' },
    isActive: true,
  },

  /* 5. GRAPHOLOGY  (Live · Specialist) */
  {
    title: 'Graphology & Signature Analysis Course',
    slug: 'graphology',
    category: 'Graphology',
    tier: 'Specialist',
    courseType: 'Live',
    level: 'Intermediate',
    price: 8999,
    mrp: 12999,
    validityDays: 0,
    duration: '16 classes · ~24 hrs · 7–8 wks',
    modulesCount: 4,
    description:
      'Decode personality and hidden traits from handwriting and signatures, ending with graphotherapy — changing behaviour by changing handwriting.',
    longDesc:
      'Decode personality, behaviour and hidden traits from handwriting and signatures. This live certification covers complete handwriting analysis plus the specialised art of signature reading, ending with graphotherapy — the technique of improving personality traits by consciously changing handwriting.',
    topics: [
      'Introduction to graphology — how handwriting mirrors the mind',
      'Baseline, slant and what they reveal about emotional nature',
      'Size of writing — confidence, focus and social needs',
      'Pressure and speed — energy, drive and stress levels',
      'Spacing between words and lines — thinking patterns',
      'Margins and page usage — attitude to past, future and money',
      'Zones of writing (upper, middle, lower) and personality layers',
      'Individual letter formations and their psychological meaning',
      'T-bars, i-dots and connecting strokes',
      'Signature analysis — the public self vs the private self',
      'Danger signs in handwriting — dishonesty, stress, instability',
      'Handwriting changes: tracking personality over time',
      'Graphotherapy — changing handwriting to change behaviour',
      'Analysing famous signatures — case studies',
      'Professional report writing for graphology clients',
      'Live analysis practice + certification assessment',
    ],
    learningOutcomes: [
      'Analyse core handwriting traits accurately',
      'Build structured personality profiles from samples',
      'Offer professional graphology consultations',
    ],
    curriculum: [
      { title: 'Module 1 — Handwriting Basics', lessons: ['Slant, size & pressure', 'Zones of handwriting', 'Baseline behaviour'] },
      { title: 'Module 2 — Letter Analysis', lessons: ['Key letter formations', 'Loops & connections', 'Speed & rhythm'] },
      { title: 'Module 3 — Signature & Spacing', lessons: ['Signature vs text analysis', 'Margins & spacing', 'Case studies'] },
      { title: 'Module 4 — Professional Practice', lessons: ['Building a report', 'Live sample analysis', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 16,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Is graphology scientifically recognised?', answer: 'Graphology is a well-established observational discipline used in personality profiling and is taught here as a practical, in-demand skill.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified graphologist with experience in personality profiling.', image: '' },
    isActive: true,
  },

  /* 6. TAROT — BASIC TO PROFESSIONAL  (Live · Specialist) */
  {
    title: 'Tarot (Basic to Professional)',
    slug: 'tarot-basic-to-professional',
    category: 'Tarot',
    tier: 'Specialist',
    courseType: 'Live',
    level: 'Intermediate',
    price: 9999,
    mrp: 13999,
    validityDays: 0,
    duration: '16 classes · ~26 hrs · 7–8 wks',
    modulesCount: 4,
    description:
      'Go from never having touched a deck to conducting confident, paid professional tarot readings — all 78 cards, taught live.',
    longDesc:
      'Go from never having touched a deck to conducting confident, paid professional readings. All 78 cards, every essential spread, timing techniques and real client-handling skills — taught live with practice readings in every phase of the course.',
    topics: [
      'History and structure of the 78-card tarot deck',
      'Connecting with your deck — cleansing, energising and care',
      "The 22 Major Arcana — the soul's journey, card by card",
      'Minor Arcana: the suit of Wands (fire — action and career)',
      'Minor Arcana: the suit of Cups (water — love and emotion)',
      'Minor Arcana: the suit of Swords (air — mind and conflict)',
      'Minor Arcana: the suit of Pentacles (earth — money and material life)',
      'Court cards — reading people through the deck',
      'Reversed cards and their interpretations',
      'Classic spreads: one-card, three-card, Celtic Cross',
      'Speciality spreads: love, career, money and yes/no',
      'Timing techniques — predicting when events will happen',
      "Intuition development and reading the querent's energy",
      'Ethics, boundaries and handling sensitive readings',
      'Setting up as a professional tarot reader — pricing and client handling',
      'Live reading practice + certification assessment',
    ],
    learningOutcomes: [
      'Read all 78 Tarot cards confidently, upright and reversed',
      'Run structured professional consultations',
      'Build a client-ready Tarot practice',
    ],
    curriculum: [
      { title: 'Module 1 — Major Arcana', lessons: ['The Fool\'s Journey', 'Cards 0–10', 'Cards 11–21'] },
      { title: 'Module 2 — Minor Arcana', lessons: ['Wands & Cups', 'Swords & Pentacles', 'Court cards'] },
      { title: 'Module 3 — Spreads & Practice', lessons: ['3-card & Celtic Cross', 'Reversed cards', 'Live practice readings'] },
      { title: 'Module 4 — Professional Practice', lessons: ['Structuring client sessions', 'Ethics & boundaries', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 16,
      classDuration: '100 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Do I need a Tarot deck before starting?', answer: 'Yes, we recommend the Rider-Waite-Smith deck; guidance on where to buy is shared before Module 1.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Professional Tarot reader and mentor with client-consultation experience.', image: '' },
    isActive: true,
  },

  /* 7. KUNDALI READING MASTERCLASS  (Live · Specialist) */
  {
    title: 'Divisional Kundli Masterclass',
    slug: 'kundali-reading-masterclass',
    category: 'Vedic Astrology',
    tier: 'Specialist',
    courseType: 'Live',
    level: 'Intermediate',
    price: 9999,
    mrp: 13999,
    validityDays: 0,
    duration: '8 weekly sessions · ~28 hrs · 8 wks',
    modulesCount: 6,
    description:
      'For students who know basic astrology and want to go deep — unlocks Navamsa, Dashamsa, Saptamsa and the Ashtakavarga scoring system.',
    longDesc:
      'For students who know basic astrology and want to go deep. This masterclass unlocks the divisional charts — Navamsa, Dashamsa, Saptamsa and more — plus the Ashtakavarga scoring system, giving your predictions a precision that basic chart reading can never achieve.',
    topics: [
      'Why divisional charts exist — the logic of the varga system',
      "D-9 Navamsa — marriage, dharma and the soul's promise",
      'D-10 Dashamsa — career and professional destiny in depth',
      'D-7 Saptamsa and D-2 Hora — children and wealth',
      'D-4, D-12, D-24 — property, parents and education',
      'Ashtakavarga system — scoring transits with precision',
      'Important yogas re-examined through divisional charts',
      'Integrated case studies: full multi-varga chart analysis + assessment',
    ],
    learningOutcomes: [
      'Identify and interpret major Rajayogas and Dhana Yogas',
      'Read Navamsa and Dashamsha charts independently',
      'Use Ashtakavarga to evaluate transit periods',
      'Correlate Dasha + transit + natal chart for precise timing',
      'Conduct a structured 45-minute client consultation',
    ],
    curriculum: [
      { title: 'Module 1 — Yogas in Depth', lessons: ['Rajayoga identification rules', 'Dhana Yogas & wealth indicators', 'Viparita Raja Yoga', 'Parivartana (exchange) Yogas'] },
      { title: 'Module 2 — Divisional Charts', lessons: ['Purpose of D-charts', 'Navamsa (D9) — marriage & spirituality', 'Dashamsha (D10) — career & profession', 'Saptamsha (D7) & Drekanna (D3)'] },
      { title: 'Module 3 — Ashtakavarga', lessons: ['Understanding Bhinnashtakavarga', 'Sarvashtakavarga calculation', 'Applying Ashtakavarga to transits', 'Practical exercises'] },
      { title: 'Module 4 — Transits (Gochara)', lessons: ['Saturn & Jupiter transits — significance', 'Rahu/Ketu axis transits', 'Combining Dasha + transit', 'Timing major life events'] },
      { title: 'Module 5 — Medical Astrology', lessons: ['Significators of body parts', 'Identifying health challenges', 'Timing illness & recovery', 'Case studies'] },
      { title: 'Module 6 — Professional Practice', lessons: ['Structuring a client session', 'Ethical dos and don\'ts', 'Case study practice — 5 charts', 'Mock consultation & feedback'] },
    ],
    batchDetails: {
      startDate: 'Rolling Batches — Next batch starts 1st of every month',
      classCount: 24,
      classDuration: '2 hours',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'What is the prerequisite for this course?', answer: 'You should know the basics — planets, signs, and houses. Completion of our Foundation Course or equivalent knowledge is recommended.' },
      { question: 'Will I get a certificate?', answer: 'Yes. A course completion certificate is issued after passing the final assessment.' },
      { question: 'Can I use this knowledge professionally?', answer: 'Absolutely. By the end of this course you will have the skills to offer paid consultations.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Senior Jyotish practitioner specialising in predictive astrology and yogas.', image: '' },
    isActive: true,
  },

  /* ───────────────────────────────────────────────────────────
   * LIVE — ADVANCED
   * ─────────────────────────────────────────────────────────── */

  /* 8. KP SYSTEM OF ASTROLOGY  (Live · Advanced) */
  {
    title: 'KP System of Astrology',
    slug: 'kp-system-of-astrology',
    category: 'KP Astrology',
    tier: 'Advanced',
    courseType: 'Live',
    level: 'Advanced',
    price: 12999,
    mrp: 17999,
    validityDays: 0,
    duration: '10 weekly sessions · ~35 hrs · 10 wks',
    modulesCount: 7,
    description:
      "The most precise predictive system in modern astrology, famous for pinpoint 'yes or no, and when' answers — sub lords, significators, ruling planets and KP horary.",
    longDesc:
      "The most precise predictive system in modern astrology — famous for pinpoint 'yes or no, and when' answers. This live certification covers the complete Krishnamurti Paddhati: sub lords, significators, ruling planets and KP horary, turning vague predictions into exact ones.",
    topics: [
      'Why KP — the logic of Krishnamurti Paddhati vs traditional astrology',
      'The 249 subs — star lords and sub lords explained',
      'Casting a KP chart with Placidus houses',
      'Cuspal sub lords — the heart of KP prediction',
      'Significators and the ABCD grading method',
      "Ruling planets — KP's famous instant-timing tool",
      'KP horary (1–249) — precise answers to any question',
      'Timing events: dasha + transit the KP way',
      'Applying KP to career, marriage, children, property and litigation',
      'Full case-study practice + certification assessment',
    ],
    learningOutcomes: [
      'Understand the KP stellar sub-lord system completely',
      'Identify significators for any house matter accurately',
      'Use cuspal sub-lords to assess planetary promise',
      'Cast and read KP Horary charts',
      'Time events using KP transit and RP methods',
    ],
    curriculum: [
      { title: 'Module 1 — KP Fundamentals', lessons: ['Why KP? Comparison with Parashari', 'Nakshatras divided into sub-lords', 'Star-lord table and sub-lord table', 'KP Ayanamsa'] },
      { title: 'Module 2 — Significators', lessons: ['Primary significators (star-lord)', 'Secondary significators (sign lord)', 'Ruling planets and their usage', 'Framing the query correctly'] },
      { title: 'Module 3 — Cuspal Sub-Lords', lessons: ['Role of the cuspal sub-lord', 'Promise vs fulfilment', 'Applying CSL to marriage, career, health', 'Case studies'] },
      { title: 'Module 4 — KP Horary', lessons: ['Setting up a horary number', 'Reading the chart for YES/NO', 'Timing the event in horary', 'Practice questions'] },
      { title: 'Module 5 — Event Timing', lessons: ['When significators transit', 'Dasha, Bhukti, Antara method', 'Transits of significators', 'Calendar method'] },
      { title: 'Module 6 — Advanced Topics', lessons: ['KP for financial matters', 'Medical questions in KP', 'Missing persons & lost article', 'Combine natal + horary'] },
      { title: 'Module 7 — Practice & Certification', lessons: ['10 live chart readings', 'Student prediction attempts', 'Feedback & corrections', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — Next batch starts 1st of every month',
      classCount: 28,
      classDuration: '2 hours',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Is prior knowledge of Vedic Astrology needed?', answer: 'Basic familiarity with planets, signs, and houses is helpful but not mandatory. We introduce KP from scratch.' },
      { question: 'Is KP different from Parashari Jyotish?', answer: 'Yes, significantly. KP uses a different house system (Placidus), different Ayanamsa, and focuses entirely on the sub-lord theory for predictions.' },
      { question: 'What software do I need?', answer: 'We recommend KP Astro, Jagannatha Hora, or Astro-Vision KP software. Free versions are available.' },
    ],
    instructor: { name: 'To be assigned', bio: 'KP Astrology specialist and certified teacher with 8+ years of practice.', image: '' },
    isActive: true,
  },

  /* 9. ADVANCED PREDICTIVE ASTROLOGY  (Live · Advanced) */
  {
    title: 'Advanced Predictive Astrology',
    slug: 'advanced-predictive-astrology',
    category: 'Vedic Astrology',
    tier: 'Advanced',
    courseType: 'Live',
    level: 'Advanced',
    price: 16999,
    mrp: 23999,
    validityDays: 0,
    duration: '16 weekly sessions · ~45 hrs · 16 wks',
    modulesCount: 10,
    description:
      'Our most advanced open course — a 16-week mastery program in actually predicting events, not just describing charts.',
    longDesc:
      'Our most advanced open course — a 16-week mastery program in actually predicting events, not just describing charts. Jaimini, Prashna, Muhurta, advanced dashas and transits come together into one professional prediction methodology, taught through relentless real-chart practice.',
    topics: [
      'Advanced dasha analysis — antardasha and pratyantardasha precision',
      'Jaimini astrology — chara karakas and karakamsha',
      'Jaimini rashi dashas and pada analysis',
      'Prashna (horary) astrology — answering questions without a birth chart',
      'Muhurta — electing the perfect time for any event',
      'Advanced transit techniques — double transit and Ashtakavarga transit',
      'Retrograde, combust and vargottama planets in prediction',
      'Predicting career events with precision',
      'Predicting marriage, children and family events',
      'Predicting property, vehicles and foreign settlement',
      'Medical astrology fundamentals',
      'Remedial astrology — gemstones, mantras and donations, prescribed correctly',
      'Annual chart (Varshphal / Tajika) system',
      'Rectification and verification techniques',
      'Building your prediction methodology — the professional workflow',
      'Capstone case studies + certification assessment',
    ],
    learningOutcomes: [
      'Apply Jaimini Karakas and Arudha Padas for depth analysis',
      'Answer specific questions using Prashna charts',
      'Select auspicious timings using Muhurtha principles',
      'Construct and read Varshaphal (annual) charts',
      'Rectify birth time using life events',
    ],
    curriculum: [
      { title: 'Module 1 — Jaimini Karakas', lessons: ['Atmakaraka & its role', 'All 8 Karakas and significations', 'Jaimini Rashi aspects', 'Arudha Padas introduction'] },
      { title: 'Module 2 — Arudha Padas & Chara Dasha', lessons: ['Lagna Pada (AL) analysis', 'Upapada Lagna for marriage', 'Chara Dasha calculation & use', 'Case studies'] },
      { title: 'Module 3 — Prashna Astrology', lessons: ['Setting up a Prashna chart', 'Rules for answering questions', 'Lost articles & missing persons', 'Medical prashna'] },
      { title: 'Module 4 — Muhurtha', lessons: ['Tithi, Vara, Nakshatra, Yoga, Karana', 'Muhurtha for marriage', 'Business inauguration timing', 'Travel & surgical Muhurtha'] },
      { title: 'Module 5 — Varshaphal', lessons: ['Solar return chart construction', 'Muntha & its role', 'Varsha Dasha (Mudda Dasha)', 'Integrating with natal chart'] },
      { title: 'Module 6 — Sudarshana Chakra', lessons: ['Three-layered chakra analysis', 'Timing events using all three Lagnas', 'Integrating Sudarshana with Vimshottari', 'Practical exercise'] },
      { title: 'Module 7 — Nadi Concepts', lessons: ['Introduction to Nadi leaves', 'Bhrigu Nandi Nadi principles', 'Nadi transit techniques', 'Practical application'] },
      { title: 'Module 8 — Birth Time Rectification', lessons: ['Methods of rectification', 'Using life events as anchors', 'KP sub-lord method', 'Hands-on rectification practice'] },
      { title: 'Module 9 — Mundane Astrology', lessons: ['Ingress charts', 'National & political analysis', 'Financial market timing basics', 'Eclipse effects'] },
      { title: 'Module 10 — Integration & Mastery', lessons: ['Developing a signature prediction methodology', 'Complex multi-technique case studies', 'Live predictions workshop', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Quarterly batches — contact us for the next schedule',
      classCount: 40,
      classDuration: '2 hours',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Who should enrol in this course?', answer: 'Students who have completed our Foundation and Masterclass courses, or those with at least 2 years of independent study in Vedic Astrology.' },
      { question: 'Is there a payment plan?', answer: 'Yes. You can pay in 2 instalments. Contact us for details.' },
      { question: 'Do I get lifetime access to recordings?', answer: 'Yes — all session recordings are available lifetime in your dashboard.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Master-level Jyotishi with expertise in Jaimini and Prashna astrology.', image: '' },
    isActive: true,
  },

  /* ───────────────────────────────────────────────────────────
   * LIVE — FLAGSHIP
   * ─────────────────────────────────────────────────────────── */

  /* 10. PROFESSIONAL CERTIFICATION IN VEDIC ASTROLOGY  (Live · Flagship) */
  {
    title: 'Professional Certification in Vedic Astrology',
    slug: 'professional-certification-vedic-astrology',
    category: 'Vedic Astrology',
    tier: 'FLAGSHIP',
    courseType: 'Live',
    level: 'Advanced',
    price: 39999,
    mrp: 54999,
    validityDays: 0,
    duration: '~90 hrs total · 5–6 months · Capped ~20 seats/batch',
    modulesCount: 8,
    description:
      'A complete 5–6 month transformation from student to practising professional astrologer, with a supervised live internship on real client charts.',
    longDesc:
      'The flagship — a complete 5–6 month transformation from student to practising professional astrologer. Structured phases cover everything from foundations to advanced prediction and remedies, followed by a supervised live internship on real client charts. Seats are capped at around 20 per batch so every student gets personal mentorship.',
    topics: [
      'Phase 1 — Foundations: rashis, grahas, bhavas and chart reading mastery',
      'Phase 2 — Nakshatras and the Vimshottari dasha system in depth',
      'Phase 3 — Yogas: raj yogas, dhan yogas, doshas and cancellations',
      'Phase 4 — Divisional charts and Ashtakavarga',
      'Phase 5 — Predictive techniques: dasha + transit synthesis',
      'Phase 6 — Specialised areas: career, marriage, health, wealth and children',
      'Phase 7 — Remedial astrology: gemstones, mantras, charity and lifestyle',
      'Phase 8 — Consultation skills: ethics, communication and report writing',
      'Live case-study internship: real charts under mentor supervision',
      'Final panel assessment and professional certification',
    ],
    learningOutcomes: [
      'Independently read and interpret complex birth charts',
      'Complete supervised live client case studies',
      'Pass a panel-assessed professional certification',
      'Launch and run a professional astrology practice',
    ],
    curriculum: [
      { title: 'Module 1 — Core Theory Review', lessons: ['Planets, signs, houses recap', 'Dasha systems', 'Yogas'] },
      { title: 'Module 2 — Divisional Charts', lessons: ['Navamsa & Dashamsha', 'Ashtakavarga', 'Transits'] },
      { title: 'Module 3 — Advanced Prediction', lessons: ['Jaimini basics', 'Muhurtha', 'Rectification'] },
      { title: 'Module 4 — Case-Study Internship', lessons: ['Supervised live client cases', 'Mentor feedback rounds', 'Consultation practice'] },
      { title: 'Module 5 — Professional Practice', lessons: ['Ethics & client management', 'Building your practice', 'Pricing & positioning'] },
      { title: 'Module 6 — Panel Assessment', lessons: ['Mock panel review', 'Final case presentation', 'Certification'] },
    ],
    batchDetails: {
      startDate: 'Capped batches — ~20 seats. Contact us for the next intake.',
      classCount: 60,
      classDuration: '2 hours',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Why are seats capped?', answer: 'Seats are capped at ~20 per batch to ensure every student gets mentor time during the live case-study internship.' },
      { question: 'Is this suitable for someone wanting to practise professionally?', answer: 'Yes — this is our most complete, panel-certified program designed specifically to prepare you for professional practice.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Senior panel of certified Vedic Astrologers overseeing the flagship internship program.', image: '' },
    isActive: true,
  },

  /* NEW — ADVANCED VEDIC NUMEROLOGY COURSE  (Live) — added from July 2026 content pack, price TBD */
  {
    title: 'Advanced Vedic Numerology Course',
    slug: 'advanced-vedic-numerology-course',
    category: 'Numerology',
    tier: 'Advanced',
    courseType: 'Live',
    level: 'Advanced',
    price: null,
    mrp: null,
    validityDays: 0,
    duration: '10 classes · ~16 hrs · 4–5 wks',
    modulesCount: 10,
    description:
      'The professional level of numerology — personal year cycles, name-correction methodology, business/mobile-number analysis and full client reports.',
    longDesc:
      'The professional level of numerology. Building on the basics, you master personal year cycles, complete name-correction methodology, business and mobile-number analysis, and the art of preparing full client reports — everything needed to run paid numerology consultations.',
    topics: [
      'Advanced number combinations and compound numbers',
      'Deep Lo Shu grid analysis — planes, arrows and element balance',
      'Yearly, monthly and daily number cycles — personal timing',
      'Name correction methodology — the professional process',
      'Business name numerology and brand number selection',
      'Mobile number correction — the complete method',
      'Numerology + astrology combined analysis',
      'Advanced remedies: switch words, number grids and colour therapy',
      'Building complete client reports',
      'Professional consultation practice + certification assessment',
    ],
    learningOutcomes: [
      'Apply advanced compound-number and Lo Shu grid analysis',
      'Perform professional name and mobile-number correction',
      'Prepare complete numerology client reports',
      'Run paid numerology consultations confidently',
    ],
    curriculum: [
      { title: 'Module 1 — Advanced Number Systems', lessons: ['Compound numbers', 'Deep Lo Shu grid analysis', 'Element balance'] },
      { title: 'Module 2 — Timing Cycles', lessons: ['Personal year/month/day cycles', 'Timing major events'] },
      { title: 'Module 3 — Correction Methodology', lessons: ['Name correction process', 'Business & mobile number correction'] },
      { title: 'Module 4 — Professional Practice', lessons: ['Numerology + astrology combined', 'Client report building', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 10,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Do I need the Basic course first?', answer: 'Yes, this course assumes you already know core numerology calculations from our Basic Vedic Numerology course or equivalent.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified numerologist with hands-on consultation experience.', image: '' },
    isActive: false,
  },

  /* NEW — PRO CANDLE SPELL COURSE  (Live) — added from July 2026 content pack, price TBD */
  {
    title: 'Pro Candle Spell Course',
    slug: 'pro-candle-spell-course',
    category: 'Spiritual Remedies',
    tier: 'Professional',
    courseType: 'Live',
    level: 'Intermediate',
    price: null,
    mrp: null,
    validityDays: 0,
    duration: '8 classes · ~12 hrs · 4 wks',
    modulesCount: 8,
    description:
      'Learn the correct, complete method of candle spells — from choosing and dressing the candle to timing, casting and reading the flame.',
    longDesc:
      'Learn the correct, complete method of candle spells — one of the fastest-acting manifestation practices. From choosing and dressing the candle to timing, casting and reading the flame, this live course teaches the professional ritual craft that random YouTube videos never reveal.',
    topics: [
      'The science and tradition behind candle magick',
      'Candle types, shapes and sizes — choosing the right one',
      'Colour selection — the complete candle colour code',
      'Dressing and anointing candles: oils, herbs and inscriptions',
      'Timing your spell — moon phases, days and hours',
      'Spells for love, money, protection and success — full methods',
      'Reading candle flames, wax and smoke signs',
      'Safety, ethics and performing spells for clients + certification assessment',
    ],
    learningOutcomes: [
      'Choose and dress the correct candle for any intention',
      'Time spells correctly using moon phases, days and hours',
      'Read flame, wax and smoke signs after a ritual',
      'Perform candle spells safely and ethically for clients',
    ],
    curriculum: [
      { title: 'Module 1 — Candle Magick Foundations', lessons: ['Science & tradition', 'Candle types & colours'] },
      { title: 'Module 2 — Preparation & Timing', lessons: ['Dressing & anointing', 'Moon phases, days & hours'] },
      { title: 'Module 3 — Spellcasting', lessons: ['Love, money, protection & success spells', 'Reading flame & wax signs'] },
      { title: 'Module 4 — Professional Practice', lessons: ['Safety & ethics', 'Performing spells for clients', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 8,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'How is this different from the recorded Candle Spell Course?', answer: 'This is a live, mentor-led version with real-time guidance and Q&A on your own spells, versus the self-paced recorded course.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Spiritual practitioner specialising in ritual and remedial work.', image: '' },
    isActive: false,
  },

  /* NEW — PRO CRYSTAL HEALING & DOWSING  (Live) — added from July 2026 content pack, price TBD */
  {
    title: 'Pro Crystal Healing & Dowsing',
    slug: 'pro-crystal-healing-dowsing',
    category: 'Crystal Healing',
    tier: 'Professional',
    courseType: 'Live',
    level: 'Intermediate',
    price: null,
    mrp: null,
    validityDays: 0,
    duration: '14 classes · ~20 hrs · 6–7 wks',
    modulesCount: 14,
    description:
      'A complete live certification in crystal therapy and pendulum dowsing — chakra healing, crystal grids and accurate yes/no guidance, with live guided practice.',
    longDesc:
      'A complete live certification in the two most in-demand healing skills — crystal therapy and pendulum dowsing. Learn to select, cleanse and program crystals, run full chakra-healing sessions, and use the pendulum for accurate yes/no guidance and energy scanning, all with live guided practice.',
    topics: [
      'How crystals work — energy, vibration and the human field',
      'Identifying genuine crystals and detecting fakes',
      'The essential 30 crystals — properties and uses',
      'Cleansing, charging and programming crystals',
      'Chakra system fundamentals',
      'Crystal healing layouts for each chakra',
      'Crystals for wealth, love, protection and health',
      'Crystal grids — geometry and activation',
      'Introduction to pendulum dowsing',
      'Choosing, cleansing and calibrating your pendulum',
      'Yes/no dowsing and designing prediction charts',
      'Dowsing for chakra scanning and remedy selection',
      'Crystals + Vastu: energising spaces',
      'Client session structure and professional practice + certification assessment',
    ],
    learningOutcomes: [
      'Select, cleanse and program crystals correctly',
      'Run structured chakra-healing sessions with crystal layouts',
      'Perform accurate yes/no pendulum dowsing',
      'Structure a professional crystal-healing client session',
    ],
    curriculum: [
      { title: 'Module 1 — Crystal Foundations', lessons: ['Energy & vibration', 'Identifying genuine crystals', 'The essential 30 crystals'] },
      { title: 'Module 2 — Chakra Healing', lessons: ['Chakra fundamentals', 'Healing layouts', 'Crystals for wealth, love, protection & health'] },
      { title: 'Module 3 — Crystal Grids', lessons: ['Grid geometry & activation'] },
      { title: 'Module 4 — Pendulum Dowsing', lessons: ['Choosing & calibrating a pendulum', 'Yes/no dowsing', 'Chakra scanning & remedy selection'] },
      { title: 'Module 5 — Professional Practice', lessons: ['Crystals + Vastu', 'Client session structure', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 14,
      classDuration: '90 minutes',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Do I need to buy crystals before starting?', answer: 'A basic starter set is recommended; a shopping guide is shared before Module 1.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified crystal healer and energy practitioner.', image: '' },
    isActive: false,
  },

  /* NEW — LAAL KITAB PROFESSIONAL  (Live) — added from July 2026 content pack, price TBD */
  {
    title: 'Laal Kitab Professional',
    slug: 'laal-kitab-professional',
    category: 'Lal Kitab',
    tier: 'Professional',
    courseType: 'Live',
    level: 'Advanced',
    price: null,
    mrp: null,
    validityDays: 0,
    duration: '10 weekly sessions · ~30 hrs · 10 wks',
    modulesCount: 10,
    description:
      'Master the legendary red book — startlingly accurate predictions and simple, inexpensive remedies — from chart logic and karmic debts to varshphal and remedy prescription.',
    longDesc:
      'Master the legendary red book — famous for startlingly accurate predictions and simple, inexpensive remedies that work. This live professional course covers the complete Lal Kitab system from its unique chart logic and karmic debts to varshphal and remedy prescription for real clients.',
    topics: [
      'Origin and philosophy of Lal Kitab — how it differs from Vedic Jyotish',
      'Lal Kitab kundli creation and its unique house system',
      "Planets in Lal Kitab — nature, friendships and 'sleeping' planets",
      'Rin (karmic debts) — identifying pitru rin and other debts',
      'The 35-year planetary cycle of Lal Kitab',
      'Planets in each of the 12 houses — complete result analysis',
      'Blind chart (andhi kundli) and special chart conditions',
      'Varshphal — the Lal Kitab annual prediction method',
      'The famous Lal Kitab remedies (upay) — logic, method and precautions',
      'Professional case-study practice + certification assessment',
    ],
    learningOutcomes: [
      'Construct a Lal Kitab chart and identify karmic debts',
      'Read planets across all 12 houses in the Lal Kitab system',
      'Calculate the annual varshphal prediction',
      'Prescribe correct Lal Kitab remedies for real clients',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations', lessons: ['Origin & philosophy', 'Lal Kitab chart system', 'Sleeping planets'] },
      { title: 'Module 2 — Karmic Debts', lessons: ['Rin identification', '35-year planetary cycle'] },
      { title: 'Module 3 — Planets in Houses', lessons: ['Complete house-by-house results', 'Blind chart conditions'] },
      { title: 'Module 4 — Varshphal & Remedies', lessons: ['Annual prediction method', 'Remedy (upay) logic & precautions'] },
      { title: 'Module 5 — Professional Practice', lessons: ['Case-study practice', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 10,
      classDuration: '3 hours',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'How is this different from the recorded Laal Kitab courses?', answer: 'This is a live, mentor-led professional certification with real-time case study practice, versus our self-paced recorded Lal Kitab courses.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Senior Lal Kitab specialist with advanced remedy-prescription experience.', image: '' },
    isActive: false,
  },

  /* NEW — ASTRO-VASTU PROFESSIONAL  (Live) — added from July 2026 content pack, price TBD */
  {
    title: 'Astro-Vastu Professional',
    slug: 'astro-vastu-professional',
    category: 'Vastu',
    tier: 'Professional',
    courseType: 'Live',
    level: 'Advanced',
    price: null,
    mrp: null,
    validityDays: 0,
    duration: '10 weekly sessions · ~30 hrs · 10 wks',
    modulesCount: 10,
    description:
      'The premium skill of correcting life problems by aligning a home with the birth chart — floor plans, planetary energy mapping and no-demolition remedies.',
    longDesc:
      "The premium skill of correcting life problems by aligning a person's home with their birth chart. You learn to read floor plans, map planetary energies to directions, diagnose which corner of the house is blocking career, money or health — and fix it with practical, no-demolition remedies.",
    topics: [
      'Foundations: how astrology and Vastu connect',
      'The 16 directions and their planetary lordships',
      'Five elements (Panchtatva) in the home',
      'Reading a floor plan — zones, entrances and energy mapping',
      'Linking the birth chart to the house — the Astro-Vastu method',
      'Diagnosing life problems from the combination of chart + home',
      'Room-by-room analysis: bedroom, kitchen, toilet, study, temple',
      'Remedies without demolition: colours, mirrors, metals, symbols and placements',
      'Commercial Astro-Vastu: shops, offices and factories',
      'Full case studies and professional consultation practice + certification assessment',
    ],
    learningOutcomes: [
      'Read and grid a floor plan for planetary-direction analysis',
      'Diagnose which zone of a home is blocking a life area',
      'Prescribe no-demolition remedies for residential and commercial spaces',
      'Run a professional Astro-Vastu consultation',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations', lessons: ['Astrology + Vastu connection', '16 directions & lordships', 'Panchtatva elements'] },
      { title: 'Module 2 — Floor Plan Analysis', lessons: ['Reading & gridding a plan', 'Linking chart to house'] },
      { title: 'Module 3 — Diagnosis', lessons: ['Room-by-room analysis', 'Diagnosing life problems from chart + home'] },
      { title: 'Module 4 — Remedies', lessons: ['No-demolition remedies', 'Commercial Astro-Vastu'] },
      { title: 'Module 5 — Professional Practice', lessons: ['Full case studies', 'Certification assessment'] },
    ],
    batchDetails: {
      startDate: 'Rolling batches — next batch starts 1st of every month',
      classCount: 10,
      classDuration: '3 hours',
      platform: 'Zoom (recording provided)',
    },
    faqs: [
      { question: 'Do I need an architecture background?', answer: 'No — floor plan reading is taught from scratch.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Astro-Vastu consultant with experience in residential and commercial projects.', image: '' },
    isActive: false,
  },

  /* ───────────────────────────────────────────────────────────
   * RECORDED — LEAD MAGNET
   * ─────────────────────────────────────────────────────────── */

  /* 11. NUMEROLOGY & NAME CORRECTION  (Recorded · Lead Magnet) */
  {
    title: 'Numerology & Name Correction',
    slug: 'numerology-name-correction',
    category: 'Numerology',
    tier: 'Lead Magnet',
    courseType: 'Recorded',
    level: 'Beginner',
    price: 1999,
    mrp: 2999,
    validityDays: 365,
    duration: '8 modules · ~6 hrs',
    modulesCount: 5,
    description:
      'A compact, self-paced certificate teaching the single most requested numerology service — name correction.',
    longDesc:
      'A compact, self-paced certificate that teaches the single most requested numerology service — name correction. Learn to calculate core numbers, assess whether a name supports or blocks a person\'s destiny, and apply the correction method used by professional numerologists.',
    topics: [
      'Numerology fundamentals — Mulank, Bhagyank and their meanings',
      'The personality of numbers 1–9',
      'Planet–number connections',
      'Name numerology — calculating name numbers',
      'The name-correction method step by step',
      'Balancing name vibrations with birth numbers',
      'Lucky numbers, dates and colours',
      'Practical name-correction case studies',
    ],
    learningOutcomes: [
      'Calculate all core numerology numbers from name and date of birth',
      'Interpret Life Path, Destiny, Soul Urge, and Personality numbers',
      'Identify compatibility between numbers',
      'Perform professional name correction analysis',
      'Read personal year cycles for timing guidance',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations of Numerology', lessons: ['Origins and history', 'Chaldean vs Pythagorean', 'Number meanings 1–9 + master numbers 11, 22, 33', 'Basic calculation methods'] },
      { title: 'Module 2 — Core Numbers from Date of Birth', lessons: ['Life Path Number in detail', 'Birth Day Number', 'Karmic debt numbers', 'Practical examples'] },
      { title: 'Module 3 — Core Numbers from Name', lessons: ['Destiny / Expression Number', 'Soul Urge Number', 'Personality Number', 'Calculating from full birth name'] },
      { title: 'Module 4 — Cycles & Pinnacles', lessons: ['Personal Year cycle (1–9)', 'Personal Month & Day numbers', 'Life Pinnacles & Challenges', 'Timing major events'] },
      { title: 'Module 5 — Name Correction', lessons: ['Why names matter vibrationally', 'Chaldean method for name analysis', 'How to suggest corrections', 'Case studies — 5 real names'] },
    ],
    faqs: [
      { question: 'Is this course for beginners?', answer: 'Yes, completely. No prior knowledge of numerology or astrology is needed.' },
      { question: 'Can I use this to help clients professionally?', answer: 'Yes. By the end of the course you will have enough knowledge to offer basic numerology consultations and name corrections.' },
      { question: 'Do I need any special software?', answer: 'No — all calculations are done manually or with a basic calculator. We provide calculation worksheets.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified Numerologist practising name correction and life path coaching.', image: '' },
    isActive: true,
  },

  /* ───────────────────────────────────────────────────────────
   * RECORDED — ENTRY
   * ─────────────────────────────────────────────────────────── */

  /* 12. LAL KITAB — REMEDIES & PREDICTIONS  (Recorded · Entry) */
  {
    title: 'Lal Kitab — Remedies & Predictions',
    slug: 'lal-kitab-remedies-predictions',
    category: 'Lal Kitab',
    tier: 'Entry',
    courseType: 'Recorded',
    level: 'Intermediate',
    price: 3999,
    mrp: 5999,
    validityDays: 365,
    duration: '10 modules · ~8 hrs',
    modulesCount: 5,
    description:
      'The famous remedial system of the red book, distilled into a practical self-paced course — quick prediction rules and legendary simple remedies.',
    longDesc:
      "The famous remedial system of the red book, distilled into a practical self-paced course. Learn the quick prediction rules and the legendary simple remedies — feeding, donating, floating and placing — that have made Lal Kitab India's most loved practical astrology system.",
    topics: [
      "Introduction to Lal Kitab — the red book and its uniqueness",
      'Lal Kitab chart basics',
      'Planets in Lal Kitab — nature and special conditions',
      'Understanding karmic debts (rin)',
      'Planets in houses — quick prediction rules',
      'The logic of Lal Kitab remedies',
      'Remedies for each planet — the essential list',
      "Do's and don'ts — remedy precautions",
      'Common life problems and their Lal Kitab solutions',
      'Case-study walkthroughs',
    ],
    learningOutcomes: [
      'Construct a Lal Kitab chart from a Vedic birth chart',
      'Identify planetary debts and their life manifestations',
      'Prescribe appropriate Lal Kitab Upayas (remedies)',
      'Read the annual Lal Kitab chart for yearly predictions',
      'Integrate Lal Kitab remedies with regular chart consultations',
    ],
    curriculum: [
      { title: 'Module 1 — Introduction to Lal Kitab', lessons: ['Origin and manuscripts of Lal Kitab', 'Core philosophy and difference from Parashari', 'Setting up a Lal Kitab chart', 'Identifying the Lagna (Ascendant)'] },
      { title: 'Module 2 — Planets in Houses', lessons: ['Sun and Moon in all 12 houses', 'Mars and Mercury placements', 'Jupiter and Venus effects', 'Saturn, Rahu and Ketu positions'] },
      { title: 'Module 3 — Debts & Karmic Patterns', lessons: ['The 6 types of Rin (karmic debts)', 'Identifying debt from chart', 'Impact of debts on life events', 'How remedies resolve debts'] },
      { title: 'Module 4 — Lal Kitab Remedies', lessons: ['Types of Upayas — donations, items, rituals', 'Planetary remedies (planet-wise)', 'Do\'s and don\'ts of remedies', '20 most effective practical remedies'] },
      { title: 'Module 5 — Annual Lal Kitab Chart', lessons: ['Calculating the annual chart', 'Dormant and active planets in Varshkundali', 'Annual predictions method', '3 case study annual charts'] },
    ],
    faqs: [
      { question: 'Do I need to know Vedic Astrology first?', answer: 'Basic knowledge of planets and houses is helpful. We briefly revise these at the start.' },
      { question: 'Are the remedies expensive?', answer: 'Lal Kitab is famous precisely because its remedies are simple and low-cost — often involving common household items, colours, or small acts of charity.' },
      { question: 'Is Lal Kitab considered scientific?', answer: 'Lal Kitab is an empirical tradition developed from observed correlations. Like all astrology, it works as a guidance system rather than a scientific proof.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Lal Kitab specialist and astrologer with expertise in Upaya prescriptions.', image: '' },
    isActive: true,
  },

  /* ───────────────────────────────────────────────────────────
   * RECORDED — MID
   * ─────────────────────────────────────────────────────────── */

  /* 13. TAROT CARD READING (COMPLETE)  (Recorded · Mid) */
  {
    title: 'Tarot Card Reading (Complete)',
    slug: 'tarot-card-reading-complete',
    category: 'Tarot',
    tier: 'Mid',
    courseType: 'Recorded',
    level: 'Beginner',
    price: 3499,
    mrp: 4999,
    validityDays: 365,
    duration: '12 modules · ~10 hrs',
    modulesCount: 6,
    description:
      'A complete self-paced Tarot course covering all 78 cards — Major and Minor Arcana — with practical spreads, intuition development, and professional reading techniques.',
    longDesc:
      'Tarot is a powerful tool for self-reflection, guidance, and intuitive insight. This recorded course takes you through every one of the 78 cards in depth — their imagery, symbolism, upright and reversed meanings — and teaches you how to lay out spreads for yourself and others. By the end you will be reading Tarot confidently for daily guidance, relationships, career, and spiritual growth.',
    topics: [
      'History and origin of Tarot',
      'Major Arcana — all 22 cards in depth',
      'Minor Arcana — all 4 suits (56 cards)',
      'Court cards — understanding personality archetypes',
      'Popular spreads: 1-card, 3-card, Celtic Cross',
      'Reversed card meanings',
      'Developing intuition alongside card meanings',
      'Ethics of giving Tarot readings',
    ],
    learningOutcomes: [
      'Know the meaning of all 78 Tarot cards (upright + reversed)',
      'Perform 1-card, 3-card, and Celtic Cross readings',
      'Read for others professionally and ethically',
      'Develop personal intuitive style beyond book meanings',
      'Build a daily Tarot practice for self-development',
    ],
    curriculum: [
      { title: 'Module 1 — Introduction to Tarot', lessons: ['What is Tarot and how does it work?', 'History of Tarot cards', 'Choosing and caring for your deck', 'Setting up sacred space'] },
      { title: 'Module 2 — Major Arcana (0–10)', lessons: ['The Fool\'s Journey concept', 'Cards 0–5: The Fool to the Hierophant', 'Cards 6–10: The Lovers to the Wheel', 'How Major Arcana affects a reading'] },
      { title: 'Module 3 — Major Arcana (11–21)', lessons: ['Cards 11–15: Justice to the Devil', 'Cards 16–21: The Tower to The World', 'Major vs Minor Arcana in readings', 'Practice reading: Major Arcana only'] },
      { title: 'Module 4 — Minor Arcana', lessons: ['Suit of Wands — fire & passion', 'Suit of Cups — water & emotions', 'Suit of Swords — air & mind', 'Suit of Pentacles — earth & material'] },
      { title: 'Module 5 — Court Cards & Spreads', lessons: ['Pages, Knights, Queens & Kings', 'Court cards as people vs situations', '1-card, 3-card, Celtic Cross spreads', 'Past-Present-Future spread'] },
      { title: 'Module 6 — Professional Practice', lessons: ['Reading reversed cards', 'Structuring a client reading', 'Ethics, boundaries & disclaimers', 'Building confidence as a reader'] },
    ],
    faqs: [
      { question: 'Which Tarot deck do I need?', answer: 'We recommend the Rider-Waite-Smith deck for beginners as all teachings are based on its imagery. Any edition works.' },
      { question: 'Can I learn Tarot without being psychic?', answer: 'Absolutely! Tarot is a learnable skill based on symbolism and intuition development. No special abilities required.' },
      { question: 'How long do I have access to the videos?', answer: 'Access is valid for 1 year from the date of enrolment.' },
      { question: 'Is this course in Hindi or English?', answer: 'This course is available in Hindi with English subtitles and written materials.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Professional Tarot reader and teacher with 7 years of experience.', image: '' },
    isActive: true,
  },

  /* 14. PALMISTRY & HAND ANALYSIS  (Recorded · Mid) */
  {
    title: 'Palmistry & Hand Analysis',
    slug: 'palmistry-hand-analysis',
    category: 'Palmistry',
    tier: 'Mid',
    courseType: 'Recorded',
    level: 'Intermediate',
    price: 3999,
    mrp: 5999,
    validityDays: 365,
    duration: '12 modules · ~10 hrs',
    modulesCount: 6,
    description:
      'Hand shape, mounts, major & minor lines — a recorded introduction to classical Palmistry.',
    longDesc:
      'Palmistry (Hast Rekha Shastra) is one of the oldest predictive sciences, using the lines, mounts, shape, and markings of the hand to reveal character, health, relationships, and destiny. This recorded course covers classical Indian and Western palmistry traditions, teaching you to read both hands systematically, identify key lines (Heart, Head, Life, Fate), interpret mounts and special signs, and deliver insightful hand readings.',
    topics: [
      'Hand shape — Earth, Air, Fire, Water hands',
      'The four quadrants of the palm',
      'Major lines: Life, Head, Heart, Fate, Sun',
      'Minor lines: Marriage, Children, Travel, Intuition',
      'The Mounts of the palm',
      'Special marks: Stars, Squares, Crosses, Triangles',
      'Timing events on the Life line',
      'Reading both hands — dominant vs non-dominant',
    ],
    learningOutcomes: [
      'Classify hand shapes and understand their personality implications',
      'Identify and interpret all major and minor lines',
      'Read the mounts and understand their meaning in context',
      'Time significant life events using line formations',
    ],
    curriculum: [
      { title: 'Module 1 — Introduction to Palmistry', lessons: ['History of palmistry across cultures', 'Hand shape classification', 'Finger shapes and meanings', 'Which hand to read and when'] },
      { title: 'Module 2 — The Major Lines', lessons: ['Life Line — health, vitality & timeline', 'Head Line — intellect & decision making', 'Heart Line — emotions & relationships', 'Fate / Destiny Line'] },
      { title: 'Module 3 — The Sun, Mercury & Minor Lines', lessons: ['Sun Line — success & fame', 'Mercury Line — business & communication', 'Marriage & relationship lines', 'Children lines'] },
      { title: 'Module 4 — The Mounts', lessons: ['Mount of Jupiter, Saturn & Apollo', 'Mount of Mercury, Venus & Moon', 'Mount of Mars (inner & outer)', 'Interpreting overdeveloped mounts'] },
      { title: 'Module 5 — Special Markings', lessons: ['Stars, squares, and triangles', 'Crosses and grilles', 'Islands and breaks in lines', 'Mystic cross and intuition marks'] },
      { title: 'Module 6 — Reading Practice', lessons: ['Reading both hands together', 'Timing life events on lines', 'Structuring a 30-minute session', '5 case study hand prints'] },
    ],
    faqs: [
      { question: 'Is palmistry related to astrology?', answer: 'Yes — palmistry and Vedic Astrology share planetary symbolism. Mounts are named after planets and the lines correspond to astrological influences.' },
      { question: 'How do I practice without clients?', answer: 'We provide high-resolution hand print images throughout the course for practice. You can also read your own hands and those of family members.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Classical palmist trained in both Indian (Hast Rekha) and Western traditions.', image: '' },
    isActive: true,
  },

  /* 15. CANDLE SPELL COURSE  (Recorded · Mid) */
  {
    title: 'Candle Spell Course',
    slug: 'candle-spell-course',
    category: 'Spiritual Remedies',
    tier: 'Mid',
    courseType: 'Recorded',
    level: 'Beginner',
    price: 3499,
    mrp: 4999,
    validityDays: 365,
    duration: '7 modules · ~6 hrs',
    modulesCount: 4,
    description:
      'Learn the correct method of candle spells for positive results — ritual steps, colour codes, timing and flame reading, fully self-paced.',
    longDesc:
      'Learn the correct method of candle spells for positive results — the ritual steps, colour codes, timing and flame reading that make the difference between a candle that just burns and a spell that works. Fully self-paced, beginner-safe and practical from day one.',
    topics: [
      'Introduction to candle magick and how it works',
      'Candle types and colour meanings',
      'Preparing and dressing your candle',
      'Timing basics — moon phases and days',
      'Core spells: positivity, protection and attraction',
      'Performing your first complete spell ritual',
      'Reading flame and wax signs',
    ],
    learningOutcomes: [
      'Perform a correctly structured candle spell from start to finish',
      'Select the right colour and timing for a given intention',
      'Understand safety and ritual-closing practices',
    ],
    curriculum: [
      { title: 'Module 1 — Candle Magic Basics', lessons: ['History of candle rituals', 'Candle colours & meanings', 'Tools you need'] },
      { title: 'Module 2 — Timing & Intention', lessons: ['Choosing the right day/time', 'Writing effective intentions', 'Common mistakes to avoid'] },
      { title: 'Module 3 — The Ritual Method', lessons: ['Step-by-step spell casting', 'Closing & grounding the ritual', 'Reading the candle burn'] },
      { title: 'Module 4 — Practice & Safety', lessons: ['Safety precautions', 'Cleansing your space', 'Practice spells for common goals'] },
    ],
    faqs: [
      { question: 'Is this safe to practise at home?', answer: 'Yes, when the safety guidelines in Module 4 are followed. All materials used are simple household candles.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Spiritual practitioner specialising in ritual and remedial work.', image: '' },
    isActive: true,
  },

  /* 16. CRYSTAL HEALING & DOWSING  (Recorded · Mid) */
  {
    title: 'Crystal Healing & Dowsing',
    slug: 'crystal-healing-dowsing',
    category: 'Crystal Healing',
    tier: 'Mid',
    courseType: 'Recorded',
    level: 'Intermediate',
    price: 5999,
    mrp: 8499,
    validityDays: 365,
    duration: '12 modules · ~14 hrs',
    modulesCount: 5,
    description:
      'A complete self-paced journey into crystal healing plus the bonus skill of pendulum dowsing.',
    longDesc:
      'A complete self-paced journey into crystal healing plus the bonus skill of pendulum dowsing. Learn to choose genuine crystals, cleanse, charge and program them, apply chakra-based healing layouts and get reliable yes/no answers with a pendulum — for self-healing or to serve others.',
    topics: [
      'How crystal energy works',
      'Identifying genuine crystals',
      'The 20 essential crystals and their properties',
      'Cleansing and charging methods',
      'Programming crystals with intention',
      'The chakra system explained',
      'Crystal placements for each chakra',
      'Crystals for wealth, love, protection and health',
      'Wearing crystals — bracelets, pendants and rings done right',
      'Introduction to pendulum dowsing',
      'Yes/no dowsing technique and practice',
      'Crystals in the home — placement and energy correction',
    ],
    learningOutcomes: [
      'Select and use the right crystals for common needs',
      'Cleanse, charge, and maintain crystal energy',
      'Build simple crystal grids for healing and protection',
      'Practise basic pendulum dowsing',
    ],
    curriculum: [
      { title: 'Module 1 — Crystal Fundamentals', lessons: ['Crystal properties overview', 'Choosing crystals for intention', 'Cleansing & charging methods'] },
      { title: 'Module 2 — Chakra & Healing Work', lessons: ['Crystals for each chakra', 'Healing layouts', 'Protection crystals'] },
      { title: 'Module 3 — Crystal Grids', lessons: ['Building a grid', 'Grid patterns for goals', 'Maintaining a grid'] },
      { title: 'Module 4 — Introduction to Dowsing', lessons: ['What is dowsing?', 'Choosing a pendulum', 'Basic yes/no calibration'] },
      { title: 'Module 5 — Practice & Application', lessons: ['Dowsing for energy detection', 'Combining crystals + dowsing', 'Practice sessions'] },
    ],
    faqs: [
      { question: 'Do I need to buy crystals before starting?', answer: 'A basic starter set is recommended; a shopping guide is included in Module 1.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified crystal healer and energy practitioner.', image: '' },
    isActive: true,
  },

  /* ───────────────────────────────────────────────────────────
   * RECORDED — COMPREHENSIVE
   * ─────────────────────────────────────────────────────────── */

  /* 17. PALMISTRY (BASIC TO ADVANCE)  (Recorded · Comprehensive) */
  {
    title: 'Palmistry (Basic to Advance)',
    slug: 'palmistry-basic-to-advance',
    category: 'Palmistry',
    tier: 'Comprehensive',
    courseType: 'Recorded',
    level: 'Advanced',
    price: 7999,
    mrp: 11499,
    validityDays: 365,
    duration: '18 modules · ~20 hrs',
    modulesCount: 6,
    description:
      'The complete art of hand reading, from your first glance at a palm to advanced event timing.',
    longDesc:
      'The complete art of hand reading, from your first glance at a palm to advanced event timing. Eighteen structured modules cover every major and minor line, all nine mounts, signs and symbols — finishing with a professional step-by-step method for full palm analysis.',
    topics: [
      'Introduction to Hast Rekha Shastra',
      'Hand shapes and elemental hand types',
      'Fingers, thumbs and nails — personality indicators',
      'The mounts of the palm — all nine explained',
      'The life line in depth',
      'The head line in depth',
      'The heart line in depth',
      'The fate line — career and destiny',
      'The sun line — fame and success',
      'Health, marriage and children lines',
      'Travel, intuition and money lines',
      'Minor lines and special markings',
      'Signs, symbols and dangerous markings',
      'Timing events on the palm',
      'Comparing left vs right hand',
      'Remedies suggested through palmistry',
      'Complete palm analysis method — step by step',
      'Advanced case studies and practice readings',
    ],
    learningOutcomes: [
      'Deliver an advanced, multi-area predictive palmistry reading',
      'Time life events precisely using advanced line techniques',
      'Identify and interpret rare hand markings',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations Recap', lessons: ['Hand shapes & major lines', 'Mounts overview', 'Quick-start reading practice'] },
      { title: 'Module 2 — Advanced Line Timing', lessons: ['Precise age-point mapping', 'Life event correlation', 'Cross-verifying with minor lines'] },
      { title: 'Module 3 — Career & Wealth Indicators', lessons: ['Career line analysis', 'Wealth & success markers', 'Business vs job indicators'] },
      { title: 'Module 4 — Marriage & Relationships', lessons: ['Marriage line analysis', 'Compatibility indicators', 'Timing marriage events'] },
      { title: 'Module 5 — Health Indicators', lessons: ['Health markers on the hand', 'Vitality & life line depth', 'Caution signs'] },
      { title: 'Module 6 — Advanced Practice', lessons: ['Rare markings deep-dive', 'Full client report building', 'Case studies — advanced hands'] },
    ],
    faqs: [
      { question: 'Do I need the Mid-tier Palmistry course first?', answer: 'Not required, but recommended if you are completely new — this program moves at a faster, more advanced pace.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Advanced palmistry practitioner with 10+ years of client reading experience.', image: '' },
    isActive: true,
  },

  /* 18. ASTRO-VASTU SHASTRA (BASIC TO ADVANCE)  (Recorded · Comprehensive) */
  {
    title: 'Astro-Vastu Shastra (Basic to Advance)',
    slug: 'astro-vastu-shastra-basic-to-advance',
    category: 'Vastu',
    tier: 'Comprehensive',
    courseType: 'Recorded',
    level: 'Advanced',
    price: 12999,
    mrp: 17999,
    validityDays: 365,
    duration: '32 modules · ~40 hrs',
    modulesCount: 8,
    description:
      'Our most comprehensive recorded program — 40 hours covering complete Vastu Shastra fused with astrology.',
    longDesc:
      'Our most comprehensive recorded program — 40 hours covering complete Vastu Shastra fused with astrology. Learn to grid any floor plan, connect it to the occupant\'s birth chart, diagnose exactly which zone is causing money, health or relationship problems, and correct it without breaking a single wall.',
    topics: [
      'Foundations of Vastu Shastra and its scientific logic',
      'The five elements and their zones in a building',
      'The 16 Vastu directions in detail (multi-module series)',
      'Reading and gridding a floor plan',
      'The Vastu Purusha Mandala',
      'Astrology basics needed for Astro-Vastu',
      'Linking the birth chart to the home',
      'Main entrance analysis — the most critical factor',
      'Room-by-room Vastu: bedroom, kitchen, toilet, study, pooja room (module series)',
      'Water, fire and earth element corrections',
      'Colours, mirrors, metals and symbols as remedies',
      'Vastu defects (dosha) and no-demolition corrections',
      'Commercial Vastu: shops, offices and factories',
      'Plot selection and construction Vastu',
      'Astro-Vastu case studies — diagnosing life problems from the home',
      'Full property audit method — professional workflow',
    ],
    learningOutcomes: [
      'Analyse a floor plan for Vastu compliance',
      'Correlate planetary influences with Vastu zones',
      'Identify and remedy common Vastu doshas',
      'Advise on both residential and commercial Vastu',
    ],
    curriculum: [
      { title: 'Module 1 — Vastu Fundamentals', lessons: ['Directions & the 8 zones', 'The five elements', 'Vastu Purusha Mandala'] },
      { title: 'Module 2 — Planetary Correlations', lessons: ['Planet-direction mapping', 'Astro-Vastu synthesis', 'Reading a chart alongside a floor plan'] },
      { title: 'Module 3 — Floor Plan Analysis', lessons: ['Reading architectural plans', 'Room placement rules', 'Entrance & main door analysis'] },
      { title: 'Module 4 — Common Doshas', lessons: ['Identifying Vastu doshas', 'Effects on health, wealth & relationships', 'Priority-ranking issues'] },
      { title: 'Module 5 — Remedies', lessons: ['Non-structural remedies', 'Colour & element corrections', 'Placement of objects & symbols'] },
      { title: 'Module 6 — Commercial Vastu', lessons: ['Office & shop layout', 'Cash counter & seating placement', 'Case studies'] },
      { title: 'Module 7 — Advanced Integration', lessons: ['Combining chart timing with Vastu correction', 'Muhurtha for Vastu remedies', 'Complex property case studies'] },
      { title: 'Module 8 — Practice & Certification', lessons: ['Full property assessment practice', 'Report writing', 'Certification assessment'] },
    ],
    faqs: [
      { question: 'Do I need an architecture background?', answer: 'No — floor plan reading is taught from scratch in Module 3.' },
      { question: 'Can this be applied to rented properties?', answer: 'Yes, most remedies taught are non-structural and work for rented spaces too.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Astro-Vastu consultant with experience in residential and commercial projects.', image: '' },
    isActive: true,
  },

  /* 19. LAAL KITAB (BASIC TO ADVANCE)  (Recorded · Comprehensive) */
  {
    title: 'Laal Kitab (Basic to Advance)',
    slug: 'laal-kitab-basic-to-advance',
    category: 'Lal Kitab',
    tier: 'Comprehensive',
    courseType: 'Recorded',
    level: 'Advanced',
    price: 14999,
    mrp: 19999,
    validityDays: 365,
    duration: '42 modules · ~50 hrs',
    modulesCount: 8,
    description:
      'The definitive basic-to-advance program on one of the most powerful predictive and remedial systems ever written.',
    longDesc:
      "The definitive basic-to-advance program on one of the most powerful predictive and remedial systems ever written. Across 42 modules and 50 hours you master the red book's unique grammar, karmic debt analysis, house-by-house results, varshphal and its complete remedy encyclopaedia — to true practitioner depth.",
    topics: [
      'History and five original editions of Lal Kitab',
      'Lal Kitab chart system vs Vedic chart (module series)',
      'Grammar of Lal Kitab — the rules that unlock the book',
      'Each planet in Lal Kitab in depth — nature, friends, enemies (9-module series)',
      'Sleeping planets and sleeping houses',
      'Karmic debts (rin) — all types with identification rules',
      'Blind chart and half-blind chart conditions',
      'Planets in all 12 houses — complete results (12-module series)',
      'The 35-year cycle and planetary periods',
      'Varshphal — annual predictions the Lal Kitab way',
      'Remedy logic — why Lal Kitab upay work',
      'Complete remedy encyclopaedia by planet and house',
      'Remedy precautions and common mistakes',
      'Professional case studies — full chart to remedy workflow',
    ],
    learningOutcomes: [
      'Build and interpret a complete Laal Kitab chart independently',
      'Diagnose the full range of karmic debts from a chart',
      'Prescribe the correct remedy from the complete Upaya library',
      'Read annual Varshkundali charts for detailed yearly predictions',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations', lessons: ['Origins & philosophy', 'Chart construction', 'Pakki ghar (permanent houses)'] },
      { title: 'Module 2 — Planets in Houses (Part 1)', lessons: ['Sun, Moon, Mars', 'Mercury, Jupiter', 'Case studies'] },
      { title: 'Module 3 — Planets in Houses (Part 2)', lessons: ['Venus, Saturn', 'Rahu, Ketu', 'Combined placements'] },
      { title: 'Module 4 — Karmic Debts', lessons: ['All 6 types of Rin', 'Identifying debt patterns', 'Life manifestations'] },
      { title: 'Module 5 — Remedy Library', lessons: ['Planet-wise Upayas', 'Donation & ritual remedies', 'Sequencing multiple remedies'] },
      { title: 'Module 6 — Annual Chart Mastery', lessons: ['Varshkundali construction', 'Dormant vs active planets', 'Yearly prediction method'] },
      { title: 'Module 7 — Advanced Integration', lessons: ['Combining with Parashari analysis', 'Complex multi-debt case studies', 'Client consultation structure'] },
      { title: 'Module 8 — Certification Practice', lessons: ['Full chart case studies', 'Report writing practice', 'Certification assessment'] },
    ],
    faqs: [
      { question: 'How is this different from the Entry-level Lal Kitab course?', answer: 'This comprehensive program goes far deeper — covering the complete remedy library, advanced annual chart analysis, and certification-level case studies.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Senior Lal Kitab specialist with advanced remedy-prescription experience.', image: '' },
    isActive: true,
  },

  /* ───────────────────────────────────────────────────────────
   * RECORDED — NEW FOUNDATION COURSES  (added from July 2026 content pack, price TBD)
   * ─────────────────────────────────────────────────────────── */

  /* NEW — NUMEROLOGY FOUNDATION COURSE  (Recorded) */
  {
    title: 'Numerology Foundation Course',
    slug: 'numerology-foundation-course',
    category: 'Numerology',
    tier: 'Lead Magnet',
    courseType: 'Recorded',
    level: 'Beginner',
    price: null,
    mrp: null,
    validityDays: 365,
    duration: '6 modules · ~4 hrs',
    modulesCount: 6,
    description:
      'The easiest possible entry into occult sciences — calculate core numbers and plot your first Lo Shu grid in about four hours.',
    longDesc:
      'The easiest possible entry into occult sciences. In about four hours of crisp recorded lessons you learn to calculate and interpret the core numbers of anyone\'s birth date and plot your first Lo Shu grid — a perfect taste before committing to the live numerology certifications.',
    topics: [
      'What numerology is and how it works',
      'Calculating your core numbers from date of birth',
      'Meanings of numbers 1–9',
      'Introduction to the Lo Shu grid',
      'Plotting your first grid and basic interpretation',
      'Doing your first readings — a simple framework',
    ],
    learningOutcomes: [
      'Calculate core numerology numbers from a date of birth',
      'Plot and read a basic Lo Shu grid',
      'Perform a simple first numerology reading',
    ],
    curriculum: [
      { title: 'Module 1 — Numerology Basics', lessons: ['What numerology is', 'Core number calculation'] },
      { title: 'Module 2 — Number Meanings', lessons: ['Meanings of 1–9'] },
      { title: 'Module 3 — Lo Shu Grid', lessons: ['Introduction & plotting', 'Basic interpretation'] },
      { title: 'Module 4 — First Readings', lessons: ['Simple reading framework'] },
    ],
    faqs: [
      { question: 'Is this the same as the Numerology & Name Correction course?', answer: 'No — this is a shorter, more basic entry point. Name Correction is a separate, slightly deeper course focused specifically on correcting names.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified Numerologist practising name correction and life path coaching.', image: '' },
    isActive: false,
  },

  /* NEW — TAROT FOUNDATION COURSE  (Recorded) */
  {
    title: 'Tarot Foundation Course',
    slug: 'tarot-foundation-course',
    category: 'Tarot',
    tier: 'Lead Magnet',
    courseType: 'Recorded',
    level: 'Beginner',
    price: null,
    mrp: null,
    validityDays: 365,
    duration: '8 modules · ~6 hrs',
    modulesCount: 8,
    description:
      'Everything a complete beginner needs to start reading tarot confidently — Major Arcana, suit essentials and your first spreads.',
    longDesc:
      'Everything a complete beginner needs to start reading tarot confidently — the Major Arcana, suit essentials and your first spreads, in bite-sized recorded lessons. Finish this and you will be ready for the live Tarot Basic→Professional certification whenever you want to go pro.',
    topics: [
      'Introduction to tarot and the structure of the deck',
      'Choosing, cleansing and bonding with your first deck',
      'The 22 Major Arcana — core meanings',
      'Overview of the four Minor Arcana suits',
      'The one-card daily draw practice',
      'The classic three-card spread (past–present–future)',
      'Asking questions the right way',
      'Your first full readings — guided practice',
    ],
    learningOutcomes: [
      'Know the core meanings of all 22 Major Arcana cards',
      'Read simple one-card and three-card spreads',
      'Ask well-formed questions and give a first guided reading',
    ],
    curriculum: [
      { title: 'Module 1 — Getting Started', lessons: ['Deck structure', 'Choosing & cleansing your deck'] },
      { title: 'Module 2 — Major Arcana', lessons: ['Core meanings of all 22 cards'] },
      { title: 'Module 3 — Minor Arcana Overview', lessons: ['The four suits'] },
      { title: 'Module 4 — First Spreads', lessons: ['One-card draw', 'Three-card spread', 'Asking questions', 'Guided first readings'] },
    ],
    faqs: [
      { question: 'How is this different from Tarot Card Reading (Complete)?', answer: 'This is a shorter beginner-only foundation; the Complete course goes deeper into all 78 cards and professional reading technique.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Professional Tarot reader and teacher with 7 years of experience.', image: '' },
    isActive: false,
  },

  /* NEW — FACE READING FOUNDATION COURSE  (Recorded) */
  {
    title: 'Face Reading Foundation Course',
    slug: 'face-reading-foundation-course',
    category: 'Face Reading',
    tier: 'Lead Magnet',
    courseType: 'Recorded',
    level: 'Beginner',
    price: null,
    mrp: null,
    validityDays: 365,
    duration: '8 modules · ~6 hrs',
    modulesCount: 8,
    description:
      'Learn to read the basics of any face in a weekend — face zones, shapes and the meaning of every major feature.',
    longDesc:
      'Learn to read the basics of any face in a weekend. This self-paced foundation covers face zones, shapes and the meaning of every major feature, so you can build quick personality profiles of the people around you — and decide if the full live Face Reading certification is your calling.',
    topics: [
      'Introduction to Samudrik Shastra face reading',
      'The three zones of the face',
      'Face shapes and personality types',
      'Forehead and eyebrows — career and temperament',
      'Eyes and nose — nature and wealth',
      'Lips, chin and jaw — love and willpower',
      'Moles and marks — quick meanings',
      'Building a basic face profile — practice framework',
    ],
    learningOutcomes: [
      'Classify basic face shapes and zones',
      'Read core facial features for personality traits',
      'Build a quick face-reading profile of a person',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations', lessons: ['Samudrik Shastra intro', 'Face zones', 'Face shapes'] },
      { title: 'Module 2 — Feature Reading', lessons: ['Forehead & eyebrows', 'Eyes & nose', 'Lips, chin & jaw'] },
      { title: 'Module 3 — Practice', lessons: ['Moles & marks', 'Building a basic profile'] },
    ],
    faqs: [
      { question: 'How is this different from the live Face Reading course?', answer: 'This recorded foundation covers the basics only; the live certification goes into full depth with case studies and professional practice.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Face reading specialist with cross-training in physiognomy traditions.', image: '' },
    isActive: false,
  },

  /* NEW — BASIC VEDIC ASTROLOGY COURSE  (Recorded) */
  {
    title: 'Basic Vedic Astrology Course',
    slug: 'basic-vedic-astrology-course',
    category: 'Vedic Astrology',
    tier: 'Entry',
    courseType: 'Recorded',
    level: 'Beginner',
    price: null,
    mrp: null,
    validityDays: 365,
    duration: '10 modules · ~8 hrs',
    modulesCount: 10,
    description:
      'A self-paced introduction to real Jyotish for absolute beginners — planets, houses and dasha periods with a simple, repeatable reading method.',
    longDesc:
      'A self-paced introduction to real Jyotish for absolute beginners. Ten recorded modules take you from opening your first birth chart to identifying planets, houses and dasha periods with a simple, repeatable reading method — the ideal stepping stone to the live astrology certifications.',
    topics: [
      'What is Vedic astrology — scope and logic',
      'The 12 rashis (signs) and their nature',
      'The 9 grahas (planets) and what they signify',
      'The 12 houses and their domains',
      'How to read a birth chart format',
      'Planetary dignities — strong vs weak planets',
      'Introduction to aspects (drishti)',
      'Introduction to the Vimshottari dasha',
      'Simple chart-reading method for beginners',
      'Practice charts with guided analysis',
    ],
    learningOutcomes: [
      'Identify planets, signs and houses on a birth chart',
      'Apply a simple, repeatable chart-reading method',
      'Recognise basic planetary dignities and dasha periods',
    ],
    curriculum: [
      { title: 'Module 1 — Foundations', lessons: ['What is Jyotish', 'The 12 rashis', 'The 9 grahas'] },
      { title: 'Module 2 — Houses & Chart Reading', lessons: ['The 12 houses', 'Reading a birth chart format'] },
      { title: 'Module 3 — Strength & Timing', lessons: ['Planetary dignities', 'Aspects (drishti)', 'Vimshottari dasha intro'] },
      { title: 'Module 4 — Practice', lessons: ['Simple reading method', 'Guided practice charts'] },
    ],
    faqs: [
      { question: 'How is this different from the live Basic Vedic Astrology course?', answer: 'This is a self-paced recorded version at your own speed; the live course adds mentor-led classes and real-time Q&A.' },
    ],
    instructor: { name: 'To be assigned', bio: 'Certified Vedic Astrologer with 10+ years of teaching experience.', image: '' },
    isActive: false,
  },
];

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('✓ Connected to MongoDB\n');

  // Upsert categories
  for (const cat of CATEGORIES) {
    const existing = await CourseCategory.findOne({ slug: cat.slug });
    if (!existing) {
      await CourseCategory.create({ ...cat, isActive: true });
      console.log(`  [category] Created: ${cat.name}`);
    } else {
      console.log(`  [category] Already exists: ${cat.name}`);
    }
  }

  console.log('');

  // Upsert courses by slug
  let created = 0, updated = 0;
  for (const course of COURSES) {
    const existing = await Course.findOne({ slug: course.slug });
    if (existing) {
      await Course.updateOne({ slug: course.slug }, { $set: course });
      console.log(`  [course] Updated: ${course.title}`);
      updated++;
    } else {
      await Course.create(course);
      console.log(`  [course] Created: ${course.title}`);
      created++;
    }
  }

  console.log(`\n✓ Done — ${created} created, ${updated} updated.`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
