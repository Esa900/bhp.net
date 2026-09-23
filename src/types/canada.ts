export type CanadaCategoryType =
  | 'work-permit-docs'
  | 'offer-letter'
  | 'job-confirmation'
  | 'biometric-vfs'
  | 'work-permit-pending';

export interface CanadaDocumentRecord {
  id: string;
  categoryType: CanadaCategoryType;
  mainTitle: string;
  subMenu: string;
  
  // Search identification fields
  tinOrRef?: string;
  idNumber?: string;
  verificationIdNo?: string;
  transitionIdNo?: string;
  referenceNo?: string;

  // Candidate Details
  candidateName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth?: string;

  // Employment Details
  jobTitle: string;
  employerName: string;
  workLocation: string;
  hourlyWageOrSalary?: string;
  workingHours?: string;
  status: 'Approved' | 'Pending' | 'Verified' | 'Under Review';

  // Dates & Official IDs
  issueDate: string;
  expiryDate: string;
  officialDocNumber?: string;
  lmiaNumber?: string;
  documentFileUrl?: string;
  documentFileName?: string;
  notes?: string;
  createdAt: string;
}

export interface CanadaMenuItemConfig {
  id: CanadaCategoryType;
  mainTitle: string;
  subMenu: string;
  fieldLabel: string;
  searchFieldKey: 'tinOrRef' | 'idNumber' | 'verificationIdNo' | 'transitionIdNo' | 'referenceNo';
  placeholder: string;
  samplePlaceholder: string;
  description: string;
}
