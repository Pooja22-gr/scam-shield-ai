export interface ScamInspectionReport {
  scamThreatIndex: number; // 0 - 100 calculated sum
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';
  summary: string;
  scoreFactors: Array<{
    factor: string;
    points: number;
  }>;
  detectedRedFlags: Array<{
    indicator: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    evidence: string;
    explanation: string;
  }>;
  safeSignals: string[];
  domainAnalysis: {
    domainName: string;
    suspiciousPatterns: string[];
    domainAge: string;
    notes: string;
  };
  recommendedActions: string[];
}

export function runDynamicInspection(
  rawText: string,
  urlInput: string = ''
): ScamInspectionReport {
  const cleanText = (rawText || '').trim();
  const cleanUrl = (urlInput || '').trim();
  const combined = `${cleanText} ${cleanUrl}`.trim();

  if (!combined) {
    return {
      scamThreatIndex: 0,
      riskLevel: 'Low Risk',
      summary: 'No document or URL provided for inspection.',
      scoreFactors: [],
      detectedRedFlags: [],
      safeSignals: ['Ready for document analysis.'],
      domainAnalysis: {
        domainName: 'N/A',
        suspiciousPatterns: [],
        domainAge: 'Domain age unavailable',
        notes: 'No external URL or email domain submitted.',
      },
      recommendedActions: [
        'Paste an employment offer, rental agreement, or URL to begin scanning.',
      ],
    };
  }

  const factors: Array<{ factor: string; points: number }> = [];
  const redFlags: ScamInspectionReport['detectedRedFlags'] = [];
  const safeSignals: string[] = [];
  const suspiciousPatterns: string[] = [];
  const lower = combined.toLowerCase();

  // -------------------------------------------------------------
  // 1. SENSITIVE PII & BANKING CREDENTIALS HARVESTING TRAP (+35 pts)
  // Required: Explicit SSN, Passport, Bank Login Code, or Financial Credentials
  // -------------------------------------------------------------
  const piiHarvestingRegex =
    /(?:social\s+security(?:\s+number)?|\bssn\b|tax\s+id(?:entification)?|national\s+id|\b\d{3}[-\s]\d{2}[-\s]\d{4}\b|passport(?:\s+(?:number|photo|copy|scan))?|driver'?s?\s+license|front\s+and\s+back\s+of\s+(?:your\s+)?(?:id|license)|identity\s+card|government\s+issued\s+id|photo\s+id|bank\s+login(?:\s+code|\s+credentials)?|banking\s+(?:code|credentials|password)|login\s+code|account\s+pin|online\s+banking\s+(?:login|credentials|password)|otp\s+(?:code|verification)|bank\s+verification\s+code|bank\s+account\s+and\s+routing\s+login)/i;
  const piiMatch = combined.match(piiHarvestingRegex);

  if (piiMatch) {
    factors.push({
      factor: 'Sensitive PII & Financial Credentials Harvesting Trap',
      points: 35,
    });
    redFlags.push({
      indicator: 'Sensitive PII & Financial Credentials Harvesting',
      severity: 'Critical',
      evidence: extractSnippet(combined, piiMatch[0]),
      explanation:
        'Demanding government identification (SSN, Passport) or online banking login credentials/codes prior to verified, formal hiring or in-person lease execution is a definitive credential harvesting and identity theft attack.',
    });
  }

  // -------------------------------------------------------------
  // 2. ADVANCE-FEE EQUIPMENT & FAKE CHECK OVERPAYMENT TRAP (+35 pts)
  // Required: MUST explicitly contain financial check issuance/deposit
  // AND MUST explicitly contain equipment/hardware purchase from a vendor.
  // Must NOT trigger on general "background check" or non-equipment checks.
  // -------------------------------------------------------------
  const financialCheckRegex =
    /(?:cashier'?s?\s+check|certified\s+check|deposit(?:\s+this|\s+the)?\s+check|issue(?:\s+you)?\s+a\s+check|send(?:\s+you)?\s+a\s+check|advance\s+check|check\s+(?:of|for)\s+\$|\$\d+(?:,\d{3})*(?:\.\d{2})?\s+check|check\s+to\s+cover|overpayment\s+check)/i;
  const equipmentKeywordsRegex =
    /(?:equipment|macbook|laptop|workstation|hardware|office\s+gear|software\s+suite|certified\s+(?:vendor|supplier)|equipment\s+vendor|supplies\s+vendor|home\s+office\s+setup)/i;

  const checkMatch = combined.match(financialCheckRegex);
  const equipmentMatch = combined.match(equipmentKeywordsRegex);

  // Check if check is only a "background check" or "reference check"
  const isOnlyBackgroundCheck =
    /background\s+check|reference\s+check|security\s+check/i.test(combined) && !checkMatch;

  if (checkMatch && equipmentMatch && !isOnlyBackgroundCheck) {
    factors.push({
      factor: 'Advance-Fee Equipment & Fake Check Overpayment Trap',
      points: 35,
    });
    redFlags.push({
      indicator: 'Fake Check Equipment Scam',
      severity: 'Critical',
      evidence: extractSnippet(combined, `${checkMatch[0]} ... ${equipmentMatch[0]}`),
      explanation:
        'Directing a candidate to deposit an employer check and transfer money to an equipment vendor is a classic advance-fee check fraud scheme. The check will bounce, leaving the victim liable for all transferred funds.',
    });
  }

  // -------------------------------------------------------------
  // 3. SIGHT-UNSEEN RENTAL DEPOSIT TRAP (+30 pts)
  // Required: Rental context + upfront deposit/wire + sight-unseen excuses
  // -------------------------------------------------------------
  const rentalContextRegex =
    /(?:rent|lease|landlord|tenant|sublet|penthouse|apartment|flat|security\s+deposit|first\s+month'?s?\s+rent|holding\s+deposit)/i;
  const sightUnseenExcusesRegex =
    /(?:cannot\s+meet\s+in\s+person|out\s+of\s+(?:town|the\s+country)|missionary|humanitarian|keys\s+will\s+be\s+(?:couriered|mailed|dispatched|sent)|wire\s+the\s+deposit)/i;

  const rentalContextMatch = combined.match(rentalContextRegex);
  const sightUnseenMatch = combined.match(sightUnseenExcusesRegex);

  if (rentalContextMatch && sightUnseenMatch) {
    factors.push({
      factor: 'Sight-Unseen Rental Deposit Trap',
      points: 30,
    });
    redFlags.push({
      indicator: 'Absentee Landlord Deposit Trap',
      severity: 'Critical',
      evidence: extractSnippet(combined, sightUnseenMatch[0]),
      explanation:
        'Demanding non-refundable wire transfers or escrow deposits prior to a physical walk-through or meeting in person is the primary signature of rental fraud.',
    });
  }

  // -------------------------------------------------------------
  // 4. NON-REVERSIBLE PAYMENT CHANNEL DEMAND (+30 pts)
  // Required: Direct demand for Zelle/Venmo/Western Union/Bitcoin/Gift Cards
  // Only added if not already captured under Equipment or Rental traps
  // -------------------------------------------------------------
  const paymentMethodsRegex =
    /(?:zelle|venmo|cash\s*app|western\s+union|moneygram|wire\s+transfer|bitcoin|cryptocurrency|crypto|gift\s+card|apple\s+gift\s+cards|steam\s+card)/i;
  const paymentMatch = combined.match(paymentMethodsRegex);

  if (
    paymentMatch &&
    !factors.some(
      (f) =>
        f.factor.includes('Equipment') ||
        f.factor.includes('Rental') ||
        f.factor.includes('Payment Channel')
    )
  ) {
    factors.push({
      factor: 'Non-Reversible Payment Channel Demand (Zelle/Wire/Crypto)',
      points: 30,
    });
    redFlags.push({
      indicator: 'Irreversible Payment Vector',
      severity: 'Critical',
      evidence: extractSnippet(combined, paymentMatch[0]),
      explanation:
        'Demanding non-refundable payment methods like Zelle, Western Union, wire transfers, or cryptocurrency before onboarding or contract validation allows scammers to abscond with funds untraceably.',
    });
  }

  // -------------------------------------------------------------
  // 5. OFFICIAL ENTERPRISE USING FREE PUBLIC WEBMAIL (+20 pts)
  // Required: MUST explicitly contain a free webmail address in the text
  // -------------------------------------------------------------
  const freeEmailRegex =
    /[a-zA-Z0-9._%+-]+@(fastmail\.[a-z]+|gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|protonmail\.com|aol\.com|zoho\.com|mail\.com|yandex\.com|icloud\.com)/i;
  const freeEmailMatch = combined.match(freeEmailRegex);

  if (freeEmailMatch) {
    factors.push({
      factor: 'Official Enterprise / Vendor Using Free Public Webmail',
      points: 20,
    });
    suspiciousPatterns.push(`Free consumer webmail domain detected: ${freeEmailMatch[0]}`);
    redFlags.push({
      indicator: 'Consumer Webmail Domain for Corporate Operations',
      severity: 'High',
      evidence: extractSnippet(combined, freeEmailMatch[0]),
      explanation:
        'Legitimate enterprise recruitment, procurement, and leasing is conducted via registered corporate domains, never free personal email providers like Fastmail, Gmail, or Yahoo.',
    });
  }

  // -------------------------------------------------------------
  // 6. SUSPICIOUS LOOKALIKE / TYPOSQUATTED DOMAIN STRUCTURE (+25 pts)
  // Required: MUST have an actual URL/domain explicitly found AND
  // that domain must have lookalike hyphen patterns, high-risk TLDs, or plain HTTP
  // -------------------------------------------------------------
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(?:top|xyz|live|net|info|work|cc|online|link|click|bid)\b[^\s]*)/gi;
  const urlsFound = combined.match(urlRegex) || [];
  let detectedDomain = 'N/A';

  if (cleanUrl) {
    try {
      const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      detectedDomain = parsed.hostname;
    } catch {
      detectedDomain = cleanUrl.replace(/^https?:\/\//i, '').split('/')[0] || 'N/A';
    }
  } else if (urlsFound.length > 0 && urlsFound[0]) {
    const rawUrl = urlsFound[0];
    detectedDomain = rawUrl.replace(/^https?:\/\//i, '').split('/')[0] || 'N/A';
  }

  if (detectedDomain !== 'N/A') {
    const hasLookalikeHyphens =
      /(?:portal|careers|supplies|jobs|recruiting|hiring|verify|hr-|login-)[a-zA-Z0-9-]*\.[a-z]+/i.test(
        detectedDomain
      ) ||
      /[a-zA-Z0-9-]+-(?:portal|supplies|login|hr|jobs|careers|team)\.[a-z]+/i.test(
        detectedDomain
      );

    const hasSuspiciousTld = /\.(xyz|top|live|click|work|online|cc|link|bid)$/i.test(
      detectedDomain
    );

    const isInsecureHttp =
      combined.includes('http://') &&
      !combined.includes('https://') &&
      detectedDomain !== 'N/A';

    if (hasLookalikeHyphens || hasSuspiciousTld || isInsecureHttp) {
      factors.push({
        factor: 'Suspicious Lookalike / Typosquatted Domain Structure',
        points: 25,
      });

      if (hasLookalikeHyphens) {
        suspiciousPatterns.push(`Hyphenated brand spoofing pattern in domain '${detectedDomain}'`);
      }
      if (hasSuspiciousTld) {
        suspiciousPatterns.push(`High-risk phishing top-level domain '${detectedDomain}'`);
      }
      if (isInsecureHttp) {
        suspiciousPatterns.push('Unencrypted plain HTTP transmission on sensitive portal URL');
      }

      redFlags.push({
        indicator: 'Lookalike or High-Risk Phishing Domain',
        severity: 'High',
        evidence: detectedDomain,
        explanation:
          'The destination domain utilizes multi-hyphenated brand spoofing or high-risk disposable top-level domains commonly deployed in spear-phishing campaigns.',
      });
    }
  }

  // -------------------------------------------------------------
  // 7. OFF-PLATFORM RECRUITMENT MIGRATION (TELEGRAM/WHATSAPP) (+15 pts)
  // Required: MUST explicitly contain telegram, whatsapp, signal, wechat, or t.me/
  // DO NOT match plain email addresses with '@'!
  // -------------------------------------------------------------
  const offPlatformRegex =
    /(?:telegram|whatsapp|signal|wechat|google\s+hangouts|wire\s+app|t\.me\/[a-zA-Z0-9_]+|reach\s+out\s+on\s+telegram|contact\s+(?:on|via)\s+telegram|message\s+(?:on|via)\s+telegram|contact\s+(?:on|via)\s+whatsapp|message\s+(?:on|via)\s+whatsapp)/i;
  const offPlatformMatch = combined.match(offPlatformRegex);

  if (offPlatformMatch) {
    factors.push({
      factor: 'Off-Platform Recruitment Migration (Telegram/WhatsApp)',
      points: 15,
    });
    redFlags.push({
      indicator: 'Off-Platform Chat Migration',
      severity: 'High',
      evidence: extractSnippet(combined, offPlatformMatch[0]),
      explanation:
        'Moving recruitment or leasing dialogues onto encrypted chat apps (Telegram/WhatsApp) evades corporate security controls, compliance logging, and law enforcement accountability.',
    });
  }

  // -------------------------------------------------------------
  // 8. MANUFACTURED HIGH-PRESSURE URGENCY DEADLINE (+15 pts)
  // Required: Explicit high-pressure deadline (e.g. 12/24 hours, expires today)
  // -------------------------------------------------------------
  const urgencyRegex =
    /(?:within\s+(?:12|24|48)\s+hours|sign\s+and\s+wire\s+funds\s+within|transfer\s+receipt\s+within|hold\s+your\s+(?:spot|position|reservation)\s+within|urgent\s+reply|expires\s+(?:today|in\s+24\s+hours))/i;
  const urgencyMatch = combined.match(urgencyRegex);

  if (urgencyMatch) {
    factors.push({
      factor: 'Manufactured High-Pressure Urgency Deadline',
      points: 15,
    });
    redFlags.push({
      indicator: 'High-Pressure Urgency Trap',
      severity: 'High',
      evidence: extractSnippet(combined, urgencyMatch[0]),
      explanation:
        'Artificial time pressure (e.g., 24-hour expiration) is engineered to induce panic and prevent candidates from conducting due diligence, checking bank records, or consulting advisors.',
    });
  }

  // -------------------------------------------------------------
  // 9. IMPERSONAL GENERIC SALUTATION (+10 pts)
  // Required: "Dear Applicant", "Dear Candidate", "Dear Job Seeker"
  // -------------------------------------------------------------
  const genericSalutationRegex =
    /(?:dear\s+applicant|dear\s+candidate|dear\s+job\s+seeker|dear\s+sir\/madam)/i;
  const salutationMatch = combined.match(genericSalutationRegex);

  if (salutationMatch) {
    factors.push({
      factor: 'Impersonal Generic Salutation (Mass Phishing Blast)',
      points: 10,
    });
    redFlags.push({
      indicator: 'Generic Salutation',
      severity: 'Low',
      evidence: extractSnippet(combined, salutationMatch[0]),
      explanation:
        'Impersonal greetings like "Dear Applicant" or "Dear Candidate" indicate mass-distributed automated phishing templates rather than targeted corporate communications.',
    });
  }

  // -------------------------------------------------------------
  // 10. DISPROPORTIONATELY INFLATED ENTRY-LEVEL REMOTE COMPENSATION (+10 pts)
  // Required: Unrealistic hourly wage ($40-$80/hr) for generic roles
  // -------------------------------------------------------------
  const inflatedWageRegex =
    /(\$(?:4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9])(?:\.00)?\s*(?:\/|\s*per\s*)hr|\$\d{2,3},\d{3}\s+monthly)/i;
  const wageMatch = combined.match(inflatedWageRegex);

  if (
    wageMatch &&
    (lower.includes('data entry') ||
      lower.includes('administrative') ||
      lower.includes('assistant') ||
      lower.includes('remote operations') ||
      lower.includes('customer care') ||
      lower.includes('copywriting'))
  ) {
    factors.push({
      factor: 'Disproportionately Inflated Entry-Level Remote Compensation',
      points: 10,
    });
    redFlags.push({
      indicator: 'Unrealistic Compensation Hook',
      severity: 'Medium',
      evidence: extractSnippet(combined, wageMatch[0]),
      explanation:
        'Offering exorbitant hourly compensation ($40-$80/hr) for routine administrative or entry-level duties is a psychological bait used to disarm candidate skepticism.',
    });
  }

  // -------------------------------------------------------------
  // SAFE SIGNALS DETECTION
  // -------------------------------------------------------------
  if (
    lower.includes('w-4') ||
    lower.includes('i-9') ||
    lower.includes('benefits package') ||
    lower.includes('401(k)') ||
    lower.includes('health insurance')
  ) {
    safeSignals.push('Standard statutory employment onboarding references (W-4 / I-9 / Benefits)');
  }

  if (
    lower.includes('in-person') ||
    lower.includes('physical walk-through') ||
    lower.includes('lease signing at leasing office')
  ) {
    safeSignals.push('Mandatory in-person property walk-through before lease execution');
  }

  if (
    lower.includes('company provided laptop') ||
    lower.includes('it department will ship') ||
    lower.includes('zero expense to you') ||
    lower.includes('shipped by our internal it')
  ) {
    safeSignals.push('Company IT provisions equipment directly at zero employee expense');
  }

  if (
    lower.includes('prior verbal offer') ||
    lower.includes('following our interview') ||
    lower.includes('interviews on')
  ) {
    safeSignals.push('References verified formal interview progression');
  }

  const corporateDomainMatch = combined.match(
    /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.(?:com|org|io|tech|co|net))\b/i
  );
  if (corporateDomainMatch && !freeEmailMatch) {
    safeSignals.push(`Official corporate domain communication: @${corporateDomainMatch[1]}`);
  }

  // -------------------------------------------------------------
  // DYNAMIC SCORE CALCULATION: Purely from the active factors
  // -------------------------------------------------------------
  const rawSum = factors.reduce((sum, f) => sum + f.points, 0);
  const scamThreatIndex = Math.min(100, Math.max(0, rawSum));

  // Determine Risk Tier according to THREAT CATEGORY MAPPING:
  // 0 to 24: Low Risk (Safe)
  // 25 to 49: Moderate Risk (Caution)
  // 50 to 74: High Risk (Likely Phishing)
  // 75 to 100: Critical Risk (Definite Scam)
  let riskLevel: ScamInspectionReport['riskLevel'] = 'Low Risk';
  if (scamThreatIndex >= 75) {
    riskLevel = 'Critical Risk';
  } else if (scamThreatIndex >= 50) {
    riskLevel = 'High Risk';
  } else if (scamThreatIndex >= 25) {
    riskLevel = 'Moderate Risk';
  } else {
    riskLevel = 'Low Risk';
    if (safeSignals.length === 0) {
      safeSignals.push('No advance-fee check overpayment or equipment traps detected.');
      safeSignals.push('No sensitive PII (SSN, Passport) or bank login credential harvesting.');
      safeSignals.push('No off-platform Telegram or WhatsApp communication migration.');
    }
  }

  // Generate dynamic executive summary
  let summary = '';
  if (scamThreatIndex >= 75) {
    summary = `CRITICAL FRAUD THREAT (${scamThreatIndex}% Threat Index): The submitted document exhibits multiple severe fraud indicators totaling ${scamThreatIndex} risk points. Active threats include severe financial traps, credentials or payment redirection, and social engineering hooks. Immediate cessation of contact is advised.`;
  } else if (scamThreatIndex >= 50) {
    summary = `HIGH PHISHING RISK (${scamThreatIndex}% Threat Index): Document contains prominent social engineering hooks or payment redirection totaling ${scamThreatIndex} risk points. Exercise extreme caution and do not disburse funds or share sensitive credentials.`;
  } else if (scamThreatIndex >= 25) {
    summary = `MODERATE CAUTION (${scamThreatIndex}% Threat Index): Irregular signals detected totaling ${scamThreatIndex} risk points. Independent verification of domain records, corporate identity, and direct recruiter channels is strongly advised.`;
  } else {
    summary = `LOW RISK DETECTED (${scamThreatIndex}% Threat Index): The document text displays standard professional patterns with 0 high-risk advance-fee traps, wire transfer coercion, or off-platform recruitment channels detected.`;
  }

  // Generate recommended actions
  const recommendedActions: string[] = [];
  if (scamThreatIndex >= 50) {
    recommendedActions.push(
      'NEVER deposit checks from unknown parties or wire money back to supposed equipment vendors.'
    );
    recommendedActions.push(
      'Do not provide sensitive PII (SSN, Passport copy) or online banking login codes.'
    );
    recommendedActions.push(
      'Cease all communication immediately with the sender and block external chat IDs (Telegram/WhatsApp).'
    );
    recommendedActions.push(
      'Verify authentic corporate openings exclusively via the official company career portal.'
    );
    recommendedActions.push(
      'File an official fraud report with the FTC (ReportFraud.ftc.gov) or IC3 (ic3.gov).'
    );
  } else if (scamThreatIndex >= 25) {
    recommendedActions.push(
      'Confirm the offer letter sender email matches the authentic corporate domain (e.g. @company.com).'
    );
    recommendedActions.push(
      'Submit required legal onboarding documentation (I-9, W-4) only through secure internal HR portals.'
    );
    recommendedActions.push(
      'Ensure in-person property walk-through is executed prior to signing any binding lease agreement.'
    );
  } else {
    recommendedActions.push(
      'Confirm the offer letter sender email matches the authentic corporate domain (e.g. @company.com).'
    );
    recommendedActions.push(
      'Submit required legal onboarding documentation (I-9, W-4) only through secure internal HR portals.'
    );
    recommendedActions.push(
      'Ensure all company hardware is delivered directly from authorized corporate IT logistics.'
    );
  }

  return {
    scamThreatIndex,
    riskLevel,
    summary,
    scoreFactors: factors,
    detectedRedFlags: redFlags,
    safeSignals,
    domainAnalysis: {
      domainName: detectedDomain,
      suspiciousPatterns,
      domainAge: 'Domain age unavailable (Requires live WHOIS lookup)',
      notes:
        detectedDomain !== 'N/A'
          ? `Extracted domain '${detectedDomain}' was evaluated for typosquatting, high-risk TLDs, and protocol security.`
          : 'No external URL or email domain submitted.',
    },
    recommendedActions,
  };
}

function extractSnippet(fullText: string, matchedWord: string): string {
  const index = fullText.toLowerCase().indexOf(matchedWord.toLowerCase());
  if (index === -1) return matchedWord;
  const start = Math.max(0, index - 30);
  const end = Math.min(fullText.length, index + matchedWord.length + 40);
  let snippet = fullText.slice(start, end).trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < fullText.length) snippet = snippet + '...';
  return snippet;
}
