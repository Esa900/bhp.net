import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Persistent Server Data Directory
const DATA_DIR = path.resolve(__dirname, 'server-data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const CANADA_DOCS_FILE = path.join(DATA_DIR, 'canada_documents.json');
const MENU_ITEMS_FILE = path.join(DATA_DIR, 'menu_items.json');
const CANADA_MENU_ITEMS_FILE = path.join(DATA_DIR, 'canada_menu_items.json');
const DELETED_IDS_FILE = path.join(DATA_DIR, 'deleted_ids.json');

interface DeletedIdsStore {
  posts: string[];
  canada: string[];
}

function getDeletedIds(): DeletedIdsStore {
  const data = readJsonFile<DeletedIdsStore>(DELETED_IDS_FILE, { posts: [], canada: [] });
  return {
    posts: Array.isArray(data?.posts) ? data.posts : [],
    canada: Array.isArray(data?.canada) ? data.canada : [],
  };
}

function recordDeletedIds(type: 'posts' | 'canada', ids: string[]) {
  if (!ids || ids.length === 0) return;
  const current = getDeletedIds();
  const nextSet = new Set([...current[type], ...ids.filter(Boolean)]);
  current[type] = Array.from(nextSet).slice(-500);
  writeJsonFile(DELETED_IDS_FILE, current);
}

function clearDeletedId(type: 'posts' | 'canada', id?: string) {
  if (!id) return;
  const current = getDeletedIds();
  if (current[type].includes(id)) {
    current[type] = current[type].filter((item) => item !== id);
    writeJsonFile(DELETED_IDS_FILE, current);
  }
}

// Helper to safely read JSON
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (Array.isArray(fallback) && Array.isArray(parsed)) {
          return parsed as unknown as T;
        }
        if (!Array.isArray(fallback) && typeof parsed === 'object') {
          return parsed as unknown as T;
        }
      }
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON
function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// =========================================================================
// INITIAL SERVER SEEDS
// =========================================================================
const INITIAL_DEFAULT_POSTS: any[] = [
  {
    id: 'post-doc-egp56',
    title: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER',
    refNumber: 'EGP56RU55H',
    content: 'Application for a Work Permit (D Category). Verified and endorsed by BHP Canada & IRCC.',
    category: 'Employment Application & Verification',
    author: 'BHP Operations',
    date: '2026-03-02',
    status: 'Published',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    attachedDocuments: [
      {
        id: 'att-post-egp56-pdf',
        name: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
        size: '737 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Work Permit Documents (ওয়ার্ক পারমিট)',
        isPrimary: true,
        uploadDate: '2026-03-02',
      },
      {
        id: 'att-post-egp56-offer',
        name: 'BHP_Official_Offer_Letter_and_Employment_Contract.pdf',
        size: '450 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Job Confirmation & Offer Letter (অফার লেটার)',
        isPrimary: false,
        uploadDate: '2026-03-02',
      },
    ],
    readTime: '4 min read',
    badges: ['VERIFIED', 'WORK PERMIT', 'D CATEGORY'],
    candidateName: 'MD IBRAHIM KHALIL MOZUMDER',
    passportNumber: 'A99014322',
    nationality: 'Bangladeshi',
    dateOfBirth: '1990-06-15',
    jobTitle: 'Commercial Transport & Heavy Mobile Equipment Operator',
    employerName: 'BHP Canada Operations Ltd',
    workLocation: 'Calgary, Alberta, Canada',
    salaryPackage: '$38.50 CAD / hr',
    visaSubclass: 'Work Permit (D Category)',
    issueDate: '2026-03-02',
    expiryDate: '2029-03-01',
    verificationIdNo: 'VRF-CAN-56RU55',
  },
];

const INITIAL_CANADA_DOCUMENTS = [
  {
    id: 'ca-doc-egp56',
    categoryType: 'work-permit-pending',
    mainTitle: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER',
    subMenu: 'Work Permit Documents Pending See',
    tinOrRef: 'EGP56RU55H',
    referenceNo: 'EGP56RU55H',
    idNumber: 'EGP56RU55H',
    verificationIdNo: 'VRF-CAN-56RU55',
    transitionIdNo: 'VFS-CAN-56RU55',
    candidateName: 'MD IBRAHIM KHALIL MOZUMDER',
    passportNumber: 'A99014322',
    nationality: 'Bangladeshi',
    dateOfBirth: '1990-06-15',
    jobTitle: 'Commercial Transport & Heavy Mobile Equipment Operator',
    employerName: 'BHP Canada Operations Ltd',
    workLocation: 'Calgary, Alberta, Canada',
    hourlyWageOrSalary: '$38.50 CAD / hr',
    workingHours: '40 hrs / week',
    status: 'Verified & Active',
    issueDate: '2026-03-02',
    expiryDate: '2029-03-01',
    officialDocNumber: 'WP-IRCC-EGP56RU55H',
    lmiaNumber: 'LMIA-CA-56RU55',
    documentFileName: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
    documentFileUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
    notes: 'Application for a Work Permit (D Category). Verified and endorsed by BHP Canada & IRCC.',
    createdAt: '2026-03-02T10:00:00.000Z',
    attachedDocuments: [
      {
        id: 'att-ca-egp56-pdf',
        name: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
        size: '737 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Work Permit Documents (ওয়ার্ক পারমিট)',
        isPrimary: true,
        uploadDate: '2026-03-02',
      },
      {
        id: 'att-ca-egp56-offer',
        name: 'BHP_Official_Offer_Letter_and_Employment_Contract.pdf',
        size: '450 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Job Confirmation & Offer Letter (অফার লেটার)',
        isPrimary: false,
        uploadDate: '2026-03-02',
      },
    ],
  },
  {
    id: 'ca-doc-5',
    categoryType: 'work-permit-pending',
    mainTitle: 'Work Permit Documents Pending',
    subMenu: 'Work Permit Documents Pending See',
    referenceNo: 'WPD-CAN-55102',
    candidateName: 'Kazi Farhan Ahmed',
    passportNumber: 'B77410299',
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
    tinOrRef: 'WPD-CAN-55102',
    idNumber: 'WPD-CAN-55102',
    verificationIdNo: 'VRF-CAN-55102',
    documentFileName: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
    documentFileUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
    attachedDocuments: [
      {
        id: 'att-ca-wpd55102-pdf',
        name: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
        size: '737 KB',
        type: 'pdf',
        dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
        sectionTag: 'Work Permit Documents (ওয়ার্ক পারমিট)',
        isPrimary: true,
        uploadDate: '2026-03-02',
      },
    ],
  },
];

