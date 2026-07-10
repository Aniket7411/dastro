export const tarotDeck = [
  { name: 'The Fool', arcana: 'Major', suit: null, meaningUpright: 'new beginnings, leaps of faith, spontaneity', meaningReversed: 'recklessness, fear of unknown, holding back' },
  { name: 'The Magician', arcana: 'Major', suit: null, meaningUpright: 'manifestation, resourcefulness, power', meaningReversed: 'manipulation, poor planning, untapped talents' },
  { name: 'The High Priestess', arcana: 'Major', suit: null, meaningUpright: 'intuition, subconscious, divine feminine', meaningReversed: 'secrets, disconnected from intuition, withdrawal' },
  { name: 'The Empress', arcana: 'Major', suit: null, meaningUpright: 'femininity, beauty, nature, abundance', meaningReversed: 'creative block, dependence on others' },
  { name: 'The Emperor', arcana: 'Major', suit: null, meaningUpright: 'authority, establishment, structure', meaningReversed: 'domination, excessive control, lack of discipline' },
  { name: 'The Hierophant', arcana: 'Major', suit: null, meaningUpright: 'spiritual wisdom, religious beliefs, conformity', meaningReversed: 'personal beliefs, freedom, challenging status quo' },
  { name: 'The Lovers', arcana: 'Major', suit: null, meaningUpright: 'love, harmony, relationships, values alignment', meaningReversed: 'self-love, disharmony, imbalance, misalignment of values' },
  { name: 'The Chariot', arcana: 'Major', suit: null, meaningUpright: 'control, willpower, success, action', meaningReversed: 'lack of control, lack of direction, aggression' },
  { name: 'Strength', arcana: 'Major', suit: null, meaningUpright: 'strength, courage, persuasion, influence', meaningReversed: 'inner strength, self-doubt, low energy' },
  { name: 'The Hermit', arcana: 'Major', suit: null, meaningUpright: 'soul-searching, introspection, being alone', meaningReversed: 'isolation, loneliness, withdrawal' },
  { name: 'Wheel of Fortune', arcana: 'Major', suit: null, meaningUpright: 'good luck, karma, life cycles, destiny', meaningReversed: 'bad luck, resistance to change, breaking cycles' },
  { name: 'Justice', arcana: 'Major', suit: null, meaningUpright: 'justice, fairness, truth, cause and effect', meaningReversed: 'unfairness, lack of accountability, dishonesty' },
  { name: 'The Hanged Man', arcana: 'Major', suit: null, meaningUpright: 'pause, surrender, letting go, new perspectives', meaningReversed: 'delays, resistance, stalling, indecision' },
  { name: 'Death', arcana: 'Major', suit: null, meaningUpright: 'endings, change, transformation, transition', meaningReversed: 'resistance to change, personal transformation, inner purging' },
  { name: 'Temperance', arcana: 'Major', suit: null, meaningUpright: 'balance, moderation, patience, purpose', meaningReversed: 'imbalance, excess, self-healing, re-alignment' },
  { name: 'The Devil', arcana: 'Major', suit: null, meaningUpright: 'shadow self, attachment, addiction, restriction', meaningReversed: 'releasing limiting beliefs, exploring dark thoughts, detachment' },
  { name: 'The Tower', arcana: 'Major', suit: null, meaningUpright: 'sudden change, upheaval, chaos, revelation', meaningReversed: 'personal transformation, fear of change, averting disaster' },
  { name: 'The Star', arcana: 'Major', suit: null, meaningUpright: 'hope, faith, purpose, renewal, spirituality', meaningReversed: 'lack of faith, despair, self-trust, disconnection' },
  { name: 'The Moon', arcana: 'Major', suit: null, meaningUpright: 'illusion, fear, anxiety, subconscious, intuition', meaningReversed: 'release of fear, repressed emotion, inner confusion' },
  { name: 'The Sun', arcana: 'Major', suit: null, meaningUpright: 'positivity, fun, warmth, success, vitality', meaningReversed: 'inner child, feeling down, overly optimistic' },
  { name: 'Judgement', arcana: 'Major', suit: null, meaningUpright: 'judgement, rebirth, inner calling, absolution', meaningReversed: 'self-doubt, inner critic, ignoring the call' },
  { name: 'The World', arcana: 'Major', suit: null, meaningUpright: 'completion, integration, accomplishment, travel', meaningReversed: 'seeking personal closure, short-cuts, delays' },

  ...['Wands', 'Cups', 'Swords', 'Pentacles'].flatMap(suit => 
    ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'].map(rank => {
      const suitMeanings = {
        Wands: { u: 'passion, energy, enthusiasm, courage', r: 'delays, lack of direction, feeling stuck' },
        Cups: { u: 'emotion, intuition, relationships, love', r: 'emotional blocks, repressed feelings, disconnection' },
        Swords: { u: 'logic, intellect, communication, truth', r: 'confusion, miscommunication, hostility' },
        Pentacles: { u: 'wealth, work, physical reality, manifestation', r: 'financial loss, poor work ethic, materialism' }
      };
      return {
        name: `${rank} of ${suit}`,
        arcana: 'Minor',
        suit: suit,
        meaningUpright: `${rank} representing ${suitMeanings[suit].u}`,
        meaningReversed: `Blocked ${rank} energy, showing ${suitMeanings[suit].r}`
      };
    })
  )
];
