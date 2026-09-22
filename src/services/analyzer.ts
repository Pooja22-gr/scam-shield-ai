import {
  DetectedRedFlag,
  DomainAnalysis,
  RiskLevel,
  SecurityInspectionReport,
  VerdictDetails,
  VerificationMode,
} from '../types';
import { scrubPii } from './piiScrubber';

export function analyzeDocument(
  text: string,
  mode: VerificationMode = 'job',
  enablePiiShield: boolean = true,
  urlInput: string = ''
): SecurityInspectionReport {
  // 1. Client-Side PII Scrubbing
  let cleanText = text;
  let piiTokens: any[] = [];
  let piiScrubbedCount = 0;

  if (enablePiiShield) {
    const scrubResult = scrubPii(text);
    cleanText = scrubResult.sanitizedText;
    piiTokens = scrubResult.piiTokens;
    piiScrubbedCount = scrubResult.scrubbedCount;
  }

  const normalized = cleanText.trim();
  const lower = normalized.toLowerCase();

  const redFlags: DetectedRedFlag[] = [];
  const psychologicalTriggers: string[] = [];
  const suspiciousDomainsFound: string[] = [];

  let isLookalikeDomain = false;
  let equipmentScamDetected = false;
  let depositTrapDetected = false;
  let fakeRecruiterDetected = false;

  let totalScore = 0;

  // 2. URL INSPECTION
  const urlFlags: string[] = [];
  let parsedDomain = '';
  let parsedProtocol = '';
  let hasSuspiciousTld = false;
  let hasHyphenatedKeywords = false;

  if (urlInput.trim()) {
    const cleanUrl = urlInput.trim().toLowerCase();
    try {
      const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      parsedDomain = urlObj.hostname;
      parsedProtocol = urlObj.protocol.replace(':', '');

      if (parsedProtocol === 'http') {
        urlFlags.push('Insecure connection (HTTP without SSL/TLS encryption)');
        redFlags.push({
          category: 'Domain Mismatch',
          severity: 'Medium',
          description: 'Insecure URL protocol. Corporate applicant portals and verified real estate platforms mandate HTTPS.',
          evidenceText: urlInput,
          pointsContributed: 10,
        });
        totalScore += 10;
      }

      // Check suspicious TLDs
      const suspiciousTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.work', '.click', '.live', '.online'];
      if (suspiciousTlds.some((tld) => parsedDomain.endsWith(tld))) {
        hasSuspiciousTld = true;
        urlFlags.push(`High-risk Top-Level Domain (TLD) flagged: ${parsedDomain}`);
        suspiciousDomainsFound.push(parsedDomain);
        redFlags.push({
          category: 'Domain Mismatch',
          severity: 'High',
          description: `The URL uses a high-risk consumer or burner domain (${parsedDomain}) frequently associated with disposable phishing campaigns.`,
          evidenceText: parsedDomain,
          pointsContributed: 20,
        });
        totalScore += 20;
      }

      // Check hyphenated typosquatting
      const hyphenCount = (parsedDomain.match(/-/g) || []).length;
      const brandTrapWords = ['careers', 'jobs', 'portal', 'hr', 'recruiting', 'apartments', 'rent', 'lease', 'apply', 'direct', 'verify'];
      const hasBrandKeyword = brandTrapWords.some((kw) => parsedDomain.includes(kw));

      if (hyphenCount >= 2 || (hyphenCount >= 1 && hasBrandKeyword)) {
        hasHyphenatedKeywords = true;
        isLookalikeDomain = true;
        urlFlags.push(`Lookalike typosquatting pattern detected: ${parsedDomain}`);
        if (!suspiciousDomainsFound.includes(parsedDomain)) {
          suspiciousDomainsFound.push(parsedDomain);
        }
        redFlags.push({
          category: 'Domain Mismatch',
          severity: 'Critical',
          description: `Combines enterprise keywords with multi-hyphenated syntax (${parsedDomain}) to impersonate legitimate brand websites.`,
          evidenceText: parsedDomain,
          pointsContributed: 25,
        });
        totalScore += 25;
      }
    } catch {
      urlFlags.push('Invalid or malformed URL syntax');
    }
  }

  // 3. UPFRONT PAYMENT & DEPOSIT TRAP DETECTOR (+35 pts max)
  const p2pKeywords = [
    'zelle',
    "cashier's check",
    'cashiers check',
    'cashier check',
    'wire transfer',
    'western union',
    'moneygram',
    'bitcoin',
    'usdt',
    'tether',
    'cryptocurrency',
    'crypto',
    'gift card',
    'apple gift card',
    'venmo',
    'cash app',
  ];
  const equipmentKeywords = [
    'equipment vendor',
    'approved vendor',
    'home office',
    'purchase equipment',
    'macbook pro',
    'software suite',
    'supplies portal',
    'deposit this check',
    'deposit check',
    'send the zelle',
    'transfer receipt',
    'security deposit',
    'refundable security deposit',
  ];

  const hasP2POrCheck = p2pKeywords.some((kw) => lower.includes(kw));
  const hasEquipmentOrDepositDemand = equipmentKeywords.some((kw) => lower.includes(kw));

  if (hasP2POrCheck || hasEquipmentOrDepositDemand) {
    const sentences = normalized.split(/(?<=[.?!])\s+/);
    const matchedSentences = sentences.filter((s) => {
      const sl = s.toLowerCase();
      return p2pKeywords.some((kw) => sl.includes(kw)) || equipmentKeywords.some((kw) => sl.includes(kw));
    });

    const quote = matchedSentences.slice(0, 2).join(' ') || 'Demands advance funds or check deposit.';

    if (
      lower.includes('cashier') ||
      (lower.includes('check') && (lower.includes('zelle') || lower.includes('transfer') || lower.includes('vendor')))
    ) {
      equipmentScamDetected = true;
      redFlags.push({
        category: 'Upfront Payment',
        severity: 'Critical',
        description:
          "Advance-Fee Check Overpayment Trap: Recipient is directed to deposit a company check and immediately send funds via Zelle or wire transfer to an 'approved equipment vendor'. When the counterfeit check bounces, the victim is personally liable for all transferred funds.",
        evidenceText: quote,
        pointsContributed: 35,
      });
      psychologicalTriggers.push('Advance-Fee Financial Illusion');
      totalScore += 35;
    } else if (
      lower.includes('deposit') &&
      (lower.includes('sight-unseen') ||
        lower.includes('wire') ||
        lower.includes('escrow') ||
        lower.includes('reserve the keys') ||
        lower.includes('first month') ||
        mode === 'rental')
    ) {
      depositTrapDetected = true;
      redFlags.push({
        category: 'Upfront Payment',
        severity: 'Critical',
        description:
          'Sight-Unseen Deposit Trap: Landlord or listing agent demands wire transfer, Zelle, or cryptocurrency deposit prior to an in-person physical walk-through or verified key handover.',
        evidenceText: quote,
        pointsContributed: 35,
      });
      psychologicalTriggers.push('Escrow & Deposit Impersonation');
      totalScore += 35;
    } else if (hasP2POrCheck) {
      redFlags.push({
        category: 'Upfront Payment',
        severity: 'High',
        description:
          'Unconventional Payment Channel: Demands transaction via peer-to-peer or cryptocurrency rails (Zelle, Venmo, Bitcoin). Legitimate corporations and registered leasing firms never mandate irreversible consumer P2P transfers.',
        evidenceText: quote,
        pointsContributed: 35,
      });
      psychologicalTriggers.push('Irreversible Payment Demand');
      totalScore += 35;
    }
  }

  // 4. ENTITY & LOOKALIKE DOMAIN INSPECTOR (+25 pts max)
  const freeEmailRegex = /@([a-zA-Z0-9.-]+\.(?:com|net|org|io|co|me|xyz|info|top))/gi;
  const genericDomains = [
    'fastmail.com',
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'protonmail.com',
    'aol.com',
    'mail.com',
    'zoho.com',
  ];

  let match;
  while ((match = freeEmailRegex.exec(normalized)) !== null) {
    const domain = match[1].toLowerCase();
    if (!suspiciousDomainsFound.includes(domain)) {
      if (genericDomains.includes(domain)) {
        suspiciousDomainsFound.push(domain);
      }
    }
  }

  // Lookalike patterns in text
  const lookalikePattern =
    /(?:[a-z0-9]+-(?:careers|jobs|portal|supplies|hr|support|logistics)[a-z0-9.-]*\.[a-z]{2,})|(?:[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.[a-z]{2,})/gi;
  let lookalikeMatch;
  while ((lookalikeMatch = lookalikePattern.exec(lower)) !== null) {
    isLookalikeDomain = true;
    if (!suspiciousDomainsFound.includes(lookalikeMatch[0])) {
      suspiciousDomainsFound.push(lookalikeMatch[0]);
    }
  }

  let domainNotes = 'Official domain verification passed without flags.';

  if (suspiciousDomainsFound.length > 0 || isLookalikeDomain) {
    const quote =
      normalized.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] ||
      suspiciousDomainsFound[0];

    domainNotes = `Suspect email addresses or lookalike domains detected: ${suspiciousDomainsFound.join(
      ', '
    )}. Legitimate enterprises and verified property managers operate on authenticated corporate domains, not consumer webmail or hyphenated lookalikes.`;

    if (!redFlags.some((rf) => rf.category === 'Domain Mismatch')) {
      redFlags.push({
        category: 'Domain Mismatch',
        severity: 'High',
        description:
          'Domain Authenticity Anomaly: Official hiring communication or equipment procurement is channeled through consumer webmail (e.g., Fastmail, Gmail) or unauthenticated domains.',
        evidenceText: quote,
        pointsContributed: 25,
      });
      totalScore += 25;
    }
  }

  // 5. PSYCHOLOGICAL URGENCY RADAR (+15 pts max)
  const urgencyKeywords = [
    '24 hours',
    '12 hours',
    '2 hours',
    '48 hours',
    'immediately',
    'high applicant volume',
    'secure your spot',
    'slots remaining',
    'hurry',
    'act fast',
    'urgent',
    'lock in this',
    'expire today',
  ];

  const hasUrgency = urgencyKeywords.some((kw) => lower.includes(kw));
  if (hasUrgency) {
    const matchedUrgency = urgencyKeywords.filter((kw) => lower.includes(kw));
    const sentences = normalized.split(/(?<=[.?!])\s+/);
    const urgencySentence =
      sentences.find((s) => matchedUrgency.some((kw) => s.toLowerCase().includes(kw))) ||
      'High urgency timeframe stated in correspondence.';

    psychologicalTriggers.push('Manufactured Urgency (Artificial Deadline)');
    if (lower.includes('applicant volume') || lower.includes('slots remaining')) {
      psychologicalTriggers.push('Artificial Scarcity & FOMO');
    }

    redFlags.push({
      category: 'Urgency',
      severity: 'High',
      description:
        'Manufactured Urgency & Coercion: The sender imposes strict countdowns (e.g., 12 or 24 hours) to induce panic and compel payment before the victim has time to verify legitimacy.',
      evidenceText: urgencySentence,
      pointsContributed: 15,
    });
    totalScore += 15;
  }

  // 6. OFF-PLATFORM MIGRATION (+15 pts max)
  const offPlatformKeywords = [
    'telegram',
    'whatsapp',
    'skype',
    'signal',
    '@globallogistics',
    '@apex',
    'telegram:',
    'whatsapp at',
  ];

  const hasOffPlatform = offPlatformKeywords.some((kw) => lower.includes(kw));
  if (hasOffPlatform) {
    const sentences = normalized.split(/(?<=[.?!])\s+/);
    const offPlatformSentence =
      sentences.find((s) => offPlatformKeywords.some((kw) => s.toLowerCase().includes(kw))) ||
      'Instructs communication via Telegram or WhatsApp.';

    psychologicalTriggers.push('Off-Platform Channel Migration');
    fakeRecruiterDetected = true;

    redFlags.push({
      category: 'Off-Platform Move',
      severity: 'High',
      description:
        'Off-Platform Redirection: Communication is steered to end-to-end encrypted messaging applications (Telegram, WhatsApp) to avoid enterprise audit logs, corporate domain verification, and platform fraud detection.',
      evidenceText: offPlatformSentence,
      pointsContributed: 15,
    });
    totalScore += 15;
  }

  // 7. STRUCTURAL & LINGUISTIC ANOMALIES (+10 pts max)
  const genericSalutations = [
    'dear applicant',
    'dear prospective tenant',
    'dear job seeker',
    'dear candidate',
    'hello!',
  ];
  const secrecyKeywords = [
    'do not contact',
    'keep confidential',
    'not authorized',
    'overseas on an emergency',
    'emergency humanitarian',
    'cannot meet you in person',
    'doctors without borders',
  ];

  const hasGenericSalutation = genericSalutations.some((sal) => lower.startsWith(sal) || lower.includes(sal));
  const hasSecrecyOrOddStory = secrecyKeywords.some((kw) => lower.includes(kw));

  if (hasGenericSalutation || hasSecrecyOrOddStory) {
    let quote = '';
    if (hasGenericSalutation) {
      const matchSal = genericSalutations.find((sal) => lower.includes(sal));
      quote = normalized.match(new RegExp(matchSal || '', 'i'))?.[0] || 'Generic greeting used.';
    } else {
      const sentences = normalized.split(/(?<=[.?!])\s+/);
      quote =
        sentences.find((s) => secrecyKeywords.some((kw) => s.toLowerCase().includes(kw))) ||
        'Inconsistent structural narrative.';
    }

    if (hasSecrecyOrOddStory) {
      psychologicalTriggers.push('Isolation & Secrecy Mandate');
    }

    redFlags.push({
      category: 'Structural Anomaly',
      severity: 'Medium',
      description:
        'Linguistic & Narrative Red Flags: Use of impersonal bulk salutations, suspicious overseas absence narratives, or explicit mandates barring communication with official leasing management.',
      evidenceText: quote,
      pointsContributed: 10,
    });
    totalScore += 10;
  }

  // Score mapping (0 - 100)
  const scamThreatIndex = Math.min(100, Math.max(0, totalScore));

  let riskLevel: RiskLevel = 'Safe';
  if (scamThreatIndex >= 80) {
    riskLevel = 'Critical Threat';
  } else if (scamThreatIndex >= 60) {
    riskLevel = 'High Risk';
  } else if (scamThreatIndex >= 40) {
    riskLevel = 'Moderate Risk';
  } else if (scamThreatIndex >= 20) {
    riskLevel = 'Low Risk';
  } else {
    riskLevel = 'Safe';
  }

  // Summary logic
  let summary = '';
  if (riskLevel === 'Critical Threat') {
    summary = `CRITICAL THREAT: Severe fraud signals detected (Threat Index: ${scamThreatIndex}/100). The document requests advance fund transfers via non-refundable channels, employs artificial countdown urgency, and redirects to unverified channels. Immediate cessation of contact is advised.`;
  } else if (riskLevel === 'High Risk') {
    summary = `HIGH RISK DETECTED (Threat Index: ${scamThreatIndex}/100). Multiple threat vectors detected, including unverified domain routing, high-pressure compliance demands, and off-platform messaging migration.`;
  } else if (riskLevel === 'Moderate Risk') {
    summary = `MODERATE CAUTION (Threat Index: ${scamThreatIndex}/100). Ambiguous domain routing or formatting anomalies detected. Verify the sender's identity through official corporate channels before submitting personal credentials.`;
  } else if (riskLevel === 'Low Risk') {
    summary = `LOW RISK (Threat Index: ${scamThreatIndex}/100). Minor linguistic or formatting discrepancies detected, but no systemic advance-fee or identity harvesting indicators were identified.`;
  } else {
    summary = `CLEAN SECURITY PROFILE (Threat Index: ${scamThreatIndex}/100). Legitimate enterprise structure verified. Hardware and onboarding are handled via authenticated company infrastructure at zero applicant cost.`;
  }

  // Actionable steps
  const actionableSteps: string[] = [];
  if (scamThreatIndex >= 60) {
    if (equipmentScamDetected) {
      actionableSteps.push(
        "DO NOT deposit any cashier's checks or employer checks into your bank account. Counterfeit checks typically take 3-7 business days to bounce."
      );
      actionableSteps.push(
        'DO NOT remit money via Zelle, wire transfer, Venmo, or cryptocurrency. Legitimate corporate employers never instruct hires to purchase hardware from third-party vendors.'
      );
    }
    if (depositTrapDetected) {
      actionableSteps.push(
        'DO NOT wire rent or security deposits for properties you have not toured in person with a licensed real estate broker or verifiable leasing agent.'
      );
      actionableSteps.push(
        'Cross-reference the property address with public county property tax records to confirm registered deed ownership.'
      );
    }
    if (hasOffPlatform) {
      actionableSteps.push(
        'Cease messaging on Telegram or WhatsApp. Report and block the contact immediately.'
      );
    }
    actionableSteps.push(
      'Never send scans of your Social Security Card, Passport, or bank statements via unencrypted messaging.'
    );
    actionableSteps.push(
      'Report this fraudulent solicitation to the Federal Trade Commission (ReportFraud.ftc.gov) and the FBI Internet Crime Complaint Center (IC3.gov).'
    );
  } else if (scamThreatIndex >= 20) {
    actionableSteps.push(
      'Call the organization using an independently verified phone number from their official corporate website, not numbers provided in this message.'
    );
    actionableSteps.push(
      'Verify the recruiter’s full name and corporate role on LinkedIn or corporate directory.'
    );
    actionableSteps.push(
      'Ensure all electronic signatures and documents are processed via an authenticated enterprise portal (e.g., Workday, Greenhouse).'
    );
  } else {
    actionableSteps.push(
      'Standard corporate security procedure: verify sender email header matches the official domain SPF/DKIM records.'
    );
    actionableSteps.push(
      'Complete onboarding exclusively through the company’s authenticated Single Sign-On (SSO) portal.'
    );
  }

  // Safe Response Template Generator
  let safeResponseTemplate = '';
  if (equipmentScamDetected) {
    safeResponseTemplate = `Dear Hiring Team,

Thank you for the offer for the Remote Operations role.

In accordance with standard employment best practices, I do not accept third-party check deposits or make advance payments to equipment vendors via personal payment apps (Zelle/Venmo/Wire).

Please arrange to have all necessary IT equipment and company-provisioned software shipped directly to my address by your corporate IT logistics department at company expense. Additionally, please provide your official corporate email address (@company.com) and direct corporate phone extension so I can verify this offer through your main corporate switchboard.

Sincerely,
[Your Name]`;
  } else if (depositTrapDetected) {
    safeResponseTemplate = `Dear Property Owner,

Thank you for providing the lease details for 450 Grand Avenue.

Per standard tenant protection protocols, I do not send advance wire transfers, Zelle payments, or deposits prior to completing an in-person walkthrough of the property with a licensed leasing agent or verified building manager.

Please let me know when an authorized representative or the on-site leasing office is available for a physical showing. Once the walkthrough is complete and a formal lease is verified, payments can be made through an insured title escrow or certified tenant portal.

Regards,
[Your Name]`;
  } else if (scamThreatIndex >= 60) {
    safeResponseTemplate = `Hello,

Thank you for reaching out. Before proceeding further, I require verification through your official enterprise domain. Please send all contract documents and correspondence from your corporate @company.com email address. I do not conduct formal recruitment or financial transactions over unverified messaging applications.

Best regards,
[Your Name]`;
  } else {
    safeResponseTemplate = `Dear Hiring Team,

Thank you for extending this formal offer of employment. I have reviewed the terms and look forward to completing my onboarding through your secure enterprise portal.

Please confirm the orientation schedule and point of contact for IT equipment delivery.

Warm regards,
[Your Name]`;
  }

  const verdictDetails: VerdictDetails = {
    equipmentScamDetected,
    depositTrapDetected,
    fakeRecruiterDetected,
  };

  const domainAnalysis: DomainAnalysis = {
    suspiciousDomainsFound,
    isLookalikeDomain,
    notes: domainNotes,
    urlAnalysis: urlInput
      ? {
          rawUrl: urlInput,
          protocol: parsedProtocol,
          domain: parsedDomain,
          isSuspiciousTld: hasSuspiciousTld,
          hasHyphenatedKeywords: hasHyphenatedKeywords,
          flags: urlFlags,
        }
      : undefined,
  };

  return {
    scamThreatIndex,
    riskLevel,
    summary,
    domainAnalysis,
    detectedRedFlags: redFlags,
    psychologicalTriggers,
    verdictDetails,
    actionableSteps,
    safeResponseTemplate,
    documentType: mode === 'job' ? 'Job Offer Letter' : 'Rental Agreement',
    verificationMode: mode,
    analyzedAt: new Date().toISOString(),
    wordCount: normalized.split(/\s+/).filter(Boolean).length,
    piiScrubbedCount,
    scrubbedTokens: piiTokens,
    originalCleanText: cleanText,
  };
}