const INITIAL_CANADA_MENU_ITEMS = [
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


const INITIAL_MENU_ITEMS = [
  {
    id: 'australia-work-permit',
    mainTitle: 'Australia Work Permit Documents',
    subMenu: 'Employment Application Document See',
    fieldLabel: 'TIN / Reference Number',
    fieldKey: 'tinOrRef',
    placeholder: 'Enter TIN (e.g. 782 190 442) or Reference Number (e.g. REF-928410)...',
    documentType: 'application-form',
    sampleValue: 'REF-928410',
    description: 'Verify official Employment Application and Tax File Identification with Commonwealth Department of Home Affairs.',
    badge: 'TIN & Reference Verified',
    category: 'Work Permit',
  },
  {
    id: 'offer-letter-pending',
    mainTitle: 'Offer Letter of Employment Pending',
    subMenu: 'Offer Letter of Employment See',
    fieldLabel: 'ID Number',
    fieldKey: 'idNumber',
    placeholder: 'Enter ID Number (e.g. ED-78412-WA or GBR5829104)...',
    documentType: 'employment-offer',
    sampleValue: 'ED-78412-WA',
    description: 'Search official corporate employment agreement, remuneration schedule, and FIFO work allowances.',
    badge: 'Employer Declaration ID',
    category: 'Employment',
  },
  {
    id: 'job-confirmation-pending',
    mainTitle: 'Job Confirmation Pending',
    subMenu: 'Job Confirmation Pending See',
    fieldLabel: 'Verification ID No',
    fieldKey: 'verificationIdNo',
    placeholder: 'Enter Verification ID No (e.g. VRF-99420-AU)...',
    documentType: 'job-confirmation',
    sampleValue: 'VRF-99420-AU',
    description: 'Access Department of Home Affairs and nominating sponsor validated Job Confirmation certificate.',
    badge: 'Sponsorship Verified',
    category: 'Employment',
  },
  {
    id: 'biometric-vfs-pending',
    mainTitle: 'Biometric Received Paper of VFS Global Document Pending',
    subMenu: 'Biometric Received Paper of VFS Global Document Pending See',
    fieldLabel: 'Transition ID No',
    fieldKey: 'transitionIdNo',
    placeholder: 'Enter Transition ID No (e.g. VFS-TRN-882190)...',
    documentType: 'biometric-receipt',
    sampleValue: 'VFS-TRN-882190',
    description: 'Track official biometric data collection dispatch and identity transmission receipt.',
    badge: 'VFS Biometrics Registered',
    category: 'Biometrics',
  },
  {
    id: 'work-permit-pending',
    mainTitle: 'Work Permit Documents Pending',
    subMenu: 'Work Permit Documents Pending See',
    fieldLabel: 'Reference No',
    fieldKey: 'referenceNo',
    placeholder: 'Enter Reference No (e.g. REF-928410)...',
    documentType: 'work-permit',
    sampleValue: 'REF-928410',
    description: 'Verify Australian Department of Home Affairs Subclass 482 / 186 work authorization validity.',
    badge: 'Commonwealth Visa Status',
    category: 'Immigration',
  },
  {
    id: 'work-permit-issued',
    mainTitle: 'Work Permit Documents Issued',
    subMenu: 'Work Permit Documents Issued See',
    fieldLabel: 'Visa Grant Number',
    fieldKey: 'visaGrantNumber',
    placeholder: 'Enter Visa Grant Number (e.g. 0982147612984)...',
    documentType: 'work-permit',
    sampleValue: '0982147612984',
    description: 'Verify issued work permits, ANZSCO nominated code authorizations, and employer compliance certificates.',
    badge: 'Visa Grant Verified',
    category: 'Immigration',
  },
  {
    id: 'medical-report',
    mainTitle: 'Medical Fitness & Health Clearance',
    subMenu: 'Medical Report Verified See',
    fieldLabel: 'HAP ID / Medical Clearance No',
    fieldKey: 'hapId',
    placeholder: 'Enter HAP ID (e.g. HAP-8849201)...',
    documentType: 'medical-clearance',
    sampleValue: 'HAP-8849201',
    description: 'Statutory health and fitness verification conducted by accredited Commonwealth medical panels.',
    badge: 'Fit for Remote Mining',
    category: 'Health',
  },
  {
    id: 'insurance-policy',
    mainTitle: 'Corporate Overseas Health Cover (OVHC)',
    subMenu: 'Health Insurance Certificate See',
    fieldLabel: 'Insurance Policy Number',
    fieldKey: 'insuranceNo',
    placeholder: 'Enter Insurance Policy No (e.g. BUPA-OVHC-7741029)...',
    documentType: 'insurance-certificate',
    sampleValue: 'BUPA-OVHC-7741029',
    description: 'Mandatory 8501 condition compliant private health insurance certificate covering emergency medical care and evacuation.',
    badge: 'Condition 8501 Compliant',
    category: 'Insurance',
  },
  {
    id: 'immi-card',
    mainTitle: 'Commonwealth ImmiCard & Digital ID',
    subMenu: 'ImmiCard Electronic Record See',
    fieldLabel: 'ImmiCard Number',
    fieldKey: 'immiCardNo',
    placeholder: 'Enter ImmiCard No (e.g. IMMI-CARD-492019)...',
    documentType: 'immicard-record',
    sampleValue: 'IMMI-CARD-492019',
    description: 'Department of Home Affairs issued electronic identity evidence facilitating Australian government and banking verification.',
    badge: 'VEVO Synced Identity',
    category: 'Identity',
  },
  {
    id: 'air-ticket',
    mainTitle: 'Corporate Mobilisation & Flight E-Ticket',
    subMenu: 'Flight Booking E-Ticket See',
    fieldLabel: 'Ticket / Booking Reference (PNR)',
    fieldKey: 'ticketNumber',
    placeholder: 'Enter Airline Ticket No (e.g. QF-948201)...',
    documentType: 'flight-ticket',
    sampleValue: 'QF-948201',
    description: 'Confirmed international transit itinerary and FIFO site transfer scheduling issued by BHP Travel Desk.',
    badge: 'Mobilisation Scheduled',
    category: 'Logistics',
  },
  {
    id: 'australia-visas',
    mainTitle: 'Australia Visas Verification',
    subMenu: 'Australia Visas Documents See',
    fieldLabel: 'Passport / Reference Number',
    fieldKey: 'passportOrRef',
    placeholder: 'Enter Passport Number (e.g. GBR5829104) or Reference Number...',
    documentType: 'work-permit',
    sampleValue: 'GBR5829104',
    description: 'Search Commonwealth visa records, grant notifications, and VEVO authorization clearances.',
    badge: 'VEVO Direct Lookup',
    category: 'Visa Search',
  },
];

// Fallback Commonwealth portal records for cross-device searches
const SAMPLE_PORTAL_RECORDS = [
  {
    id: 'prof-1',
    referenceNumber: 'REF-928410',
    edNumber: 'ED-78412-WA',
    fullName: 'Marcus Sterling',
    nationality: 'United Kingdom',
    documentNumber: 'GBR5829104',
    dateOfBirth: '14 May 1988',
    visaSubclass: 'Subclass 482 (Temporary Skill Shortage - Medium-term Stream)',
    nominatedOccupation: 'Mining Operations Engineer',
    sponsorName: 'BHP Group Limited / Western Australia Iron Ore Pty Ltd',
    workLocation: 'Pilbara Operations, Newman Hub, Western Australia',
    status: 'VERIFIED_ACTIVE',
    verificationIdNo: 'VRF-99420-AU',
    transitionIdNo: 'VFS-TRN-882190',
    insuranceNo: 'BUPA-OVHC-7741029',
    immiCardNo: 'IMMI-CARD-492019',
    ticketNumber: 'QF-948201',
  },
  {
    id: 'prof-2',
    referenceNumber: 'REF-663201',
    edNumber: 'ED-55104-QLD',
    fullName: 'Dr. Ananya Sharma',
    nationality: 'India',
    documentNumber: 'IND9021482',
    dateOfBirth: '08 Aug 1991',
    visaSubclass: 'Subclass 186 (Employer Nomination Scheme - Direct Entry)',
    nominatedOccupation: 'Materials & Metallurgical Research Specialist',
    sponsorName: 'BHP Mitsubishi Alliance (BMA) Queensland Coal Operations',
    workLocation: 'Brisbane Technology Centre & Bowen Basin, Queensland',
    status: 'VERIFIED_ACTIVE',
    verificationIdNo: 'VRF-55104-AU',
  },
  {
    id: 'prof-3',
    referenceNumber: 'REF-114920',
    edNumber: 'ED-11492-VIC',
    fullName: 'Kasper Lindqvist',
    nationality: 'Sweden',
    documentNumber: 'SWE4412095',
    dateOfBirth: '29 Nov 1985',
    visaSubclass: 'Subclass 482 (Temporary Skill Shortage - Labour Agreement Stream)',
    nominatedOccupation: 'Senior Geotechnical & Mine Safety Assessor',
    sponsorName: 'BHP Group Limited - Olympic Dam Division',
    workLocation: 'Olympic Dam Underground Mine, Roxby Downs, South Australia',
    status: 'VERIFIED_ACTIVE',
    verificationIdNo: 'VRF-11492-AU',
  },
];

// Persistent Uploads Directory for attached PDFs and images
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const PUBLIC_UPLOADS = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(PUBLIC_UPLOADS)) {
  fs.mkdirSync(PUBLIC_UPLOADS, { recursive: true });
}

