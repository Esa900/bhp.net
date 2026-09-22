import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Boxes,
  Newspaper,
  TrendingUp,
  Briefcase,
  Users,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  Edit3,
  Check,
  Eye,
  RefreshCw,
  Search,
  Key,
  Lock,
  Globe,
  Mail,
  Phone,
  FileText,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  EyeOff,
  LogOut,
  Award,
  Pin,
  ChevronDown,
  Tag,
  Menu,
} from 'lucide-react';
import { useAdminData, AdminRole, JobPosting, ContactSubmission } from '../../context/AdminDataContext';
import { CommodityItem, NewsItem, ReportItem, EventItem, StockMarketData } from '../../types';
import { PositiveListOccupation } from '../../types/portal';
import { AdminPostsManager } from './AdminPostsManager';
import { AdminMenuItemsManager } from './AdminMenuItemsManager';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'news'
  | 'investor'
  | 'careers'
  | 'leads'
  | 'settings'
  | 'positive-list'
  | 'posts-all'
  | 'posts-new'
  | 'posts-categories'
  | 'menu-manager';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const {
    isAuthenticated,
    loginAdmin,
    logoutAdmin,
    adminPassword,
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
    deleteReport,
    events,
    addEvent,
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
    updateInquiryStatus,
    deleteInquiry,
    subscribers,
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
    changeAdminPassword,
    positiveList,
    addPositiveListOccupation,
    updatePositiveListOccupation,
    deletePositiveListOccupation,
    resetPositiveList,
    analytics,
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPostsMenuOpen, setIsPostsMenuOpen] = useState(true);

  // Positive List State
  const [positiveListSearch, setPositiveListSearch] = useState('');
  const [positiveListSectorFilter, setPositiveListSectorFilter] = useState('ALL');
  const [showPositiveListModal, setShowPositiveListModal] = useState(false);
  const [editingOccupation, setEditingOccupation] = useState<PositiveListOccupation | null>(null);
  const [occupationForm, setOccupationForm] = useState<{
    anzscoCode: string;
    title: string;
    sector: string;
    skillLevel: string;
    eligibleVisas: string;
    assessingAuthority: string;
    minSalaryAUD: string;
    priorityStatus: string;
  }>({
    anzscoCode: '',
    title: '',
    sector: 'Mining & Resources',
    skillLevel: 'Skill Level 1 (Bachelor degree or higher)',
    eligibleVisas: '482, 186, 189, 190, 491',
    assessingAuthority: 'Engineers Australia',
    minSalaryAUD: '$135,000 AUD',
    priorityStatus: 'Critical Skills Priority',
  });

  // Security Auth Gate States
  const [enteredPassword, setEnteredPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Form states
  // 1. Commodity Form
  const [editingCommodity, setEditingCommodity] = useState<CommodityItem | null>(null);
  const [showCommodityModal, setShowCommodityModal] = useState(false);
  const [commodityForm, setCommodityForm] = useState({
    id: '',
    name: '',
    description: '',
    secondaryText: '',
    imageUrl: '',
    statLabel1: 'Global Rank',
    statValue1: '#1 in Scale',
    statLabel2: 'Annual Output',
    statValue2: '250+ Mt',
    pdfCatalogUrl: '',
  });

  // 2. News Form
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({
    id: '',
    title: '',
    badges: 'NEWS, SUSTAINABILITY',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    linkText: 'Read article',
  });

  // 3. Financial Report Form
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    tag: 'Financial Results',
    title: '',
    description: '',
    downloadUrl: '#',
    pageCount: '84 pages',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  });

  // 4. Event Form
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    day: '28',
    month: 'NOV',
    year: '2026',
    title: '',
    description: '',
    time: '10:00 AEST',
    location: 'Melbourne & Online Webcast',
    status: 'Upcoming' as EventItem['status'],
  });

  // 5. Job Posting Form
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Mining & Operations',
    location: 'Perth, WA, Australia',
    type: 'Full-time' as JobPosting['type'],
    experience: '3+ years',
    status: 'Active' as JobPosting['status'],
    description: '',
  });

  // 6. Settings Form
  const [siteForm, setSiteForm] = useState(siteSettings);
  const [seoForm, setSeoForm] = useState(seoSettings);
  const [apiForm, setApiForm] = useState(stockApiConfig);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // Password Change
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Filter & Search states
  const [commoditySearch, setCommoditySearch] = useState('');
  const [newsSearch, setNewsSearch] = useState('');
  const [jobFilter, setJobFilter] = useState<'All' | 'Active' | 'Closed'>('All');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Role permissions check
  const canAccessProducts = adminRole === 'Super Admin' || adminRole === 'Editor';
  const canAccessNews = adminRole === 'Super Admin' || adminRole === 'Editor';
  const canAccessInvestor = adminRole === 'Super Admin' || adminRole === 'Editor';
  const canAccessCareers = adminRole === 'Super Admin' || adminRole === 'HR Manager';
  const canAccessLeads = adminRole === 'Super Admin' || adminRole === 'HR Manager' || adminRole === 'Editor';
  const canAccessSettings = adminRole === 'Super Admin';

  // Commodity Submit
  const handleSaveCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodityForm.name) return;

    const item: CommodityItem = {
      id: editingCommodity ? editingCommodity.id : (commodityForm.id || commodityForm.name.toLowerCase().replace(/\s+/g, '-')),
      name: commodityForm.name,
      description: commodityForm.description,
      secondaryText: commodityForm.secondaryText,
      ctaText: 'Find out more',
      imageUrl: commodityForm.imageUrl || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: commodityForm.statLabel1, value: commodityForm.statValue1 },
        { label: commodityForm.statLabel2, value: commodityForm.statValue2 },
      ],
    };

    if (editingCommodity) {
      updateCommodity(editingCommodity.id, item);
      showToast(`Product "${item.name}" updated successfully.`);
    } else {
      addCommodity(item);
      showToast(`New Product "${item.name}" added successfully.`);
    }

    setShowCommodityModal(false);
    setEditingCommodity(null);
  };

  // News Submit
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title) return;

    const badges = newsForm.badges.split(',').map((b) => b.trim().toUpperCase()).filter(Boolean);
    const item: NewsItem = {
      id: editingNews ? editingNews.id : `news-${Date.now()}`,
      title: newsForm.title,
      badges: badges.length > 0 ? badges : ['NEWS'],
      date: newsForm.date,
      readTime: newsForm.readTime,
      imageUrl: newsForm.imageUrl,
      linkText: newsForm.linkText || 'Read article',
    };

    if (editingNews) {
      updateNews(editingNews.id, item);
      showToast(`Article updated successfully.`);
    } else {
      addNews(item);
      showToast(`New Press Release published successfully.`);
    }

    setShowNewsModal(false);
    setEditingNews(null);
  };

  // Report Submit
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title) return;
    const item: ReportItem = {
      id: `rep-${Date.now()}`,
      ...reportForm,
    };
    addReport(item);
    showToast(`Financial report "${reportForm.title}" uploaded.`);
    setShowReportModal(false);
  };

  // Event Submit
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;
    const item: EventItem = {
      id: `event-${Date.now()}`,
      ...eventForm,
    };
    addEvent(item);
    showToast(`Investor event "${eventForm.title}" scheduled.`);
    setShowEventModal(false);
  };

  // Job Submit
  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title) return;
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      ...jobForm,
      postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    addJob(newJob);
    showToast(`Job opening "${newJob.title}" posted.`);
    setShowJobModal(false);
  };

  // Positive List Handlers
  const handleOpenAddOccupation = () => {
    setEditingOccupation(null);
    setOccupationForm({
      anzscoCode: '',
      title: '',
      sector: 'Mining & Resources',
      skillLevel: 'Skill Level 1 (Bachelor degree or higher)',
      eligibleVisas: '482, 186, 189, 190, 491',
      assessingAuthority: 'Engineers Australia',
      minSalaryAUD: '$135,000 AUD',
      priorityStatus: 'Critical Skills Priority',
    });
    setShowPositiveListModal(true);
  };

  const handleOpenEditOccupation = (item: PositiveListOccupation) => {
    setEditingOccupation(item);
    setOccupationForm({
      anzscoCode: item.anzscoCode,
      title: item.title,
      sector: item.sector,
      skillLevel: item.skillLevel || 'Skill Level 1 (Bachelor degree or higher)',
      eligibleVisas: item.eligibleVisas.join(', '),
      assessingAuthority: item.assessingAuthority,
      minSalaryAUD: item.minSalaryAUD || item.minimumSalary || '$110,000 AUD',
      priorityStatus: item.priorityStatus || item.demandStatus || 'Critical Skills Priority',
    });
    setShowPositiveListModal(true);
  };

  const handleSaveOccupation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!occupationForm.anzscoCode.trim() || !occupationForm.title.trim()) {
      showToast('Error: ANZSCO Code and Title are required.');
      return;
    }

    const visas = occupationForm.eligibleVisas
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const item: PositiveListOccupation = {
      anzscoCode: occupationForm.anzscoCode.trim(),
      title: occupationForm.title.trim(),
      sector: occupationForm.sector,
      skillLevel: occupationForm.skillLevel,
      eligibleVisas: visas.length > 0 ? visas : ['482', '186'],
      assessingAuthority: occupationForm.assessingAuthority.trim() || 'VETASSESS',
      minimumSalary: occupationForm.minSalaryAUD.trim() || '$110,000 AUD',
      minSalaryAUD: occupationForm.minSalaryAUD.trim() || '$110,000 AUD',
      demandStatus: occupationForm.priorityStatus.trim() || 'Critical Shortage',
      priorityStatus: occupationForm.priorityStatus.trim() || 'Critical Skills Priority',
      australianStates: ['WA', 'QLD', 'NSW', 'SA', 'NT'],
      description: `Commonwealth skilled work listed occupation for ${occupationForm.title.trim()}.`,
    };

    if (editingOccupation) {
      updatePositiveListOccupation(editingOccupation.anzscoCode, item);
      showToast(`Occupation "${item.title}" (${item.anzscoCode}) updated successfully.`);
    } else {
      addPositiveListOccupation(item);
      showToast(`New Occupation "${item.title}" (${item.anzscoCode}) added to Positive List.`);
    }

    setShowPositiveListModal(false);
    setEditingOccupation(null);
  };

  const handleDeleteOccupation = (anzscoCode: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" (ANZSCO: ${anzscoCode}) from the Positive List?`)) {
      deletePositiveListOccupation(anzscoCode);
      showToast(`Occupation "${title}" removed from Positive List.`);
    }
  };

  const handleResetPositiveList = () => {
    if (window.confirm('Reset Positive List to Commonwealth standard default occupations? This will restore original list entries.')) {
      resetPositiveList();
      showToast('Positive List restored to standard official occupations.');
    }
  };

  // API Test
  const handleTestApi = async () => {
    setIsTestingApi(true);
    await testStockApiConnection();
    setIsTestingApi(false);
    showToast(`Stock API Connection test succeeded (Provider: ${apiForm.provider})`);
  };

  // Password Change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      showToast('Error: New password and confirmation do not match.');
      return;
    }
    const res = changeAdminPassword(pwdForm.oldPassword, pwdForm.newPassword);
    showToast(res.message);
    if (res.success) {
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePasswordModal(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(enteredPassword);
    if (ok) {
      setAuthError('');
      setEnteredPassword('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন।');
    }
  };

  if (!isOpen) return null;

  // Render Password Protected Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#16181C] border border-[#333842] text-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#252830] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F25C05] to-[#FF8E4D] text-white flex items-center justify-center shadow-lg shadow-[#F25C05]/20 mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-extrabold text-white tracking-tight">
              AP Security Access
            </h3>
            <p className="text-xs text-[#FF8E4D] font-mono mt-0.5">
              পাসওয়ার্ড সংরক্ষিত অ্যাডমিন পোর্টাল
            </p>
            <p className="text-xs text-gray-400 mt-2 max-w-xs leading-relaxed">
              Please enter the administrative password to access all modules and configurations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Admin Password (পাসওয়ার্ড)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter AP password..."
                  className="w-full bg-[#101114] border border-[#2F333D] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05] focus:ring-1 focus:ring-[#F25C05] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-xl text-sm font-bold shadow-md shadow-[#F25C05]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock AP (প্রবেশ করুন)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 pt-1"
            >
              <span>← Back to BHP Homepage (হোমপেজে ফিরে যান)</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-7xl h-[92vh] bg-[#141517] border border-[#2F3238] text-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Navigation Bar */}
        <div className="px-6 py-4 bg-[#191B1E] border-b border-[#2C2F36] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#F25C05] text-white px-2.5 py-1 rounded font-black text-sm tracking-wide">
              <span>BHP</span>
              <span className="text-[10px] font-mono bg-black/30 px-1 rounded uppercase tracking-wider">AP</span>
            </div>
            <div className="hidden sm:block border-l border-gray-700 pl-3">
              <h2 className="text-base font-bold text-white">Management & Governance Portal</h2>
              <p className="text-xs text-gray-400">Real-time sync across commodities, news, investor relations, and site settings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Role Selector Badge */}
            <div className="flex items-center gap-1.5 bg-[#23262D] px-2.5 py-1.5 rounded-md border border-[#373B45] text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F25C05]" />
              <span className="text-gray-400 hidden sm:inline">Role:</span>
              <select
                value={adminRole}
                onChange={(e) => {
                  setAdminRole(e.target.value as AdminRole);
                  showToast(`Switched active role view to: ${e.target.value}`);
                }}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Super Admin" className="bg-[#23262D]">Super Admin (Full)</option>
                <option value="Editor" className="bg-[#23262D]">Editor (Content)</option>
                <option value="HR Manager" className="bg-[#23262D]">HR Manager (Jobs)</option>
              </select>
            </div>

            {/* Change Password Action Button */}
            <button
              type="button"
              onClick={() => setShowChangePasswordModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#23262D] hover:bg-[#2F333D] text-gray-200 hover:text-white border border-[#373B45] text-xs font-semibold cursor-pointer transition-colors"
              title="Change Password (পাসওয়ার্ড পরিবর্তন)"
            >
              <Key className="w-3.5 h-3.5 text-[#F25C05]" />
              <span className="hidden md:inline">Password</span>
            </button>

            {/* Lock AP Button */}
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                showToast('AP locked. Please enter password to re-enter.');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#23262D] hover:bg-red-950/80 hover:border-red-600/50 text-gray-200 hover:text-red-300 border border-[#373B45] text-xs font-semibold cursor-pointer transition-colors"
              title="Lock AP (লগআউট)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#23262D] hover:bg-[#323640] text-gray-200 hover:text-white border border-[#373B45] text-xs font-semibold cursor-pointer transition-colors"
              title="Return to public BHP website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F25C05]" />
              <span className="hidden sm:inline">Back to Website</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2D35] rounded-lg transition-colors cursor-pointer"
              aria-label="Close admin panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-[#1E3A2B] border-b border-green-500/50 px-6 py-2 flex items-center justify-between text-xs text-green-200 font-semibold animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Body Container with Sidebar and Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-60 sm:w-68 bg-[#181A1D] border-r border-[#282A2F] flex flex-col justify-between shrink-0 p-3 overflow-y-auto">
            <nav className="space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Core Modules
              </div>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#F25C05] text-white shadow-sm'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>1. Dashboard</span>
              </button>

              <button
                disabled={!canAccessProducts}
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  !canAccessProducts ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'products'
                    ? 'bg-[#F25C05] text-white'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Boxes className="w-4 h-4 shrink-0" />
                  <span>2. Products</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                  {commodities.length}
                </span>
              </button>

              {/* Posts Menu Item (WordPress style with 3 sub-options: Add New Post, All Posts, Categories) */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsPostsMenuOpen(!isPostsMenuOpen);
                    if (!isPostsMenuOpen && !activeTab.startsWith('posts-')) {
                      setActiveTab('posts-new');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab.startsWith('posts-')
                      ? 'bg-[#135e96] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Pin className="w-4 h-4 shrink-0 text-[#38bdf8]" />
                    <span>Posts</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isPostsMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* 3 Sub-menu items: Add New Post, All Posts, Categories */}
                {isPostsMenuOpen && (
                  <div className="ml-3 pl-3 py-1 space-y-1 border-l-2 border-[#135e96] bg-[#16181b] rounded-r-lg">
                    {/* 1. Add New Post */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('posts-new')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer text-left ${
                        activeTab === 'posts-new'
                          ? 'bg-[#0284c7] text-white font-bold'
                          : 'text-[#7dd3fc] hover:text-white hover:bg-[#22262d]'
                      }`}
                    >
                      <Plus className="w-3 h-3 text-[#38bdf8]" />
                      <span>Add New Post</span>
                    </button>

                    {/* 2. All Posts */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('posts-all')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer text-left ${
                        activeTab === 'posts-all'
                          ? 'bg-[#0284c7] text-white font-bold'
                          : 'text-[#7dd3fc] hover:text-white hover:bg-[#22262d]'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-gray-300" />
                      <span>All Posts</span>
                    </button>

                    {/* 3. Categories */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('posts-categories')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer text-left ${
                        activeTab === 'posts-categories'
                          ? 'bg-[#0284c7] text-white font-bold'
                          : 'text-[#7dd3fc] hover:text-white hover:bg-[#22262d]'
                      }`}
                    >
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span>Categories</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                disabled={!canAccessNews}
                onClick={() => setActiveTab('news')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  !canAccessNews ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'news'
                    ? 'bg-[#F25C05] text-white'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-4 h-4 shrink-0" />
                  <span>3. News & Press</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                  {news.length}
                </span>
              </button>

              <button
                disabled={!canAccessInvestor}
                onClick={() => setActiveTab('investor')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  !canAccessInvestor ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'investor'
                    ? 'bg-[#F25C05] text-white'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>4. Investor Data</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                  {reports.length + events.length}
                </span>
              </button>

              <button
                disabled={!canAccessCareers}
                onClick={() => setActiveTab('careers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  !canAccessCareers ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'careers'
                    ? 'bg-[#F25C05] text-white'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>5. Careers & Jobs</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                  {jobs.length}
                </span>
              </button>

              <button
                disabled={!canAccessLeads}
                onClick={() => setActiveTab('leads')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  !canAccessLeads ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'leads'
                    ? 'bg-[#F25C05] text-white'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>6. Leads & Users</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                  {inquiries.length + subscribers.length}
                </span>
              </button>

              <button
                disabled={!canAccessSettings}
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  !canAccessSettings ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'settings'
                    ? 'bg-[#F25C05] text-white'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>7. Settings & SEO</span>
                </div>
                {!canAccessSettings && <Lock className="w-3 h-3 text-gray-500" />}
              </button>

              <button
                onClick={() => setActiveTab('positive-list')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'positive-list'
                    ? 'bg-[#F25C05] text-white shadow-sm'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 shrink-0 text-[#FFCD00]" />
                  <span>8. Positive List</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#FFCD00]">
                  {positiveList.length}
                </span>
              </button>

              {/* 9. 3-Line Menu Manager */}
              <button
                onClick={() => setActiveTab('menu-manager')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'menu-manager'
                    ? 'bg-[#F25C05] text-white shadow-sm'
                    : 'text-gray-300 hover:bg-[#23262D] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Menu className="w-4 h-4 shrink-0 text-[#38bdf8]" />
                  <span>9. 3-Line Menu (মেনু)</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-[#FF8E4D]">
                  Search
                </span>
              </button>
            </nav>

            <div className="p-3 bg-[#131416] rounded-lg border border-[#26282E] text-[11px] text-gray-400 space-y-1">
              <div className="font-bold text-gray-300">Live Client Sync</div>
              <div>Changes made in this panel instantly update the live BHP website.</div>
            </div>
          </aside>

          {/* Main Work Area */}
          <main className="flex-1 bg-[#141517] overflow-y-auto p-4 sm:p-8">
            
            {/* POSTS MODULE (ADD NEW POST, ALL POSTS, CATEGORIES) */}
            {activeTab.startsWith('posts-') && (
              <AdminPostsManager
                subView={activeTab === 'posts-new' ? 'new' : activeTab === 'posts-categories' ? 'categories' : 'all'}
                onSwitchSubView={(v) => setActiveTab(`posts-${v}` as AdminTab)}
                showToast={showToast}
              />
            )}

            {/* 3-LINE HAMBURGER MENU MANAGER */}
            {activeTab === 'menu-manager' && (
              <AdminMenuItemsManager showToast={showToast} />
            )}

            {/* MODULE 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 max-w-6xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    1. Executive Overview & Live Analytics
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Real-time audience metrics, live commodity counters, subscriber rates, and operational content status.
                  </p>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A] shadow-sm">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Visitors (মোট ভিজিটর)</div>
                    <div className="text-3xl font-extrabold text-white mt-2">
                      {analytics.totalVisitors.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-400 font-bold mt-2 flex items-center gap-1">
                      <span>+14.2%</span> <span className="text-gray-400 font-normal">vs last month</span>
                    </div>
                  </div>

                  <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A] shadow-sm">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Page Views (পেজ ভিউ)</div>
                    <div className="text-3xl font-extrabold text-white mt-2">
                      {analytics.pageViews.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-400 font-bold mt-2 flex items-center gap-1">
                      <span>+8.9%</span> <span className="text-gray-400 font-normal">avg 3.4 pages/session</span>
                    </div>
                  </div>

                  <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A] shadow-sm">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Subscribers (সাবস্ক্রাইবার)</div>
                    <div className="text-3xl font-extrabold text-[#F25C05] mt-2">
                      {subscribers.length}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Ready for news & media alerts export
                    </div>
                  </div>

                  <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A] shadow-sm">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bounce Rate & Duration</div>
                    <div className="text-3xl font-extrabold text-white mt-2">
                      {analytics.bounceRate}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Avg Session: <span className="text-white font-semibold">{analytics.avgSessionDuration}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A]">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span>Content & Operational Quick Stats</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="p-4 bg-[#141517] rounded-lg border border-[#2B2E36] text-center">
                      <span className="text-xs text-gray-400 block">Live News Articles</span>
                      <span className="text-2xl font-black text-[#F25C05]">{news.length}</span>
                    </div>
                    <div className="p-4 bg-[#141517] rounded-lg border border-[#2B2E36] text-center">
                      <span className="text-xs text-gray-400 block">Active Commodities</span>
                      <span className="text-2xl font-black text-white">{commodities.length}</span>
                    </div>
                    <div className="p-4 bg-[#141517] rounded-lg border border-[#2B2E36] text-center">
                      <span className="text-xs text-gray-400 block">Published Reports</span>
                      <span className="text-2xl font-black text-white">{reports.length}</span>
                    </div>
                    <div className="p-4 bg-[#141517] rounded-lg border border-[#2B2E36] text-center">
                      <span className="text-xs text-gray-400 block">Job Openings</span>
                      <span className="text-2xl font-black text-white">{jobs.length}</span>
                    </div>
                    <div className="p-4 bg-[#141517] rounded-lg border border-[#2B2E36] text-center">
                      <span className="text-xs text-gray-400 block">Contact Inquiries</span>
                      <span className="text-2xl font-black text-white">{inquiries.length}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Inquiries & Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-white">Recent Contact Form Submissions</h4>
                      <button
                        onClick={() => setActiveTab('leads')}
                        className="text-xs font-semibold text-[#F25C05] hover:underline"
                      >
                        View all ({inquiries.length})
                      </button>
                    </div>
                    <div className="space-y-3">
                      {inquiries.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 text-xs bg-[#15171A] rounded-lg border border-dashed border-[#282B33]">
                          <Mail className="w-5 h-5 mx-auto text-gray-600 mb-1 opacity-60" />
                          এখনো কোনো ইনকোয়ারি জমা পড়েনি (No inquiries yet)
                        </div>
                      ) : (
                        inquiries.slice(0, 3).map((inq) => (
                          <div key={inq.id} className="p-3 bg-[#16181B] rounded-lg border border-[#2B2E36] text-xs">
                            <div className="flex items-center justify-between font-bold text-white">
                              <span>{inq.name} ({inq.country})</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                                inq.status === 'New' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-300'
                              }`}>
                                {inq.status}
                              </span>
                            </div>
                            <p className="text-gray-400 mt-1 line-clamp-1">{inq.message}</p>
                            <div className="text-[10px] text-gray-400 mt-1">{inq.submittedAt} • {inq.inquiryType}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-white">Recent Job Candidates</h4>
                      <button
                        onClick={() => setActiveTab('careers')}
                        className="text-xs font-semibold text-[#F25C05] hover:underline"
                      >
                        View applicants ({applicants.length})
                      </button>
                    </div>
                    <div className="space-y-3">
                      {applicants.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 text-xs bg-[#15171A] rounded-lg border border-dashed border-[#282B33]">
                          <Users className="w-5 h-5 mx-auto text-gray-600 mb-1 opacity-60" />
                          এখনো কোনো প্রার্থীর আবেদন জমা পড়েনি (No applicants yet)
                        </div>
                      ) : (
                        applicants.slice(0, 3).map((app) => (
                          <div key={app.id} className="p-3 bg-[#16181B] rounded-lg border border-[#2B2E36] text-xs">
                            <div className="flex items-center justify-between font-bold text-white">
                              <span>{app.name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-[#29303D] text-blue-300">
                                {app.status}
                              </span>
                            </div>
                            <div className="text-gray-300 mt-0.5 font-medium">{app.jobTitle}</div>
                            <div className="text-[10px] text-gray-400 mt-1">{app.email} • {app.appliedDate}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: PRODUCTS & COMMODITIES MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      2. Products & Commodities Management (পণ্য ব্যবস্থাপনা)
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Update product descriptions, industrial applications, images, production statistics and catalog downloads.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCommodity(null);
                      setCommodityForm({
                        id: '',
                        name: '',
                        description: '',
                        secondaryText: '',
                        imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
                        statLabel1: 'Global Rank',
                        statValue1: '#1 in Scale',
                        statLabel2: 'Annual Output',
                        statValue2: '250+ Mt',
                        pdfCatalogUrl: '',
                      });
                      setShowCommodityModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Commodity</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search commodities (e.g., Copper, Iron Ore, Potash)..."
                    value={commoditySearch}
                    onChange={(e) => setCommoditySearch(e.target.value)}
                    className="w-full bg-[#1C1E23] border border-[#2F333D] rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                {/* Commodities List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {commodities
                    .filter((c) => c.name.toLowerCase().includes(commoditySearch.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#1C1E23] border border-[#2D313A] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                      >
                        <div className="relative h-44 bg-gray-900 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E23] via-transparent to-black/40" />
                          <div className="absolute top-3 left-3 bg-[#F25C05] text-white px-2.5 py-1 rounded text-xs font-extrabold uppercase">
                            {item.name}
                          </div>
                        </div>

                        <div className="p-5 flex-1 space-y-3">
                          <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
                          <div className="p-3 bg-[#15171A] rounded-lg border border-[#282B33] text-[11px] text-gray-400">
                            <span className="font-semibold text-white block mb-0.5">Use Cases & Energy Transition:</span>
                            {item.secondaryText}
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {item.stats.map((s, idx) => (
                              <div key={idx} className="bg-[#15171A] p-2 rounded text-center">
                                <span className="text-[10px] text-gray-400 block">{s.label}</span>
                                <span className="text-xs font-bold text-white">{s.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-[#17191C] border-t border-[#282B33] flex items-center justify-between">
                          <span className="text-xs font-mono text-gray-400">ID: {item.id}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCommodity(item);
                                setCommodityForm({
                                  id: item.id,
                                  name: item.name,
                                  description: item.description,
                                  secondaryText: item.secondaryText,
                                  imageUrl: item.imageUrl,
                                  statLabel1: item.stats[0]?.label || 'Stat 1',
                                  statValue1: item.stats[0]?.value || '',
                                  statLabel2: item.stats[1]?.label || 'Stat 2',
                                  statValue2: item.stats[1]?.value || '',
                                  pdfCatalogUrl: '',
                                });
                                setShowCommodityModal(true);
                              }}
                              className="p-1.5 text-gray-300 hover:text-white hover:bg-[#252830] rounded cursor-pointer"
                              title="Edit Commodity"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {commodities.length > 1 && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete ${item.name} from catalog?`)) {
                                    deleteCommodity(item.id);
                                    showToast(`Deleted ${item.name}`);
                                  }
                                }}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded cursor-pointer"
                                title="Delete Commodity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* MODULE 3: NEWS & PRESS RELEASES */}
            {activeTab === 'news' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      3. News & Press Release Management (সংবাদ ও আপডেট)
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Publish news articles, update press statements, set article badges, reading duration and featured photography.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingNews(null);
                      setNewsForm({
                        id: '',
                        title: '',
                        badges: 'NEWS, SUSTAINABILITY',
                        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        readTime: '3 min read',
                        imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
                        linkText: 'Read article',
                      });
                      setShowNewsModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Press Release</span>
                  </button>
                </div>

                {/* News Table */}
                <div className="bg-[#1C1E23] rounded-xl border border-[#2D313A] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#15171A] text-gray-400 font-bold uppercase border-b border-[#2B2E36]">
                        <tr>
                          <th className="py-3.5 px-4">Article</th>
                          <th className="py-3.5 px-4">Categories / Badges</th>
                          <th className="py-3.5 px-4">Publish Date</th>
                          <th className="py-3.5 px-4">Read Time</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#282B33]">
                        {news.map((n) => (
                          <tr key={n.id} className="hover:bg-[#22252C]">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={n.imageUrl}
                                  alt={n.title}
                                  className="w-12 h-10 object-cover rounded shrink-0 bg-gray-800"
                                />
                                <span className="font-bold text-white text-sm line-clamp-2 max-w-md">
                                  {n.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {n.badges.map((b, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-[#2A2E38] text-gray-200 text-[10px] font-bold rounded uppercase"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-300 font-mono whitespace-nowrap">{n.date}</td>
                            <td className="py-3 px-4 text-gray-400 whitespace-nowrap">{n.readTime}</td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingNews(n);
                                  setNewsForm({
                                    id: n.id,
                                    title: n.title,
                                    badges: n.badges.join(', '),
                                    date: n.date,
                                    readTime: n.readTime,
                                    imageUrl: n.imageUrl,
                                    linkText: n.linkText,
                                  });
                                  setShowNewsModal(true);
                                }}
                                className="p-1.5 text-gray-300 hover:text-white hover:bg-[#2B2E36] rounded cursor-pointer mr-1"
                                title="Edit News"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete article: "${n.title}"?`)) {
                                    deleteNews(n.id);
                                    showToast('Article deleted.');
                                  }
                                }}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded cursor-pointer"
                                title="Delete News"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: INVESTOR & FINANCIAL DATA MANAGEMENT */}
            {activeTab === 'investor' && (
              <div className="space-y-8 max-w-6xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    4. Investor & Financial Data Management (ইনভেস্টর সেকশন)
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage statutory financial reports, real-time Stock Market prices, API endpoints, and shareholder events.
                  </p>
                </div>

                {/* Section A0: Live Real-time Stock Price Editor */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#F25C05]" />
                      <div>
                        <h4 className="text-base font-bold text-white">Live Stock Price Manual Override & Real-time Sync</h4>
                        <p className="text-xs text-gray-400">এখান থেকে শেয়ারের দাম পরিবর্তন করলে সাথে সাথে হোমপেজ ও ইনভেস্টর সেন্টারে লাইভ আপডেট হবে</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {stockData && (Object.entries(stockData) as [string, StockMarketData][]).map(([exchangeKey, stk]) => (
                      <div key={exchangeKey} className="p-4 bg-[#15171A] rounded-lg border border-[#282B33] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#F25C05]">{stk.exchange || exchangeKey}</span>
                          <span className="text-[11px] font-mono text-gray-400">{stk.symbol}</span>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Price ({stk.currency})</label>
                          <input
                            type="text"
                            value={stk.price}
                            onChange={(e) => {
                              updateStockPrice(exchangeKey, e.target.value, stk.changePercent);
                            }}
                            className="w-full bg-[#1A1D23] border border-[#2F333D] rounded px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-[#F25C05]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Daily Change (%)</label>
                          <input
                            type="text"
                            value={stk.changePercent}
                            onChange={(e) => {
                              updateStockPrice(exchangeKey, stk.price, e.target.value);
                            }}
                            className="w-full bg-[#1A1D23] border border-[#2F333D] rounded px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#F25C05]"
                          />
                        </div>
                        <div className="text-[10px] text-right text-emerald-400 font-mono pt-1">
                          ● Realtime Synced
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section A: Stock Market API Settings */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#F25C05]" />
                      <h4 className="text-base font-bold text-white">Stock Price API Integration (এপিআই কনফিগারেশন)</h4>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                      stockApiConfig.lastSyncStatus === 'Connected' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      Status: {stockApiConfig.lastSyncStatus} ({stockApiConfig.lastSyncTimestamp})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">API Provider</label>
                      <select
                        value={apiForm.provider}
                        onChange={(e) => setApiForm({ ...apiForm, provider: e.target.value as any })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      >
                        <option value="InternalSimulation">BHP Market Data Feed (Internal)</option>
                        <option value="AlphaVantage">AlphaVantage Global Equity API</option>
                        <option value="Finnhub">Finnhub Stock & FX API</option>
                        <option value="YahooFinance">Yahoo Finance Live Quote Proxy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">API Key / Secret Token</label>
                      <input
                        type="password"
                        value={apiForm.apiKey}
                        onChange={(e) => setApiForm({ ...apiForm, apiKey: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Polling Interval (Minutes)</label>
                      <select
                        value={apiForm.pollingIntervalMinutes}
                        onChange={(e) => setApiForm({ ...apiForm, pollingIntervalMinutes: Number(e.target.value) })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      >
                        <option value={1}>1 Minute (High Frequency)</option>
                        <option value={5}>5 Minutes (Recommended)</option>
                        <option value={15}>15 Minutes (Standard Delay)</option>
                        <option value={60}>1 Hour</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isTestingApi}
                      onClick={handleTestApi}
                      className="px-4 py-2 bg-[#282B33] hover:bg-[#343842] text-xs font-bold text-gray-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin text-[#F25C05]' : ''}`} />
                      <span>{isTestingApi ? 'Testing Connection...' : 'Test API Connection'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateStockApiConfig(apiForm);
                        showToast('Stock API settings saved successfully.');
                      }}
                      className="px-4 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Save API Settings
                    </button>
                  </div>
                </div>

                {/* Section B: Financial Reports Upload/Manage */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-[#F25C05]" />
                      <h4 className="text-base font-bold text-white">Financial Reports & PDFs (বার্ষিক ও আর্থিক রিপোর্ট)</h4>
                    </div>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F25C05] hover:bg-[#d84e00] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload New Report</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {reports.map((rep) => (
                      <div key={rep.id} className="p-4 bg-[#15171A] rounded-lg border border-[#282B33] flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#F25C05] uppercase tracking-wider">{rep.tag}</span>
                          <h5 className="font-bold text-white text-sm mt-1">{rep.title}</h5>
                          <p className="text-xs text-gray-400 mt-1">{rep.pageCount} • {rep.year}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#23262E]">
                          <span className="text-xs text-gray-400">PDF Ready</span>
                          <button
                            onClick={() => {
                              if (confirm(`Remove report: "${rep.title}"?`)) {
                                deleteReport(rep.id);
                                showToast('Report removed.');
                              }
                            }}
                            className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: Event & Financial Calendar */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#F25C05]" />
                      <h4 className="text-base font-bold text-white">Event & Calendar Input (ইভেন্ট ও ক্যালেন্ডার শিডিউল)</h4>
                    </div>
                    <button
                      onClick={() => setShowEventModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F25C05] hover:bg-[#d84e00] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Investor Event</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {events.map((ev) => (
                      <div key={ev.id} className="p-4 bg-[#15171A] rounded-lg border border-[#282B33] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center p-2 bg-[#20232A] rounded border border-[#313540] min-w-[60px]">
                            <div className="text-base font-extrabold text-[#F25C05]">{ev.day}</div>
                            <div className="text-[10px] font-bold text-gray-300 uppercase">{ev.month} {ev.year}</div>
                          </div>
                          <div>
                            <h5 className="font-bold text-white text-sm">{ev.title}</h5>
                            <p className="text-xs text-gray-400">{ev.description}</p>
                            <span className="text-[11px] text-gray-400 mt-0.5 block">{ev.time} • {ev.location}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Remove event: "${ev.title}"?`)) {
                              deleteEvent(ev.id);
                              showToast('Event removed.');
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: CAREER & JOB MANAGEMENT */}
            {activeTab === 'careers' && (
              <div className="space-y-8 max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      5. Career & Job Management (চাকরি প্যানেল)
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Publish recruitment circulars, manage job statuses, and review incoming candidate CVs and resumes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setJobForm({
                        title: '',
                        department: 'Mining & Operations',
                        location: 'Perth, WA, Australia',
                        type: 'Full-time',
                        experience: '3+ years',
                        status: 'Active',
                        description: '',
                      });
                      setShowJobModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Job Circular</span>
                  </button>
                </div>

                {/* Sub-tab 1: Active Job Openings */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <h4 className="text-base font-bold text-white">Active Job Postings ({jobs.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="p-5 bg-[#15171A] rounded-lg border border-[#282B33] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#F25C05] uppercase tracking-wider">{job.department}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              job.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-300'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-base mt-1.5">{job.title}</h5>
                          <p className="text-xs text-gray-400 mt-1">{job.location} • {job.type} • {job.experience}</p>
                          <p className="text-xs text-gray-300 mt-2 line-clamp-2">{job.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#23262E] text-xs">
                          <span className="text-gray-400">Posted: {job.postedDate}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                updateJob(job.id, { status: job.status === 'Active' ? 'Closed' : 'Active' });
                                showToast(`Job status changed to ${job.status === 'Active' ? 'Closed' : 'Active'}`);
                              }}
                              className="text-gray-300 hover:text-white underline cursor-pointer"
                            >
                              Toggle Status
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete circular for: "${job.title}"?`)) {
                                  deleteJob(job.id);
                                  showToast('Job circular deleted.');
                                }
                              }}
                              className="text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-tab 2: Applicant List */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Candidate Applicant List (সিভি ও আবেদন তালিকা - {applicants.length})
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        প্রকৃত প্রার্থীরা আবেদন করলে তাদের আসল তথ্য ও সিভি এখানে স্বয়ংক্রিয়ভাবে জমা হবে
                      </p>
                    </div>
                    {applicants.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('আপনি কি সব প্রার্থীর আবেদন মুছে ফেলতে চান?')) {
                            clearAllApplicants();
                            showToast('সকল আবেদন সফলভাবে মুছে ফেলা হয়েছে');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/60 border border-red-700/50 text-red-200 text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  {applicants.length === 0 ? (
                    <div className="py-12 px-4 text-center bg-[#15171A] rounded-lg border border-dashed border-[#282B33] space-y-2">
                      <Users className="w-9 h-9 mx-auto text-gray-500 opacity-50" />
                      <p className="text-sm font-semibold text-gray-300">এখনো কোনো আবেদন জমা পড়েনি</p>
                      <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                        কোনো ডেমো আবেদন রাখা হয়নি। ওয়েবসাইট থেকে যখন প্রকৃত কেউ চাকরির আবেদন ফর্ম পূরণ করবে, তখন তার নাম, পদবী, যোগাযোগের নম্বর ও আপলোডকৃত সিভি সরাসরি এখানে দেখা যাবে।
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#15171A] text-gray-400 font-bold uppercase border-b border-[#282B33]">
                          <tr>
                            <th className="py-3 px-4">Candidate Name</th>
                            <th className="py-3 px-4">Applied Role</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4">CV / Resume</th>
                            <th className="py-3 px-4">Status Review</th>
                            <th className="py-3 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#282B33]">
                          {applicants.map((app) => (
                            <tr key={app.id} className="hover:bg-[#20232A]">
                              <td className="py-3 px-4 font-bold text-white">
                                {app.name}
                                <span className="block text-[10px] font-normal text-gray-400">Date: {app.appliedDate}</span>
                              </td>
                              <td className="py-3 px-4 text-gray-200">{app.jobTitle}</td>
                              <td className="py-3 px-4 text-gray-300">
                                <div>{app.email}</div>
                                <div className="text-gray-400">{app.phone}</div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => showToast(`Opening resume: ${app.resumeFileName}`)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#262A33] hover:bg-[#323642] text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#F25C05]" />
                                  <span>{app.resumeFileName}</span>
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={app.status}
                                  onChange={(e) => {
                                    updateApplicantStatus(app.id, e.target.value as any);
                                    showToast(`Applicant status updated to: ${e.target.value}`);
                                  }}
                                  className="bg-[#15171A] border border-[#2D313A] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#F25C05] cursor-pointer"
                                >
                                  <option value="New">New</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Shortlisted">Shortlisted</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`${app.name}-এর আবেদনটি মুছে ফেলতে চান?`)) {
                                      deleteApplicant(app.id);
                                      showToast('আবেদনটি মুছে ফেলা হয়েছে');
                                    }
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                                  title="Delete applicant"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULE 6: LEAD & INQUIRY MANAGEMENT */}
            {activeTab === 'leads' && (
              <div className="space-y-8 max-w-6xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    6. Lead & Inquiry Management (ইউজার ডাটা)
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage incoming Contact Us submissions and download verified newsletter subscribers in CSV format.
                  </p>
                </div>

                {/* Section A: Newsletter Subscribers & CSV Export */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#F25C05]" />
                        <span>Newsletter Subscribers ({subscribers.length})</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Users who submitted their email address through the news alert banners.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        exportSubscribersCsv();
                        showToast('Exporting subscribers CSV file...');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV List</span>
                    </button>
                  </div>

                  {subscribers.length === 0 ? (
                    <div className="py-8 px-4 text-center bg-[#15171A] rounded-lg border border-dashed border-[#282B33] space-y-1.5 text-xs text-gray-500">
                      <Mail className="w-6 h-6 mx-auto text-gray-600 opacity-60 mb-1" />
                      <p className="font-semibold text-gray-300">এখনো কোনো সাবস্ক্রাইবার নেই (No subscribers yet)</p>
                      <p className="text-gray-500 max-w-sm mx-auto text-[11px]">
                        কোনো ডেমো সাবস্ক্রাইবার রাখা হয়নি। ভিজিটররা নিউজলেটার সাবস্ক্রাইব করলে তাদের ইমেইল এখানে তালিকাভুক্ত হবে।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {subscribers.map((sub) => (
                        <div key={sub.id} className="p-3 bg-[#15171A] rounded-lg border border-[#282B33] text-xs">
                          <span className="font-semibold text-white block truncate">{sub.email}</span>
                          <div className="text-[10px] text-gray-400 flex items-center justify-between mt-1">
                            <span>{sub.subscribedAt}</span>
                            <span className="bg-[#242831] px-1.5 py-0.5 rounded text-gray-300">{sub.source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section B: Contact Us Form Submissions */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white">Contact Us Form Submissions ({inquiries.length})</h4>
                    <span className="text-xs text-gray-400">Updated in real-time</span>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="py-12 px-4 text-center bg-[#15171A] rounded-lg border border-dashed border-[#282B33] space-y-2">
                      <Mail className="w-8 h-8 mx-auto text-gray-500 opacity-50" />
                      <p className="text-sm font-semibold text-gray-300">কোনো ইনকোয়ারি বা মেসেজ নেই</p>
                      <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                        সকল ডেমো মেসেজ মুছে দেওয়া হয়েছে। ওয়েবসাইট থেকে প্রকৃত ভিজিটর Contact Us ফর্ম পূরণ করলে তার নাম, ইমেইল, ফোন ও বার্তা রিয়েলটাইমে এখানে জমা হবে।
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="p-4 bg-[#15171A] rounded-lg border border-[#282B33] space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold text-white text-sm">
                              <span>{inq.name}</span>
                              {inq.country && <span className="text-xs text-gray-400 font-normal">({inq.country})</span>}
                              <span className="text-xs font-mono text-[#F25C05] bg-[#F25C05]/10 px-2 py-0.5 rounded">
                                {inq.inquiryType}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{inq.submittedAt}</span>
                              <select
                                value={inq.status}
                                onChange={(e) => {
                                  updateInquiryStatus(inq.id, e.target.value as any);
                                  showToast(`Inquiry marked as ${e.target.value}`);
                                }}
                                className="bg-[#1C1E23] border border-[#2F333D] rounded px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Replied">Replied</option>
                                <option value="Archived">Archived</option>
                              </select>
                              <button
                                onClick={() => {
                                  if (confirm('Delete inquiry message?')) {
                                    deleteInquiry(inq.id);
                                    showToast('Inquiry deleted.');
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-gray-300 bg-[#1A1C20] p-3 rounded border border-[#24272E]">
                            "{inq.message}"
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>Email: <a href={`mailto:${inq.email}`} className="text-white hover:underline">{inq.email}</a></span>
                            {inq.phone && <span>Phone: <span className="text-white">{inq.phone}</span></span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULE 7: GENERAL SETTINGS & ACCESS CONTROL */}
            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-6xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    7. General Settings & Access Control (সেটিংস)
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage corporate identity, social media links, admin security credentials, and search engine optimization.
                  </p>
                </div>

                {/* Section A: Site Settings */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#F25C05]" />
                    <span>Site Identity & Corporate Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Company Brand Name</label>
                      <input
                        type="text"
                        value={siteForm.brandName}
                        onChange={(e) => setSiteForm({ ...siteForm, brandName: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Logo Wordmark</label>
                      <input
                        type="text"
                        value={siteForm.logoText}
                        onChange={(e) => setSiteForm({ ...siteForm, logoText: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Primary Official Email</label>
                      <input
                        type="text"
                        value={siteForm.primaryEmail}
                        onChange={(e) => setSiteForm({ ...siteForm, primaryEmail: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Global Phone Contact</label>
                      <input
                        type="text"
                        value={siteForm.supportPhone}
                        onChange={(e) => setSiteForm({ ...siteForm, supportPhone: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-gray-300 block mb-2">Social Media Links (Facebook, LinkedIn, X, YouTube)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">LinkedIn Profile URL</label>
                        <input
                          type="text"
                          value={siteForm.linkedinUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, linkedinUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">Facebook Page URL</label>
                        <input
                          type="text"
                          value={siteForm.facebookUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, facebookUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">X (Twitter) URL</label>
                        <input
                          type="text"
                          value={siteForm.twitterUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, twitterUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-0.5">YouTube Channel URL</label>
                        <input
                          type="text"
                          value={siteForm.youtubeUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, youtubeUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Announcement Banner Setting */}
                  <div className="p-4 bg-[#15171A] rounded-lg border border-[#282B33] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-white block">
                          Top Live Announcement Banner (শীর্ষ লাইভ নোটিশ বার)
                        </label>
                        <p className="text-[11px] text-gray-400">
                          ওয়েবসাইটের একদম উপরে কমলা রঙের নোটিশ বার সক্রিয়/নিষ্ক্রিয় করুন
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="announcementToggle"
                        checked={siteForm.announcementEnabled || false}
                        onChange={(e) => setSiteForm({ ...siteForm, announcementEnabled: e.target.checked })}
                        className="w-4 h-4 accent-[#F25C05] cursor-pointer"
                      />
                    </div>
                    {siteForm.announcementEnabled && (
                      <div>
                        <label className="block text-[11px] text-gray-300 font-semibold mb-1">
                          Announcement Notice Text (বার্তা লিখুন)
                        </label>
                        <input
                          type="text"
                          value={siteForm.announcementText || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, announcementText: e.target.value })}
                          placeholder="e.g. BHP FY25 Half Year Results & Webcast available now"
                          className="w-full bg-[#1C1E24] border border-[#353945] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Footer Copyright Notice</label>
                    <input
                      type="text"
                      value={siteForm.footerCopyright}
                      onChange={(e) => setSiteForm({ ...siteForm, footerCopyright: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSiteSettings(siteForm);
                        showToast('Site settings updated successfully.');
                      }}
                      className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Save Site Settings
                    </button>
                  </div>
                </div>

                {/* Section B: Admin Password & Access Control */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#F25C05]" />
                    <span>Admin Security & Password Change (পাসওয়ার্ড পরিবর্তন)</span>
                  </h4>

                  <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={pwdForm.oldPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="At least 6 characters"
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#282B33] hover:bg-[#353944] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Section C: SEO Management */}
                <div className="p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#F25C05]" />
                    <span>SEO Management & Social Graph (মেটা ও এসইও সেটিংস)</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Meta Title (পৃষ্ঠার শিরোনাম)</label>
                      <input
                        type="text"
                        value={seoForm.metaTitle}
                        onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Meta Description (সার্চ বিবরণ)</label>
                      <textarea
                        rows={3}
                        value={seoForm.metaDescription}
                        onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                        className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Keywords (কী-ওয়ার্ডস)</label>
                        <input
                          type="text"
                          value={seoForm.keywords}
                          onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">OG Share Image URL</label>
                        <input
                          type="text"
                          value={seoForm.ogImageUrl}
                          onChange={(e) => setSeoForm({ ...seoForm, ogImageUrl: e.target.value })}
                          className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Google Search Snippet Preview */}
                  <div className="mt-4 p-4 bg-[#15171A] rounded-lg border border-[#252830]">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Google Search Result Snippet Preview:
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 truncate">https://www.bhp.com</div>
                      <div className="text-base text-[#8AB4F8] hover:underline font-medium cursor-pointer">
                        {seoForm.metaTitle}
                      </div>
                      <div className="text-xs text-gray-300 line-clamp-2">
                        {seoForm.metaDescription}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSeoSettings(seoForm);
                        showToast('SEO settings saved successfully.');
                      }}
                      className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Save SEO Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: POSITIVE LIST FOR SKILLED WORK */}
            {activeTab === 'positive-list' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Module Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1C1E23] p-6 rounded-xl border border-[#2B2F38]">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FFCD00] uppercase tracking-wider mb-1">
                      <Award className="w-4 h-4 text-[#FFCD00]" />
                      <span>ANZSCO Priority Migration Skilled Occupation List (PMSOL)</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Positive List for Skilled Work Management
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
                      Add, edit, or remove approved Australian skilled occupations. Changes synchronize in real-time with the client Document Verification Portal.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleResetPositiveList}
                      className="px-3.5 py-2 bg-[#262A33] hover:bg-[#323742] text-gray-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#3A404E]"
                      title="Restore original standard occupations"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Standard List</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenAddOccupation}
                      className="px-4 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Occupation</span>
                    </button>
                  </div>
                </div>

                {/* Search & Sector Filters */}
                <div className="bg-[#1C1E23] p-4 rounded-xl border border-[#2B2F38] flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={positiveListSearch}
                      onChange={(e) => setPositiveListSearch(e.target.value)}
                      placeholder="Search occupation title, ANZSCO code, or authority..."
                      className="w-full pl-9 pr-3 py-2 bg-[#15171A] border border-[#2E323D] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap hidden md:inline">Sector:</span>
                    {['ALL', 'Mining & Resources', 'Engineering', 'Construction & Trades', 'IT & Technology', 'Healthcare'].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setPositiveListSectorFilter(sec)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          positiveListSectorFilter === sec
                            ? 'bg-[#FFCD00] text-black font-bold'
                            : 'bg-[#15171A] text-gray-400 hover:text-white border border-[#2E323D]'
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occupations Table */}
                <div className="bg-[#1C1E23] rounded-xl border border-[#2B2F38] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#2B2F38] flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-300">
                      Approved Occupations Database ({positiveList.length} total)
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Live sync to Portal: Row 2 Item 4 & Positive List Section
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-[#15171A] text-gray-400 uppercase text-[10px] font-bold border-b border-[#2B2F38]">
                        <tr>
                          <th className="px-4 py-3">ANZSCO</th>
                          <th className="px-4 py-3">Occupation Title</th>
                          <th className="px-4 py-3">Sector</th>
                          <th className="px-4 py-3">Eligible Visas</th>
                          <th className="px-4 py-3">Assessing Body</th>
                          <th className="px-4 py-3">Min Salary</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#262932]">
                        {positiveList
                          .filter((item) => {
                            const q = positiveListSearch.toLowerCase();
                            const matchesSearch =
                              item.title.toLowerCase().includes(q) ||
                              item.anzscoCode.includes(q) ||
                              item.assessingAuthority.toLowerCase().includes(q);
                            const matchesSector =
                              positiveListSectorFilter === 'ALL' || item.sector === positiveListSectorFilter;
                            return matchesSearch && matchesSector;
                          })
                          .map((item) => (
                            <tr key={item.anzscoCode} className="hover:bg-[#20232A] transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-white whitespace-nowrap">
                                <span className="bg-[#15171A] px-2 py-0.5 rounded border border-[#2E323D]">
                                  {item.anzscoCode}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-white">
                                <div>{item.title}</div>
                                <span className="text-[10px] text-emerald-400 font-medium">
                                  {item.priorityStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                                <div>{item.sector}</div>
                                <div className="text-[10px] text-gray-500">{item.skillLevel.split('(')[0]}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {item.eligibleVisas.map((v) => (
                                    <span
                                      key={v}
                                      className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/40 text-[10px] font-mono font-bold"
                                    >
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-300 whitespace-nowrap font-medium">
                                {item.assessingAuthority}
                              </td>
                              <td className="px-4 py-3 text-amber-300 font-mono font-bold whitespace-nowrap">
                                {item.minSalaryAUD}
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditOccupation(item)}
                                    className="p-1.5 text-gray-300 hover:text-white bg-[#252830] hover:bg-[#323640] rounded transition-colors cursor-pointer"
                                    title="Edit Occupation"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOccupation(item.anzscoCode, item.title)}
                                    className="p-1.5 text-gray-300 hover:text-red-300 bg-[#252830] hover:bg-red-950/70 rounded transition-colors cursor-pointer"
                                    title="Remove from Positive List"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* MODAL: Commodity Add/Edit Dialog */}
        {showCommodityModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-xl rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <h4 className="font-bold text-base text-white">
                  {editingCommodity ? `Edit Commodity: ${editingCommodity.name}` : 'Add New Commodity (নতুন পণ্য)'}
                </h4>
                <button onClick={() => setShowCommodityModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCommodity} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Commodity Name (যেমন: Copper, Lithium)</label>
                  <input
                    type="text"
                    required
                    value={commodityForm.name}
                    onChange={(e) => setCommodityForm({ ...commodityForm, name: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Description (পণ্যের বর্ণনা)</label>
                  <textarea
                    rows={2}
                    required
                    value={commodityForm.description}
                    onChange={(e) => setCommodityForm({ ...commodityForm, description: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Use Cases / Decarbonisation Applications</label>
                  <textarea
                    rows={2}
                    value={commodityForm.secondaryText}
                    onChange={(e) => setCommodityForm({ ...commodityForm, secondaryText: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Image URL (ছবি লিংক)</label>
                  <input
                    type="text"
                    value={commodityForm.imageUrl}
                    onChange={(e) => setCommodityForm({ ...commodityForm, imageUrl: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Stat 1 Label & Value</label>
                    <input
                      type="text"
                      placeholder="Label"
                      value={commodityForm.statLabel1}
                      onChange={(e) => setCommodityForm({ ...commodityForm, statLabel1: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-2.5 py-1.5 text-xs text-white mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={commodityForm.statValue1}
                      onChange={(e) => setCommodityForm({ ...commodityForm, statValue1: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Stat 2 Label & Value</label>
                    <input
                      type="text"
                      placeholder="Label"
                      value={commodityForm.statLabel2}
                      onChange={(e) => setCommodityForm({ ...commodityForm, statLabel2: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-2.5 py-1.5 text-xs text-white mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={commodityForm.statValue2}
                      onChange={(e) => setCommodityForm({ ...commodityForm, statValue2: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowCommodityModal(false)}
                    className="px-4 py-2 bg-[#252830] text-gray-300 rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded text-xs font-bold"
                  >
                    Save Commodity
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: News Add/Edit Dialog */}
        {showNewsModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-xl rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <h4 className="font-bold text-base text-white">
                  {editingNews ? 'Edit News Article' : 'Add New Press Release (নতুন সংবাদ)'}
                </h4>
                <button onClick={() => setShowNewsModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNews} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Headline / Title</label>
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Badges (comma separated)</label>
                    <input
                      type="text"
                      value={newsForm.badges}
                      onChange={(e) => setNewsForm({ ...newsForm, badges: e.target.value })}
                      placeholder="NEWS, SUSTAINABILITY"
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={newsForm.readTime}
                      onChange={(e) => setNewsForm({ ...newsForm, readTime: e.target.value })}
                      placeholder="3 min read"
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={newsForm.imageUrl}
                    onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowNewsModal(false)}
                    className="px-4 py-2 bg-[#252830] text-gray-300 rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded text-xs font-bold"
                  >
                    Publish Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Report Add Dialog */}
        {showReportModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <h4 className="font-bold text-base text-white">Upload Financial Report (পিডিএফ রিপোর্ট)</h4>
                <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReport} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Report Title</label>
                  <input
                    type="text"
                    required
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    placeholder="e.g. BHP Operational Review Q3 2026"
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Tag / Category</label>
                    <input
                      type="text"
                      value={reportForm.tag}
                      onChange={(e) => setReportForm({ ...reportForm, tag: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Page Count</label>
                    <input
                      type="text"
                      value={reportForm.pageCount}
                      onChange={(e) => setReportForm({ ...reportForm, pageCount: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Brief Summary</label>
                  <textarea
                    rows={2}
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-[#252830] text-gray-300 rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded text-xs font-bold"
                  >
                    Upload Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Event Add Dialog */}
        {showEventModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <h4 className="font-bold text-base text-white">Schedule Investor Event (ইভেন্ট যোগ করুন)</h4>
                <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Annual General Meeting (AGM) 2026"
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Day</label>
                    <input
                      type="text"
                      value={eventForm.day}
                      onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Month</label>
                    <input
                      type="text"
                      value={eventForm.month}
                      onChange={(e) => setEventForm({ ...eventForm, month: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Year</label>
                    <input
                      type="text"
                      value={eventForm.year}
                      onChange={(e) => setEventForm({ ...eventForm, year: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Time & Location</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      placeholder="08:30 AEST"
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="Location / Webcast"
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 bg-[#252830] text-gray-300 rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded text-xs font-bold"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Job Posting Dialog */}
        {showJobModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <h4 className="font-bold text-base text-white">Publish Job Circular (চাকরির বিজ্ঞপ্তি)</h4>
                <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Job Title (পদের নাম)</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. Principal Geologist"
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Department</label>
                    <input
                      type="text"
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Employment Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as any })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Experience Required</label>
                    <input
                      type="text"
                      value={jobForm.experience}
                      onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Key Responsibilities / Description</label>
                  <textarea
                    rows={3}
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="px-4 py-2 bg-[#252830] text-gray-300 rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded text-xs font-bold"
                  >
                    Publish Circular
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Dedicated Change Password Dialog */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#F25C05]" />
                  <h4 className="font-bold text-base text-white">Change AP Password (পাসওয়ার্ড পরিবর্তন)</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Current Password (বর্তমান পাসওয়ার্ড)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={pwdForm.oldPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    New Password (নতুন পাসওয়ার্ড)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={pwdForm.newPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Confirm New Password (পুনরায় লিখুন)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={pwdForm.confirmPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2 bg-[#252830] text-gray-300 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Positive List Add / Edit Dialog */}
        {showPositiveListModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-xl rounded-xl p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FFCD00]" />
                  <h4 className="font-bold text-base text-white">
                    {editingOccupation
                      ? `Edit Occupation: ${editingOccupation.title} (${editingOccupation.anzscoCode})`
                      : 'Add New Skilled Occupation (নতুন পেশা যোগ করুন)'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPositiveListModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveOccupation} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      ANZSCO Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 233611"
                      value={occupationForm.anzscoCode}
                      onChange={(e) => setOccupationForm({ ...occupationForm, anzscoCode: e.target.value })}
                      disabled={!!editingOccupation}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white disabled:opacity-50 focus:outline-none focus:border-[#F25C05]"
                    />
                    {editingOccupation && (
                      <span className="text-[10px] text-gray-400">ANZSCO code is unique identifier.</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Priority Status
                    </label>
                    <select
                      value={occupationForm.priorityStatus}
                      onChange={(e) => setOccupationForm({ ...occupationForm, priorityStatus: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                    >
                      <option value="Critical Skills Priority">Critical Skills Priority</option>
                      <option value="High Demand">High Demand</option>
                      <option value="Regional Priority">Regional Priority</option>
                      <option value="Medium Demand">Medium Demand</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Occupation Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mining & Petroleum Engineer"
                    value={occupationForm.title}
                    onChange={(e) => setOccupationForm({ ...occupationForm, title: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Industry Sector
                    </label>
                    <select
                      value={occupationForm.sector}
                      onChange={(e) => setOccupationForm({ ...occupationForm, sector: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                    >
                      <option value="Mining & Resources">Mining & Resources</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Construction & Trades">Construction & Trades</option>
                      <option value="IT & Technology">IT & Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Agriculture & Environment">Agriculture & Environment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Skill Level
                    </label>
                    <select
                      value={occupationForm.skillLevel}
                      onChange={(e) => setOccupationForm({ ...occupationForm, skillLevel: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                    >
                      <option value="Skill Level 1 (Bachelor degree or higher)">Skill Level 1 (Bachelor degree or higher)</option>
                      <option value="Skill Level 2 (Associate degree / Diploma)">Skill Level 2 (Associate degree / Diploma)</option>
                      <option value="Skill Level 3 (Certificate IV / III + experience)">Skill Level 3 (Certificate IV / III + experience)</option>
                      <option value="Skill Level 4 (Certificate II / III)">Skill Level 4 (Certificate II / III)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Eligible Visas (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 482, 186, 189, 190, 491"
                      value={occupationForm.eligibleVisas}
                      onChange={(e) => setOccupationForm({ ...occupationForm, eligibleVisas: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Assessing Authority Body
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engineers Australia / VETASSESS"
                      value={occupationForm.assessingAuthority}
                      onChange={(e) => setOccupationForm({ ...occupationForm, assessingAuthority: e.target.value })}
                      className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Minimum Base Salary Threshold (AUD)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $135,000 AUD"
                    value={occupationForm.minSalaryAUD}
                    onChange={(e) => setOccupationForm({ ...occupationForm, minSalaryAUD: e.target.value })}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                  <button
                    type="button"
                    onClick={() => setShowPositiveListModal(false)}
                    className="px-4 py-2 bg-[#252830] hover:bg-[#323640] text-gray-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    {editingOccupation ? 'Save Changes' : 'Add to Positive List'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
