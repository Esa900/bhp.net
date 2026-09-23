import { CanadaDocumentRecord, CanadaMenuItemConfig } from '../types/canada';

export const CANADA_STORAGE_KEY = 'bhp_canada_documents';
export const CANADA_DOCUMENTS_UPDATED_EVENT = 'bhp_canada_documents_updated';

export const CANADA_MENU_CONFIGS: CanadaMenuItemConfig[] = [
  {
    id: 'work-permit-docs',
    mainTitle: 'Canada Work Permit Documents',
    subMenu: 'Employment Application Document See',
    fieldLabel: 'TIN / Reference Number',
    searchFieldKey: 'tinOrRef',
    placeholder: 'Enter TIN (e.g. TIN-CA-782190) or Reference Number (e.g. REF-CA-928410)...',
    samplePlaceholder: 'REF-CA-928410',
    description: 'Verify official Canada Employment Application and Tax File Identification authorization.',
  },
  {
    id: 'offer-letter',
    mainTitle: 'Offer Letter of Employment Pending',
    subMenu: 'Offer Letter of Employment See',
    fieldLabel: 'ID Number',
    searchFieldKey: 'idNumber',
    placeholder: 'Enter ID Number (e.g. CA-ED-88412)...',
    samplePlaceholder: 'CA-ED-88412',
    description: 'Search official Canadian employer offer letter, compensation schedule, and LMIA approval details.',
  },
  {
    id: 'job-confirmation',
    mainTitle: 'Job Confirmation Pending',
    subMenu: 'Job Confirmation Pending See',
    fieldLabel: 'Verification ID No',
    searchFieldKey: 'verificationIdNo',
    placeholder: 'Enter Verification ID No (e.g. VRF-CAN-99420)...',
    samplePlaceholder: 'VRF-CAN-99420',
    description: 'Verify statutory Job Confirmation and Canadian employer sponsorship confirmation certificate.',
  },
  {
    id: 'biometric-vfs',
    mainTitle: 'Biometric Received Paper of VFS Global Document Pending',
    subMenu: 'Biometric Received Paper of VFS Global Document Pending See',
    fieldLabel: 'Transition ID No',
    searchFieldKey: 'transitionIdNo',
    placeholder: 'Enter Transition ID No (e.g. VFS-CAN-882190)...',
    samplePlaceholder: 'VFS-CAN-882190',
    description: 'Confirm VFS Global biometric enrollment collection, facial capture and transition tracking dispatch.',
  },
  {
    id: 'work-permit-pending',
    mainTitle: 'Work Permit Documents Pending',
    subMenu: 'Work Permit Documents Pending See',
    fieldLabel: 'Reference No',
    searchFieldKey: 'referenceNo',
    placeholder: 'Enter Reference No (e.g. WPD-CAN-55102)...',
    samplePlaceholder: 'WPD-CAN-55102',
    description: 'Immigration, Refugees and Citizenship Canada (IRCC) work permit status and temporary resident visa verification.',
  },
];