// Helper to save base64 string to a file on disk
function saveBase64ToFile(dataUrl: string, nameHint: string): string {
  if (!dataUrl || !dataUrl.startsWith('data:') || dataUrl.length < 50) return dataUrl;
  try {
    const commaIdx = dataUrl.indexOf(',');
    const metaHeader = commaIdx !== -1 ? dataUrl.substring(0, commaIdx).toLowerCase() : '';
    const base64Str = commaIdx !== -1 ? dataUrl.substring(commaIdx + 1) : dataUrl;
    const buffer = Buffer.from(base64Str, 'base64');
    const isPdf =
      metaHeader.includes('application/pdf') ||
      base64Str.trimStart().startsWith('JVBERi') ||
      nameHint.toLowerCase().endsWith('.pdf');
    let ext = '.png';
    if (isPdf) {
      ext = '.pdf';
    } else if (metaHeader.includes('image/jpeg') || metaHeader.includes('image/jpg') || nameHint.toLowerCase().match(/\.(jpg|jpeg)$/)) {
      ext = '.jpg';
    } else if (metaHeader.includes('image/webp') || nameHint.toLowerCase().endsWith('.webp')) {
      ext = '.webp';
    } else if (metaHeader.includes('image/gif') || nameHint.toLowerCase().endsWith('.gif')) {
      ext = '.gif';
    }
    const safeBase = (nameHint || 'document').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^/.]+$/, '');
    const finalFileName = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${safeBase}${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, finalFileName), buffer);
    try {
      fs.writeFileSync(path.join(PUBLIC_UPLOADS, finalFileName), buffer);
    } catch (_) {}
    return `/uploads/${finalFileName}`;
  } catch (e) {
    console.error('Error saving base64 to file:', e);
    return dataUrl;
  }
}

function normalizeAttachedType(att: any, url: string): 'pdf' | 'image' | 'other' {
  const lowerUrl = (url || '').toLowerCase();
  const lowerName = (att?.name || '').toLowerCase();
  if (
    att?.type === 'pdf' ||
    lowerName.endsWith('.pdf') ||
    lowerUrl.endsWith('.pdf') ||
    lowerUrl.includes('application/pdf') ||
    (url || '').includes('JVBERi')
  ) {
    return 'pdf';
  }
  if (
    att?.type === 'image' ||
    lowerUrl.startsWith('data:image') ||
    Boolean(lowerName.match(/\.(jpg|jpeg|png|webp|gif)$/)) ||
    Boolean(lowerUrl.match(/\.(jpg|jpeg|png|webp|gif)$/))
  ) {
    return 'image';
  }
  return att?.type || 'other';
}

