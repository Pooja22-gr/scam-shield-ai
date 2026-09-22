import { scrubPii } from './piiScrubber';
import { analyzeDocument } from './analyzer';
import { TestSuiteResult } from '../types';

export function runAllUnitTests(): TestSuiteResult[] {
  const suites: TestSuiteResult[] = [];

  // SUITE 1: Client-Side PII Regex Sanitizer
  {
    const start = performance.now();
    const assertions = [];

    // Test 1.1: SSN Masking
    const ssnInput = 'Applicant Social Security: 452-88-9123 on file.';
    const ssnResult = scrubPii(ssnInput);
    const ssnPassed =
      !ssnResult.sanitizedText.includes('452-88-9123') &&
      ssnResult.sanitizedText.includes('[REDACTED-SSN-***]');
    assertions.push({
      name: 'SSN Masking Regex Assertion',
      passed: ssnPassed,
      expected: 'Replaces SSN with [REDACTED-SSN-***]',
      actual: ssnResult.sanitizedText,
      details: `Detected and redacted ${ssnResult.scrubbedCount} PII token.`,
    });

    // Test 1.2: Phone Number Masking
    const phoneInput = 'Call direct at (555) 234-5678 or +1-555-987-6543 immediately.';
    const phoneResult = scrubPii(phoneInput);
    const phonePassed =
      !phoneResult.sanitizedText.includes('555') &&
      phoneResult.sanitizedText.includes('[REDACTED-PHONE-***]');
    assertions.push({
      name: 'Phone Number Masking Assertion',
      passed: phonePassed,
      expected: 'Replaces phone patterns with [REDACTED-PHONE-***]',
      actual: phoneResult.sanitizedText,
      details: `Redacted ${phoneResult.scrubbedCount} phone instances.`,
    });

    // Test 1.3: Bank / Card Number Masking
    const bankInput = 'Direct deposit account number: 4532189012345678 verified.';
    const bankResult = scrubPii(bankInput);
    const bankPassed =
      !bankResult.sanitizedText.includes('4532189012345678') &&
      bankResult.sanitizedText.includes('[REDACTED-ACCOUNT-***]');
    assertions.push({
      name: 'Credit Card / Account Number Masking Assertion',
      passed: bankPassed,
      expected: 'Masks sequences of 12-19 digits',
      actual: bankResult.sanitizedText,
      details: `Detected account number and neutralized leak vector.`,
    });

    suites.push({
      id: 'suite-pii-sanitizer',
      title: 'Client-Side PII Regex Sanitizer',
      category: 'Data Privacy & Redaction',
      durationMs: Math.round(performance.now() - start),
      assertions,
      allPassed: assertions.every((a) => a.passed),
    });
  }

  // SUITE 2: Threat Score Calculation Logic
  {
    const start = performance.now();
    const assertions = [];

    // Test 2.1: Payment Demands (+35 pts)
    const paymentText = "Deposit this cashier's check of $3,200 and transfer via Zelle to equipment vendor.";
    const paymentReport = analyzeDocument(paymentText, 'job', false);
    const hasPaymentFlag = paymentReport.detectedRedFlags.some(
      (rf) => rf.category === 'Upfront Payment' && rf.pointsContributed === 35
    );
    assertions.push({
      name: 'Upfront Payment Weighted Attribution (+35 pts)',
      passed: hasPaymentFlag && paymentReport.verdictDetails.equipmentScamDetected,
      expected: '+35 pts for cashier check / Zelle vendor demand',
      actual: `Contributed: ${
        paymentReport.detectedRedFlags.find((r) => r.category === 'Upfront Payment')?.pointsContributed
      } pts, Equipment Trap: ${paymentReport.verdictDetails.equipmentScamDetected}`,
    });

    // Test 2.2: Urgency Tactics (+15 pts)
    const urgencyText = 'You must accept this offer within 24 hours to secure your spot due to high applicant volume.';
    const urgencyReport = analyzeDocument(urgencyText, 'job', false);
    const hasUrgencyFlag = urgencyReport.detectedRedFlags.some(
      (rf) => rf.category === 'Urgency' && rf.pointsContributed === 15
    );
    assertions.push({
      name: 'Urgency & Pressure Attribution (+15 pts)',
      passed: hasUrgencyFlag,
      expected: '+15 pts for 24-hour deadline requirement',
      actual: `Contributed: ${
        urgencyReport.detectedRedFlags.find((r) => r.category === 'Urgency')?.pointsContributed
      } pts`,
    });

    // Test 2.3: Off-Platform Move (+15 pts)
    const offPlatformText = 'Reach out directly to our HR Manager on Telegram: @Corporate_HR_Lead.';
    const offPlatformReport = analyzeDocument(offPlatformText, 'job', false);
    const hasOffPlatformFlag = offPlatformReport.detectedRedFlags.some(
      (rf) => rf.category === 'Off-Platform Move' && rf.pointsContributed === 15
    );
    assertions.push({
      name: 'Off-Platform Redirection Attribution (+15 pts)',
      passed: hasOffPlatformFlag && offPlatformReport.verdictDetails.fakeRecruiterDetected,
      expected: '+15 pts for Telegram / WhatsApp redirect',
      actual: `Contributed: ${
        offPlatformReport.detectedRedFlags.find((r) => r.category === 'Off-Platform Move')?.pointsContributed
      } pts`,
    });

    // Test 2.4: Composite Scam Score Tier (80-100 = Critical Threat)
    const fullScamText = `Dear Applicant,
Congratulations! Remote Associate at $42/hr.
Deposit $3,200 cashier's check and Zelle $2,800 to vendor-supplies@fastmail.com within 24 hours.
Message HR on Telegram: @Global_HR.`;
    const compositeReport = analyzeDocument(fullScamText, 'job', false);
    const scorePassed = compositeReport.scamThreatIndex >= 80 && compositeReport.riskLevel === 'Critical Threat';
    assertions.push({
      name: 'Composite Scam Threat Index & Critical Threat Tier',
      passed: scorePassed,
      expected: 'Threat Index >= 80, Tier: Critical Threat',
      actual: `Threat Index: ${compositeReport.scamThreatIndex}/100, Tier: ${compositeReport.riskLevel}`,
    });

    suites.push({
      id: 'suite-threat-scoring',
      title: 'Scam Threat Index Scoring Matrix',
      category: 'Mathematical Threat Weighting',
      durationMs: Math.round(performance.now() - start),
      assertions,
      allPassed: assertions.every((a) => a.passed),
    });
  }

  // SUITE 3: Domain Anomaly & Typosquatting Detection
  {
    const start = performance.now();
    const assertions = [];

    // Test 3.1: Free Webmail for Enterprise Hiring
    const freeEmailText = 'Send your resume and signed offer to hr-department@fastmail.com or hiring@gmail.com.';
    const freeEmailReport = analyzeDocument(freeEmailText, 'job', false);
    const freeEmailPassed =
      freeEmailReport.domainAnalysis.suspiciousDomainsFound.includes('fastmail.com') ||
      freeEmailReport.domainAnalysis.suspiciousDomainsFound.includes('gmail.com');
    assertions.push({
      name: 'Consumer Webmail Domain Flagging',
      passed: freeEmailPassed,
      expected: 'Flags @fastmail.com or @gmail.com for enterprise hiring',
      actual: `Found: ${freeEmailReport.domainAnalysis.suspiciousDomainsFound.join(', ')}`,
    });

    // Test 3.2: Lookalike Typosquatting URL Detection
    const typosquatUrl = 'https://google-recruiting-portal.com/apply';
    const urlReport = analyzeDocument('Job posting description', 'job', false, typosquatUrl);
    const lookalikePassed =
      urlReport.domainAnalysis.isLookalikeDomain &&
      urlReport.domainAnalysis.urlAnalysis?.hasHyphenatedKeywords;
    assertions.push({
      name: 'Typosquatted Brand Hyphenation Detection',
      passed: Boolean(lookalikePassed),
      expected: 'Flags lookalike domain combining brand and portal/recruiting keywords',
      actual: `isLookalikeDomain: ${urlReport.domainAnalysis.isLookalikeDomain}, Flags: ${urlReport.domainAnalysis.urlAnalysis?.flags.join('; ')}`,
    });

    // Test 3.3: High-Risk TLD Detection
    const highRiskTldUrl = 'https://luxury-condo-sublease.xyz';
    const tldReport = analyzeDocument('Rental lease', 'rental', false, highRiskTldUrl);
    const tldPassed = Boolean(tldReport.domainAnalysis.urlAnalysis?.isSuspiciousTld);
    assertions.push({
      name: 'High-Risk Phishing TLD (.xyz/.top) Detection',
      passed: tldPassed,
      expected: 'Identifies disposable .xyz TLD as high-risk',
      actual: `isSuspiciousTld: ${tldReport.domainAnalysis.urlAnalysis?.isSuspiciousTld}`,
    });

    suites.push({
      id: 'suite-domain-anomaly',
      title: 'Domain Anomaly & URL Typosquatting Engine',
      category: 'DNS & Identity Verification',
      durationMs: Math.round(performance.now() - start),
      assertions,
      allPassed: assertions.every((a) => a.passed),
    });
  }

  return suites;
}
