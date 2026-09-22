export type RiskLevel =
  | 'Safe'
  | 'Low Risk'
  | 'Moderate Risk'
  | 'High Risk'
  | 'Critical Threat';

export type RedFlagCategory =
  | 'Upfront Payment'
  | 'Domain Mismatch'
  | 'Urgency'
  | 'Off-Platform Move'
  | 'Structural Anomaly';

export type RedFlagSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type VerificationMode = 'job' | 'rental';

export interface DetectedRedFlag {
  category: RedFlagCategory;
  severity: RedFlagSeverity;
  description: string;
  evidenceText: string;
  pointsContributed?: number;
}

export interface DomainAnalysis {
  suspiciousDomainsFound: string[];
  isLookalikeDomain: boolean;
  notes: string;
  urlAnalysis?: {
    rawUrl?: string;
    protocol?: string;
    domain?: string;
    isSuspiciousTld?: boolean;
    hasHyphenatedKeywords?: boolean;
    flags: string[];
  };
}

export interface VerdictDetails {
  equipmentScamDetected: boolean;
  depositTrapDetected: boolean;
  fakeRecruiterDetected: boolean;
}

export interface PiiToken {
  type: 'SSN' | 'Phone' | 'Bank/Card';
  original: string;
  redacted: string;
}

export interface SecurityInspectionReport {
  scamThreatIndex: number;
  riskLevel: RiskLevel;
  summary: string;
  domainAnalysis: DomainAnalysis;
  detectedRedFlags: DetectedRedFlag[];
  psychologicalTriggers: string[];
  verdictDetails: VerdictDetails;
  actionableSteps: string[];
  safeResponseTemplate: string;
  documentType?: string;
  verificationMode: VerificationMode;
  analyzedAt?: string;
  wordCount?: number;
  piiScrubbedCount: number;
  scrubbedTokens: PiiToken[];
  originalCleanText: string;
}

export interface TestSample {
  id: string;
  title: string;
  mode: VerificationMode;
  category: string;
  description: string;
  expectedThreat: RiskLevel;
  content: string;
  urlPlaceholder?: string;
}

export interface TestAssertion {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export interface TestSuiteResult {
  id: string;
  title: string;
  category: string;
  durationMs: number;
  assertions: TestAssertion[];
  allPassed: boolean;
}
