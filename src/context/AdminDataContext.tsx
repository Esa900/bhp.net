import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommodityItem, NewsItem, ReportItem, EventItem, StockMarketData } from '../types';
import { COMMODITIES, NEWS_ARTICLES, REPORTS, UPCOMING_EVENTS, STOCK_DATA } from '../data';
import { PositiveListOccupation } from '../types/portal';
import { POSITIVE_LIST_DATA } from '../data/portalData';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time';
  experience: string;
  status: 'Active' | 'Draft' | 'Closed';
  postedDate: string;
  description: string;
}

export interface JobApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  appliedDate: string;
  resumeFileName: string;
  status: 'New' | 'Under Review' | 'Shortlisted' | 'Rejected';
  notes: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  inquiryType: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Replied' | 'Archived';
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
}

export interface SiteSettings {
  brandName: string;
  logoText: string;
  footerCopyright: string;
  primaryEmail: string;
  supportPhone: string;
  facebookUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  announcementEnabled?: boolean;
  announcementText?: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl: string;
}

export interface StockApiConfig {
  provider: 'AlphaVantage' | 'Finnhub' | 'YahooFinance' | 'InternalSimulation';
  apiKey: string;
  pollingIntervalMinutes: number;
  autoRefresh: boolean;
  lastSyncStatus: 'Connected' | 'Error' | 'Idle';
  lastSyncTimestamp: string;
}

export type AdminRole = 'Super Admin' | 'Editor' | 'HR Manager';

interface AdminDataContextType {
  // Authentication & Security
  isAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  adminPassword: string;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };

  // Commodities
  commodities: CommodityItem[];
  addCommodity: (item: CommodityItem) => void;
  updateCommodity: (id: string, updated: Partial<CommodityItem>) => void;
  deleteCommodity: (id: string) => void;

  // News
  news: NewsItem[];
  addNews: (item: NewsItem) => void;
  updateNews: (id: string, updated: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  // Reports
  reports: ReportItem[];
  addReport: (item: ReportItem) => void;
  updateReport: (id: string, updated: Partial<ReportItem>) => void;
  deleteReport: (id: string) => void;

  // Events
  events: EventItem[];
  addEvent: (item: EventItem) => void;
  updateEvent: (id: string, updated: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  // Live Stock Data
  stockData: Record<string, StockMarketData>;
  updateStockPrice: (exchange: string, price: string, changePercent: string) => void;

  // Jobs & Applicants
  jobs: JobPosting[];
  addJob: (job: JobPosting) => void;
  updateJob: (id: string, updated: Partial<JobPosting>) => void;
  deleteJob: (id: string) => void;
  applicants: JobApplicant[];
  addApplicant: (applicant: Omit<JobApplicant, 'id' | 'appliedDate' | 'status'>) => void;
  updateApplicantStatus: (id: string, status: JobApplicant['status']) => void;
  deleteApplicant: (id: string) => void;
  clearAllApplicants: () => void;

  // Inquiries & Subscribers
  inquiries: ContactSubmission[];
  addInquiry: (inquiry: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: ContactSubmission['status']) => void;
  deleteInquiry: (id: string) => void;

  subscribers: Subscriber[];
  addSubscriber: (email: string) => boolean;
  exportSubscribersCsv: () => void;

  // Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  seoSettings: SeoSettings;
  updateSeoSettings: (seo: Partial<SeoSettings>) => void;

  stockApiConfig: StockApiConfig;
  updateStockApiConfig: (config: Partial<StockApiConfig>) => void;
  testStockApiConnection: () => Promise<boolean>;

  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;

  // Positive List for Skilled Work Management
  positiveList: PositiveListOccupation[];
  addPositiveListOccupation: (item: PositiveListOccupation) => void;
  updatePositiveListOccupation: (anzscoCode: string, updated: Partial<PositiveListOccupation>) => void;
  deletePositiveListOccupation: (anzscoCode: string) => void;
  resetPositiveList: () => void;

  // Analytics
  analytics: {
    totalVisitors: number;
    pageViews: number;
    bounceRate: string;
    avgSessionDuration: string;
  };
}

const defaultJobs: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Senior Geotechnical Engineer',
    department: 'Mining Operations',
    location: 'Perth, WA, Australia',
    type: 'Full-time',
    experience: '5+ years',
    status: 'Active',
    postedDate: '10 Sep 2026',
    description: 'Lead geotechnical hazard assessments and open-pit ground support design for WA Iron Ore.',
  },
  {
    id: 'job-2',
    title: 'Process Automation Specialist',
    department: 'Technology & Innovation',
    location: 'Santiago, Chile',
    type: 'Full-time',
    experience: '3+ years',
    status: 'Active',
    postedDate: '07 Sep 2026',
    description: 'Optimize autonomous haulage operations and remote monitoring systems at Minera Escondida.',
  },
  {
    id: 'job-3',
    title: 'Environmental & Decarbonisation Advisor',
    department: 'Sustainability & ESG',
    location: 'Melbourne, Australia',
    type: 'Full-time',
    experience: '4+ years',
    status: 'Active',
    postedDate: '02 Sep 2026',
    description: 'Coordinate Scope 1 and 2 emission abatement projects and biodiversity conservation programs.',
  },
  {
    id: 'job-4',
    title: 'Mechanical Technician - Potash Projects',
    department: 'Engineering',
    location: 'Saskatoon, Canada',
    type: 'Full-time',
    experience: '2+ years',
    status: 'Active',
    postedDate: '28 Aug 2026',
    description: 'Support shaft sinking and heavy processing installation at the Jansen Potash project.',
  },
];

