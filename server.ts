import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { runDynamicInspection, ScamInspectionReport } from './src/services/dynamicScanner';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Gemini Dynamic Inspection Endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { text = '', url = '', language = 'en' } = req.body || {};
    const cleanText = (text || '').trim();
    const cleanUrl = (url || '').trim();

    if (!cleanText && !cleanUrl) {
      return res.json(runDynamicInspection('', ''));
    }

    const ai = getGenAI();

    // If no API key or client, immediately fallback to the deterministic dynamic scanner
    if (!ai) {
      const fallbackReport = runDynamicInspection(cleanText, cleanUrl);
      return res.json(fallbackReport);
    }

    const languageNames: Record<string, string> = {
      es: 'Spanish / Español',
      hi: 'Hindi / हिंदी',
      fr: 'French / Français',
      zh: 'Mandarin Chinese / 中文',
      de: 'German / Deutsch',
      ar: 'Arabic / العربية',
    };
    const targetLangName = language && language !== 'en' ? (languageNames[language] || language) : '';

    const systemInstruction = `You are ScamShield AI, an elite cybersecurity product engine, document fraud inspector, and anti-phishing analyst. Your objective is to perform precise, explainable security inspections on job offer letters, employment contracts, rental agreements, property listings, and suspicious URLs submitted by users.

CRITICAL OPERATIONAL DIRECTIVES:
1. Explainable Threat Scoring: You must dynamically score the Scam Threat Index from 0 to 100 based strictly on the sum of detected risk factor weights. Never output a hardcoded or static score.
2. Anti-Phishing & "Hook" Detection: Actively look for social engineering traps ("hooks"), such as fake equipment check buybacks, deposit traps, urgency pressure, off-platform chat migrations, and typosquatted lookalike domains.
3. Differentiate Safe from Fraudulent: Do NOT mark every input as a scam. If a document or image appears legitimate, assign low weights, highlight safe signals, and assign a low threat index (0–24%).
4. Honest Information Policy: Never invent domain ages, WHOIS records, or company registration data. If domain details are not provided, explicitly state "Domain age unavailable (Requires live WHOIS lookup)".
5. Objective Evidence Extraction: For every red flag detected, quote the exact text or URL snippet from the input that triggered the warning.
6. DEDICATED VECTOR RULE: If an input contains ID/Banking Theft vectors (SSN, Passport, Bank Login Code, credentials, account PIN, OTP), you MUST display a dedicated factor:
   "factor": "Sensitive PII & Financial Credentials Harvesting Trap", "points": 35.
7. STRICT RELEVANCE RULE: Do NOT include "Equipment Trap", "Webmail", "Lookalike Domain", or "Telegram Migration" UNLESS those specific keywords or patterns are explicitly found in the target input text.
8. Calculate the Scam Threat Index dynamically purely from the active factors detected in the current payload. If no risk factors are detected, the scamThreatIndex MUST be 0.
${
  targetLangName
    ? `9. MULTILINGUAL DIRECTIVE:
