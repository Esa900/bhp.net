export type DocumentType =
  | 'application-form'
  | 'job-acceptance'
  | 'employment-offer'
  | 'job-confirmation'
  | 'insurance-travel'
  | 'insurance-paper'
  | 'travel-insurance'
  | 'health-certificate'
  | 'tax-certificate'
  | 'income-tax'
  | 'work-permit'
  | 'visa-received'
  | 'visa-granted'
  | 'biometric-vfs'
  | 'plane-ticket'
  | 'immi-card';

export interface ApplicantProfile {
  id: string;
  referenceNumber: string; // e.g. REF-928410 or TRN-928410
  edNumber: string; // e.g. ED-78412-WA
  fullName: string;
  nationality: string;
  documentNumber: string; // Passport Number
  dateOfBirth: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  visaSubclass: string; // e.g. 482 - Temporary Skill Shortage (TSS)
  visaStream: string; // e.g. Medium-Term Stream
  nominatedOccupation: string;
  anzscoCode: string;
  sponsorName: string;
  sponsorAbn: string;
  applicationDate: string;
  grantDate: string;
  visaExpiryDate: string;
  visaGrantNumber: string;
  hapId: string; // Health Assessment Portal ID
  tfnNumber: string;
  salaryPackage: string;
  workLocation: string;
  status: 'VERIFIED_ACTIVE' | 'PENDING_REVIEW' | 'GRANTED';
  verificationIdNo?: string; // e.g. VRF-99420-AU
  transitionIdNo?: string; // e.g. VFS-TRN-882190
  insuranceNo?: string; // e.g. BUPA-OVHC-7741029
  immiCardNo?: string; // e.g. IMMI-CARD-492019
  ticketNumber?: string; // e.g. QF-948201
  airlineName?: string; // e.g. Qantas Airways
  flightRoute?: string; // e.g. London Heathrow (LHR) -> Perth Airport (PER)
}

export interface PositiveListOccupation {
  anzscoCode: string;
  title: string;
  sector: 'Mining & Resources' | 'Engineering' | 'Healthcare' | 'IT & Technology' | 'Construction & Trades' | string;
  assessingAuthority: string; // e.g. Engineers Australia, VETASSESS, TRA, ACS
  eligibleVisas: string[]; // ['482', '186', '189', '190', '491']
  minimumSalary: string;
  demandStatus: 'Critical Shortage' | 'High Demand' | 'Priority Migration' | string;
  australianStates?: string[];
  description?: string;
  skillLevel?: string;
  minSalaryAUD?: string;
  priorityStatus?: string;
}

export interface DocumentMetadata {
  type: DocumentType;
  title: string;
  searchKey: 'ED' | 'REF' | 'BOTH';
  badge: string;
  code: string;
  description: string;
}
