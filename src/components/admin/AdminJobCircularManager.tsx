import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RotateCcw,
  Users,
  FileText,
  Clock,
  MapPin,
  DollarSign,
  Award,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  User,
  Home,
  CreditCard,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { JobCategory, JobRequirement, JobApplication } from '../../types/jobCircular';
import {
  getStoredJobCategories,
  saveJobCategories,
  addJobCategory,
  removeJobCategory,
  updateJobCategory,
  resetJobCategoriesToDefault,
  getStoredJobRequirements,
  getJobRequirementByCategoryId,
  upsertJobRequirement,
  deleteJobRequirement,
  resetJobRequirementsToDefault,
  getStoredJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
  clearAllJobApplications,
  JOB_CATEGORIES_UPDATED_EVENT,
  JOB_REQUIREMENTS_UPDATED_EVENT,
  JOB_APPLICATIONS_UPDATED_EVENT,
} from '../../utils/jobCircularStorage';

interface AdminJobCircularManagerProps {
  showToast: (msg: string) => void;
}

type CircularSubTab = 'categories' | 'requirements' | 'history';

export const AdminJobCircularManager: React.FC<AdminJobCircularManagerProps> = ({
  showToast,
}) => {
  const [subTab, setSubTab] = useState<CircularSubTab>('categories');

  // Categories state
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Requirements state
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [selectedCatIdForReq, setSelectedCatIdForReq] = useState<string>('');
  const [reqForm, setReqForm] = useState<Partial<JobRequirement>>({
    jobTitle: '',
    vacancy: '',
    salary: '',
    location: '',
    dutyHours: '',
    experience: '',
    ageLimit: '',
    education: '',
    requirements: [],
    benefits: [],
    deadline: '',
    description: '',
    status: 'Active',
  });
  const [reqRequirementsText, setReqRequirementsText] = useState('');
  const [reqBenefitsText, setReqBenefitsText] = useState('');

  // History state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState('all');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');
  const [viewingApp, setViewingApp] = useState<JobApplication | null>(null);

  // Load all data
  const loadAllData = () => {
    const cats = getStoredJobCategories();
    setCategories(cats);

    const reqs = getStoredJobRequirements();
    setRequirements(reqs);

    const apps = getStoredJobApplications();
    setApplications(apps);

    if (cats.length > 0 && !selectedCatIdForReq) {
      setSelectedCatIdForReq(cats[0].id);
    }
  };

  useEffect(() => {
    loadAllData();

    const handleCatsUpdated = () => setCategories(getStoredJobCategories());
    const handleReqsUpdated = () => setRequirements(getStoredJobRequirements());
    const handleAppsUpdated = () => setApplications(getStoredJobApplications());

    window.addEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleCatsUpdated);
    window.addEventListener(JOB_REQUIREMENTS_UPDATED_EVENT, handleReqsUpdated);
    window.addEventListener(JOB_APPLICATIONS_UPDATED_EVENT, handleAppsUpdated);
    window.addEventListener('storage', loadAllData);

    return () => {
      window.removeEventListener(JOB_CATEGORIES_UPDATED_EVENT, handleCatsUpdated);
      window.removeEventListener(JOB_REQUIREMENTS_UPDATED_EVENT, handleReqsUpdated);
      window.removeEventListener(JOB_APPLICATIONS_UPDATED_EVENT, handleAppsUpdated);
      window.removeEventListener('storage', loadAllData);
    };
  }, []);

  // When selectedCatIdForReq changes, populate reqForm
  useEffect(() => {
    if (!selectedCatIdForReq) return;
    const cat = categories.find((c) => c.id === selectedCatIdForReq);
    if (!cat) return;

    const req = getJobRequirementByCategoryId(selectedCatIdForReq);
    if (req) {
      setReqForm({ ...req });
      setReqRequirementsText(req.requirements ? req.requirements.join('\n') : '');
      setReqBenefitsText(req.benefits ? req.benefits.join('\n') : '');
    } else {
      setReqForm({
        id: `req-${cat.id}`,
        categoryId: cat.id,
        categoryName: cat.name,
        jobTitle: `${cat.name} Specialist (কর্মী)`,
        vacancy: '25 Posts (২৫ জন)',
        salary: '$3,800 - $4,800 AUD / Month',
        location: 'BHP Operations Sites & Facilities',
        dutyHours: '8 Hours / Day',
        experience: '1-2 Years Experience (বা নতুন/Fresher)',
        ageLimit: '20 to 45 Years',
        education: 'SSC / Equivalent',
        description: `BHP গ্লোবাল অপারেশনে ${cat.name} পদে কাজের জন্য যোগ্য প্রার্থী আবশ্যক।`,
        status: 'Active',
        deadline: 'Open / Ongoing 2026 Recruitment',
      });
      setReqRequirementsText(
        `Technical knowledge and practical trade skill in ${cat.name}\nPhysical fitness and adherence to site safety guidelines\nDisciplined, punctual and responsible attitude`
      );
      setReqBenefitsText(
        `Free Company Accommodation (কোম্পানির ফ্রি থাকা)\nFree Food / Meals Provided (ফ্রি খাবার)\nFull Medical & Health Insurance (চিকিৎসা সুবিধা)\nOvertime Allowance & Annual Leave with Ticket`
      );
    }
  }, [selectedCatIdForReq, categories, requirements]);

  // ----------------------------------------------------
  // Handlers: Categories
  // ----------------------------------------------------
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const added = addJobCategory(newCatName.trim());
    setNewCatName('');
    showToast(`Category "${added.name}" added successfully!`);
    setSelectedCatIdForReq(added.id);
  };

  const handleSaveEditCategory = (id: string) => {
    if (!editingCatName.trim()) return;
    updateJobCategory(id, editingCatName.trim());
    setEditingCatId(null);
    setEditingCatName('');
    showToast('Category renamed successfully!');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove category "${name}"?`)) {
      removeJobCategory(id);
      showToast(`Category "${name}" removed.`);
    }
  };

  const handleResetCategories = () => {
    if (window.confirm('Reset all categories back to standard 10 defaults?')) {
      resetJobCategoriesToDefault();
      resetJobRequirementsToDefault();
      showToast('Categories & Requirements reset to defaults.');
    }
  };

  // ----------------------------------------------------
  // Handlers: Requirements
  // ----------------------------------------------------
  const handleSaveRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === selectedCatIdForReq);
    if (!cat) {
      showToast('Please select a valid category first.');
      return;
    }

    const reqList = reqRequirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const benefitList = reqBenefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedReq: JobRequirement = {
      id: reqForm.id || `req-${cat.id}`,
      categoryId: cat.id,
      categoryName: cat.name,
      jobTitle: reqForm.jobTitle?.trim() || `${cat.name} Specialist`,
      vacancy: reqForm.vacancy?.trim() || '20 Posts',
      salary: reqForm.salary?.trim() || '$3,500 - $4,500 AUD / Month',
      location: reqForm.location?.trim() || 'BHP Sites & Operations',
      dutyHours: reqForm.dutyHours?.trim() || '8 Hours / Day',
      experience: reqForm.experience?.trim() || '1+ Year Experience',
      ageLimit: reqForm.ageLimit?.trim() || '21 to 45 Years',
      education: reqForm.education?.trim() || 'SSC / Equivalent',
      requirements: reqList,
      benefits: benefitList,
      deadline: reqForm.deadline?.trim() || 'Ongoing 2026',
      description: reqForm.description?.trim() || '',
      status: reqForm.status === 'Closed' ? 'Closed' : 'Active',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    upsertJobRequirement(updatedReq);
    showToast(`Requirements for "${cat.name}" saved! Visitors will now see these details on the website.`);
  };

  // ----------------------------------------------------
  // Handlers: Applications History
  // ----------------------------------------------------
  const handleUpdateStatus = (id: string, newStatus: JobApplication['status']) => {
    updateJobApplicationStatus(id, newStatus);
    showToast(`Application ${id} status updated to: ${newStatus}`);
    if (viewingApp && viewingApp.id === id) {
      setViewingApp({ ...viewingApp, status: newStatus });
    }
  };

  const handleDeleteApp = (id: string) => {
    if (window.confirm(`Delete application ${id}?`)) {
      deleteJobApplication(id);
      showToast('Application deleted.');
      if (viewingApp?.id === id) setViewingApp(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all applicant history? This cannot be undone.')) {
      clearAllJobApplications();
      showToast('All application history cleared.');
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (historyCategoryFilter !== 'all' && app.categoryId !== historyCategoryFilter) {
      return false;
    }
    if (historyStatusFilter !== 'all' && app.status !== historyStatusFilter) {
      return false;
    }
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      const match =
        app.id.toLowerCase().includes(q) ||
        app.fullName.toLowerCase().includes(q) ||
        app.phone.toLowerCase().includes(q) ||
        app.categoryName.toLowerCase().includes(q) ||
        app.nidOrPassport.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Module Title & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2A2E37]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#F25C05]/20 text-[#F25C05] border border-[#F25C05]/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Job Circular Management (জব সার্কুলার প্যানেল)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Manage website 3-line circular categories, configure requirements & review online applicant submissions.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Main Sub-options */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#17191D] rounded-xl border border-[#2D313A]">
          <button
            type="button"
            onClick={() => setSubTab('categories')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'categories'
                ? 'bg-[#F25C05] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#23272F]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1. Categories (ক্যাটাগরি)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-white font-mono">
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('requirements')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'requirements'
                ? 'bg-[#F25C05] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#23272F]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Requirements (রিকোয়ারমেন্ট)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('history')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'history'
                ? 'bg-[#F25C05] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#23272F]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>3. Job Circular History (হিস্ট্রি)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                applications.length > 0 ? 'bg-emerald-500 text-black' : 'bg-black/40 text-gray-300'
              }`}
            >
              {applications.length}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUB-VIEW 1: CATEGORIES ADD / REMOVE
         ========================================================================= */}
      {subTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Add Category Card */}
          <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#F25C05]" />
                  <span>নতুন ক্যাটাগরি যোগ করুন (Add New Category)</span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  যে ক্যাটাগরি যোগ করবেন তা স্বয়ংক্রিয়ভাবে ওয়েবসাইটের ৩-লাইনের "JOB CIRCULAR" মেনুতে যুক্ত হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetCategories}
                className="px-3 py-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Restore default 10 categories"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="যেমন: Welder, Painter, Security Guard, Chef..."
                className="flex-1 bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="px-6 py-2.5 bg-[#F25C05] hover:bg-[#D94F04] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </form>
          </div>

          {/* Current Categories List */}
          <div className="p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E37]">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Active Website Job Categories ({categories.length})
                </h4>
                <p className="text-xs text-gray-400">
                  নিচের ক্যাটাগরিগুলো বর্তমানে ওয়েবসাইটের ৩-লাইন মেনুতে দৃশ্যমান রয়েছে:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat, idx) => {
                const isEditing = editingCatId === cat.id;
                const req = requirements.find((r) => r.categoryId === cat.id);
                const appCount = applications.filter((a) => a.categoryId === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    className="p-4 bg-[#15171A] rounded-xl border border-[#282B33] hover:border-[#3D424F] transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#242730] text-gray-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        {isEditing ? (
                          <div className="flex-1 flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              className="flex-1 bg-[#101113] border border-[#F25C05] rounded px-2 py-1 text-xs text-white"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditCategory(cat.id)}
                              className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCatId(null)}
                              className="p-1 rounded bg-gray-700 text-gray-300"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <h5 className="text-sm font-bold text-white">{cat.name}</h5>
                            <span className="text-[10px] text-gray-500 font-mono">
                              ID: {cat.id}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            req
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {req ? 'Requirement Ready' : 'Needs Requirement'}
                        </span>
                        <span className="text-gray-400">
                          Applications: <strong className="text-white">{appCount}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#23262E] gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCatIdForReq(cat.id);
                          setSubTab('requirements');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#22252C] hover:bg-[#2C313C] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-[#38bdf8]" />
                        <span>Edit Requirement</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatName(cat.name);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#252830] text-gray-400 hover:text-white transition-colors cursor-pointer"
                          title="Rename Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-VIEW 2: REQUIREMENTS ADD / EDIT / REMOVE
         ========================================================================= */}
      {subTab === 'requirements' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Category Selector Bar */}
          <div className="p-4 bg-[#1C1E23] rounded-xl border border-[#2D313A] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                ক্যাটাগরি নির্বাচন করুন (Select Category to Configure):
              </span>
              <select
                value={selectedCatIdForReq}
                onChange={(e) => setSelectedCatIdForReq(e.target.value)}
                className="bg-[#121316] border border-[#3B3F4A] rounded-xl px-3 py-2 text-xs font-bold text-[#FF8E4D] focus:outline-none focus:border-[#F25C05] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-gray-400">
              Editing circular for:{' '}
              <strong className="text-white">
                {categories.find((c) => c.id === selectedCatIdForReq)?.name || 'N/A'}
              </strong>
            </div>
          </div>

          {/* Requirement Edit Form */}
          <form
            onSubmit={handleSaveRequirement}
            className="p-5 sm:p-6 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E37]">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#F25C05]" />
                  <span>
                    সার্কুলার ও রিকোয়ারমেন্ট বিবরণী (Job Circular & Requirements Data)
                  </span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  এখানে যা সংরক্ষণ করবেন, ওয়েবসাইটে এই ক্যাটাগরিতে ক্লিক করলে গ্রাহকরা ঠিক তাই দেখতে পাবেন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Status:</span>
                <select
                  value={reqForm.status || 'Active'}
                  onChange={(e) =>
                    setReqForm({ ...reqForm, status: e.target.value as 'Active' | 'Closed' })
                  }
                  className="bg-[#121316] border border-[#3B3F4A] rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-400 focus:outline-none"
                >
                  <option value="Active">Active (চলমান)</option>
                  <option value="Closed">Closed (বন্ধ)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300">
                  পদের নাম ও টাইটেল (Job Title / Designation) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reqForm.jobTitle || ''}
                  onChange={(e) => setReqForm({ ...reqForm, jobTitle: e.target.value })}
                  placeholder="যেমন: Industrial Electrician & Wireman (ইলেকট্রিশিয়ান)"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Vacancy */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  পদ সংখ্যা (Vacancy / Total Posts)
                </label>
                <input
                  type="text"
                  value={reqForm.vacancy || ''}
                  onChange={(e) => setReqForm({ ...reqForm, vacancy: e.target.value })}
                  placeholder="যেমন: 35 Posts (৩৫ জন)"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Salary */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  মাসিক বেতন (Monthly Salary / Compensation)
                </label>
                <input
                  type="text"
                  value={reqForm.salary || ''}
                  onChange={(e) => setReqForm({ ...reqForm, salary: e.target.value })}
                  placeholder="যেমন: $4,200 - $5,600 AUD / Month (৳৩,৩০,০০০ - ৳৪,৪০,০০০)"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  কাজের স্থান (Job Location)
                </label>
                <input
                  type="text"
                  value={reqForm.location || ''}
                  onChange={(e) => setReqForm({ ...reqForm, location: e.target.value })}
                  placeholder="যেমন: BHP Western Australia Sites & Mining Operations"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Duty Hours */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  কাজের সময় ও শিফট (Duty Hours / Shift)
                </label>
                <input
                  type="text"
                  value={reqForm.dutyHours || ''}
                  onChange={(e) => setReqForm({ ...reqForm, dutyHours: e.target.value })}
                  placeholder="যেমন: 8 Hours / Day (Overtime allowed)"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  কাজের অভিজ্ঞতা (Experience Required)
                </label>
                <input
                  type="text"
                  value={reqForm.experience || ''}
                  onChange={(e) => setReqForm({ ...reqForm, experience: e.target.value })}
                  placeholder="যেমন: 1-3 Years in Electrical Installation (বা নতুন/Fresher)"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Age Limit */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  বয়সসীমা (Age Limit)
                </label>
                <input
                  type="text"
                  value={reqForm.ageLimit || ''}
                  onChange={(e) => setReqForm({ ...reqForm, ageLimit: e.target.value })}
                  placeholder="যেমন: 21 to 45 Years"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Education */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  শিক্ষাগত যোগ্যতা (Educational Qualification)
                </label>
                <input
                  type="text"
                  value={reqForm.education || ''}
                  onChange={(e) => setReqForm({ ...reqForm, education: e.target.value })}
                  placeholder="যেমন: SSC / Vocational / Diploma or Trade Training Certificate"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  আবেদনের শেষ সময় (Application Deadline)
                </label>
                <input
                  type="text"
                  value={reqForm.deadline || ''}
                  onChange={(e) => setReqForm({ ...reqForm, deadline: e.target.value })}
                  placeholder="যেমন: 30 October 2026 (বা Open / Ongoing)"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Specific Requirements / Skills (One per line) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300">
                  কাজের রিকোয়ারমেন্ট ও দক্ষতা (Specific Job Requirements - প্রতি লাইনে একটি করে লিখুন):
                </label>
                <textarea
                  rows={4}
                  value={reqRequirementsText}
                  onChange={(e) => setReqRequirementsText(e.target.value)}
                  placeholder={`Basic electrical wiring, switchboard installation and repair knowledge\nFamiliarity with circuit diagrams, testing equipment and safety protocols\nPhysical fitness for site operations and technical work\nGood teamwork and commitment to workplace safety standards`}
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>

              {/* Benefits / Facilities (One per line) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300">
                  কোম্পানি সুযোগ-সুবিধা (Facilities & Benefits - প্রতি লাইনে একটি করে লিখুন):
                </label>
                <textarea
                  rows={4}
                  value={reqBenefitsText}
                  onChange={(e) => setReqBenefitsText(e.target.value)}
                  placeholder={`Free Accommodation (কোম্পানির ফ্রি আবাসন)\nFree Food / Food Allowance (ফ্রি খাবার বা খাবার ভাতা)\nMedical & Health Insurance (মেডিকেল ও হেলথ ইন্স্যুরেন্স)\nAnnual Leave & Return Air Ticket (বার্ষিক ছুটি ও বিমান টিকেট)\nOvertime allowance as per company regulations`}
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300">
                  সার্কুলারের পূর্ণাঙ্গ বিবরণ (Official Description Overview):
                </label>
                <textarea
                  rows={3}
                  value={reqForm.description || ''}
                  onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })}
                  placeholder="BHP গ্লোবাল অপারেশনের জন্য দক্ষ ও সহকারী কর্মী নিয়োগ করা হচ্ছে। কোম্পানির নীতিমালা অনুযায়ী আকর্ষণীয় বেতন, সুযোগ-সুবিধা এবং নিরাপদ কর্মপরিবেশ প্রদান করা হবে।"
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-[#2A2E37] flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                সংরক্ষণ করার সাথে সাথে ওয়েবসাইট লাইভ আপডেট হয়ে যাবে।
              </span>

              <button
                type="submit"
                className="px-8 py-3 bg-[#F25C05] hover:bg-[#D94F04] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Requirements (সংরক্ষণ করুন)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          SUB-VIEW 3: JOB CIRCULAR HISTORY (APPLICANT SUBMISSIONS)
         ========================================================================= */}
      {subTab === 'history' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* History Header & Filters */}
          <div className="p-4 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>জমা পড়া চাকরির আবেদনসমূহ (Job Applications History)</span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  ওয়েবসাইটের ৩-লাইনের সার্কুলার থেকে প্রার্থীরা ফরম পূরণ করে জমা দিলে এখানে রিয়েল-টাইমে দেখতে পাবেন।
                </p>
              </div>

              {applications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Clear All History
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#282B33]">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="নাম, মোবাইল, রেফারেন্স বা পাসপোর্ট দিয়ে খুঁজুন..."
                  className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={historyCategoryFilter}
                onChange={(e) => setHistoryCategoryFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#121316] border border-[#343842] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
              >
                <option value="all">All Categories ({applications.length})</option>
                {categories.map((c) => {
                  const count = applications.filter((a) => a.categoryId === c.id).length;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count})
                    </option>
                  );
                })}
              </select>

              {/* Status Filter */}
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#121316] border border-[#343842] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table / Cards */}
          {filteredApps.length === 0 ? (
            <div className="p-10 text-center bg-[#1A1C20] rounded-xl border border-[#2B2F38] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#272B33] text-gray-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-bold text-white">কোন আবেদন পাওয়া যায়নি (No Applications Found)</h5>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                {applications.length === 0
                  ? 'ওয়েবসাইট থেকে এখনো কোনো প্রার্থী আবেদন জমা দেয়নি। ওয়েবসাইট ৩-লাইনের সার্কুলারে গিয়ে আবেদন পূরণ করলে তা সরাসরি এখানে দেখা যাবে।'
                  : 'বর্তমান ফিল্টারের সাথে মিলে এমন কোনো আবেদন রেকর্ড পাওয়া যায়নি।'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 bg-[#1C1E23] rounded-xl border border-[#2D313A] hover:border-[#3E4350] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-extrabold text-[#FF8E4D] bg-[#2A211B] px-2.5 py-1 rounded-lg border border-[#54301B]">
                        {app.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F25C05]/15 text-[#FF8E4D] border border-[#F25C05]/30">
                        {app.categoryName}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {app.jobTitle}
                      </span>
                      <span className="text-[11px] text-gray-500 ml-auto sm:ml-0">
                        {app.appliedAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[11px]">Candidate:</span>
                        <strong className="text-white text-sm">{app.fullName}</strong>
                        <span className="text-gray-400 block text-[11px]">{app.age}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Contact & NID:</span>
                        <span className="text-[#38bdf8] font-mono block">{app.phone}</span>
                        <span className="text-gray-400 font-mono text-[11px]">NID/Pass: {app.nidOrPassport}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Education & Exp:</span>
                        <span className="text-gray-200 block truncate">{app.education}</span>
                        <span className="text-gray-400 block truncate">{app.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#262A33]">
                    {/* Status Changer */}
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleUpdateStatus(app.id, e.target.value as JobApplication['status'])
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        app.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : app.status === 'Shortlisted'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : app.status === 'Under Review'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : app.status === 'Rejected'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      <option value="Pending">Pending (অপেক্ষমাণ)</option>
                      <option value="Under Review">Under Review (যাচাই চলছে)</option>
                      <option value="Shortlisted">Shortlisted (বাছাইকৃত)</option>
                      <option value="Approved">Approved (অনুমোদিত)</option>
                      <option value="Rejected">Rejected (বাতিল)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setViewingApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#393F4C]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteApp(app.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          APPLICATION DETAILS MODAL
         ========================================================================= */}
      {viewingApp && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setViewingApp(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#17191D] border border-[#2D313A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 relative text-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#1F2228] px-5 py-4 border-b border-[#2C3038] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FF8E4D]">
                      {viewingApp.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F25C05]/20 text-[#FF8E4D]">
                      {viewingApp.categoryName}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {viewingApp.fullName}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingApp(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#2C3038]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730]">
                  <span className="text-gray-400 block text-[11px]">Applied Position:</span>
                  <strong className="text-white text-sm">{viewingApp.jobTitle}</strong>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730]">
                  <span className="text-gray-400 block text-[11px]">Application Date:</span>
                  <strong className="text-white text-sm">{viewingApp.appliedAt}</strong>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730]">
                  <span className="text-gray-400 block text-[11px]">Phone / Mobile:</span>
                  <strong className="text-[#38bdf8] font-mono text-sm">{viewingApp.phone}</strong>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730]">
                  <span className="text-gray-400 block text-[11px]">Email Address:</span>
                  <span className="text-gray-200">{viewingApp.email || 'N/A'}</span>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730]">
                  <span className="text-gray-400 block text-[11px]">Age / Birth:</span>
                  <span className="text-gray-200">{viewingApp.age}</span>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730]">
                  <span className="text-gray-400 block text-[11px]">NID / Passport No:</span>
                  <strong className="text-white font-mono">{viewingApp.nidOrPassport}</strong>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730] sm:col-span-2">
                  <span className="text-gray-400 block text-[11px]">Present Address / District:</span>
                  <span className="text-gray-200">{viewingApp.presentAddress}</span>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730] sm:col-span-2">
                  <span className="text-gray-400 block text-[11px]">Education:</span>
                  <span className="text-gray-200">{viewingApp.education}</span>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-[#242730] sm:col-span-2">
                  <span className="text-gray-400 block text-[11px]">Experience:</span>
                  <span className="text-gray-200">{viewingApp.experience}</span>
                </div>

                {viewingApp.notes && (
                  <div className="p-3 bg-[#131417] rounded-xl border border-[#242730] sm:col-span-2">
                    <span className="text-gray-400 block text-[11px]">Applicant Remarks:</span>
                    <p className="text-gray-200 mt-1 whitespace-pre-line">{viewingApp.notes}</p>
                  </div>
                )}

                {viewingApp.resumeDataUrl && (
                  <div className="p-3 bg-[#131417] rounded-xl border border-[#242730] sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 block text-[11px]">Attached CV / Document:</span>
                      <strong className="text-emerald-400">{viewingApp.resumeFileName || 'Document'}</strong>
                    </div>
                    <a
                      href={viewingApp.resumeDataUrl}
                      download={viewingApp.resumeFileName || 'candidate-doc.pdf'}
                      className="px-3 py-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-white flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Status Change & Print */}
            <div className="px-5 py-3.5 bg-[#1F2228] border-t border-[#2C3038] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Update Status:</span>
                <select
                  value={viewingApp.status}
                  onChange={(e) =>
                    handleUpdateStatus(viewingApp.id, e.target.value as JobApplication['status'])
                  }
                  className="bg-[#121316] border border-[#3B3F4A] rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#272B33] hover:bg-[#343A45] text-gray-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingApp(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#F25C05] hover:bg-[#D94F04] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