function processBase64InDoc(doc: any) {
  if (!doc) return doc;
  const copy = { ...doc };
  if (copy.documentFileUrl && copy.documentFileUrl.startsWith('data:')) {
    copy.documentFileUrl = saveBase64ToFile(copy.documentFileUrl, copy.documentFileName || 'document.pdf');
  }
  if (copy.candidatePhotoUrl && copy.candidatePhotoUrl.startsWith('data:')) {
    copy.candidatePhotoUrl = saveBase64ToFile(copy.candidatePhotoUrl, 'candidate_photo.png');
  }
  if (copy.imageUrl && copy.imageUrl.startsWith('data:')) {
    copy.imageUrl = saveBase64ToFile(copy.imageUrl, 'primary_image.png');
  }
  if (Array.isArray(copy.galleryImages)) {
    copy.galleryImages = copy.galleryImages.map((img: string, idx: number) =>
      img && img.startsWith('data:') ? saveBase64ToFile(img, `gallery_${idx + 1}.png`) : img
    );
  }
  const fallbackSectionTag = copy.category || copy.mainTitle || 'Work Permit Documents (ওয়ার্ক পারমিট)';
  if (Array.isArray(copy.attachedDocuments)) {
    copy.attachedDocuments = copy.attachedDocuments.map((att: any, idx: number) => {
      if (!att) return att;
      let nextUrl = att.dataUrl || '';
      if (nextUrl.startsWith('data:')) {
        nextUrl = saveBase64ToFile(nextUrl, att.name || 'attached_doc.pdf');
      }
      const normalizedType = normalizeAttachedType(att, nextUrl);
      return {
        ...att,
        id: att.id || `att-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        type: normalizedType,
        sectionTag: att.sectionTag || fallbackSectionTag,
        dataUrl: nextUrl,
      };
    });
  }
  return copy;
}

// Auto-seed files on server boot
function seedServerStorageIfEmpty() {
  let existingPosts = readJsonFile<any[]>(POSTS_FILE, []);
  if (!existingPosts || existingPosts.length === 0) {
    writeJsonFile(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    console.log('[Server Storage] Seeded posts.json with initial records');
  } else {
    const hasEgp56 = existingPosts.some(
      (p) => p.refNumber === 'EGP56RU55H' || p.id === 'post-doc-egp56'
    );
    if (!hasEgp56) {
      existingPosts = [...INITIAL_DEFAULT_POSTS, ...existingPosts];
      writeJsonFile(POSTS_FILE, existingPosts);
      console.log('[Server Storage] Added EGP56RU55H record to posts.json');
    }
  }

  let existingCaDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, []);
  if (!existingCaDocs || existingCaDocs.length === 0) {
    writeJsonFile(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    console.log('[Server Storage] Seeded canada_documents.json with initial records');
  } else {
    // Ensure ca-doc-egp56 and ca-doc-5 have the 11-page Canada Visa Application PDF attached if missing
    let updated = false;
    existingCaDocs = existingCaDocs.map((doc) => {
      const isTargetDoc =
        doc.id === 'ca-doc-egp56' ||
        doc.id === 'ca-doc-5' ||
        doc.referenceNo === 'EGP56RU55H' ||
        doc.tinOrRef === 'EGP56RU55H' ||
        doc.referenceNo === 'WPD-CAN-55102' ||
        doc.tinOrRef === 'WPD-CAN-55102';
      if (
        isTargetDoc &&
        (!doc.attachedDocuments || doc.attachedDocuments.length === 0 || !doc.documentFileUrl)
      ) {
        updated = true;
        return {
          ...doc,
          documentFileName: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
          documentFileUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
          attachedDocuments: [
            {
              id: `att-ca-${doc.id || 'doc'}-pdf`,
              name: 'Canada Visa Application - MD IBRAHIM KHALIL MOZUMDER.pdf',
              size: '737 KB',
              type: 'pdf',
              dataUrl: '/uploads/Canada_Visa_Application_MD_IBRAHIM_KHALIL_MOZUMDER.pdf',
              sectionTag: 'Work Permit Documents (ওয়ার্ক পারমিট)',
              isPrimary: true,
              uploadDate: '2026-03-02',
            },
          ],
        };
      }
      return doc;
    });
    if (updated) {
      writeJsonFile(CANADA_DOCS_FILE, existingCaDocs);
      console.log('[Server Storage] Updated ca-doc-egp56 and ca-doc-5 with 11-page Canada Visa Application PDF in canada_documents.json');
    }
  }

  const existingMenuItems = readJsonFile<any[]>(MENU_ITEMS_FILE, []);
  if (!existingMenuItems || existingMenuItems.length === 0) {
    writeJsonFile(MENU_ITEMS_FILE, INITIAL_MENU_ITEMS);
    console.log('[Server Storage] Seeded menu_items.json with initial items');
  }

  const existingCaMenuItems = readJsonFile<any[]>(CANADA_MENU_ITEMS_FILE, []);
  if (!existingCaMenuItems || existingCaMenuItems.length === 0) {
    writeJsonFile(CANADA_MENU_ITEMS_FILE, INITIAL_CANADA_MENU_ITEMS);
    console.log('[Server Storage] Seeded canada_menu_items.json with initial items');
  }
}

seedServerStorageIfEmpty();

function mergeAttachedDocsLists(serverAtt: any[] = [], incomingAtt: any[] = [], preferIncoming = false): any[] {
  if (preferIncoming) {
    return Array.isArray(incomingAtt) ? incomingAtt : [];
  }
  const map = new Map<string, any>();
  const addItem = (d: any) => {
    if (!d) return;
    const key = d.id || `${d.sectionTag || 'default'}_${d.name || ''}_${d.dataUrl || ''}`.toLowerCase();
    if (!map.has(key)) {
      map.set(key, d);
    }
  };
  (Array.isArray(serverAtt) ? serverAtt : []).forEach(addItem);
  (Array.isArray(incomingAtt) ? incomingAtt : []).forEach(addItem);
  return Array.from(map.values());
}

async function startServer() {
  const app = express();

  // Allow up to 60MB for posts containing attached documents / scanned PDFs
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // CORS headers & no-cache for APIs for multi-device cross-origin support
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.path.startsWith('/api/')) {
      res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', '0');
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Static uploads serving for attached PDFs and scanned documents
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/uploads', express.static(PUBLIC_UPLOADS));
  // Explicit 404 for missing /uploads/* so SPA catch-all never returns index.html as PDF bytes
  app.use('/uploads', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Uploaded document file not found' });
  });

  // =========================================================================
  // API: DIRECT FILE UPLOAD (Fast, persists directly to disk on server)
  // =========================================================================
  app.post('/api/upload-file', (req: Request, res: Response) => {
    try {
      const { fileName, fileData, type } = req.body || {};
      if (!fileData || typeof fileData !== 'string') {
        res.status(400).json({ error: 'Missing fileData' });
        return;
      }
      const safeName = (fileName || `upload_${Date.now()}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileUrl = saveBase64ToFile(fileData, safeName);
      const isPdf = fileUrl.endsWith('.pdf') || type === 'pdf';
      res.json({
        success: true,
        fileName: fileName || safeName,
        fileUrl,
        type: isPdf ? 'pdf' : (type || 'other'),
      });
    } catch (err) {
      console.error('Upload endpoint error:', err);
      res.status(500).json({ error: 'Failed to process file upload' });
    }
  });

  // =========================================================================
  // API: AUSTRALIA POSTS (Atomic upsert + Merge-safe multi-device persistence)
  // =========================================================================
  app.get('/api/posts', (_req: Request, res: Response) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    const deleted = getDeletedIds();
    res.json({ success: true, posts, deletedIds: deleted.posts });
  });

  // Atomic single-post create/update endpoint — NEVER overwrites other devices' posts!
  app.post('/api/posts/upsert', (req: Request, res: Response) => {
    const rawPost = req.body?.post || req.body;
    if (!rawPost || !rawPost.id) {
      res.status(400).json({ error: 'Expected post object with id' });
      return;
    }
    const processed = processBase64InDoc(rawPost);
    clearDeletedId('posts', processed.id);

    const existingPosts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    const idx = existingPosts.findIndex((p) => p.id === processed.id);
    let updatedPosts: any[];
    if (idx !== -1) {
      updatedPosts = existingPosts.map((p, i) => (i === idx ? { ...p, ...processed } : p));
    } else {
      updatedPosts = [processed, ...existingPosts];
    }

    const saved = writeJsonFile(POSTS_FILE, updatedPosts);

    try {
      const ref = processed.refNumber || processed.id;
      if (Array.isArray(processed.attachedDocuments)) {
        processed.attachedDocuments.forEach((att: any) => {
          crossSyncAttachedDocToBoth(ref, att, processed.candidateName, processed.passportNumber);
        });
      }
    } catch (e) {
      console.warn('Cross sync from post upsert error:', e);
    }

    const latestPosts = readJsonFile<any[]>(POSTS_FILE, updatedPosts);
    res.json({ success: saved, post: processed, posts: latestPosts });
  });

  // Delete a single Australia post safely across all devices
  app.delete('/api/posts/:id', (req: Request, res: Response) => {
    const targetId = req.params.id;
    const existingPosts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    const filtered = existingPosts.filter((p) => p.id !== targetId);
    recordDeletedIds('posts', [targetId]);
    const saved = writeJsonFile(POSTS_FILE, filtered);
    res.json({ success: saved, posts: filtered, deletedIds: getDeletedIds().posts });
  });

  // Delete all Australia posts explicitly
  app.post('/api/posts/delete-all', (_req: Request, res: Response) => {
    const existingPosts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    recordDeletedIds('posts', existingPosts.map((p) => p.id).filter(Boolean));
    const saved = writeJsonFile(POSTS_FILE, []);
    res.json({ success: saved, posts: [], deletedIds: getDeletedIds().posts });
  });

  // Bulk sync / save Australia posts (SMART MERGE by id — preserves other devices' posts unless ?replace=true)
  app.post('/api/posts', (req: Request, res: Response) => {
    const rawPosts = Array.isArray(req.body) ? req.body : req.body?.posts;
    if (!Array.isArray(rawPosts)) {
      res.status(400).json({ error: 'Expected an array of posts' });
      return;
    }
    const incoming = rawPosts.map(processBase64InDoc);
    const forceReplace = req.query.replace === 'true';

    let finalPosts: any[];
    if (forceReplace) {
      finalPosts = incoming;
    } else {
      const existing = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
      const deletedSet = new Set(getDeletedIds().posts);
      const mergedMap = new Map<string, any>();

      // Keep existing server records first (preserving other devices' posts!)
      existing.forEach((p) => {
        if (p && p.id && !deletedSet.has(p.id)) {
          mergedMap.set(p.id, p);
        }
      });

      // Merge incoming posts into map without erasing existing ones
      incoming.forEach((p) => {
        if (!p || !p.id) return;
        if (deletedSet.has(p.id)) return; // Skip already-deleted posts from stale device caches
        const prev = mergedMap.get(p.id);
        if (prev) {
          mergedMap.set(p.id, {
            ...prev,
            ...p,
            attachedDocuments: mergeAttachedDocsLists(prev.attachedDocuments, p.attachedDocuments, false),
          });
        } else {
          mergedMap.set(p.id, p);
        }
      });

      finalPosts = Array.from(mergedMap.values());
    }

    const saved = writeJsonFile(POSTS_FILE, finalPosts);

    try {
      finalPosts.forEach((p: any) => {
        const ref = p.refNumber || p.id;
        if (Array.isArray(p.attachedDocuments)) {
          p.attachedDocuments.forEach((att: any) => {
            crossSyncAttachedDocToBoth(ref, att, p.candidateName, p.passportNumber);
          });
        }
      });
    } catch (e) {
      console.warn('Cross sync from posts error:', e);
    }

    res.json({ success: saved, count: finalPosts.length, posts: readJsonFile<any[]>(POSTS_FILE, finalPosts) });
  });

  // =========================================================================
  // API: CANADA DOCUMENTS (Atomic upsert + Merge-safe multi-device persistence)
  // =========================================================================
  app.get('/api/canada-documents', (_req: Request, res: Response) => {
    const docs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    const deleted = getDeletedIds();
    res.json({ success: true, documents: docs, deletedIds: deleted.canada });
  });

  // Atomic single-document create/update endpoint — NEVER overwrites other devices' docs!
  app.post('/api/canada-documents/upsert', (req: Request, res: Response) => {
    const rawDoc = req.body?.document || req.body;
    if (!rawDoc || !rawDoc.id) {
      res.status(400).json({ error: 'Expected document object with id' });
      return;
    }
    const processed = processBase64InDoc(rawDoc);
    clearDeletedId('canada', processed.id);

    const existingDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    const idx = existingDocs.findIndex((d) => d.id === processed.id);
    let updatedDocs: any[];
    if (idx !== -1) {
      updatedDocs = existingDocs.map((d, i) => (i === idx ? { ...d, ...processed } : d));
    } else {
      updatedDocs = [processed, ...existingDocs];
    }

    const saved = writeJsonFile(CANADA_DOCS_FILE, updatedDocs);

    try {
      const ref = processed.tinOrRef || processed.referenceNo || processed.idNumber || processed.id;
      if (Array.isArray(processed.attachedDocuments)) {
        processed.attachedDocuments.forEach((att: any) => {
          crossSyncAttachedDocToBoth(ref, att, processed.candidateName, processed.passportNumber);
        });
      }
    } catch (e) {
      console.warn('Cross sync from canada upsert error:', e);
    }

    const latestDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, updatedDocs);
    res.json({ success: saved, document: processed, documents: latestDocs });
  });

  // Delete a single Canada document safely across all devices
  app.delete('/api/canada-documents/:id', (req: Request, res: Response) => {
    const targetId = req.params.id;
    const existingDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    const filtered = existingDocs.filter((d) => d.id !== targetId);
    recordDeletedIds('canada', [targetId]);
    const saved = writeJsonFile(CANADA_DOCS_FILE, filtered);
    res.json({ success: saved, documents: filtered, deletedIds: getDeletedIds().canada });
  });

  // Delete all Canada documents explicitly
  app.post('/api/canada-documents/delete-all', (_req: Request, res: Response) => {
    const existingDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    recordDeletedIds('canada', existingDocs.map((d) => d.id).filter(Boolean));
    const saved = writeJsonFile(CANADA_DOCS_FILE, []);
    res.json({ success: saved, documents: [], deletedIds: getDeletedIds().canada });
  });

  // Bulk sync / save Canada documents (SMART MERGE by id — preserves other devices' docs unless ?replace=true)
  app.post('/api/canada-documents', (req: Request, res: Response) => {
    const rawDocs = Array.isArray(req.body) ? req.body : req.body?.documents;
    if (!Array.isArray(rawDocs)) {
      res.status(400).json({ error: 'Expected an array of canada documents' });
      return;
    }
    const incoming = rawDocs.map(processBase64InDoc);
    const forceReplace = req.query.replace === 'true';

    let finalDocs: any[];
    if (forceReplace) {
      finalDocs = incoming;
    } else {
      const existing = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
      const deletedSet = new Set(getDeletedIds().canada);
      const mergedMap = new Map<string, any>();

      existing.forEach((d) => {
        if (d && d.id && !deletedSet.has(d.id)) {
          mergedMap.set(d.id, d);
        }
      });

      incoming.forEach((d) => {
        if (!d || !d.id) return;
        if (deletedSet.has(d.id)) return;
        const prev = mergedMap.get(d.id);
        if (prev) {
          mergedMap.set(d.id, {
            ...prev,
            ...d,
            attachedDocuments: mergeAttachedDocsLists(prev.attachedDocuments, d.attachedDocuments, false),
          });
        } else {
          mergedMap.set(d.id, d);
        }
      });

      finalDocs = Array.from(mergedMap.values());
    }

    const saved = writeJsonFile(CANADA_DOCS_FILE, finalDocs);

    try {
      finalDocs.forEach((c: any) => {
        const ref = c.tinOrRef || c.referenceNo || c.idNumber;
        if (Array.isArray(c.attachedDocuments)) {
          c.attachedDocuments.forEach((att: any) => {
            crossSyncAttachedDocToBoth(ref, att, c.candidateName, c.passportNumber);
          });
        }
      });
    } catch (e) {
      console.warn('Cross sync from canada docs error:', e);
    }

    res.json({ success: saved, count: finalDocs.length, documents: readJsonFile<any[]>(CANADA_DOCS_FILE, finalDocs) });
  });

  // Helper to sync an attached document to both Canada documents and Australia posts
  function crossSyncAttachedDocToBoth(
    refNumberOrTin: string,
    attachedDoc: any,
    clientName?: string,
    passportNo?: string
  ) {
    if (!refNumberOrTin && !clientName && !passportNo) return;
    const cleanRef = String(refNumberOrTin || '').toLowerCase().replace(/[-\s_./#:]/g, '');
    const cleanName = String(clientName || '').toLowerCase().replace(/[-\s_./#:]/g, '');
    const cleanPass = String(passportNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');

    // 1. Sync to Canada Documents
    try {
      const caDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
      let caChanged = false;
      const updatedCa = caDocs.map((c) => {
        const cTin = (c.tinOrRef || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const cRef = (c.referenceNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const cId = (c.idNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const cName = (c.candidateName || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const cPass = (c.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');

        const isMatch =
          (cleanRef && (cTin === cleanRef || cRef === cleanRef || cId === cleanRef)) ||
          (cleanPass && cPass && cPass === cleanPass) ||
          (cleanName && cName && cName.length > 5 && (cName.includes(cleanName) || cleanName.includes(cName)));

        if (isMatch) {
          const existingList = Array.isArray(c.attachedDocuments) ? [...c.attachedDocuments] : [];
          // Deduplicate ONLY by exact id or same (name + sectionTag). NEVER by dataUrl alone!
          const alreadyHas = existingList.some(
            (d) =>
              (attachedDoc.id && d.id === attachedDoc.id) ||
              (d.name === attachedDoc.name && d.sectionTag === attachedDoc.sectionTag)
          );
          if (!alreadyHas) {
            caChanged = true;
            if (attachedDoc.isPrimary) {
              existingList.forEach((d) => (d.isPrimary = false));
            }
            return {
              ...c,
              attachedDocuments: [...existingList, attachedDoc],
              documentFileUrl: attachedDoc.isPrimary ? attachedDoc.dataUrl : (c.documentFileUrl || attachedDoc.dataUrl),
              documentFileName: attachedDoc.isPrimary ? attachedDoc.name : (c.documentFileName || attachedDoc.name),
            };
          }
        }
        return c;
      });
      if (caChanged) {
        writeJsonFile(CANADA_DOCS_FILE, updatedCa);
      }
    } catch (e) {
      console.warn('Cross sync to Canada error:', e);
    }

    // 2. Sync to Australia Posts
    try {
      const posts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
      let pChanged = false;
      const updatedPosts = posts.map((p) => {
        const pRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const pId = (p.id || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const pName = (p.candidateName || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');

        const isMatch =
          (cleanRef && (pRef === cleanRef || pId === cleanRef)) ||
          (cleanPass && pPass && pPass === cleanPass) ||
          (cleanName && pName && pName.length > 5 && (pName.includes(cleanName) || cleanName.includes(pName)));

        if (isMatch) {
          const existingList = Array.isArray(p.attachedDocuments) ? [...p.attachedDocuments] : [];
          // Deduplicate ONLY by exact id or same (name + sectionTag). NEVER by dataUrl alone!
          const alreadyHas = existingList.some(
            (d) =>
              (attachedDoc.id && d.id === attachedDoc.id) ||
              (d.name === attachedDoc.name && d.sectionTag === attachedDoc.sectionTag)
          );
          if (!alreadyHas) {
            pChanged = true;
            if (attachedDoc.isPrimary) {
              existingList.forEach((d) => (d.isPrimary = false));
            }
            return {
              ...p,
              attachedDocuments: [...existingList, attachedDoc],
            };
          }
        }
        return p;
      });
      if (pChanged) {
        writeJsonFile(POSTS_FILE, updatedPosts);
      }
    } catch (e) {
      console.warn('Cross sync to Australia error:', e);
    }
  }

  // Direct endpoint to attach a new PDF to an existing Canada post with section tag
  app.post('/api/canada-documents/add-attached-doc', (req: Request, res: Response) => {
    const { docId, referenceNo, candidateName, passportNumber } = req.body || {};
    const attachedDocRaw = req.body?.attachedDoc || req.body?.doc;
    if (!attachedDocRaw || (!docId && !referenceNo)) {
      res.status(400).json({ error: 'Missing attachedDoc/doc or document identifier (docId/referenceNo)' });
      return;
    }

    let attachedDoc = { ...attachedDocRaw };
    if (attachedDoc.dataUrl && attachedDoc.dataUrl.startsWith('data:')) {
      attachedDoc.dataUrl = saveBase64ToFile(attachedDoc.dataUrl, attachedDoc.name || 'document.pdf');
    }
    attachedDoc.type = normalizeAttachedType(attachedDoc, attachedDoc.dataUrl);
    if (!attachedDoc.id) {
      attachedDoc.id = `att-ca-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const docs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    const cleanRef = String(referenceNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');

    const targetIdx = docs.findIndex((d) => {
      if (docId && d.id === docId) return true;
      if (cleanRef) {
        const dTin = (d.tinOrRef || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const dRef = (d.referenceNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const dId = (d.idNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const dVrf = (d.verificationIdNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const dTrn = (d.transitionIdNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const dPass = (d.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const dOff = (d.officialDocNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        if (
          dTin === cleanRef ||
          dRef === cleanRef ||
          dId === cleanRef ||
          dVrf === cleanRef ||
          dTrn === cleanRef ||
          dPass === cleanRef ||
          dOff === cleanRef
        ) {
          return true;
        }
      }
      if (passportNumber) {
        const pClean = passportNumber.toLowerCase().replace(/[-\s_./#:]/g, '');
        const dPass = (d.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        if (pClean && dPass === pClean) return true;
      }
      return false;
    });

    if (targetIdx === -1) {
      const targetRef = referenceNo || docId;
      crossSyncAttachedDocToBoth(targetRef, attachedDoc, candidateName, passportNumber);
      res.json({ success: true, message: 'Attached and synced across records' });
      return;
    }

    const currentDoc = docs[targetIdx];
    const currentAttached = Array.isArray(currentDoc.attachedDocuments) ? [...currentDoc.attachedDocuments] : [];

    if (!attachedDoc.sectionTag) {
      attachedDoc.sectionTag = currentDoc.mainTitle || 'Work Permit Documents (ওয়ার্ক পারমিট)';
    }

    if (attachedDoc.isPrimary) {
      currentAttached.forEach((d) => (d.isPrimary = false));
    }

    const updatedAttached = [...currentAttached, attachedDoc];
    docs[targetIdx] = {
      ...currentDoc,
      attachedDocuments: updatedAttached,
      documentFileUrl: attachedDoc.isPrimary ? attachedDoc.dataUrl : (currentDoc.documentFileUrl || attachedDoc.dataUrl),
      documentFileName: attachedDoc.isPrimary ? attachedDoc.name : (currentDoc.documentFileName || attachedDoc.name),
    };

    const saved = writeJsonFile(CANADA_DOCS_FILE, docs);

    const targetRef = currentDoc.tinOrRef || currentDoc.referenceNo || currentDoc.idNumber || referenceNo;
    crossSyncAttachedDocToBoth(
      targetRef,
      attachedDoc,
      currentDoc.candidateName || candidateName,
      currentDoc.passportNumber || passportNumber
    );

    res.json({ success: saved, document: docs[targetIdx] });
  });

  // Direct endpoint to attach a new PDF to an Australia post with section tag
  app.post('/api/posts/add-attached-doc', (req: Request, res: Response) => {
    const { postId, refNumber, candidateName, passportNumber } = req.body || {};
    const attachedDocRaw = req.body?.attachedDoc || req.body?.doc;
    if (!attachedDocRaw || (!postId && !refNumber)) {
      res.status(400).json({ error: 'Missing attachedDoc/doc or post identifier (postId/refNumber)' });
      return;
    }

    let attachedDoc = { ...attachedDocRaw };
    if (attachedDoc.dataUrl && attachedDoc.dataUrl.startsWith('data:')) {
      attachedDoc.dataUrl = saveBase64ToFile(attachedDoc.dataUrl, attachedDoc.name || 'document.pdf');
    }
    attachedDoc.type = normalizeAttachedType(attachedDoc, attachedDoc.dataUrl);
    if (!attachedDoc.id) {
      attachedDoc.id = `att-au-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const posts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    const cleanRef = String(refNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');

    const targetIdx = posts.findIndex((p) => {
      if (postId && p.id === postId) return true;
      if (cleanRef) {
        const pRef = (p.refNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const pId = (p.id || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const pVrf = (p.verificationIdNo || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        if (pRef === cleanRef || pId === cleanRef || pVrf === cleanRef || pPass === cleanRef) {
          return true;
        }
      }
      if (passportNumber) {
        const passClean = passportNumber.toLowerCase().replace(/[-\s_./#:]/g, '');
        const pPass = (p.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        if (passClean && pPass === passClean) return true;
      }
      return false;
    });

    if (targetIdx === -1) {
      const targetRef = refNumber || postId;
      crossSyncAttachedDocToBoth(targetRef, attachedDoc, candidateName, passportNumber);
      res.json({ success: true, message: 'Attached and synced across records' });
      return;
    }

    const currentPost = posts[targetIdx];
    const currentAttached = Array.isArray(currentPost.attachedDocuments) ? [...currentPost.attachedDocuments] : [];

    if (!attachedDoc.sectionTag) {
      attachedDoc.sectionTag = currentPost.category || 'Australia Work Permit Documents';
    }

    if (attachedDoc.isPrimary) {
      currentAttached.forEach((d) => (d.isPrimary = false));
    }

    const updatedAttached = [...currentAttached, attachedDoc];
    posts[targetIdx] = {
      ...currentPost,
      attachedDocuments: updatedAttached,
    };

    const saved = writeJsonFile(POSTS_FILE, posts);

    const targetRef = currentPost.refNumber || refNumber;
    crossSyncAttachedDocToBoth(
      targetRef,
      attachedDoc,
      currentPost.candidateName || candidateName,
      currentPost.passportNumber || passportNumber
    );

    res.json({ success: saved, post: posts[targetIdx] });
  });

  // =========================================================================
  // API: 3-LINE MENU ITEMS (Australia + Canada)
  // =========================================================================
  app.get('/api/menu-items', (_req: Request, res: Response) => {
    const items = readJsonFile<any[]>(MENU_ITEMS_FILE, INITIAL_MENU_ITEMS);
    res.json({ success: true, items });
  });

  app.post('/api/menu-items', (req: Request, res: Response) => {
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'Expected an array of menu items' });
      return;
    }
    const saved = writeJsonFile(MENU_ITEMS_FILE, items);
    res.json({ success: saved, count: items.length });
  });

  app.get('/api/canada-menu-items', (_req: Request, res: Response) => {
    const items = readJsonFile<any[]>(CANADA_MENU_ITEMS_FILE, INITIAL_CANADA_MENU_ITEMS);
    res.json({ success: true, items });
  });

  app.post('/api/canada-menu-items', (req: Request, res: Response) => {
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'Expected an array of canada menu items' });
      return;
    }
    const saved = writeJsonFile(CANADA_MENU_ITEMS_FILE, items);
    res.json({ success: saved, count: items.length });
  });

  // =========================================================================
  // API: SYNC ALL DATA IN ONE CALL (Used by mobile clients on boot & search)
  // =========================================================================
  app.get('/api/sync-all', (_req: Request, res: Response) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    const canadaDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    const menuItems = readJsonFile<any[]>(MENU_ITEMS_FILE, INITIAL_MENU_ITEMS);
    const canadaMenuItems = readJsonFile<any[]>(CANADA_MENU_ITEMS_FILE, INITIAL_CANADA_MENU_ITEMS);
    const deletedIds = getDeletedIds();
    res.json({
      success: true,
      timestamp: Date.now(),
      posts,
      canadaDocs,
      menuItems,
      canadaMenuItems,
      deletedIds,
    });
  });

  // Comprehensive semantic section matcher for cross-device searches
  function isSectionMatch(tagOrName?: string, targetSection?: string): boolean {
    if (!tagOrName || !targetSection) return false;
    const tagLower = tagOrName.toLowerCase();
    const targetLower = targetSection.toLowerCase();

    // Direct substring or inclusion
    const cleanTag = tagLower.replace(/[-\s_./#:]/g, '');
    const cleanTarget = targetLower.replace(/[-\s_./#:]/g, '');
    if (cleanTag.includes(cleanTarget) || cleanTarget.includes(cleanTag)) {
      return true;
    }

    // Semantic category groupings
    const rules: { keywords: string[]; synonyms: string[] }[] = [
      {
        keywords: ['offer', 'letter', 'contract', 'appointment', 'অফার'],
        synonyms: ['offer', 'letter', 'contract', 'job-confirmation', 'appointment', 'অফার'],
      },
      {
        keywords: ['biometric', 'vfs', 'fingerprint', 'বায়োমেট্রিক', 'ভিএফএস'],
        synonyms: ['biometric', 'vfs', 'enrollment', 'facial', 'biometric-vfs', 'বায়োমেট্রিক', 'ভিএফএস'],
      },
      {
        keywords: ['confirmation', 'job confirmation', 'sponsorship'],
        synonyms: ['confirmation', 'job-confirmation', 'sponsor', 'conformation'],
      },
      {
        keywords: ['work permit', 'permit', 'application', 'wpd', 'ওয়ার্ক পারমিট'],
        synonyms: ['work-permit', 'permit', 'employment application', 'work permit', 'ওয়ার্ক পারমিট'],
      },
      {
        keywords: ['medical', 'health', 'clinic', 'hospital', 'examination', 'মেডিকেল'],
        synonyms: ['medical', 'health', 'clinic', 'clearance', 'examination', 'doctor', 'মেডিকেল'],
      },
      {
        keywords: ['flight', 'ticket', 'air', 'pnr', 'airline', 'transit', 'বুকিং'],
        synonyms: ['flight', 'ticket', 'airline', 'itinerary', 'air-ticket', 'transit', 'booking', 'বুকিং'],
      },
      {
        keywords: ['tax', 'tfn', 'superannuation', 'revenue'],
        synonyms: ['tax', 'tfn', 'tin', 'superannuation', 'revenue', 'tax-cert'],
      },
      {
        keywords: ['insurance', 'bupa', 'medibank', 'ovhc', 'cover'],
        synonyms: ['insurance', 'bupa', 'medibank', 'health cover', 'ovhc', 'policy'],
      },
      {
        keywords: ['immi', 'immicard', 'card', 'evidence of immigration'],
        synonyms: ['immi', 'card', 'immicard', 'status'],
      },
      {
        keywords: ['visa', 'grant', 'vevo', 'approval', 'ভিসা'],
        synonyms: ['visa', 'grant', 'vevo', 'approval', 'authorized', 'ভিসা'],
      },
      {
        keywords: ['identity', 'passport', 'dossier', 'আইডেন্টিটি'],
        synonyms: ['identity', 'passport', 'dossier', 'particulars', 'আইডেন্টিটি'],
      },
    ];

    for (const rule of rules) {
      const targetHas = rule.keywords.some((k) => targetLower.includes(k));
      if (targetHas) {
        const tagHas = rule.synonyms.some((s) => tagLower.includes(s));
        if (tagHas) return true;
      }
    }

    const targetWords = targetLower.split(/[\s_./#:,()\-]+/).filter((w) => w.length >= 4);
    const tagWords = tagLower.split(/[\s_./#:,()\-]+/).filter((w) => w.length >= 4);
    for (const tw of targetWords) {
      if (tagWords.includes(tw)) return true;
    }

    return false;
  }

  // =========================================================================
  // API: DIRECT SEARCH (Cross-device instant verification lookup)
  // Guarantees that any query from phone 2, phone 3, PC, or tablet matches,
  // and aggregates ALL attached PDFs under that client across sections!
  // =========================================================================
  app.get('/api/search', (req: Request, res: Response) => {
    const rawQuery = String(req.query.q || '').trim();
    if (!rawQuery) {
      res.json({ found: false, result: null });
      return;
    }
    const targetSection = String(req.query.section || '').trim().toLowerCase();
    const preferredSource = String(req.query.source || '').trim().toLowerCase();

    const cleanQuery = rawQuery.toLowerCase().replace(/[-\s_./#:]/g, '');
    const queryLower = rawQuery.toLowerCase();

    const posts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    const canadaDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);

    const digitsQuery = cleanQuery.replace(/\D/g, '');

    const matchesClean = (val?: string) => {
      if (!val) return false;
      const clean = val.toLowerCase().replace(/[-\s_./#:]/g, '');
      if (clean === cleanQuery || clean.includes(cleanQuery)) {
        return true;
      }
      if (clean.length >= 6 && cleanQuery.includes(clean)) {
        return true;
      }
      if (digitsQuery && digitsQuery.length >= 4) {
        const valDigits = clean.replace(/\D/g, '');
        if (valDigits && (valDigits === digitsQuery || valDigits.includes(digitsQuery))) {
          return true;
        }
      }
      return false;
    };

    // Helper to test if a post matches the query
    const doesPostMatch = (p: any) => {
      const pCand = (p.candidateName || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      return (
        matchesClean(p.refNumber) ||
        matchesClean(p.verificationIdNo) ||
        matchesClean(p.passportNumber) ||
        matchesClean(p.id) ||
        pCand.includes(queryLower) ||
        matchesClean(pCand) ||
        pTitle.includes(queryLower) ||
        matchesClean(pTitle)
      );
    };

    // Helper to test if a Canada doc matches the query
    const doesCaMatch = (c: any) => {
      const cCand = (c.candidateName || '').toLowerCase();
      return (
        matchesClean(c.tinOrRef) ||
        matchesClean(c.idNumber) ||
        matchesClean(c.verificationIdNo) ||
        matchesClean(c.transitionIdNo) ||
        matchesClean(c.referenceNo) ||
        matchesClean(c.officialDocNumber) ||
        matchesClean(c.lmiaNumber) ||
        matchesClean(c.passportNumber) ||
        matchesClean(c.id) ||
        cCand.includes(queryLower) ||
        matchesClean(cCand) ||
        matchesClean(c.mainTitle)
      );
    };

    // Pass 1: Find all direct query matches in Australia posts and Canada documents
    const matchedPostsDirect = posts.filter(doesPostMatch);
    const matchedCanadaDirect = canadaDocs.filter(doesCaMatch);

    // Pass 2: Expand to ALL records belonging to the same matched client (across sections & countries)
    const matchedPassports = new Set<string>();
    const matchedNames = new Set<string>();
    const matchedRefKeys = new Set<string>();

    const collectIdentityKeys = (rec: any) => {
      if (!rec) return;
      const pass = (rec.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      if (pass.length >= 5) matchedPassports.add(pass);
      const name = (rec.candidateName || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      if (name.length >= 5) matchedNames.add(name);
      [rec.refNumber, rec.tinOrRef, rec.referenceNo, rec.idNumber].forEach((val) => {
        const cleanVal = (val || '').toLowerCase().replace(/[-\s_./#:]/g, '');
        if (cleanVal.length >= 4) matchedRefKeys.add(cleanVal);
      });
    };

    matchedPostsDirect.forEach(collectIdentityKeys);
    matchedCanadaDirect.forEach(collectIdentityKeys);

    const isSameClientRecord = (rec: any) => {
      if (!rec) return false;
      const recPass = (rec.passportNumber || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      const recName = (rec.candidateName || '').toLowerCase().replace(/[-\s_./#:]/g, '');
      // Check ref key overlap
      const recRefs = [rec.refNumber, rec.tinOrRef, rec.referenceNo, rec.idNumber]
        .map((v) => (v || '').toLowerCase().replace(/[-\s_./#:]/g, ''))
        .filter((v) => v.length >= 4);
      if (recRefs.some((r) => matchedRefKeys.has(r))) return true;
      // Check passport overlap (only if names don't conflict)
      if (recPass && matchedPassports.has(recPass)) {
        if (!recName || matchedNames.size === 0 || matchedNames.has(recName)) {
          return true;
        }
      }
      // Check candidate name overlap
      if (recName && matchedNames.has(recName)) return true;
      return false;
    };

    const matchedPosts = [...matchedPostsDirect];
    const seenPostIds = new Set(matchedPosts.map((p) => p.id));
    posts.forEach((p) => {
      if (p && !seenPostIds.has(p.id) && isSameClientRecord(p)) {
        seenPostIds.add(p.id);
        matchedPosts.push(p);
      }
    });

    const matchedCanada = [...matchedCanadaDirect];
    const seenCaIds = new Set(matchedCanada.map((c) => c.id));
    canadaDocs.forEach((c) => {
      if (c && !seenCaIds.has(c.id) && isSameClientRecord(c)) {
        seenCaIds.add(c.id);
        matchedCanada.push(c);
      }
    });

    // If matches found in either Canada or Australia, merge attachments across ALL client records
    if (matchedCanada.length > 0 || matchedPosts.length > 0) {
      // 1. Gather all attached documents across all matched records
      const allAttached: any[] = [];
      const seenKeys = new Set<string>();
      const seenIds = new Set<string>();

      const addAttachedDoc = (doc: any, parentSection?: string) => {
        if (!doc || !doc.dataUrl || doc.dataUrl === '#') return;
        const normalizedType = normalizeAttachedType(doc, doc.dataUrl);
        const normalizedSection = doc.sectionTag || parentSection || 'Work Permit Documents (ওয়ার্ক পারমিট)';
        const dedupKey = `${normalizedSection}_${doc.name || ''}_${doc.dataUrl || ''}`.trim().toLowerCase();
        if (doc.id && seenIds.has(doc.id)) return;
        if (seenKeys.has(dedupKey)) return;
        if (doc.id) seenIds.add(doc.id);
        seenKeys.add(dedupKey);
        allAttached.push({
          ...doc,
          type: normalizedType,
          sectionTag: normalizedSection,
        });
      };

      matchedCanada.forEach((c) => {
        const parentSec = c.mainTitle || c.subMenu || 'Work Permit Documents (ওয়ার্ক পারমিট)';
        if (Array.isArray(c.attachedDocuments)) {
          c.attachedDocuments.forEach((att: any) => addAttachedDoc(att, parentSec));
        }
        if (c.documentFileUrl && c.documentFileUrl !== '#') {
          const alreadyUrl = allAttached.some((d) => d.dataUrl === c.documentFileUrl);
          if (!alreadyUrl) {
            addAttachedDoc(
              {
                id: `ca-file-${c.id}`,
                name: c.documentFileName || `${c.mainTitle || 'Canada Document'}.pdf`,
                size: 'Official IRCC Document',
                type: normalizeAttachedType({ name: c.documentFileName }, c.documentFileUrl),
                dataUrl: c.documentFileUrl,
                sectionTag: parentSec,
                uploadDate: c.issueDate,
              },
              parentSec
            );
          }
        }
      });

      matchedPosts.forEach((p) => {
        const parentSec = p.category || p.title || 'Australia Work Permit Documents';
        if (Array.isArray(p.attachedDocuments)) {
          p.attachedDocuments.forEach((att: any) => addAttachedDoc(att, parentSec));
        }
        if (Array.isArray(p.galleryImages)) {
          p.galleryImages.forEach((imgUrl: string, idx: number) => {
            if (imgUrl && !imgUrl.includes('unsplash') && !allAttached.some((d) => d.dataUrl === imgUrl)) {
              addAttachedDoc(
                {
                  id: `gallery-doc-${p.id}-${idx}`,
                  name: `${p.title || 'Document'} - Scan ${idx + 1}`,
                  size: 'Official Image Record',
                  type: 'image',
                  dataUrl: imgUrl,
                  sectionTag: parentSec,
                  uploadDate: p.date,
                },
                parentSec
              );
            }
          });
        }
      });

      // 2. Select primary record base (preferring direct match first)
      let chosenRecord: any = null;
      let chosenSource: 'canada' | 'australia' = 'canada';

      if (preferredSource === 'australia' && matchedPostsDirect.length > 0) {
        chosenRecord = matchedPostsDirect[0];
        chosenSource = 'australia';
      } else if (preferredSource === 'canada' && matchedCanadaDirect.length > 0) {
        if (targetSection) {
          const catMatch = matchedCanadaDirect.find(
            (c) =>
              (c.categoryType && c.categoryType.toLowerCase().includes(targetSection)) ||
              (c.mainTitle && c.mainTitle.toLowerCase().includes(targetSection))
          );
          chosenRecord = catMatch || matchedCanadaDirect[0];
        } else {
          chosenRecord = matchedCanadaDirect[0];
        }
        chosenSource = 'canada';
      } else if (matchedCanada.length > 0) {
        if (targetSection) {
          const catMatch = matchedCanada.find(
            (c) =>
              (c.categoryType && c.categoryType.toLowerCase().includes(targetSection)) ||
              (c.mainTitle && c.mainTitle.toLowerCase().includes(targetSection))
          );
          chosenRecord = catMatch || matchedCanada[0];
        } else {
          chosenRecord = matchedCanada[0];
        }
        chosenSource = 'canada';
      } else if (matchedPosts.length > 0) {
        chosenRecord = matchedPosts[0];
        chosenSource = 'australia';
      }

      if (chosenRecord) {
        // 3. If a specific section was targeted, move matching attached document to top while keeping ALL others in serial!
        if (targetSection && allAttached.length > 0) {
          let matchedIdx = -1;
          allAttached.forEach((att, idx) => {
            if (isSectionMatch(att.sectionTag, targetSection) || isSectionMatch(att.name, targetSection)) {
              if (matchedIdx === -1) matchedIdx = idx;
            }
          });

          if (matchedIdx > 0) {
            const [targetDoc] = allAttached.splice(matchedIdx, 1);
            allAttached.unshift(targetDoc);
          }
        }

        if (allAttached.length > 0) {
          allAttached.forEach((att, idx) => {
            att.isPrimary = idx === 0;
          });
        }

        const consolidated = {
          ...chosenRecord,
          attachedDocuments: allAttached,
          documentFileUrl: allAttached[0]?.dataUrl || chosenRecord.documentFileUrl,
          documentFileName: allAttached[0]?.name || chosenRecord.documentFileName,
        };

        res.json({
          found: true,
          source: chosenSource,
          record: consolidated,
          totalAttachments: allAttached.length,
        });
        return;
      }
    }

    // 3. Search Commonwealth sample records (fallback for REF-928410, ED-78412-WA, GBR5829104, etc.)
    const matchPortal = SAMPLE_PORTAL_RECORDS.find((pr) => {
      const name = (pr.fullName || '').toLowerCase();
      return (
        matchesClean(pr.referenceNumber) ||
        matchesClean(pr.edNumber) ||
        matchesClean(pr.documentNumber) ||
        matchesClean(pr.verificationIdNo) ||
        matchesClean(pr.transitionIdNo) ||
        matchesClean(pr.insuranceNo) ||
        matchesClean(pr.immiCardNo) ||
        matchesClean(pr.ticketNumber) ||
        name.includes(queryLower) ||
        matchesClean(name)
      );
    });

    if (matchPortal) {
      res.json({ found: true, source: 'portal', record: matchPortal });
      return;
    }

    res.json({ found: false, result: null });
  });

  // =========================================================================
  // VITE / STATIC SERVING
  // =========================================================================
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BHP Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});
