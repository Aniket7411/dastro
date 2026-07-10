/**
 * Build & download a shareable preliminary reading report as PDF.
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SITE_LOGO, SITE_LOGO_ALT, SITE_NAME, SITE_NAME_LLP } from './brandAssets';
import { CONTACT_PHONE_DISPLAY } from './contactInfo';
import { getRashiHi } from './rashi';
import { formatLeadAge } from './ageFromDob';

const SITE_WEBSITE = 'https://www.dsastrology.com';
const SITE_EMAIL = 'info@dsastroinstitute.com';
const REPORT_WIDTH_PX = 680;

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getLogoUrl() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${SITE_LOGO}`;
  }
  return `${SITE_WEBSITE.replace(/\/$/, '')}${SITE_LOGO}`;
}

async function loadLogoDataUrl() {
  const candidates = [
    getLogoUrl(),
    `${SITE_WEBSITE.replace(/\/$/, '')}${SITE_LOGO}`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      if (dataUrl) return dataUrl;
    } catch {
      // try next source
    }
  }
  return null;
}

function formatDateTimeIST(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function pickReadingBlocks(reading, lang) {
  const en = {
    nature: reading.natureEn || reading.nature || '',
    phase: reading.currentPhaseEn || reading.currentPhase || '',
    reveal: reading.fullChartRevealEn || reading.fullChartReveal || '',
    luckyColour: reading.luckyColour || '',
  };
  const hi = {
    nature: reading.natureHi || '',
    phase: reading.currentPhaseHi || '',
    reveal: reading.fullChartRevealHi || '',
    luckyColour: reading.luckyColourHi || reading.luckyColour || '',
  };

  if (lang === 'en') return { en, hi: null };
  if (lang === 'hi') return { en: null, hi };
  return { en, hi };
}

function sectionBlock(title, body, isHindi = false, compact = false) {
  if (!body?.trim()) return '';
  const font = isHindi
    ? "font-family:'IBM Plex Sans Devanagari','Noto Sans Devanagari',sans-serif;"
    : "font-family:'IBM Plex Sans',system-ui,sans-serif;";
  const mb = compact ? '8px' : '14px';
  const pad = compact ? '8px 10px' : '12px 14px';
  const titleSize = compact ? '10px' : '11px';
  const bodySize = compact ? '12px' : '14px';
  const lineHeight = compact ? '1.5' : '1.65';
  return `
    <div style="margin:0 0 ${mb};padding:${pad};background:#fff;border:1px solid #ddd;border-radius:4px;">
      <h3 style="margin:0 0 4px;font-size:${titleSize};font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#000;${font}">${escapeHtml(title)}</h3>
      <p style="margin:0;font-size:${bodySize};line-height:${lineHeight};color:#000;${font}">${escapeHtml(body)}</p>
    </div>`;
}

function metaRow(label, value, compact = false) {
  if (!value || value === '—') return '';
  const pad = compact ? '2px 10px 2px 0' : '4px 12px 4px 0';
  return `
    <tr>
      <td style="padding:${pad};font-size:10px;font-weight:700;color:#444;white-space:nowrap;vertical-align:top;width:108px;">${escapeHtml(label)}</td>
      <td style="padding:2px 0;font-size:11px;color:#000;vertical-align:top;line-height:1.4;">${escapeHtml(value)}</td>
    </tr>`;
}

export function buildReadingReportHtml(
  lead,
  reading,
  lang = 'both',
  { includePrintButton = false, logoDataUrl = null, compact = false } = {},
) {
  const blocks = pickReadingBlocks(reading, lang);
  const contactTime = formatDateTimeIST(lead.submittedAt || lead.createdAt || lead.contactedAt);
  const generatedAt = formatDateTimeIST(new Date().toISOString());
  const langLabel = lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'English & Hindi';
  const logoSrc = logoDataUrl || getLogoUrl();
  const counsellorLine = lead.counsellorName || '—';
  const outerPad = compact ? '0' : '24px 16px';
  const wrapPad = compact ? '10px 14px' : '18px 22px';

  const rashiHi = reading.rashiHi || getRashiHi(reading.sunSign);
  const rashiLine = reading.sunSign
    ? (lang === 'hi' && rashiHi
      ? `राशि: ${rashiHi} (${reading.sunSign})`
      : rashiHi
        ? `Rashi: ${reading.sunSign} · ${rashiHi}`
        : `Rashi: ${reading.sunSign}`)
    : '';

  const luckyLine = lang === 'hi'
    ? `रंग: ${blocks.hi?.luckyColour || reading.luckyColourHi || reading.luckyColour || '—'}`
    : lang === 'en'
      ? `Lucky Colour: ${blocks.en?.luckyColour || reading.luckyColour || '—'}`
      : `Lucky Colour: ${reading.luckyColour || '—'}  |  रंग: ${reading.luckyColourHi || '—'}`;

  let bodySections = '';

  if (lang === 'both' || lang === 'en') {
    if (blocks.en) {
      bodySections += sectionBlock('Your Nature', blocks.en.nature, false, compact);
      bodySections += sectionBlock('Your Current Phase', blocks.en.phase, false, compact);
      bodySections += sectionBlock('What Your Full Chart Will Reveal', blocks.en.reveal, false, compact);
    }
  }

  if (lang === 'both' || lang === 'hi') {
    if (blocks.hi) {
      if (lang === 'both') {
        bodySections += '<p style="margin:6px 0 6px;font-size:10px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:0.08em;">हिंदी</p>';
      }
      bodySections += sectionBlock('आपका स्वभाव', blocks.hi.nature, true, compact);
      bodySections += sectionBlock('आपका वर्तमान चरण', blocks.hi.phase, true, compact);
      bodySections += sectionBlock('पूरी कुंडली क्या बताएगी', blocks.hi.reveal, true, compact);
    }
  }

  const readingType = reading.source === 'fallback' ? 'Template reading' : 'AI-generated preliminary reading';

  const printButton = includePrintButton
    ? `<div class="no-print" style="padding:12px 22px 18px;text-align:center;border-top:1px solid #ccc;">
      <button onclick="window.print()" style="cursor:pointer;border:1px solid #000;background:#000;color:#fff;font-weight:700;font-size:13px;padding:10px 22px;border-radius:6px;">Print / Save as PDF</button>
    </div>`
    : '';

  const footerBlock = compact
    ? `<div style="padding:8px 14px;border-top:1px solid #ddd;background:#fafafa;text-align:center;">
        <p style="margin:0;font-size:9px;font-weight:700;color:#000;">${escapeHtml(SITE_NAME)} · ${escapeHtml(SITE_WEBSITE)}</p>
      </div>`
    : `<div style="padding:12px 22px;border-top:1px solid #000;background:#fafafa;text-align:center;">
        <img src="${escapeHtml(logoSrc)}" alt="${escapeHtml(SITE_LOGO_ALT)}" width="36" height="36" style="display:inline-block;width:36px;height:36px;object-fit:contain;margin-bottom:6px;" />
        <p style="margin:0;font-size:10px;font-weight:700;color:#000;">${escapeHtml(SITE_NAME)} · ${escapeHtml(SITE_NAME_LLP)}</p>
        <p style="margin:4px 0 0;font-size:10px;color:#444;">${escapeHtml(SITE_WEBSITE)}</p>
      </div>`;

  return `<!DOCTYPE html>
<html lang="${lang === 'hi' ? 'hi' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Preliminary Reading — ${escapeHtml(lead.name || 'Caller')} — ${SITE_NAME}</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    @media print {
      body { padding: 0; background: #fff; }
      .no-print { display: none; }
      .report-wrap { box-shadow: none !important; border: none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:${outerPad};background:#fff;font-family:'IBM Plex Sans',system-ui,sans-serif;color:#000;">
  <div class="report-wrap" style="width:${REPORT_WIDTH_PX}px;max-width:100%;margin:0 auto;background:#fff;border:1px solid #000;border-radius:${compact ? '4px' : '8px'};overflow:hidden;">
    <div style="padding:${wrapPad};border-bottom:1px solid #000;background:#fff;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="width:56px;vertical-align:middle;padding:0 10px 0 0;">
            <img src="${escapeHtml(logoSrc)}" alt="${escapeHtml(SITE_LOGO_ALT)}" width="52" height="52" style="display:block;width:52px;height:52px;object-fit:contain;" />
          </td>
          <td style="vertical-align:middle;">
            <p style="margin:0;font-size:${compact ? '15px' : '18px'};font-weight:800;color:#000;line-height:1.2;">${escapeHtml(SITE_NAME)}</p>
            <p style="margin:2px 0 0;font-size:10px;font-weight:600;color:#444;">${escapeHtml(SITE_NAME_LLP)}</p>
            <p style="margin:4px 0 0;font-size:10px;color:#444;line-height:1.4;">
              ${escapeHtml(SITE_WEBSITE)} · ${escapeHtml(SITE_EMAIL)} · ${escapeHtml(CONTACT_PHONE_DISPLAY)}
            </p>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding:${wrapPad};border-bottom:1px solid #ddd;background:#fafafa;">
      <h1 style="margin:0 0 6px;font-size:${compact ? '16px' : '20px'};font-weight:800;color:#000;line-height:1.2;">Preliminary Reading Report</h1>
      <table style="width:100%;border-collapse:collapse;">
        ${metaRow('Time of contact', `${contactTime} (IST)`, compact)}
        ${metaRow('Report generated', `${generatedAt} (IST)`, compact)}
        ${metaRow('Language', langLabel, compact)}
        ${metaRow('Reading type', readingType, compact)}
        ${metaRow('Counsellor', counsellorLine, compact)}
        ${metaRow('Counsellor email', lead.counsellorEmail || '', compact)}
      </table>
    </div>

    <div style="padding:${wrapPad};">
      <div style="margin:0 0 10px;padding:8px 10px;background:#fff;border-radius:4px;border:1px solid #ddd;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#444;">Caller details</p>
        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#000;line-height:1.3;">${escapeHtml(lead.name || '—')}</p>
        <table style="border-collapse:collapse;width:100%;">
          ${metaRow('Mobile', lead.mobile || '—', compact)}
          ${metaRow('Date of birth', lead.dob || '', compact)}
          ${metaRow('Time of birth', lead.tobUnknown ? 'Unknown' : (lead.tob || '—'), compact)}
          ${metaRow('Place of birth', lead.pob || '', compact)}
          ${metaRow('Age', formatLeadAge(lead), compact)}
          ${metaRow('Gender', lead.gender || '', compact)}
          ${metaRow('Reason for call', lead.reasonForCalling || '', compact)}
        </table>
        ${rashiLine ? `<p style="margin:6px 0 0;font-size:11px;font-weight:600;color:#000;line-height:1.4;${lang === 'hi' || rashiHi ? "font-family:'IBM Plex Sans Devanagari',sans-serif;" : ''}">${escapeHtml(rashiLine)}</p>` : ''}
      </div>

      <div style="margin:0 0 10px;padding:8px 10px;background:#fff;border-radius:4px;border:1px solid #000;text-align:center;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#000;line-height:1.4;${lang === 'hi' ? "font-family:'IBM Plex Sans Devanagari',sans-serif;" : ''}">${escapeHtml(luckyLine)}</p>
      </div>

      ${bodySections}

      <p style="margin:10px 0 0;padding-top:8px;border-top:1px solid #ddd;font-size:9px;line-height:1.45;color:#444;">
        This is a preliminary glimpse only. For exact timing, remedies and personalised guidance, book a full consultation with ${escapeHtml(SITE_NAME)}.
        Contact: ${escapeHtml(CONTACT_PHONE_DISPLAY)} · ${escapeHtml(SITE_EMAIL)} · ${escapeHtml(SITE_WEBSITE)}
      </p>
    </div>

    ${footerBlock}
    ${printButton}
  </div>
</body>
</html>`;
}

function buildPdfFilename(lead, lang) {
  const safeName = (lead.name || 'caller').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'caller';
  const langSuffix = lang === 'both' ? 'bilingual' : lang;
  return `DS-Astrology-Reading-${safeName}-${langSuffix}.pdf`;
}

async function waitForDocumentReady(doc) {
  await new Promise((resolve) => {
    if (doc.readyState === 'complete') resolve();
    else doc.defaultView?.addEventListener('load', resolve, { once: true });
  });

  const images = Array.from(doc.images);
  await Promise.all(images.map((img) => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
      setTimeout(resolve, 1500);
    });
  }));

  if (doc.fonts?.ready) {
    await doc.fonts.ready;
  }

  await new Promise((resolve) => setTimeout(resolve, 200));
}

async function renderHtmlToPdf(html) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${REPORT_WIDTH_PX}px;height:2000px;border:0;visibility:hidden;`;
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error('Could not create report frame');
  }

  doc.open();
  doc.write(html);
  doc.close();

  await waitForDocumentReady(doc);

  const target = doc.querySelector('.report-wrap') || doc.body;
  const canvas = await html2canvas(target, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: false,
    logging: false,
    width: REPORT_WIDTH_PX,
    windowWidth: REPORT_WIDTH_PX,
    imageTimeout: 0,
  });

  document.body.removeChild(iframe);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2;

  let renderW = maxW;
  let renderH = (canvas.height * maxW) / canvas.width;

  if (renderH > maxH) {
    renderH = maxH;
    renderW = (canvas.width * maxH) / canvas.height;
  }

  const x = (pageWidth - renderW) / 2;
  const y = margin;
  const imgData = canvas.toDataURL('image/png');

  pdf.addImage(imgData, 'PNG', x, y, renderW, renderH);

  return pdf;
}

export async function downloadReadingReport(lead, reading, lang = 'both') {
  if (!reading) return false;

  try {
    const logoDataUrl = await loadLogoDataUrl();
    const html = buildReadingReportHtml(lead, reading, lang, {
      includePrintButton: false,
      logoDataUrl,
      compact: true,
    });
    const pdf = await renderHtmlToPdf(html);
    pdf.save(buildPdfFilename(lead, lang));
    return true;
  } catch {
    return false;
  }
}

export function openReadingReportPrint(lead, reading, lang = 'both') {
  if (!reading) return false;
  const html = buildReadingReportHtml(lead, reading, lang, { includePrintButton: true });
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
  return true;
}
