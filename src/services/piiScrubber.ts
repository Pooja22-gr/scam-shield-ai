import { PiiToken } from '../types';

export interface PiiScrubResult {
  sanitizedText: string;
  piiTokens: PiiToken[];
  scrubbedCount: number;
}

/**
 * Client-side PII Regex Sanitizer
 * Redacts SSNs, phone numbers, and bank/card numbers before document parsing.
 */
export function scrubPii(text: string): PiiScrubResult {
  if (!text) {
    return { sanitizedText: '', piiTokens: [], scrubbedCount: 0 };
  }

  const piiTokens: PiiToken[] = [];
  let sanitized = text;

  // 1. Social Security Number (SSN) Regex
  // Matches 123-45-6789 or 123 45 6789
  const ssnRegex = /\b(?!000|666|9\d{2})\d{3}[-.\s]?(?!00)\d{2}[-.\s]?(?!0000)\d{4}\b/g;
  sanitized = sanitized.replace(ssnRegex, (match) => {
    piiTokens.push({
      type: 'SSN',
      original: match,
      redacted: '[REDACTED-SSN-***]',
    });
    return '[REDACTED-SSN-***]';
  });

  // 2. Credit Card / Bank Account Regex
  // Matches 13 to 19 digit card/account patterns with optional hyphens or spaces
  const bankCardRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{10,18}\b/g;
  sanitized = sanitized.replace(bankCardRegex, (match) => {
    // Only mask if not a simple year (e.g., 2024) or standard short number
    if (match.length >= 10 && !match.startsWith('19') && !match.startsWith('20')) {
      piiTokens.push({
        type: 'Bank/Card',
        original: match,
        redacted: '[REDACTED-ACCOUNT-***]',
      });
      return '[REDACTED-ACCOUNT-***]';
    }
    return match;
  });

  // 3. US/Intl Phone Number Regex
  // Matches (555) 019-4821, +1 555-019-4821, 555-019-4821, etc.
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  sanitized = sanitized.replace(phoneRegex, (match) => {
    piiTokens.push({
      type: 'Phone',
      original: match,
      redacted: '[REDACTED-PHONE-***]',
    });
    return '[REDACTED-PHONE-***]';
  });

  return {
    sanitizedText: sanitized,
    piiTokens,
    scrubbedCount: piiTokens.length,
  };
}
