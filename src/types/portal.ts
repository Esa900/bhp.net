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
  | 'visa-granted';

export interface DocumentAttachment {
  fileUrl?: string; // base64 data URI or external link
  fileName?: string;
  fileType?: string;
  uploadedAt?: string;
  notes?: string;
}

export interface CustomAttachment {
  id: string;
  title: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  uploadedAt: string;
  notes?: string;
}

export interface ApplicantProfile {
  id: string;
  referenceNumber: string; // e.g. REF-100200
  edNumber: string; // e.g. ED-800900
  fullName: string;
  nationality: string;
  documentNumber: string; // Passport Number or Identity Number
  dateOfBirth: string;
  documentIssueDate: string;
  documentExpiryDate?: string;
  visaSubclass?: string; // e.g. 482 - Temporary Skill Shortage (TSS)
  visaStream?: string; // e.g. Medium-Term Stream
  nominatedOccupation?: string;
  anzscoCode?: string;
  sponsorName?: string;
  sponsorAbn?: string;
  applicationDate?: string;
  grantDate?: string;
  visaExpiryDate?: string;
  visaGrantNumber?: string;
  hapId?: string; // Health Assessment Portal ID
  tfnNumber?: string;
  salaryPackage?: string;
  workLocation?: string;
  status: 'VERIFIED_ACTIVE' | 'PENDING_REVIEW' | 'GRANTED';
  attachments?: {
    applicationForm?: DocumentAttachment;
    jobAcceptance?: DocumentAttachment;
    employmentOffer?: DocumentAttachment;
    jobConfirmation?: DocumentAttachment;
    workPermit?: DocumentAttachment;
    incomeTax?: DocumentAttachment;
    taxCertificate?: DocumentAttachment;
    insurancePaper?: DocumentAttachment;
    travelInsurance?: DocumentAttachment;
    healthCertificate?: DocumentAttachment;
    visaReceived?: DocumentAttachment;
    visaGranted?: DocumentAttachment;
  };
  customAttachments?: CustomAttachment[];
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
