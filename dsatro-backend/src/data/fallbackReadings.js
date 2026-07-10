/** Warm pre-written readings — one per sun sign (live-call fallback), English + Hindi. */
import { getRashiHi } from '../utils/sunSignFromDob.js';

const TEMPLATES = {
  Aries: {
    luckyNumber: '9',
    luckyColour: 'Red',
    luckyColourHi: 'लाल',
    nature:
      'You carry a brave and energetic spirit. You like to move forward quickly and take charge when life asks for leadership.',
    natureHi:
      'आपमें साहस और ऊर्जा भरी है। आप जल्दी आगे बढ़ना पसंद करते हैं और जरूरत पड़ने पर नेतृत्व संभाल लेते हैं।',
    currentPhase:
      'This is a phase of fresh momentum. Small bold steps in the area you asked about can open new doors over the next few weeks.',
    currentPhaseHi:
      'यह नई शुरुआत और गति का समय है। जिस विषय पर आपने पूछा है, वहाँ छोटे साहसी कदम अगले कुछ हफ्तों में नए रास्ते खोल सकते हैं।',
    fullChartReveal:
      'To know exact timing and personalised remedies for your question, your full birth chart — especially birth time — and a live session with our astrologer will give precise answers.',
    fullChartRevealHi:
      'सटीक समय और व्यक्तिगत उपाय जानने के लिए पूरी जन्म कुंडली — खासकर जन्म समय — और हमारे ज्योतिषी के साथ लाइव सत्र जरूरी है।',
  },
  Taurus: {
    luckyNumber: '6',
    luckyColour: 'Green',
    luckyColourHi: 'हरा',
    nature:
      'You are steady, loyal and practical. You build security patiently and value trust in relationships and work.',
    natureHi:
      'आप स्थिर, वफादार और व्यावहारिक हैं। आप धैर्य से सुरक्षा बनाते हैं और रिश्तों व काम में भरोसे को महत्व देते हैं।',
    currentPhase:
      'Stability and patience are your strengths right now. Consistent effort in the matter you called about will bring gradual but lasting progress.',
    currentPhaseHi:
      'अभी स्थिरता और धैर्य आपकी ताकत हैं। जिस मामले में आपने कॉल किया है, लगातार प्रयास से धीरे-धीरे लेकिन टिकाऊ प्रगति होगी।',
    fullChartReveal:
      'For specific dates, dasha periods and remedies tied to your question, a complete chart reading with birth time and Damini ma\'am\'s live guidance is recommended.',
    fullChartRevealHi:
      'सटीक तारीखें, दशा और उपाय जानने के लिए जन्म समय सहित पूरी कुंडली और दामिनी मैम के लाइव मार्गदर्शन की सलाह दी जाती है।',
  },
  Gemini: {
    luckyNumber: '5',
    luckyColour: 'Yellow',
    luckyColourHi: 'पीला',
    nature:
      'You are curious, adaptable and communicative. You learn quickly and connect ideas across different areas of life.',
    natureHi:
      'आप जिज्ञासु, लचीले और बातचीत में निपुण हैं। आप जल्दी सीखते हैं और जीवन के अलग-अलग क्षेत्रों को जोड़कर सोचते हैं।',
    currentPhase:
      'Ideas and conversations are flowing. Stay open to new information related to your concern — clarity often comes through dialogue now.',
    currentPhaseHi:
      'विचार और बातचीत का प्रवाह अच्छा है। अपनी चिंता से जुड़ी नई जानकारी के लिए खुले रहें — अक्सर स्पष्टता संवाद से आती है।',
    fullChartReveal:
      'Your exact answers on timing and remedies need a full kundli with birth time and a personalised consultation with our astrologer.',
    fullChartRevealHi:
      'समय और उपाय की सटीक जानकारी के लिए जन्म समय सहित पूरी कुंडली और हमारे ज्योतिषी से व्यक्तिगत परामर्श जरूरी है।',
  },
  Cancer: {
    luckyNumber: '2',
    luckyColour: 'White',
    luckyColourHi: 'सफेद',
    nature:
      'You are caring, intuitive and protective of loved ones. Emotional honesty is one of your greatest strengths.',
    natureHi:
      'आप देखभाल करने वाले, सहज और प्रियजनों के प्रति सुरक्षात्मक हैं। भावनात्मक ईमानदारी आपकी बड़ी ताकत है।',
    currentPhase:
      'Emotional balance is important in this period. Nurturing routines and family support can help the situation you asked about improve gently.',
    currentPhaseHi:
      'इस समय भावनात्मक संतुलन जरूरी है। अपनों का साथ और अच्छी दिनचर्या से आपके प्रश्न वाले मामले में धीरे-धीरे सुधार हो सकता है।',
    fullChartReveal:
      'For depth on relationships, home and timing, your complete chart with birth time and a live reading will reveal what this general glimpse cannot.',
    fullChartRevealHi:
      'रिश्तों, घर और समय की गहराई के लिए जन्म समय सहित पूरी कुंडली और लाइव रीडिंग वो बातें बताएगी जो यह सामान्य झलक नहीं दिखा सकती।',
  },
  Leo: {
    luckyNumber: '1',
    luckyColour: 'Gold',
    luckyColourHi: 'सुनहरा',
    nature:
      'You shine with confidence and warmth. You naturally inspire others and prefer to lead with dignity and heart.',
    natureHi:
      'आप आत्मविश्वास और गर्मजोशी से दमकते हैं। आप स्वाभाविक रूप से दूसरों को प्रेरित करते हैं और गरिमा व दिल से नेतृत्व करना पसंद करते हैं।',
    currentPhase:
      'Recognition and self-belief are highlighted. Step forward visibly in the area you care about — your efforts are being noticed.',
    currentPhaseHi:
      'पहचान और आत्मविश्वास पर जोर है। जिस क्षेत्र की आपको चिंता है, वहाँ स्पष्ट रूप से आगे बढ़ें — आपके प्रयास देखे जा रहे हैं।',
    fullChartReveal:
      'Precise career and life-timing answers come from your full horoscope with birth time and a session with Damini ma\'am.',
    fullChartRevealHi:
      'करियर और जीवन के सटीक समय की जानकारी जन्म समय सहित पूरी कुंडली और दामिनी मैम के सत्र से मिलती है।',
  },
  Virgo: {
    luckyNumber: '5',
    luckyColour: 'Navy Blue',
    luckyColourHi: 'गहरा नीला',
    nature:
      'You are thoughtful, detail-oriented and helpful. You improve situations through careful planning and sincere service.',
    natureHi:
      'आप विचारशील, विस्तार पर ध्यान देने वाले और सहायक हैं। सावधानी से योजना और ईमानदार सेवा से आप स्थितियाँ बेहतर बनाते हैं।',
    currentPhase:
      'Organising small daily habits will support the matter you raised. Perfection is not required — steady improvement is enough.',
    currentPhaseHi:
      'छोटी दैनिक आदतों को व्यवस्थित करने से आपके उठाए मुद्दे में मदद मिलेगी। पूर्णता जरूरी नहीं — लगातार सुधार काफी है।',
    fullChartReveal:
      'For exact planetary periods and remedies for your specific question, a full chart analysis with birth time is essential.',
    fullChartRevealHi:
      'आपके विशेष प्रश्न के लिए सटीक ग्रह काल और उपाय जानने हेतु जन्म समय सहित पूरी कुंडली विश्लेषण आवश्यक है।',
  },
  Libra: {
    luckyNumber: '6',
    luckyColour: 'Pink',
    luckyColourHi: 'गुलाबी',
    nature:
      'You seek harmony, fairness and beauty in life. You balance relationships with grace and diplomacy.',
    natureHi:
      'आप जीवन में संतुलन, न्याय और सुंदरता चाहते हैं। आप रिश्तों को सौजन्य और समझदारी से संभालते हैं।',
    currentPhase:
      'Partnerships and cooperation are in focus. A balanced approach to the issue you mentioned will bring better outcomes than rushing.',
    currentPhaseHi:
      'साझेदारी और सहयोग पर ध्यान है। जिस मुद्दे पर आपने बात की, उसमें संतुलित दृष्टिकोण जल्दबाजी से बेहतर परिणाम देगा।',
    fullChartReveal:
      'Relationship timing and marriage/career clarity need your complete birth chart with birth time and our astrologer\'s live reading.',
    fullChartRevealHi:
      'रिश्तों का समय और विवाह/करियर की स्पष्टता के लिए जन्म समय सहित पूरी कुंडली और हमारे ज्योतिषी की लाइव रीडिंग जरूरी है।',
  },
  Scorpio: {
    luckyNumber: '9',
    luckyColour: 'Maroon',
    luckyColourHi: 'मैरून',
    nature:
      'You are intense, loyal and deeply perceptive. You do not give up easily when something truly matters to you.',
    natureHi:
      'आप गहन, वफादार और गहरी समझ वाले हैं। जो बात आपके लिए सच में महत्वपूर्ण है, उस पर आप आसानी से हार नहीं मानते।',
    currentPhase:
      'Transformation is possible now. Let go of what no longer serves you in the area you asked about — renewal is supported.',
    currentPhaseHi:
      'अब बदलाव संभव है। जिस क्षेत्र में आपने पूछा है, वहाँ जो अब काम का नहीं उसे छोड़ें — नवीनता का समय है।',
    fullChartReveal:
      'Hidden factors and exact timing for your concern are visible only in a full kundli with birth time and expert consultation.',
    fullChartRevealHi:
      'छिपे कारण और सटीक समय केवल जन्म समय सहित पूरी कुंडली और विशेषज्ञ परामर्श से ही स्पष्ट होते हैं।',
  },
  Sagittarius: {
    luckyNumber: '3',
    luckyColour: 'Purple',
    luckyColourHi: 'बैंगनी',
    nature:
      'You are optimistic, honest and freedom-loving. You grow through learning, travel and higher purpose.',
    natureHi:
      'आप आशावादी, ईमानदार और स्वतंत्रता प्रेमी हैं। सीखने, यात्रा और उच्च उद्देश्य से आप बढ़ते हैं।',
    currentPhase:
      'Expansion and learning are favoured. Stay hopeful about the topic you called about — a wider perspective will help soon.',
    currentPhaseHi:
      'विस्तार और सीखने का समय अनुकूल है। जिस विषय पर आपने कॉल किया, उसमें आशावाद बनाए रखें — जल्द ही व्यापक दृष्टि मदद करेगी।',
    fullChartReveal:
      'For education, foreign prospects and precise timing, your full chart with birth time and a live session will give clear direction.',
    fullChartRevealHi:
      'शिक्षा, विदेश और सटीक समय के लिए जन्म समय सहित पूरी कुंडली और लाइव सत्र स्पष्ट दिशा देंगे।',
  },
  Capricorn: {
    luckyNumber: '8',
    luckyColour: 'Brown',
    luckyColourHi: 'भूरा',
    nature:
      'You are disciplined, responsible and ambitious. You build success step by step with patience and integrity.',
    natureHi:
      'आप अनुशासित, जिम्मेदार और महत्वाकांक्षी हैं। धैर्य और ईमानदारी से कदम-दर-कदम सफलता बनाते हैं।',
    currentPhase:
      'Hard work is paying off slowly but surely. Stay committed in the area you asked about — structure and persistence win now.',
    currentPhaseHi:
      'मेहनत धीरे लेकिन निश्चित रूप से रंग ला रही है। जिस क्षेत्र में पूछा है, वहाँ प्रतिबद्ध रहें — व्यवस्था और लगन अभी जीतती है।',
    fullChartReveal:
      'Career peaks, property and long-term timing need a complete chart with birth time and Damini ma\'am\'s personalised reading.',
    fullChartRevealHi:
      'करियर की ऊँचाइयाँ, संपत्ति और दीर्घकालीन समय के लिए जन्म समय सहित पूरी कुंडली और दामिनी मैम की व्यक्तिगत रीडिंग चाहिए।',
  },
  Aquarius: {
    luckyNumber: '4',
    luckyColour: 'Blue',
    luckyColourHi: 'नीला',
    nature:
      'You are independent, innovative and humanitarian. You think ahead and care about doing what is right for everyone.',
    natureHi:
      'आप स्वतंत्र, नवीन और मानवीय हैं। आप आगे सोचते हैं और सबके हित में सही करने की चिंता रखते हैं।',
    currentPhase:
      'New ideas and networks can help your situation. Stay open to unconventional solutions for the question you raised.',
    currentPhaseHi:
      'नए विचार और संपर्क आपकी स्थिति में मदद कर सकते हैं। अपने प्रश्न के लिए अनोखे समाधानों के प्रति खुले रहें।',
    fullChartReveal:
      'Unique planetary combinations affecting your life path are best understood through a full kundli with birth time and live guidance.',
    fullChartRevealHi:
      'आपके जीवन पथ को प्रभावित करने वाले विशेष ग्रह योग जन्म समय सहित पूरी कुंडली और लाइव मार्गदर्शन से सबसे अच्छे समझे जाते हैं।',
  },
  Pisces: {
    luckyNumber: '7',
    luckyColour: 'Sea Green',
    luckyColourHi: 'समुद्री हरा',
    nature:
      'You are compassionate, imaginative and spiritually sensitive. You feel deeply and often guide others with empathy.',
    natureHi:
      'आप दयालु, कल्पनाशील और आध्यात्मिक रूप से संवेदनशील हैं। आप गहराई से महसूस करते हैं और अक्सर सहानुभूति से दूसरों का मार्गदर्शन करते हैं।',
    currentPhase:
      'Intuition and faith are strong allies now. Gentle self-care and spiritual routine will support the matter you called about.',
    currentPhaseHi:
      'अभी अंतर्ज्ञान और विश्वास मजबूत साथी हैं। कोमल आत्म-देखभाल और आध्यात्मिक दिनचर्या आपके मुद्दे में सहारा देंगी।',
    fullChartReveal:
      'For spiritual growth, relationships and exact remedies for your question, a full chart with birth time and our astrologer\'s session is recommended.',
    fullChartRevealHi:
      'आध्यात्मिक विकास, रिश्तों और आपके प्रश्न के सटीक उपाय के लिए जन्म समय सहित पूरी कुंडली और हमारे ज्योतिषी का सत्र सलाह योग्य है।',
  },
};