Respond entirely in the following language: ${targetLangName}. Keep exact quote evidence in the original source text format, but translate the executive summary, indicator names, explanations, score factors, and safe signals into ${targetLangName}.`
    : ''
}

OUTPUT FORMAT:
You MUST respond strictly with a valid, raw JSON object (no markdown code blocks, no backticks, no prose preamble). Use this exact schema:
{
  "scamThreatIndex": number, // Calculated sum (0 to 100)
  "riskLevel": "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk",
  "summary": "Concise 2-3 sentence executive summary explaining the verdict.",
  "scoreFactors": [
    {
      "factor": "Short description of contributing risk factor",
      "points": number
    }
  ],
  "detectedRedFlags": [
    {
      "indicator": "Name of indicator",
      "severity": "Low" | "Medium" | "High" | "Critical",
      "evidence": "Exact quote or string snippet from input",
      "explanation": "Clear explanation of why this represents a security threat."
    }
  ],
  "safeSignals": [
    "List of positive/legitimate indicators found"
  ],
  "domainAnalysis": {
    "domainName": "Extracted domain or 'N/A'",
    "suspiciousPatterns": ["List of suspicious URL features found"],
    "domainAge": "Domain age unavailable (Requires live WHOIS lookup)",
    "notes": "Structural URL/Domain security assessment"
  },
  "recommendedActions": [
    "Clear, practical safety steps for the user to take next"
  ]
}`;

    const prompt = `Inspect the following target payload submitted by the user.

USER SUBMITTED PAYLOAD:
--- TEXT BEGIN ---
${cleanText}
--- TEXT END ---
${cleanUrl ? `TARGET URL / DOMAIN: ${cleanUrl}` : ''}

Remember:
- Evaluate the EXACT text provided.
- If ID/Banking Theft vectors (SSN, Passport, Bank Login Code) are present, include factor "Sensitive PII & Financial Credentials Harvesting Trap" (+35 pts).
- Do NOT include "Equipment Trap", "Webmail", "Lookalike Domain", or "Telegram Migration" unless those exact keywords or patterns are explicitly found in the target input text.
- Sum up the scoreFactors points to set scamThreatIndex.
${
  targetLangName
    ? `Respond entirely in the following language: ${targetLangName}. Keep exact quote evidence in the original source text format, but translate the executive summary, indicator names, explanations, score factors, and safe signals into ${targetLangName}.`
    : ''
}
Respond with raw JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text ? response.text.trim() : '';
    // Strip markdown code fences if any were included
    const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

    if (cleanedJson) {
      const parsed = JSON.parse(cleanedJson) as ScamInspectionReport;
      // Validate schema has required fields
      if (typeof parsed.scamThreatIndex === 'number' && Array.isArray(parsed.scoreFactors)) {
        // Enforce math integrity: sum of factors matches or caps at 100
        const factorSum = parsed.scoreFactors.reduce((sum, f) => sum + (f.points || 0), 0);
        parsed.scamThreatIndex = Math.min(100, Math.max(0, factorSum));
        return res.json(parsed);
      }
    }

    // Fallback if parsing didn't succeed
    const fallbackReport = runDynamicInspection(cleanText, cleanUrl);
    return res.json(fallbackReport);
  } catch (error) {
    console.error('Error in /api/scan with Gemini:', error);
    // Graceful fallback to deterministic dynamic scanner
    const fallbackReport = runDynamicInspection(req.body?.text || '', req.body?.url || '');
    return res.json(fallbackReport);
  }
});

// Dynamic AI Translation Endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { report, targetLanguage } = req.body || {};
    if (!report || !targetLanguage || targetLanguage === 'en') {
      return res.json({ success: true, report });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({ success: false, message: 'Gemini AI not initialized on server' });
    }

    const languageNames: Record<string, string> = {
      es: 'Spanish (Español)',
      hi: 'Hindi (हिंदी)',
      fr: 'French (Français)',
      zh: 'Mandarin Chinese (中文)',
      de: 'German (Deutsch)',
      ar: 'Arabic (العربية)',
    };
    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    const prompt = `You are ScamShield AI Multilingual Cybersecurity Translator.
Translate the following cyber threat inspection report into ${targetLangName}.

STRICT TRANSLATION RULES:
1. Translate "summary" into professional, natural ${targetLangName}.
2. For each item in "detectedRedFlags":
   - Translate "indicator" and "explanation" into ${targetLangName}.
   - CRITICAL REQUIREMENT: DO NOT TRANSLATE "evidence". Keep the "evidence" string EXACTLY in its original English verbatim text.
3. Translate all items in "recommendedActions" and "safeSignals" into ${targetLangName}.
4. Translate "factor" descriptions in "scoreFactors" into ${targetLangName}.
5. Do NOT change any numbers, scores, severity levels ("Low", "Medium", "High", "Critical"), or domain analysis technical names.
6. Return ONLY the valid JSON object with the exact same structure. No markdown backticks, no prose.

ORIGINAL REPORT JSON:
${JSON.stringify(report, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text ? response.text.trim() : '';
    const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

    if (cleanedJson) {
      const parsed = JSON.parse(cleanedJson);
      // Ensure evidence snippets remain strictly identical to original
      if (Array.isArray(parsed.detectedRedFlags) && Array.isArray(report.detectedRedFlags)) {
        parsed.detectedRedFlags.forEach((rf: any, i: number) => {
          if (report.detectedRedFlags[i]) {
            rf.evidence = report.detectedRedFlags[i].evidence;
          }
        });
      }
      return res.json({ success: true, report: parsed });
    }

    return res.json({ success: false, message: 'Could not parse translation' });
  } catch (err) {
    console.error('Error in /api/translate:', err);
    return res.json({ success: false, message: 'Translation error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamShield Server running on port ${PORT}`);
  });
}

startServer();
