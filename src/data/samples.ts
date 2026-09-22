import { TestSample } from '../types';

export const SAMPLE_DOCUMENTS: TestSample[] = [
  {
    id: 'fake-job-offer',
    title: 'Fake Job Offer: Check Overpayment & Zelle Trap',
    mode: 'job',
    category: 'Job Offer Letter',
    description: 'Counterfeit $3,200 check + urgency mandate to Zelle $2,800 to an equipment vendor.',
    expectedThreat: 'Critical Threat',
    urlPlaceholder: 'https://careers-google-logistics-portal.top/apply',
    content: `Dear Applicant,

Congratulations! We are pleased to offer you the position of Remote Operations Associate at Global Logistics Corp. Your starting rate is $42.00 per hour.

Applicant SSN on record: 452-88-9123. Contact Phone: (555) 234-5678.

To set up your home office, you will receive a cashier's check of $3,200 from our finance department. You are required to deposit this check into your bank account immediately and transfer $2,800 via Zelle to our verified equipment vendor (vendor-supplies-portal@fastmail.com) to receive your Apple MacBook Pro and software suite.

Due to high applicant volume, you must accept this offer and send the Zelle transfer receipt within 24 hours to secure your spot.

Please reach out directly to our HR Manager on Telegram: @GlobalLogistics_HR_Admin to finalize your onboarding.

Best regards,
Hiring Team
Global Logistics Corp`
  },
  {
    id: 'fake-rental-scam',
    title: 'Fake Rental Scam: Sight-Unseen Wire Deposit Trap',
    mode: 'rental',
    category: 'Rental Agreement',
    description: 'Improbable overseas owner, demanding wire transfer to reserve keys without physical viewing.',
    expectedThreat: 'Critical Threat',
    urlPlaceholder: 'https://craigslist-luxury-apartments-direct.xyz/post/450grand',
    content: `Dear Prospective Tenant,

Thank you for your inquiry on the luxury 2-bedroom unit at 450 Grand Avenue. Rent is reduced to $1,250/month with all utilities included.

Tenant Phone: (555) 019-4821. Pre-qualification SSN: 382-41-9982.

I am currently overseas on a missionary medical mission with Doctors Without Borders, so I am unavailable for an in-person physical walk-through. However, the keys and original lease are sealed with FedEx ready for immediate dispatch.

To secure this unit and lock in the discounted rent, you must wire the first month's rent plus a refundable security deposit ($2,500 total) via Western Union or Bitcoin to my escrow officer within 12 hours.

Do not contact the on-site leasing office or building superintendent, as they are not authorized to handle my private family unit.

Send wire receipt directly to my WhatsApp: +1 (555) 019-4821.

Sincerely,
Dr. Harold Vance
Independent Property Owner`
  },
  {
    id: 'safe-contract-sample',
    title: 'Safe Contract: Verified Enterprise Offer & IT Provisioning',
    mode: 'job',
    category: 'Job Offer Letter',
    description: 'Authentic employment offer with formal enterprise email, zero upfront fees, and standard equipment provisioning.',
    expectedThreat: 'Safe',
    urlPlaceholder: 'https://careers.cloudscaletech.com/jobs/senior-frontend-eng',
    content: `Dear Candidate,

We are delighted to formally extend an offer of employment for the position of Senior Frontend Engineer at CloudScale Technologies Inc.

Employee Phone: (415) 555-0199. Candidate Tax ID: 123-45-6789.

Your starting base salary will be $145,000 per annum, paid semi-monthly in accordance with our standard payroll cycle. Your start date will be November 2, 2026.

As an employee of CloudScale Technologies, all necessary computer equipment (MacBook Pro M3, external display, and security YubiKey) will be provisioned directly by our internal IT department and shipped to your residence at no cost to you. You will never be asked to purchase supplies or transfer funds to any third-party vendor.

Please review this formal agreement and submit your digital signature through our secure enterprise HR portal at https://careers.cloudscaletech.com/onboard. For questions, contact your dedicated HR business partner at hr@cloudscaletech.com.

Sincerely,
Elena Rostova
Head of People Operations
CloudScale Technologies Inc.`
  }
];