export function getFallbackReading(sunSign) {
  const key = TEMPLATES[sunSign] ? sunSign : 'Aries';
  const t = TEMPLATES[key];
  return {
    luckyNumber: t.luckyNumber,
    luckyColour: t.luckyColour,
    luckyColourHi: t.luckyColourHi,
    natureEn: t.nature,
    natureHi: t.natureHi,
    currentPhaseEn: t.currentPhase,
    currentPhaseHi: t.currentPhaseHi,
    fullChartRevealEn: t.fullChartReveal,
    fullChartRevealHi: t.fullChartRevealHi,
    nature: t.nature,
    currentPhase: t.currentPhase,
    fullChartReveal: t.fullChartReveal,
    sunSign: key,
    rashiHi: getRashiHi(key),
    source: 'fallback',
    rawText: [
      `Rashi: ${key} | राशि: ${getRashiHi(key)}`,
      `Lucky Colour: ${t.luckyColour} | रंग: ${t.luckyColourHi}`,
      `[ENGLISH]`,
      `Her/His Nature: ${t.nature}`,
      `Her/His Current Phase: ${t.currentPhase}`,
      `What Her/His Chart Will Reveal: ${t.fullChartReveal}`,
      `[HINDI]`,
      `आपका स्वभाव: ${t.natureHi}`,
      `आपका वर्तमान चरण: ${t.currentPhaseHi}`,
      `पूरी कुंडली क्या बताएगी: ${t.fullChartRevealHi}`,
    ].join('\n'),
  };
}
