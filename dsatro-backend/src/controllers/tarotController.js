import asyncHandler from 'express-async-handler';
import { tarotDeck } from '../data/tarotDeck.js';

/**
 * Intelligent non-AI generator based on user's exact constraint rules.
 * Intent detection -> Direct interpretation (2-3 lines) -> Actionable advice (1-2 lines).
 */
const generateInterpretation = async (card, orientation, question, position = null) => {
  const isReversed = orientation === 'Reversed';
  const meaning = isReversed ? card.meaningReversed : card.meaningUpright;
  const qLower = (question || '').toLowerCase();

  // Primary: Try AI Generation if API key is present
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `
You are a professional Tarot reader. Generate a high-quality, non-generic Tarot interpretation.

Input:
- Card: ${card.name}
- Position: ${orientation} (Upright/Reversed) ${position ? `(Spread Position: ${position})` : ''}
- User Question: ${question}

Instructions:
- Understand the intent of the question (love, career, finance, general)
- Interpret the card specifically for that context
- Do NOT repeat generic phrases like "energy shift", "karmic lesson", "representation of..."
- Avoid vague or filler sentences
- Do not restate the card meaning mechanically
- Keep response practical, clear, and insightful

Output Format (strict):

Interpretation:
- 2–3 concise lines directly answering the user's question
- Must feel personalized and situation-aware

Advice:
- 1–2 actionable lines (what the user should do next)

Tone:
- Natural, human-like (Hinglish or simple English)
- Confident, grounded, not overly mystical

Constraints:
- No repetition
- No fluff
- No over-dramatic language
- Keep total response under 80 words
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        const interpretationMatch = content.match(/Interpretation:\s*([\s\S]*?)(?=Advice:|$)/i);
        const adviceMatch = content.match(/Advice:\s*([\s\S]*?)$/i);
        
        if (interpretationMatch && adviceMatch) {
          return {
            narrative: interpretationMatch[1].trim().replace(/^- /gm, ''),
            wisdom: adviceMatch[1].trim().replace(/^- /gm, '')
          };
        }
      }
    } catch (error) {
      console.error('AI Tarot Error:', error);
    }
  }

  // Fallback: Intelligent non-AI generator
  let intent = 'general';
  if (qLower.includes('love') || qLower.includes('relationship') || qLower.includes('feel') || qLower.includes('person') || qLower.includes('marriage')) intent = 'love';
  else if (qLower.includes('job') || qLower.includes('career') || qLower.includes('work') || qLower.includes('business')) intent = 'career';
  else if (qLower.includes('money') || qLower.includes('finance') || qLower.includes('wealth') || qLower.includes('invest')) intent = 'finance';

  let interpretation = '';
  const posPrefix = position ? `In the ${position} position, ` : '';
  
  if (intent === 'love') {
    interpretation = `${posPrefix}the ${card.name} (${orientation}) indicates ${meaning} in your romantic life. `;
    interpretation += isReversed 
      ? `Existing communication blocks or emotional hesitancy need attention. `
      : `Your connection is supported by this energy, suggesting growth. `;
    interpretation += `Keep an open heart to navigate this smoothly.`;
  } else if (intent === 'career') {
    interpretation = `${posPrefix}the ${card.name} (${orientation}) brings ${meaning} into your professional path. `;
    interpretation += isReversed
      ? `You may face delays or workplace friction right now. `
      : `Opportunities for advancement or clarity are favorable. `;
    interpretation += `Stay focused on your primary goals.`;
  } else if (intent === 'finance') {
    interpretation = `${posPrefix}the ${card.name} (${orientation}) highlights ${meaning} regarding your wealth. `;
    interpretation += isReversed
      ? `Avoid risky investments or overspending during this cycle. `
      : `A stable or potentially prosperous phase is approaching. `;
    interpretation += `Manage your resources with discipline.`;
  } else {
    interpretation = `${posPrefix}the ${card.name} (${orientation}) signifies ${meaning} regarding your situation. `;
    interpretation += isReversed
      ? `You are experiencing internal resistance or an external delay. `
      : `The path forward is unblocked, allowing you to move naturally. `;
    interpretation += `Trust the process as things unfold.`;
  }

  let advice = '';
  if (isReversed) {
    if (intent === 'love') advice = 'Take a step back to evaluate your own emotional needs before talking.';
    else if (intent === 'career') advice = 'Review your work for errors and wait before making major career moves.';
    else if (intent === 'finance') advice = 'Halt unnecessary spending immediately and re-assess your budget.';
    else advice = 'Pause and reflect on your trajectory. Identify what you are avoiding.';
  } else {
    if (intent === 'love') advice = 'Communicate openly and remain receptive to your partner or new connections.';
    else if (intent === 'career') advice = 'Take the initiative confidently. Now is the time to act.';
    else if (intent === 'finance') advice = 'Invest in long-term stability and keep your financial strategy consistent.';
    else advice = 'Move forward decisively and capitalize on positive momentum.';
  }

  return {
    narrative: interpretation,
    wisdom: advice
  };
};

/**
 * @desc    Draw a random Tarot card
 * @route   POST /api/tarot/draw
 * @access  Public
 */
export const drawCard = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400);
    throw new Error('Please focus on a question before drawing a card.');
  }

  // Select randomly from the hardcoded array
  const random = Math.floor(Math.random() * tarotDeck.length);
  const card = tarotDeck[random];

  const isReversed = Math.random() < 0.3;
  const orientation = isReversed ? 'Reversed' : 'Upright';
  const interpretation = generateInterpretation(card, orientation, question);

  res.json({
    success: true,
    question,
    card: {
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      symbol: card.name.charAt(0), // Simplified symbol mapping
      orientation,
      meaning: isReversed ? card.meaningReversed : card.meaningUpright,
      interpretation: interpretation.narrative,
      wisdom: interpretation.wisdom
    },
    timestamp: new Date()
  });
});

/**
 * @desc    Draw a 3-card spread (Past, Present, Future)
 * @route   POST /api/tarot/spread
 * @access  Public
 */
export const drawSpread = asyncHandler(async (req, res) => {
  const { question } = req.body;
  
  if (!question || typeof question !== 'string') {
    res.status(400);
    throw new Error('A question is required for the Oracle.');
  }

  // Shuffle and pick 3 unique cards
  const shuffled = [...tarotDeck].sort(() => 0.5 - Math.random());
  const cards = shuffled.slice(0, 3);

  const positions = [
    { name: 'Past', desc: 'Influences that shaped you.' },
    { name: 'Present', desc: 'Current energy.' },
    { name: 'Future', desc: 'Potential outcome.' }
  ];

  const spread = cards.map((card, idx) => {
    const isReversed = Math.random() < 0.3;
    const orientation = isReversed ? 'Reversed' : 'Upright';
    const interpretation = generateInterpretation(card, orientation, question, positions[idx].name);
    
    return {
      position: positions[idx].name,
      posDesc: positions[idx].desc,
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      symbol: card.name.charAt(0),
      orientation,
      meaning: isReversed ? card.meaningReversed : card.meaningUpright,
      interpretation: interpretation.narrative,
      wisdom: interpretation.wisdom
    };
  });

  res.json({
    success: true,
    question,
    spread,
    summary: `Your spread reveals a complex journey starting with ${spread[0].name} influences, manifesting as ${spread[1].name} today, and guiding you toward ${spread[2].name} for the future.`,
    timestamp: new Date()
  });
});
