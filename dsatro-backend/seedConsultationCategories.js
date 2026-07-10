import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ConsultationCategory from './src/models/ConsultationCategory.js';

dotenv.config();

const consultationCategories = [
  {
    categoryId: 'tarot',
    name: "Tarot Card Sessions",
    icon: "fa-magic",
    description: "Intuitive guidance for love, career, and life decisions using spiritual energies.",
    sortOrder: 1,
    cards: [
      {
        id: 'tarot',
        title: "Tarot Card Reading",
        desc: "Get clarity and intuitive guidance regarding love, relationships, career, marriage, and life decisions. In this session, cards are read intuitively to give accurate answers and practical guidance.",
        price: "₹5400",
        duration: "45 min",
        badge: "General Tarot",
        badgeColor: "purple",
        img: "/images/tarot_thumbnail.png",
        short: "Tarot Reading"
      },
      {
        id: 'zoom-session',
        title: "45-minute Zoom Call Session",
        desc: "Face-to-face video consultation providing deep clarity about your current situation or upcoming life decisions. Ideal for those seeking visual connection and detailed card spreads.",
        price: "₹7200",
        duration: "45 min",
        badge: "Video Call",
        badgeColor: "purple",
        img: "/images/premium_tarot.png",
        short: "Zoom Session"
      },
      {
        id: 'phone-session',
        title: "45-minute Phone Call Session",
        desc: "Personalized guidance over a phone call. Perfect for quick clarity and immediate answers about love, career, or any specific life situation you're facing.",
        price: "₹5400",
        duration: "45 min",
        badge: "Voice Call",
        badgeColor: "pink",
        img: "/images/tarot-card.webp",
        short: "Phone Session"
      }
    ]
  },
  {
    categoryId: 'vedic',
    name: "Vedic Astrology",
    icon: "fa-om",
    description: "Birth chart analysis to understand destiny, planetary effects, and future opportunities.",
    sortOrder: 2,
    cards: [
      {
        id: 'career',
        title: "Career Consultation",
        desc: "Get guidance about job, promotion, business, career change, government job chances, foreign opportunities, and financial growth.",
        price: "₹3600",
        duration: "30-40 min",
        badge: "Professional Path",
        badgeColor: "purple",
        img: "/images/consult_career.png",
        short: "Career"
      },
      {
        id: 'marriage',
        title: "Marriage Consultation",
        desc: "Get detailed prediction about marriage timing, love vs arranged marriage, delay in marriage, relationship problems, and married life stability.",
        price: "₹2700",
        duration: "30-40 min",
        badge: "Relationship Expert",
        badgeColor: "pink",
        img: "/images/consult_marriage.png",
        short: "Marriage"
      },
      {
        id: 'divorce',
        title: "Divorce Consultation",
        desc: "Understand separation possibilities, legal stress, emotional healing, and future relationship stability. We analyze your birth chart to provide clarity during difficult transitions.",
        price: "₹3400",
        duration: "30-40 min",
        badge: "Legal/Separation",
        badgeColor: "red",
        img: "/images/consultations/health.png",
        short: "Divorce"
      },
      {
        id: 'relationship',
        title: "Affair & Relationship",
        desc: "Clarity regarding loyalty, hidden relationships, compatibility, love triangles, and future possibilities. Get deep insights into your emotional connections.",
        price: "₹3400",
        duration: "30-40 min",
        badge: "Love Expert",
        badgeColor: "pink",
        img: "/images/consultations/love.png",
        short: "Relationship"
      },
      {
        id: 'financial',
        title: "Financial Consultation",
        desc: "Understand your money flow, losses, gains, investments, and future financial stability through planetary analysis.",
        price: "₹3600",
        duration: "30 min",
        badge: "Wealth Insights",
        badgeColor: "orange",
        img: "/images/consult_finance.png",
        short: "Financial"
      },
      {
        id: 'other',
        title: "Other Concern Consultation",
        desc: "Ask about specific issues such as health concerns, family problems, court cases, education, property matters, or personal life confusion.",
        price: "₹3600",
        duration: "30 min",
        badge: "Specialized Help",
        badgeColor: "red",
        img: "/images/consult_personal.png",
        short: "Other Concerns"
      }
    ]
  },
  {
    categoryId: 'kundali',
    name: "Premium Chart Analysis",
    icon: "fa-star",
    description: "Advanced compatibility checks and precise birth time rectification.",
    sortOrder: 3,
    cards: [
      {
        id: 'kundali-matching',
        title: "Kundali Matching",
        desc: "Detailed horoscope matching for marriage including Ashtkoot Milan, Guna Milan score, Mangal dosh analysis, Dasha compatibility, and long-term married life prediction.",
        price: "₹5100",
        badge: "Full Compatibility",
        badgeColor: "purple",
        img: "/images/vedic_info.png",
        short: "Kundali Matching"
      },
      {
        id: 'time-rectification',
        title: "Kundali Time Rectification",
        desc: "If your birth time is not accurate, predictions may not work. We correct your birth time using life events to ensure your future predictions become more precise.",
        price: "₹5100",
        badge: "Precision Expert",
        badgeColor: "orange",
        img: "/images/cosmic_blueprint.png",
        short: "Time Rectification"
      }
    ]
  },
  {
    categoryId: 'spiritual',
    name: "Spiritual Remedies",
    icon: "fa-fire",
    description: "Mantra-based rituals to remove negative energy and life obstacles.",
    sortOrder: 4,
    cards: [
      {
        id: '1-day-spell',
        title: "1 Day Spell",
        desc: "Focused spiritual ritual for removing negativity, addressing immediate love/relationship blocks, or clearing minor career obstacles.",
        price: "₹4500",
        badge: "Quick Remedy",
        badgeColor: "pink",
        img: "/images/sop.png",
        short: "1 Day Spell"
      },
      {
        id: '3-day-spell',
        title: "3 Day Spell",
        desc: "Intensive spiritual healing rituals designed for relationship healing, significant career blockage removal, and attracting success.",
        price: "₹7200",
        badge: "Intensive Ritual",
        badgeColor: "orange",
        img: "/images/roadmap_bg2.png",
        short: "3 Day Spell"
      },
      {
        id: '5-day-spell',
        title: "5 Day Spell",
        desc: "Master level spiritual rituals for complete protection from evil eye, deep success attraction, and total removal of life delays.",
        price: "₹11000",
        badge: "Master Transformation",
        badgeColor: "red",
        img: "/images/advanced_info.png",
        short: "5 Day Spell"
      }
    ]
  },
  {
    categoryId: 'testing',
    name: "Live Testing",
    icon: "fa-vial",
    description: "Temporary category for live payment gateway testing.",
    sortOrder: 5,
    cards: [
      {
        id: 'test-consultation',
        title: "Test Consultation (₹1)",
        desc: "Use this card to verify the live Razorpay payment gateway integration using UPI or Netbanking.",
        price: "₹1",
        badge: "Testing Purpose",
        badgeColor: "green",
        img: "/images/premium_tarot.png",
        short: "Test Consult"
      }
    ]
  }
];

const seedCategories = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/astrology'; // Fallback if not in env
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');

    // Delete existing categories
    await ConsultationCategory.deleteMany({});
    console.log('Existing categories removed.');

    // Insert new categories
    await ConsultationCategory.insertMany(consultationCategories);
    console.log('Consultation categories seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
