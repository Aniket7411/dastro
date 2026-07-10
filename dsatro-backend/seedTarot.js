import mongoose from 'mongoose';
import Tarot from './src/models/Tarot.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/astrology';

const majorArcana = [
  { name: 'The Fool', nameShort: 'ar00', value: '0', valueInt: 0, arcana: 'Major', meaningUpright: 'New beginnings, potential, adventure', meaningReversed: 'Recklessness, fear of change, bad timing', symbol: '💨' },
  { name: 'The Magician', nameShort: 'ar01', value: '1', valueInt: 1, arcana: 'Major', meaningUpright: 'Power, manifestation, resourcefulness', meaningReversed: 'Manipulation, untapped potential, illusion', symbol: '⚡' },
  { name: 'The High Priestess', nameShort: 'ar02', value: '2', valueInt: 2, arcana: 'Major', meaningUpright: 'Intuition, mystery, inner wisdom', meaningReversed: 'Secretiveness, disconnected from intuition', symbol: '🌙' },
  { name: 'The Empress', nameShort: 'ar03', value: '3', valueInt: 3, arcana: 'Major', meaningUpright: 'Abundance, nurturing, creativity', meaningReversed: 'Creative block, dependence on others', symbol: '🌿' },
  { name: 'The Emperor', nameShort: 'ar04', value: '4', valueInt: 4, arcana: 'Major', meaningUpright: 'Authority, stability, control', meaningReversed: 'Tyranny, lack of discipline, rigidity', symbol: '👑' },
  { name: 'The Hierophant', nameShort: 'ar05', value: '5', valueInt: 5, arcana: 'Major', meaningUpright: 'Tradition, spirituality, guidance', meaningReversed: 'Rebellion, personal beliefs, non-conformity', symbol: '⛩️' },
  { name: 'The Lovers', nameShort: 'ar06', value: '6', valueInt: 6, arcana: 'Major', meaningUpright: 'Relationships, choices, harmony', meaningReversed: 'Self-love, disharmony, imbalance', symbol: '❤️' },
  { name: 'The Chariot', nameShort: 'ar07', value: '7', valueInt: 7, arcana: 'Major', meaningUpright: 'Willpower, determination, success', meaningReversed: 'Lack of direction, aggression, self-doubt', symbol: '🛡️' },
  { name: 'Strength', nameShort: 'ar08', value: '8', valueInt: 8, arcana: 'Major', meaningUpright: 'Courage, inner strength, patience', meaningReversed: 'Self-doubt, weakness, insecurity', symbol: '🦁' },
  { name: 'The Hermit', nameShort: 'ar09', value: '9', valueInt: 9, arcana: 'Major', meaningUpright: 'Soul-searching, introspection, solitude', meaningReversed: 'Isolation, loneliness, withdrawal', symbol: '🏮' },
  { name: 'Wheel of Fortune', nameShort: 'ar10', value: '10', valueInt: 10, arcana: 'Major', meaningUpright: 'Fate, cycles, change', meaningReversed: 'Bad luck, resistance to change, breaking cycles', symbol: '🎡' },
  { name: 'Justice', nameShort: 'ar11', value: '11', valueInt: 11, arcana: 'Major', meaningUpright: 'Truth, fairness, balance', meaningReversed: 'Injustice, lack of accountability, dishonesty', symbol: '⚖️' },
  { name: 'The Hanged Man', nameShort: 'ar12', value: '12', valueInt: 12, arcana: 'Major', meaningUpright: 'Surrender, letting go, new perspective', meaningReversed: 'Stalling, needless sacrifice, resistance', symbol: '⏳' },
  { name: 'Death', nameShort: 'ar13', value: '13', valueInt: 13, arcana: 'Major', meaningUpright: 'Transformation, endings, new beginnings', meaningReversed: 'Resistance to change, inability to move on', symbol: '💀' },
  { name: 'Temperance', nameShort: 'ar14', value: '14', valueInt: 14, arcana: 'Major', meaningUpright: 'Balance, moderation, patience', meaningReversed: 'Imbalance, excess, lack of long-term vision', symbol: '🏺' },
  { name: 'The Devil', nameShort: 'ar15', value: '15', valueInt: 15, arcana: 'Major', meaningUpright: 'Bondage, temptation, materialism', meaningReversed: 'Release, detached, restoring control', symbol: '👿' },
  { name: 'The Tower', nameShort: 'ar16', value: '16', valueInt: 16, arcana: 'Major', meaningUpright: 'Upheaval, sudden change, chaos', meaningReversed: 'Averting disaster, delayed change, fear of suffering', symbol: '🗼' },
  { name: 'The Star', nameShort: 'ar17', value: '17', valueInt: 17, arcana: 'Major', meaningUpright: 'Hope, inspiration, renewal', meaningReversed: 'Faithlessness, discouragement, insecurity', symbol: '⭐' },
  { name: 'The Moon', nameShort: 'ar18', value: '18', valueInt: 18, arcana: 'Major', meaningUpright: 'Illusion, fear, intuition', meaningReversed: 'Release of fear, repressed emotion, confusion', symbol: '🌑' },
  { name: 'The Sun', nameShort: 'ar19', value: '19', valueInt: 19, arcana: 'Major', meaningUpright: 'Joy, success, positivity', meaningReversed: 'Negativity, depression, sadness', symbol: '☀️' },
  { name: 'Judgement', nameShort: 'ar20', value: '20', valueInt: 20, arcana: 'Major', meaningUpright: 'Reflection, reckoning, rebirth', meaningReversed: 'Self-doubt, refusal of self-examination', symbol: '🎺' },
  { name: 'The World', nameShort: 'ar21', value: '21', valueInt: 21, arcana: 'Major', meaningUpright: 'Completion, integration, accomplishment', meaningReversed: 'Lack of closure, shortcuts, non-completion', symbol: '🌍' }
];

const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const suitSymbols = { Wands: '🪄', Cups: '🏆', Swords: '⚔️', Pentacles: '🪙' };
const values = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

const minorArcana = [];

suits.forEach(suit => {
  values.forEach((val, idx) => {
    minorArcana.push({
      name: `${val} of ${suit}`,
      nameShort: `${suit.charAt(0).toLowerCase()}${idx + 1}`,
      value: val,
      valueInt: idx + 1,
      suit: suit,
      arcana: 'Minor',
      meaningUpright: `Representation of ${suit} energy through ${val}.`,
      meaningReversed: `Blocked or distorted ${suit} energy in the form of ${val}.`,
      symbol: suitSymbols[suit]
    });
  });
});

const cards = [...majorArcana, ...minorArcana];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');
        
        await Tarot.deleteMany({});
        console.log('Cleared existing Tarot cards.');
        
        await Tarot.insertMany(cards);
        console.log(`${cards.length} Tarot cards seeded successfully.`);
        
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

console.log("testing")
seedDB();
