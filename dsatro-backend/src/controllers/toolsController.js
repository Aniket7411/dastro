import asyncHandler from 'express-async-handler';
import astrologyService from '../services/astrologyService.js';
import { DateTime } from 'luxon';
import logger from '../config/logger.js';

export const calculateMoon = asyncHandler(async (req, res) => {
  const data = await astrologyService.getMoonData(req.body);
  res.json({ success: true, ...data });
});

export const calculateNumerology = asyncHandler(async (req, res) => {
  const data = astrologyService.getNumerologyData(req.body);
  res.json({ success: true, ...data });
});

export const calculateKundali = asyncHandler(async (req, res) => {
  const data = await astrologyService.getKundaliData(req.body);
  res.json({ success: true, ...data });
});

export const calculateZodiac = asyncHandler(async (req, res) => {
  const data = await astrologyService.getZodiacData(req.body.dob);
  res.json({ success: true, ...data });
});

export const calculateLoveCompatibility = asyncHandler(async (req, res) => {
  const { partnerA, partnerB } = req.body;
  if (!partnerA || !partnerB) {
    res.status(400);
    throw new Error('Both partners birth data are required');
  }
  const data = await astrologyService.calculateLoveCompatibility(partnerA, partnerB);
  res.json({ success: true, ...data });
});

export const getHoroscope = asyncHandler(async (req, res) => {
  const { sign } = req.params;
  const today = DateTime.now().toFormat('MMM dd, yyyy');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${sign.toLowerCase()}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('External API responded with error');

    const raw = await response.json();
    const apiData = raw.data || raw;
    const predictionText = apiData.horoscope || apiData.prediction || apiData.horoscope_data;

    if (!predictionText) throw new Error('Empty prediction text from API');

    res.json({
      success: true,
      date: apiData.date || today,
      prediction: predictionText
    });
  } catch (error) {
    clearTimeout(timeoutId);
    logger.error(`Horoscope API Error for ${sign}: ${error.message}`);

    // Dynamic fallbacks based on date to ensure the tool always works
    const fallbacks = [
      `Jupiter's alignment brings a wave of creative energy to ${sign} today. Trust your intuition and take proactive steps toward your goals.`,
      `The current planetary transitions suggest a day of reflection and clarity for ${sign}. Focus on internal growth and maintain a positive outlook.`,
      `The stars indicate a time of professional stability and social connection for ${sign}. Your hard work is being recognized.`,
      `A period of significant personal growth is unfolding for ${sign}. New opportunities may arise through unexpected conversations today.`,
      `The cosmic energy today favors networking and collaboration for ${sign}. Trust your ability to influence others positively.`
    ];
    
    const dayOfMonth = new Date().getDate();
    const fallbackIndex = (dayOfMonth + sign.length) % fallbacks.length;

    res.json({
      success: true,
      date: today,
      prediction: fallbacks[fallbackIndex],
      status: "backup"
    });
  }
});
