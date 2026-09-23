import { JobCategory, JobRequirement, JobApplication } from '../types/jobCircular';

export const JOB_CATEGORIES_STORAGE_KEY = 'bhp_job_categories_v1';
export const JOB_REQUIREMENTS_STORAGE_KEY = 'bhp_job_requirements_v1';
export const JOB_APPLICATIONS_STORAGE_KEY = 'bhp_job_applications_v1';

export const JOB_CATEGORIES_UPDATED_EVENT = 'bhp_job_categories_updated';
export const JOB_REQUIREMENTS_UPDATED_EVENT = 'bhp_job_requirements_updated';
export const JOB_APPLICATIONS_UPDATED_EVENT = 'bhp_job_applications_updated';

export const DEFAULT_JOB_CATEGORIES: JobCategory[] = [
  { id: 'cat-electrician', name: 'Electrician', order: 1, createdAt: '2026-01-10' },
  { id: 'cat-cleaner', name: 'Cleaner', order: 2, createdAt: '2026-01-10' },
  { id: 'cat-plumber', name: 'Plumber', order: 3, createdAt: '2026-01-10' },
  { id: 'cat-mechanical', name: 'Mechanical', order: 4, createdAt: '2026-01-10' },
  { id: 'cat-food-packaging', name: 'Food Packaging', order: 5, createdAt: '2026-01-10' },
  { id: 'cat-driver', name: 'Driver', order: 6, createdAt: '2026-01-10' },
  { id: 'cat-construction', name: 'Construction', order: 7, createdAt: '2026-01-10' },
  { id: 'cat-housekeeping', name: 'Housekeeping', order: 8, createdAt: '2026-01-10' },
  { id: 'cat-shop-retail', name: 'Shop / Retail', order: 9, createdAt: '2026-01-10' },
  { id: 'cat-it-tech', name: 'IT & Technology', order: 10, createdAt: '2026-01-10' },
];