export const INITIAL_CANADA_DOCUMENTS: CanadaDocumentRecord[] = [
  {
    id: 'ca-doc-1',
    categoryType: 'work-permit-docs',
    mainTitle: 'canada Work Permit Documents',
    subMenu: 'Employment Application Document C',
    tinOrRef: 'REF-CA-928410',
    candidateName: 'Mohammad Rafiqul Islam',
    passportNumber: 'A08934211',
    nationality: 'Bangladeshi',
    dateOfBirth: '1992-05-14',
    jobTitle: 'Industrial Electrician',
    employerName: 'BHP Canada Operations Ltd (Jansen Project)',
    workLocation: 'Saskatoon, Saskatchewan, Canada',
    hourlyWageOrSalary: '$42.50 CAD / hr',
    workingHours: '40 hrs / week (Overtime available)',
    status: 'Verified',
    issueDate: '2025-11-10',
    expiryDate: '2028-11-09',
    officialDocNumber: 'IRCC-WP-2025-928410',
    lmiaNumber: 'LMIA-CA-884210',
    notes: 'Employment Application approved under Global Skills Strategy Stream A.',
    createdAt: '2025-11-10T10:00:00.000Z',
  },
  {
    id: 'ca-doc-2',
    categoryType: 'offer-letter',
    mainTitle: 'Offer Letter of Employment Pending',
    subMenu: 'Offer Letter of Employment C',
    idNumber: 'CA-ED-88412',
    candidateName: 'Tanvir Hossain Chowdhury',
    passportNumber: 'B19482033',
    nationality: 'Bangladeshi',
    dateOfBirth: '1994-08-22',
    jobTitle: 'Heavy Machinery Mechanic',
    employerName: 'Canadian Mining Resources Inc.',
    workLocation: 'Edmonton, Alberta, Canada',
    hourlyWageOrSalary: '$39.00 CAD / hr',
    workingHours: '42 hrs / week',
    status: 'Approved',
    issueDate: '2026-01-15',
    expiryDate: '2028-01-14',
    officialDocNumber: 'OFF-EMP-2026-88412',
    lmiaNumber: 'LMIA-AB-992100',
    notes: 'Offer letter signed and acknowledged. FIFO accommodation and health coverage included.',
    createdAt: '2026-01-15T12:30:00.000Z',
  },
  {
    id: 'ca-doc-3',
    categoryType: 'job-confirmation',
    mainTitle: 'Job Confirmation Pending',
    subMenu: 'Job Confirmation Pending See',
    verificationIdNo: 'VRF-CAN-99420',
    candidateName: 'Shahidul Alam',
    passportNumber: 'A12903488',
    nationality: 'Bangladeshi',
    dateOfBirth: '1990-11-03',
    jobTitle: 'Food Packaging & Processing Specialist',
    employerName: 'Maple Leaf Agro & Foods Canada',
    workLocation: 'Mississauga, Ontario, Canada',
    hourlyWageOrSalary: '$28.75 CAD / hr',
    workingHours: '40 hrs / week',
    status: 'Verified',
    issueDate: '2026-02-01',
    expiryDate: '2027-02-01',
    officialDocNumber: 'JC-VRF-CAN-99420',
    lmiaNumber: 'LMIA-ON-441209',
    notes: 'Job confirmation authenticated by provincial employer registry.',
    createdAt: '2026-02-01T09:15:00.000Z',
  },
  {
    id: 'ca-doc-4',
    categoryType: 'biometric-vfs',
    mainTitle: 'Biometric Received Paper of VFS Global Document Pending',
    subMenu: 'Biometric Received Paper of VFS Global Document Pending See',
    transitionIdNo: 'VFS-CAN-882190',
    candidateName: 'Nusrat Jahan',
    passportNumber: 'B07765129',
    nationality: 'Bangladeshi',
    dateOfBirth: '1996-03-19',
    jobTitle: 'Quality Assurance Inspector',
    employerName: 'BHP Global Supply Canada',
    workLocation: 'Vancouver, British Columbia, Canada',
    hourlyWageOrSalary: '$34.00 CAD / hr',
    workingHours: '37.5 hrs / week',
    status: 'Verified',
    issueDate: '2026-02-18',
    expiryDate: '2036-02-18',
    officialDocNumber: 'VFS-BIO-882190',
    notes: 'Biometrics collected at VFS Global Dhaka Centre. Fingerprints and facial scan verified with IRCC portal.',
    createdAt: '2026-02-18T14:45:00.000Z',
  },
  {
    id: 'ca-doc-5',
    categoryType: 'work-permit-pending',
    mainTitle: 'Work Permit Documents Pending',
    subMenu: 'Work Permit Documents Pending See',
    referenceNo: 'WPD-CAN-55102',
    candidateName: 'Kazi Farhan Ahmed',
    passportNumber: 'A99014322',
    nationality: 'Bangladeshi',
    dateOfBirth: '1993-07-28',
    jobTitle: 'Commercial Transport Driver',
    employerName: 'Trans-Canada Logistics Group',
    workLocation: 'Calgary, Alberta, Canada',
    hourlyWageOrSalary: '$36.50 CAD / hr',
    workingHours: '44 hrs / week',
    status: 'Pending',
    issueDate: '2026-03-02',
    expiryDate: '2028-03-01',
    officialDocNumber: 'WP-IRCC-55102',
    lmiaNumber: 'LMIA-AB-771204',
    notes: 'Final statutory work permit issuance under processing by IRCC Edmonton processing centre.',
    createdAt: '2026-03-02T16:20:00.000Z',
  },
];

