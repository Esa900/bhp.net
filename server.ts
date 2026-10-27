import express, { Request, Response } from 'express';
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
const INITIAL_DEFAULT_POSTS: any[] = [];

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
    documentFileName: 'Canada_Work_Permit_Application_EGP56RU55H.pdf',
    notes: 'Application for a Work Permit (D Category). Verified and endorsed by BHP Canada & IRCC.',
    createdAt: '2026-03-02T10:00:00.000Z',
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
    tinOrRef: 'WPD-CAN-55102',
    idNumber: 'WPD-CAN-55102',
    verificationIdNo: 'VRF-CAN-55102',
    documentFileName: 'Canada_Work_Permit_Pending_WPD-CAN-55102.pdf',
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

// Auto-seed files on server boot
function seedServerStorageIfEmpty() {
  const existingPosts = readJsonFile<any[]>(POSTS_FILE, []);
  if (!existingPosts || existingPosts.length === 0) {
    writeJsonFile(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    console.log('[Server Storage] Seeded posts.json with initial records');
  }

  const existingCaDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, []);
  if (!existingCaDocs || existingCaDocs.length === 0) {
    writeJsonFile(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    console.log('[Server Storage] Seeded canada_documents.json with initial records');
  }

  const existingMenuItems = readJsonFile<any[]>(MENU_ITEMS_FILE, []);
  if (!existingMenuItems || existingMenuItems.length === 0) {
    writeJsonFile(MENU_ITEMS_FILE, INITIAL_MENU_ITEMS);
    console.log('[Server Storage] Seeded menu_items.json with initial items');
  }
}

seedServerStorageIfEmpty();

async function startServer() {
  const app = express();

  // Allow up to 60MB for posts containing attached documents / scanned PDFs
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // CORS headers for multi-device cross-origin support
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (_req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // =========================================================================
  // API: AUSTRALIA POSTS (Cross-device persistence)
  // =========================================================================
  app.get('/api/posts', (_req: Request, res: Response) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    res.json({ success: true, posts });
  });

  app.post('/api/posts', (req: Request, res: Response) => {
    const posts = Array.isArray(req.body) ? req.body : req.body?.posts;
    if (!Array.isArray(posts)) {
      res.status(400).json({ error: 'Expected an array of posts' });
      return;
    }
    const saved = writeJsonFile(POSTS_FILE, posts);
    res.json({ success: saved, count: posts.length });
  });

  // =========================================================================
  // API: CANADA DOCUMENTS (Cross-device persistence)
  // =========================================================================
  app.get('/api/canada-documents', (_req: Request, res: Response) => {
    const docs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    res.json({ success: true, documents: docs });
  });

  app.post('/api/canada-documents', (req: Request, res: Response) => {
    const docs = Array.isArray(req.body) ? req.body : req.body?.documents;
    if (!Array.isArray(docs)) {
      res.status(400).json({ error: 'Expected an array of canada documents' });
      return;
    }
    const saved = writeJsonFile(CANADA_DOCS_FILE, docs);
    res.json({ success: saved, count: docs.length });
  });

  // =========================================================================
  // API: 3-LINE MENU ITEMS
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

  // =========================================================================
  // API: SYNC ALL DATA IN ONE CALL (Used by mobile clients on boot & search)
  // =========================================================================
  app.get('/api/sync-all', (_req: Request, res: Response) => {
    const posts = readJsonFile<any[]>(POSTS_FILE, INITIAL_DEFAULT_POSTS);
    const canadaDocs = readJsonFile<any[]>(CANADA_DOCS_FILE, INITIAL_CANADA_DOCUMENTS);
    const menuItems = readJsonFile<any[]>(MENU_ITEMS_FILE, INITIAL_MENU_ITEMS);
    res.json({
      success: true,
      timestamp: Date.now(),
      posts,
      canadaDocs,
      menuItems,
    });
  });

  // =========================================================================
  // API: DIRECT SEARCH (Cross-device instant verification lookup)
  // Guarantees that any query from phone 2, phone 3, PC, or tablet matches!
  // =========================================================================
  app.get('/api/search', (req: Request, res: Response) => {
    const rawQuery = String(req.query.q || '').trim();
    if (!rawQuery) {
      res.json({ found: false, result: null });
      return;
    }
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

    // 1. Search Australia posts (Exact & Partial across refNumber, id, verificationIdNo, passportNumber, candidateName)
    const matchPost = posts.find((p) => {
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
    });

    if (matchPost) {
      res.json({ found: true, source: 'australia', record: matchPost });
      return;
    }

    // 2. Search Canada docs
    const matchCa = canadaDocs.find((c) => {
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
    });

    if (matchCa) {
      res.json({ found: true, source: 'canada', record: matchCa });
      return;
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