const defaultApplicants: JobApplicant[] = [];

const defaultInquiries: ContactSubmission[] = [];

const defaultSubscribers: Subscriber[] = [];

const defaultSiteSettings: SiteSettings = {
  brandName: 'BHP Group Limited',
  logoText: 'BHP',
  footerCopyright: '© BHP 2026. Resources that make the future possible. All rights reserved.',
  primaryEmail: 'info@bhp.com',
  supportPhone: '+61 1300 55 47 57',
  facebookUrl: 'https://facebook.com/bhp',
  linkedinUrl: 'https://linkedin.com/company/bhp',
  twitterUrl: 'https://twitter.com/bhp',
  youtubeUrl: 'https://youtube.com/user/bhp',
  announcementEnabled: false,
  announcementText: 'BHP announces FY26 Full Year Results & Dividend distribution for shareholders.',
};

const defaultSeoSettings: SeoSettings = {
  metaTitle: 'BHP — Building What’s Next | Global Natural Resources Leader',
  metaDescription: 'BHP is a leading global resources company producing iron ore, copper, metallurgical coal, and potash essential for global economic growth and decarbonisation.',
  keywords: 'BHP, Mining, Copper, Iron Ore, Potash, Metallurgical Coal, Energy Transition, Decarbonisation, ASX BHP',
  ogImageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
};

