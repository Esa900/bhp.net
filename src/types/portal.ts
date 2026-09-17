export type DocumentType =
  | 'application-form'
  | 'job-acceptance'
  | 'employment-offer'
  | 'job-confirmation'
  | 'insurance-travel'
  | 'health-certificate'
  | 'tax-certificate'
  | 'work-permit'
  | 'visa-received'
  | 'visa-granted';

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
}

export interface PositiveListOccupation {
  anzscoCode: string;
  title: string;
  sector: 'Mining & Resources' | 'Engineering' | 'Healthcare' | 'IT & Technology' | 'Construction & Trades';
  assessingAuthority: string; // e.g. Engineers Australia, VETASSESS, TRA, ACS
  eligibleVisas: string[]; // ['482', '186', '189', '190', '491']
  minimumSalary: string;
  demandStatus: 'Critical Shortage' | 'High Demand' | 'Priority Migration';
  australianStates: string[];
  description: string;
}

export interface DocumentMetadata {
  type: DocumentType;
  title: string;
  searchKey: 'ED' | 'REF' | 'BOTH';
  badge: string;
  code: string;
  description: string;
}