export function getStoredCanadaDocuments(): CanadaDocumentRecord[] {
  try {
    const raw = localStorage.getItem(CANADA_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CANADA_STORAGE_KEY, JSON.stringify(INITIAL_CANADA_DOCUMENTS));
      return INITIAL_CANADA_DOCUMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(CANADA_STORAGE_KEY, JSON.stringify(INITIAL_CANADA_DOCUMENTS));
    return INITIAL_CANADA_DOCUMENTS;
  } catch {
    return INITIAL_CANADA_DOCUMENTS;
  }
}

export function saveCanadaDocuments(docs: CanadaDocumentRecord[]): void {
  try {
    localStorage.setItem(CANADA_STORAGE_KEY, JSON.stringify(docs));
    window.dispatchEvent(new CustomEvent(CANADA_DOCUMENTS_UPDATED_EVENT));
  } catch (err) {
    console.error('Failed to save Canada documents to localStorage', err);
  }
}

export function addCanadaDocument(doc: Omit<CanadaDocumentRecord, 'id' | 'createdAt'>): CanadaDocumentRecord {
  const current = getStoredCanadaDocuments();
  const newRecord: CanadaDocumentRecord = {
    ...doc,
    id: `ca-doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newRecord, ...current];
  saveCanadaDocuments(updated);
  return newRecord;
}

export function updateCanadaDocument(id: string, updates: Partial<CanadaDocumentRecord>): CanadaDocumentRecord | null {
  const current = getStoredCanadaDocuments();
  const index = current.findIndex((d) => d.id === id);
  if (index === -1) return null;
  const updatedRecord = { ...current[index], ...updates };
  current[index] = updatedRecord;
  saveCanadaDocuments(current);
  return updatedRecord;
}

export function deleteCanadaDocument(id: string): boolean {
  const current = getStoredCanadaDocuments();
  const filtered = current.filter((d) => d.id !== id);
  if (filtered.length === current.length) return false;
  saveCanadaDocuments(filtered);
  return true;
}

export function resetCanadaDocuments(): void {
  saveCanadaDocuments(INITIAL_CANADA_DOCUMENTS);
}

/**
 * Searches across Canada documents using query term matching against any key
 */
export function searchCanadaDocument(
  query: string,
  categoryType?: CanadaMenuItemConfig['id']
): CanadaDocumentRecord | null {
  const clean = query.trim().toLowerCase().replace(/[-\s/]/g, '');
  if (!clean) return null;

  const docs = getStoredCanadaDocuments();

  // If a category was specified, try matching within that category first
  if (categoryType) {
    const catDocs = docs.filter((d) => d.categoryType === categoryType);
    for (const d of catDocs) {
      if (matchesCanadaRecord(d, clean, query)) {
        return d;
      }
    }
  }

  // Fallback: search all records
  for (const d of docs) {
    if (matchesCanadaRecord(d, clean, query)) {
      return d;
    }
  }

  return null;
}

function matchesCanadaRecord(d: CanadaDocumentRecord, clean: string, rawQuery: string): boolean {
  const matchesField = (val?: string) => {
    if (!val) return false;
    const cleanVal = val.toLowerCase().replace(/[-\s/]/g, '');
    return cleanVal.includes(clean) || clean.includes(cleanVal);
  };

  return (
    matchesField(d.tinOrRef) ||
    matchesField(d.idNumber) ||
    matchesField(d.verificationIdNo) ||
    matchesField(d.transitionIdNo) ||
    matchesField(d.referenceNo) ||
    matchesField(d.officialDocNumber) ||
    matchesField(d.passportNumber) ||
    d.candidateName.toLowerCase().includes(rawQuery.toLowerCase())
  );
}