const defaultStockApiConfig: StockApiConfig = {
  provider: 'InternalSimulation',
  apiKey: 'BHP_FIN_LIVE_KEY_9921_PROD',
  pollingIntervalMinutes: 5,
  autoRefresh: true,
  lastSyncStatus: 'Connected',
  lastSyncTimestamp: '2026-09-17 03:30 AEST',
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Commodities
  const [commodities, setCommodities] = useState<CommodityItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_commodities');
      return saved ? JSON.parse(saved) : COMMODITIES;
    } catch {
      return COMMODITIES;
    }
  });

  // News
  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_news');
      return saved ? JSON.parse(saved) : NEWS_ARTICLES;
    } catch {
      return NEWS_ARTICLES;
    }
  });

  // Reports
  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_reports');
      return saved ? JSON.parse(saved) : REPORTS;
    } catch {
      return REPORTS;
    }
  });

  // Events
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_events');
      return saved ? JSON.parse(saved) : UPCOMING_EVENTS;
    } catch {
      return UPCOMING_EVENTS;
    }
  });

  // Jobs
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_jobs');
      return saved ? JSON.parse(saved) : defaultJobs;
    } catch {
      return defaultJobs;
    }
  });

  // Applicants
  const [applicants, setApplicants] = useState<JobApplicant[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_applicants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((a: JobApplicant) => !['app-1', 'app-2', 'app-3'].includes(a.id));
        }
      }
      return defaultApplicants;
    } catch {
      return defaultApplicants;
    }
  });

  // Inquiries
  const [inquiries, setInquiries] = useState<ContactSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_inquiries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((inq: ContactSubmission) => !['inq-1', 'inq-2', 'inq-3'].includes(inq.id));
        }
      }
      return defaultInquiries;
    } catch {
      return defaultInquiries;
    }
  });

  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_subscribers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((s: Subscriber) => !['sub-1', 'sub-2', 'sub-3', 'sub-4'].includes(s.id));
        }
      }
      return defaultSubscribers;
    } catch {
      return defaultSubscribers;
    }
  });

  // Site & SEO Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_site_settings');
      return saved ? JSON.parse(saved) : defaultSiteSettings;
    } catch {
      return defaultSiteSettings;
    }
  });

  const [seoSettings, setSeoSettings] = useState<SeoSettings>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_seo_settings');
      return saved ? JSON.parse(saved) : defaultSeoSettings;
    } catch {
      return defaultSeoSettings;
    }
  });

  const [stockApiConfig, setStockApiConfig] = useState<StockApiConfig>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_stock_config');
      return saved ? JSON.parse(saved) : defaultStockApiConfig;
    } catch {
      return defaultStockApiConfig;
    }
  });

  // Positive List for Skilled Work State
  const [positiveList, setPositiveList] = useState<PositiveListOccupation[]>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_positive_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return POSITIVE_LIST_DATA;
    } catch {
      return POSITIVE_LIST_DATA;
    }
  });

  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    const saved = localStorage.getItem('bhp_admin_pwd');
    if (!saved || saved === 'admin123') {
      localStorage.setItem('bhp_admin_pwd', 'ESA006##');
      return 'ESA006##';
    }
    return saved;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bhp_admin_auth') === 'true';
  });

  const loginAdmin = (password: string): boolean => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bhp_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bhp_admin_auth');
  };

  // Stock Market Live Data
  const [stockData, setStockData] = useState<Record<string, StockMarketData>>(() => {
    try {
      const saved = localStorage.getItem('bhp_admin_stocks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return { ...STOCK_DATA, ...parsed };
        }
      }
      return STOCK_DATA;
    } catch {
      return STOCK_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem('bhp_admin_stocks', JSON.stringify(stockData));
  }, [stockData]);

  const updateStockPrice = (exchange: string, price: string, changePercent: string) => {
    setStockData((prev) => {
      const existing = (prev && prev[exchange]) || STOCK_DATA[exchange] || STOCK_DATA.ASX;
      const cleanPercent = String(changePercent || '').trim();
      const isPositive = !cleanPercent.startsWith('-');
      return {
        ...prev,
        [exchange]: {
          ...existing,
          price: String(price || '0.00'),
          changePercent: cleanPercent || '0.00%',
          isPositive,
          timestamp: `Updated ${new Date().toLocaleTimeString()} (Admin)`,
        },
      };
    });
  };

  // Save to LocalStorage on changes
  useEffect(() => { localStorage.setItem('bhp_admin_commodities', JSON.stringify(commodities)); }, [commodities]);
  useEffect(() => { localStorage.setItem('bhp_admin_news', JSON.stringify(news)); }, [news]);
  useEffect(() => { localStorage.setItem('bhp_admin_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('bhp_admin_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('bhp_admin_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('bhp_admin_applicants', JSON.stringify(applicants)); }, [applicants]);
  useEffect(() => { localStorage.setItem('bhp_admin_inquiries', JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem('bhp_admin_subscribers', JSON.stringify(subscribers)); }, [subscribers]);
  useEffect(() => { localStorage.setItem('bhp_admin_site_settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => { localStorage.setItem('bhp_admin_seo_settings', JSON.stringify(seoSettings)); }, [seoSettings]);
  useEffect(() => { localStorage.setItem('bhp_admin_stock_config', JSON.stringify(stockApiConfig)); }, [stockApiConfig]);
  useEffect(() => { localStorage.setItem('bhp_admin_positive_list', JSON.stringify(positiveList)); }, [positiveList]);

  // Positive List Actions
  const addPositiveListOccupation = (item: PositiveListOccupation) => {
    setPositiveList((prev) => {
      const exists = prev.some((o) => o.anzscoCode === item.anzscoCode);
      if (exists) {
        return prev.map((o) => (o.anzscoCode === item.anzscoCode ? item : o));
      }
      return [item, ...prev];
    });
  };

  const updatePositiveListOccupation = (anzscoCode: string, updated: Partial<PositiveListOccupation>) => {
    setPositiveList((prev) =>
      prev.map((item) => (item.anzscoCode === anzscoCode ? { ...item, ...updated } : item))
    );
  };

  const deletePositiveListOccupation = (anzscoCode: string) => {
    setPositiveList((prev) => prev.filter((item) => item.anzscoCode !== anzscoCode));
  };

  const resetPositiveList = () => {
    setPositiveList(POSITIVE_LIST_DATA);
    localStorage.setItem('bhp_admin_positive_list', JSON.stringify(POSITIVE_LIST_DATA));
  };

  // Actions: Commodities
  const addCommodity = (item: CommodityItem) => {
    setCommodities((prev) => [item, ...prev]);
  };
  const updateCommodity = (id: string, updated: Partial<CommodityItem>) => {
    setCommodities((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };
  const deleteCommodity = (id: string) => {
    setCommodities((prev) => prev.filter((c) => c.id !== id));
  };

  // Actions: News
  const addNews = (item: NewsItem) => {
    setNews((prev) => [item, ...prev]);
  };
  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    setNews((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
  };
  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  // Actions: Reports
  const addReport = (item: ReportItem) => {
    setReports((prev) => [item, ...prev]);
  };
  const updateReport = (id: string, updated: Partial<ReportItem>) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
  };
  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  // Actions: Events
  const addEvent = (item: EventItem) => {
    setEvents((prev) => [item, ...prev]);
  };
  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Actions: Jobs & Applicants
  const addJob = (job: JobPosting) => {
    setJobs((prev) => [job, ...prev]);
  };
  const updateJob = (id: string, updated: Partial<JobPosting>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updated } : j)));
  };
  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };
  const updateApplicantStatus = (id: string, status: JobApplicant['status']) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };
  const addApplicant = (data: Omit<JobApplicant, 'id' | 'appliedDate' | 'status'>) => {
    const newApplicant: JobApplicant = {
      ...data,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'New',
    };
    setApplicants((prev) => [newApplicant, ...prev]);
  };
  const deleteApplicant = (id: string) => {
    setApplicants((prev) => prev.filter((a) => a.id !== id));
  };
  const clearAllApplicants = () => {
    setApplicants([]);
    localStorage.removeItem('bhp_admin_applicants');
  };

  // Actions: Inquiries & Subscribers
  const addInquiry = (data: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newInquiry: ContactSubmission = {
      ...data,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toLocaleString(),
      status: 'New',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };
  const updateInquiryStatus = (id: string, status: ContactSubmission['status']) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
  };
  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  const addSubscriber = (email: string): boolean => {
    if (!email || !email.includes('@')) return false;
    const exists = subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      const newSub: Subscriber = {
        id: `sub-${Date.now()}`,
        email,
        subscribedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        source: 'Website Submission',
      };
      setSubscribers((prev) => [newSub, ...prev]);
    }
    return true;
  };

  const exportSubscribersCsv = () => {
    const headers = 'ID,Email,Subscribed Date,Source\n';
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.subscribedAt}","${s.source}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bhp_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...settings }));
  };
  const updateSeoSettings = (seo: Partial<SeoSettings>) => {
    setSeoSettings((prev) => ({ ...prev, ...seo }));
  };
  const updateStockApiConfig = (config: Partial<StockApiConfig>) => {
    setStockApiConfig((prev) => ({ ...prev, ...config }));
  };

  const testStockApiConnection = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setStockApiConfig((prev) => ({
          ...prev,
          lastSyncStatus: 'Connected',
          lastSyncTimestamp: new Date().toLocaleTimeString() + ' UTC',
        }));
        resolve(true);
      }, 900);
    });
  };

  const changeAdminPassword = (oldPass: string, newPass: string) => {
    if (oldPass !== adminPassword) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    setAdminPassword(newPass);
    localStorage.setItem('bhp_admin_pwd', newPass);
    return { success: true, message: 'Admin password updated successfully!' };
  };

  const analytics = {
    totalVisitors: 1428950,
    pageViews: 4892110,
    bounceRate: '28.4%',
    avgSessionDuration: '3m 42s',
  };

  return (
    <AdminDataContext.Provider
      value={{
        isAuthenticated,
        loginAdmin,
        logoutAdmin,
        adminPassword,
        changeAdminPassword,
        commodities,
        addCommodity,
        updateCommodity,
        deleteCommodity,
        news,
        addNews,
        updateNews,
        deleteNews,
        reports,
        addReport,
        updateReport,
        deleteReport,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        stockData,
        updateStockPrice,
        jobs,
        addJob,
        updateJob,
        deleteJob,
        applicants,
        addApplicant,
        updateApplicantStatus,
        deleteApplicant,
        clearAllApplicants,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        subscribers,
        addSubscriber,
        exportSubscribersCsv,
        siteSettings,
        updateSiteSettings,
        seoSettings,
        updateSeoSettings,
        stockApiConfig,
        updateStockApiConfig,
        testStockApiConnection,
        adminRole,
        setAdminRole,
        positiveList,
        addPositiveListOccupation,
        updatePositiveListOccupation,
        deletePositiveListOccupation,
        resetPositiveList,
        analytics,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