export const DEFAULT_JOB_REQUIREMENTS: JobRequirement[] = [
  {
    id: 'req-electrician',
    categoryId: 'cat-electrician',
    categoryName: 'Electrician',
    jobTitle: 'Industrial Electrician & Wireman (ইলেকট্রিশিয়ান)',
    vacancy: '35 Posts (৩৫ জন)',
    salary: '$4,200 - $5,600 AUD / Month (৳৩,৩০,০০০ - ৳৪,৪০,০০০)',
    location: 'BHP Western Australia Sites & Regional Operations',
    dutyHours: '8 Hours / Day (Overtime allowed)',
    experience: '1-3 Years in Electrical Installation or Maintenance',
    ageLimit: '21 to 45 Years',
    education: 'SSC / Vocational / Diploma or Trade Training Certificate',
    requirements: [
      'Basic electrical wiring, switchboard installation and repair knowledge',
      'Familiarity with circuit diagrams, testing equipment and safety protocols',
      'Physical fitness for site operations and technical work',
      'Good teamwork and commitment to workplace safety standards',
    ],
    benefits: [
      'Free Accommodation (কোম্পানির ফ্রি আবাসন)',
      'Free Food / Food Allowance (ফ্রি খাবার বা খাবার ভাতা)',
      'Medical & Health Insurance (মেডিকেল ও হেলথ ইন্স্যুরেন্স)',
      'Annual Leave & Return Air Ticket (বার্ষিক ছুটি ও বিমান টিকেট)',
      'Overtime allowance as per company regulations',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `BHP গ্লোবাল অপারেশনের জন্য দক্ষ ও সহকারী ইলেকট্রিশিয়ান নিয়োগ করা হচ্ছে। নির্বাচিত প্রার্থীদের আধুনিক খনি ও ইনফ্রাস্ট্রাকচার প্রজেক্টে বিদ্যুৎ সংযোগ, ওয়্যারিং এবং রক্ষণাবেক্ষণ কাজের দায়িত্ব পালন করতে হবে। কোম্পানির নীতিমালা অনুযায়ী আকর্ষণীয় বেতন, সুযোগ-সুবিধা এবং নিরাপদ কর্মপরিবেশ প্রদান করা হবে।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-cleaner',
    categoryId: 'cat-cleaner',
    categoryName: 'Cleaner',
    jobTitle: 'Commercial & Facility Cleaner (ক্লিনার / পরিচ্ছন্নতাকর্মী)',
    vacancy: '50 Posts (৫০ জন)',
    salary: '$3,400 - $4,200 AUD / Month (৳২,৭০,০০০ - ৳৩,৩০,০০০)',
    location: 'BHP Operations Hubs, Camps & Facilities',
    dutyHours: '8 Hours / Day (Shift duty)',
    experience: 'Fresher or 6 months experience in cleaning/facility work',
    ageLimit: '20 to 45 Years',
    education: 'Class 8 / SSC pass (বাস্তব অভিজ্ঞতা অগ্রাধিকার পাবে)',
    requirements: [
      'Offices, camp accommodations and utility facilities cleaning',
      'Waste management, sanitization and floor maintenance',
      'Punctual, disciplined and physically capable',
      'Ability to follow hygiene standards and safety guidelines',
    ],
    benefits: [
      'Free Company Accommodation (বিনামূল্যে থাকার সুব্যবস্থা)',
      'Free Food Provided (ফ্রি খাবার)',
      'Full Health & Medical Cover (চিকিৎসা সুবিধা)',
      'Overtime Pay & Performance Bonus',
      'Annual leave with flight ticket',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `ক্যাম্প ও অফিস প্রাঙ্গণে পরিচ্ছন্নতা বজায় রাখার জন্য উদ্যমী কর্মী নিয়োগ চলছে। কোন জটিল অভিজ্ঞতা ছাড়াই স্বাস্থ্যবান ও পরিশ্রমী প্রার্থীরা সরাসরি আবেদন করতে পারবেন।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-plumber',
    categoryId: 'cat-plumber',
    categoryName: 'Plumber',
    jobTitle: 'Pipe Fitter & Plumber (প্লাম্বার ও পাইপ ফিটার)',
    vacancy: '25 Posts (২৫ জন)',
    salary: '$3,900 - $4,800 AUD / Month (৳৩,১০,০০০ - ৳৩,৮০,০০০)',
    location: 'BHP Construction & Camp Sites',
    dutyHours: '8 Hours / Day',
    experience: '1-2 Years in plumbing, drainage or pipe fitting',
    ageLimit: '21 to 45 Years',
    education: 'SSC / Trade Certificate or practical experience',
    requirements: [
      'Water supply line, drainage and sanitary fittings installation',
      'Pipe cutting, threading, welding/soldering and leak repairs',
      'Knowledge of plumbing blueprints and site safety rules',
    ],
    benefits: [
      'Free Housing & Living Amenities',
      'Nutritious meals provided daily',
      'Full medical coverage & insurance',
      'Regular overtime pay and annual bonus',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `BHP সাইট ও রেসিডেন্সিয়াল ইউনিটের পানির লাইন ও স্যানিটেশন সিস্টেম পরিচালনায় দক্ষ প্লাম্বার আহবান করা হচ্ছে।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-mechanical',
    categoryId: 'cat-mechanical',
    categoryName: 'Mechanical',
    jobTitle: 'Mechanical Technician & Assistant (মেকানিক্যাল টেকনিশিয়ান)',
    vacancy: '30 Posts (৩০ জন)',
    salary: '$4,500 - $5,800 AUD / Month (৳৩,৬০,০০০ - ৳৪,৬০,০০০)',
    location: 'Heavy Machinery Maintenance Workshops & Sites',
    dutyHours: '8 Hours / Day (Rotational shifts)',
    experience: '2+ Years in mechanical equipment or vehicle repair',
    ageLimit: '22 to 45 Years',
    education: 'Diploma in Mechanical / Vocational Trade Certificate',
    requirements: [
      'Maintenance of diesel generators, conveyors, pumps and engines',
      'Disassembly, cleaning and reassembly of mechanical parts',
      'Hand and power tool proficiency with adherence to strict safety',
    ],
    benefits: [
      'Modern camp accommodation with all facilities',
      'Meals, medical and emergency healthcare covered',
      'Overtime allowance and hazard compensation',
      'Annual airfare and vacation benefits',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `ভারী যন্ত্রপাতি ও প্ল্যান্ট অপারেশনে মেকানিক্যাল রক্ষণাবেক্ষণের জন্য উপযুক্ত প্রার্থী নিয়োগ করা হবে।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-food-packaging',
    categoryId: 'cat-food-packaging',
    categoryName: 'Food Packaging',
    jobTitle: 'Food Packaging & Warehouse Worker (ফুড প্যাকেজিং)',
    vacancy: '45 Posts (৪৫ জন)',
    salary: '$3,300 - $4,100 AUD / Month (৳২,৬০,০০০ - ৳৩,২০,০০০)',
    location: 'Catering Centers & Supply Distribution Hubs',
    dutyHours: '8 Hours / Day',
    experience: 'Fresher / Experienced both welcome',
    ageLimit: '19 to 42 Years',
    education: 'Minimum 8th Grade / SSC',
    requirements: [
      'Packing food rations, dry supplies and catering packages',
      'Labeling, quality inspection and stock organizing',
      'High hygiene and food safety standards awareness',
    ],
    benefits: [
      'Company provided accommodation and food',
      'Medical insurance and safety gear',
      'Overtime available on weekends',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `ক্যাটারিং ও ফুড সাপ্লাই চেইনে খাদ্যদ্রব্য বাছাই ও প্যাকেজিংয়ের জন্য সহজ কাজের সুযোগ।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-driver',
    categoryId: 'cat-driver',
    categoryName: 'Driver',
    jobTitle: 'Light & Heavy Vehicle Driver (ড্রাইভার)',
    vacancy: '40 Posts (৪০ জন)',
    salary: '$4,000 - $5,400 AUD / Month (৳৩,২০,০০০ - ৳৪,৩০,০০০)',
    location: 'Project Transport Hubs & Logistics Routes',
    dutyHours: '8-9 Hours / Day',
    experience: 'Valid Driving License + 2+ Years Driving Experience',
    ageLimit: '23 to 48 Years',
    education: 'SSC / Equivalent with Valid Driving License',
    requirements: [
      'Safe transport of passengers, staff and cargo between camps and sites',
      'Basic vehicle maintenance and daily pre-trip inspections',
      'Clean driving record and compliance with road safety laws',
    ],
    benefits: [
      'Free air-conditioned accommodation',
      'Quality food allowance / meals provided',
      'Full insurance and medical coverage',
      'Trip allowance and overtime pay',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `কোম্পানির বিভিন্ন রুটে গাড়ি চালানোর জন্য অভিজ্ঞ ড্রাইভার নিয়োগ চলছে। বৈধ ড্রাইভিং লাইসেন্স থাকা আবশ্যক।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-construction',
    categoryId: 'cat-construction',
    categoryName: 'Construction',
    jobTitle: 'Construction Laborer & Mason (কনস্ট্রাকশন কর্মী)',
    vacancy: '60 Posts (৬০ জন)',
    salary: '$3,500 - $4,400 AUD / Month (৳২,৮০,০০০ - ৳৩,৫০,০০০)',
    location: 'Civil Infrastructure & Mine Expansion Sites',
    dutyHours: '8 Hours / Day',
    experience: 'Fresher / Construction experience preferred',
    ageLimit: '20 to 45 Years',
    education: 'Class 8 / SSC (শারীরিক সক্ষমতা প্রধান যোগ্যতা)',
    requirements: [
      'Civil construction, scaffolding assistance, concrete work and masonry',
      'Material handling and site preparation',
      'Strict adherence to hard-hat and PPE site regulations',
    ],
    benefits: [
      'Free food and camp living quarters',
      'Accident & medical insurance',
      'Overtime allowance and performance bonuses',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `নির্মাণ প্রকল্পে কাজের জন্য উদ্যমী ও পরিশ্রমী নির্মাণ কর্মী আহবান করা হচ্ছে। সরাসরি আবেদন করুন।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-housekeeping',
    categoryId: 'cat-housekeeping',
    categoryName: 'Housekeeping',
    jobTitle: 'Accommodation & Camp Housekeeper (হাউজকিপিং)',
    vacancy: '35 Posts (৩৫ জন)',
    salary: '$3,400 - $4,200 AUD / Month (৳২,৭০,০০০ - ৳৩,৩০,০০০)',
    location: 'BHP Employee Living Quarters & Guest Lodges',
    dutyHours: '8 Hours / Day',
    experience: 'Hotel, lodge or camp housekeeping experience helpful',
    ageLimit: '20 to 44 Years',
    education: 'SSC / High School equivalent',
    requirements: [
      'Room cleaning, linen changing, bed making and supply replenishing',
      'Polite behavior and cooperative attitude with residents',
      'Maintaining spotless hygiene in living blocks',
    ],
    benefits: [
      'Free accommodation & all basic utilities',
      'Free daily meals from company cafeteria',
      'Medical benefits and overtime pay',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `ক্যাম্প ও গেস্ট লজের আবাসন ব্যবস্থাপনায় পরিপাটি ও উদ্যমী হাউজকিপিং স্টাফ নিয়োগ করা হচ্ছে।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-shop-retail',
    categoryId: 'cat-shop-retail',
    categoryName: 'Shop / Retail',
    jobTitle: 'Store Assistant & Cashier (শপ / রিটেইল স্টোর সহকারী)',
    vacancy: '20 Posts (২০ জন)',
    salary: '$3,600 - $4,500 AUD / Month (৳২,৯০,০০০ - ৳৩,৬০,০০০)',
    location: 'Camp Commissary, Supermarket & Retail Stores',
    dutyHours: '8 Hours / Day',
    experience: 'Customer service, retail or inventory experience preferred',
    ageLimit: '20 to 40 Years',
    education: 'SSC / HSC or equivalent',
    requirements: [
      'Stock display, shelf replenishment and billing assistance',
      'Customer hospitality and cashier register management',
      'Basic calculation and friendly communication skills',
    ],
    benefits: [
      'Free modern accommodation & food',
      'Store employee discounts & medical insurance',
      'Weekly off-day and annual paid leave',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `অভ্যন্তরীণ রিটেইল স্টোর ও সুপারমার্কেটে পণ্য প্রদর্শন ও বিক্রয় সহকারীর পদে আবেদন গ্রহণ করা হচ্ছে।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
  {
    id: 'req-it-tech',
    categoryId: 'cat-it-tech',
    categoryName: 'IT & Technology',
    jobTitle: 'IT Support & Hardware Assistant (আইটি ও টেকনোলজি)',
    vacancy: '15 Posts (১৫ জন)',
    salary: '$4,800 - $6,500 AUD / Month (৳৩,৮০,০০০ - ৳৫,২০,০০০)',
    location: 'Operations Control Centers & Data Stations',
    dutyHours: '8 Hours / Day',
    experience: '1-3 Years in IT support, networking, or computer hardware',
    ageLimit: '22 to 42 Years',
    education: 'Diploma / BSc in Computer Science / IT / Related certification',
    requirements: [
      'Computer hardware troubleshooting, OS installations and printer setups',
      'Local network cable crimping, router/switch configuration and basic LAN/WAN support',
      'User ticket assistance and IT asset inventory tracking',
      'Good troubleshooting mindset and fast responsiveness',
    ],
    benefits: [
      'High standard company accommodation',
      'Full health, dental & life insurance',
      'High-speed workspace internet and food allowance',
      'Annual airfare and professional skill development bonuses',
    ],
    deadline: 'Open / Ongoing 2026 Recruitment',
    description: `ক্যাম্প ও অফিসসমূহের কম্পিউটার, নেটওয়ার্ক ও যোগাযোগ যন্ত্রপাতির টেকনিক্যাল সাপোর্ট প্রদানে দক্ষ আইটি সহকারী নিয়োগ চলছে।`,
    status: 'Active',
    updatedAt: '2026-09-23',
  },
];

// Helper to broadcast update events
const broadcastEvent = (eventName: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(eventName));
  }
};

// ==========================================
// 1. CATEGORIES CRUD
// ==========================================
export const getStoredJobCategories = (): JobCategory[] => {
  if (typeof window === 'undefined') return DEFAULT_JOB_CATEGORIES;
  try {
    const raw = localStorage.getItem(JOB_CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(JOB_CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_JOB_CATEGORIES));
      return DEFAULT_JOB_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(JOB_CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_JOB_CATEGORIES));
    return DEFAULT_JOB_CATEGORIES;
  } catch (err) {
    console.error('Failed to load job categories:', err);
    return DEFAULT_JOB_CATEGORIES;
  }
};

export const saveJobCategories = (categories: JobCategory[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOB_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    broadcastEvent(JOB_CATEGORIES_UPDATED_EVENT);
  } catch (err) {
    console.error('Failed to save job categories:', err);
  }
};

export const addJobCategory = (name: string): JobCategory => {
  const trimmed = name.trim();
  const categories = getStoredJobCategories();
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat: JobCategory = {
    id: `cat-${slug}-${Date.now().toString().slice(-4)}`,
    name: trimmed,
    order: categories.length + 1,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updated = [...categories, newCat];
  saveJobCategories(updated);
  return newCat;
};

export const removeJobCategory = (id: string): void => {
  const categories = getStoredJobCategories();
  const filtered = categories.filter((c) => c.id !== id);
  saveJobCategories(filtered);
};

export const updateJobCategory = (id: string, newName: string): void => {
  const categories = getStoredJobCategories();
  const updated = categories.map((c) => (c.id === id ? { ...c, name: newName.trim() } : c));
  saveJobCategories(updated);
};

export const resetJobCategoriesToDefault = (): void => {
  saveJobCategories(DEFAULT_JOB_CATEGORIES);
};

// ==========================================
// 2. REQUIREMENTS CRUD
// ==========================================
export const getStoredJobRequirements = (): JobRequirement[] => {
  if (typeof window === 'undefined') return DEFAULT_JOB_REQUIREMENTS;
  try {
    const raw = localStorage.getItem(JOB_REQUIREMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(JOB_REQUIREMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_JOB_REQUIREMENTS));
      return DEFAULT_JOB_REQUIREMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(JOB_REQUIREMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_JOB_REQUIREMENTS));
    return DEFAULT_JOB_REQUIREMENTS;
  } catch (err) {
    console.error('Failed to load job requirements:', err);
    return DEFAULT_JOB_REQUIREMENTS;
  }
};

export const saveJobRequirements = (requirements: JobRequirement[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOB_REQUIREMENTS_STORAGE_KEY, JSON.stringify(requirements));
    broadcastEvent(JOB_REQUIREMENTS_UPDATED_EVENT);
  } catch (err) {
    console.error('Failed to save job requirements:', err);
  }
};

export const getJobRequirementByCategoryId = (categoryId: string): JobRequirement | null => {
  const all = getStoredJobRequirements();
  const found = all.find((r) => r.categoryId === categoryId);
  if (found) return found;

  // If not found by ID, try matching category name loosely
  const categories = getStoredJobCategories();
  const cat = categories.find((c) => c.id === categoryId);
  if (cat) {
    const foundByName = all.find((r) => r.categoryName.toLowerCase() === cat.name.toLowerCase());
    if (foundByName) return foundByName;
  }
  return null;
};

export const upsertJobRequirement = (req: JobRequirement): void => {
  const all = getStoredJobRequirements();
  const idx = all.findIndex((r) => r.id === req.id || r.categoryId === req.categoryId);
  let updated: JobRequirement[];
  if (idx >= 0) {
    updated = [...all];
    updated[idx] = { ...req, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    updated = [{ ...req, updatedAt: new Date().toISOString().split('T')[0] }, ...all];
  }
  saveJobRequirements(updated);
};

export const deleteJobRequirement = (id: string): void => {
  const all = getStoredJobRequirements();
  const filtered = all.filter((r) => r.id !== id);
  saveJobRequirements(filtered);
};

export const resetJobRequirementsToDefault = (): void => {
  saveJobRequirements(DEFAULT_JOB_REQUIREMENTS);
};

// ==========================================
// 3. JOB APPLICATIONS (HISTORY) CRUD
// ==========================================
export const getStoredJobApplications = (): JobApplication[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load job applications:', err);
    return [];
  }
};

export const saveJobApplications = (apps: JobApplication[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
    broadcastEvent(JOB_APPLICATIONS_UPDATED_EVENT);
  } catch (err) {
    console.error('Failed to save job applications:', err);
  }
};

export const addJobApplication = (appData: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>): JobApplication => {
  const existing = getStoredJobApplications();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const newApp: JobApplication = {
    ...appData,
    id: `BHP-APP-2026-${randNum}`,
    status: 'Pending',
    appliedAt: `${dateStr}, ${timeStr}`,
  };

  const updated = [newApp, ...existing];
  saveJobApplications(updated);
  return newApp;
};

export const updateJobApplicationStatus = (
  id: string,
  newStatus: JobApplication['status']
): void => {
  const existing = getStoredJobApplications();
  const updated = existing.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
  saveJobApplications(updated);
};

export const deleteJobApplication = (id: string): void => {
  const existing = getStoredJobApplications();
  const updated = existing.filter((a) => a.id !== id);
  saveJobApplications(updated);
};

export const clearAllJobApplications = (): void => {
  saveJobApplications([]);
};
