import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Building,
  User,
  ShieldCheck,
  Eye,
  X,
  MapPin,
  Calendar,
  Sparkles,
  Tag,
  Layers,
  Upload,
  File,
  Paperclip,
  ArrowRight,
  Hash,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { CanadaDocumentRecord, CanadaMenuItemConfig, CanadaCategoryType } from '../../types/canada';
import {
  getStoredCanadaDocuments,
  addCanadaDocument,
  updateCanadaDocument,
  deleteCanadaDocument,
  resetCanadaDocuments,
  CANADA_DOCUMENTS_UPDATED_EVENT,
  getStoredCanadaMenuConfigs,
  addStoredCanadaMenuConfig,
  updateStoredCanadaMenuConfig,
  deleteStoredCanadaMenuConfig,
  resetStoredCanadaMenuConfigs,
  CANADA_MENU_CONFIGS_UPDATED_EVENT,
} from '../../utils/canadaStorage';
import {
  FullPdfDocumentViewer,
  canadaRecordToUnifiedDoc,
} from '../FullPdfDocumentViewer';

interface AdminCanadaManagerProps {
  showToast: (msg: string) => void;
}

type CanadaTab = 'add-post' | 'all-posts' | 'categories';

export const AdminCanadaManager: React.FC<AdminCanadaManagerProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<CanadaTab>('all-posts');

  // -------------------------------------------------------------
  // Categories (Canada right 3-line drawer menu items)
  // -------------------------------------------------------------
  const [menuConfigs, setMenuConfigs] = useState<CanadaMenuItemConfig[]>(() => getStoredCanadaMenuConfigs());
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<CanadaMenuItemConfig | null>(null);
  const [catFormData, setCatFormData] = useState<{
    mainTitle: string;
    subMenu: string;
    fieldLabel: string;
    searchFieldKey: string;
    placeholder: string;
    samplePlaceholder: string;
    description: string;
  }>({
    mainTitle: '',
    subMenu: '',
    fieldLabel: 'TIN / Reference Number',
    searchFieldKey: 'tinOrRef',
    placeholder: 'Enter Reference Number (e.g. REF-CA-928410)...',
    samplePlaceholder: 'REF-CA-928410',
    description: 'Verify official Canada documentation and employment authorization.',
  });

  // -------------------------------------------------------------
  // Canada Documents / Posts Data
  // -------------------------------------------------------------
  const [documents, setDocuments] = useState<CanadaDocumentRecord[]>(() => getStoredCanadaDocuments());
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('ALL');
  const [selectedDocForView, setSelectedDocForView] = useState<CanadaDocumentRecord | null>(null);

  // Form State for Add / Edit Canada Post
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docForm, setDocForm] = useState<{
    categoryType: CanadaCategoryType;
    mainTitle: string;
    subMenu: string;
    candidateName: string;
    passportNumber: string;
    nationality: string;
    dateOfBirth: string;
    tinOrRef: string;
    idNumber: string;
    verificationIdNo: string;
    transitionIdNo: string;
    referenceNo: string;
    jobTitle: string;
    employerName: string;
    workLocation: string;
    hourlyWageOrSalary: string;
    workingHours: string;
    status: 'Approved' | 'Pending' | 'Verified' | 'Under Review';
    issueDate: string;
    expiryDate: string;
    officialDocNumber: string;
    lmiaNumber: string;
    notes: string;
    candidatePhotoUrl?: string;
    documentFileName?: string;
    documentFileUrl?: string;
  }>({
    categoryType: 'work-permit-docs',
    mainTitle: 'Canada Work Permit Documents',
    subMenu: 'Employment Application Document See',
    candidateName: '',
    passportNumber: '',
    nationality: 'Bangladeshi',
    dateOfBirth: '1993-01-01',
    candidatePhotoUrl: '',
    tinOrRef: '',
    idNumber: '',
    verificationIdNo: '',
    transitionIdNo: '',
    referenceNo: '',
    jobTitle: 'Industrial Electrician',
    employerName: 'BHP Canada Operations Ltd',
    workLocation: 'Saskatoon, Saskatchewan, Canada',
    hourlyWageOrSalary: '$38.50 CAD / hr',
    workingHours: '40 hrs / week',
    status: 'Verified',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2028-12-31',
    officialDocNumber: '',
    lmiaNumber: '',
    notes: 'Verified and authorized by IRCC and Canadian sponsor.',
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocForm((prev) => ({
        ...prev,
        candidatePhotoUrl: reader.result as string,
      }));
      showToast(`Candidate photo "${file.name}" uploaded successfully.`);
    };
    reader.readAsDataURL(file);
  };

  // Sync event listeners
  useEffect(() => {
    const handleDocsUpdate = () => {
      setDocuments(getStoredCanadaDocuments());
    };
    const handleConfigsUpdate = () => {
      setMenuConfigs(getStoredCanadaMenuConfigs());
    };
    const handleStorage = () => {
      setDocuments(getStoredCanadaDocuments());
      setMenuConfigs(getStoredCanadaMenuConfigs());
    };

    window.addEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleDocsUpdate);
    window.addEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleConfigsUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleDocsUpdate);
      window.removeEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleConfigsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Update default category when configs change
  useEffect(() => {
    if (menuConfigs.length > 0 && !docForm.categoryType) {
      setDocForm((prev) => ({
        ...prev,
        categoryType: menuConfigs[0].id,
        mainTitle: menuConfigs[0].mainTitle,
        subMenu: menuConfigs[0].subMenu,
      }));
    }
  }, [menuConfigs]);

  // When category changes in form, sync title & subMenu
  const handleCategorySelectChange = (catId: string) => {
    const cfg = menuConfigs.find((c) => c.id === catId) || menuConfigs[0];
    setDocForm((prev) => ({
      ...prev,
      categoryType: catId,
      mainTitle: cfg.mainTitle,
      subMenu: cfg.subMenu,
    }));
  };

  // -------------------------------------------------------------
  // POST ACTIONS (Add / Edit / Delete)
  // -------------------------------------------------------------
  const handleOpenAddPost = () => {
    setEditingDocId(null);
    const firstCfg = menuConfigs[0] || {
      id: 'work-permit-docs',
      mainTitle: 'Canada Work Permit Documents',
      subMenu: 'Employment Application Document See',
    };
    setDocForm({
      categoryType: firstCfg.id,
      mainTitle: firstCfg.mainTitle,
      subMenu: firstCfg.subMenu,
      candidateName: '',
      passportNumber: '',
      nationality: 'Bangladeshi',
      dateOfBirth: '1993-01-01',
      candidatePhotoUrl: '',
      tinOrRef: `REF-CA-${Math.floor(100000 + Math.random() * 900000)}`,
      idNumber: `CA-ED-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationIdNo: `VRF-CAN-${Math.floor(10000 + Math.random() * 90000)}`,
      transitionIdNo: `VFS-CAN-${Math.floor(100000 + Math.random() * 900000)}`,
      referenceNo: `WPD-CAN-${Math.floor(10000 + Math.random() * 90000)}`,
      jobTitle: 'Industrial Electrician',
      employerName: 'BHP Canada Operations Ltd',
      workLocation: 'Saskatoon, Saskatchewan, Canada',
      hourlyWageOrSalary: '$38.50 CAD / hr',
      workingHours: '40 hrs / week',
      status: 'Verified',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2028-12-31',
      officialDocNumber: `IRCC-CAN-${Math.floor(100000 + Math.random() * 900000)}`,
      lmiaNumber: `LMIA-CAN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Verified and authorized by IRCC and Canadian sponsor.',
    });
    setActiveTab('add-post');
  };

  const handleOpenEditPost = (doc: CanadaDocumentRecord) => {
    setEditingDocId(doc.id);
    setDocForm({
      categoryType: doc.categoryType,
      mainTitle: doc.mainTitle,
      subMenu: doc.subMenu,
      candidateName: doc.candidateName,
      passportNumber: doc.passportNumber,
      nationality: doc.nationality,
      dateOfBirth: doc.dateOfBirth || '1993-01-01',
      candidatePhotoUrl: doc.candidatePhotoUrl || '',
      tinOrRef: doc.tinOrRef || '',
      idNumber: doc.idNumber || '',
      verificationIdNo: doc.verificationIdNo || '',
      transitionIdNo: doc.transitionIdNo || '',
      referenceNo: doc.referenceNo || '',
      jobTitle: doc.jobTitle,
      employerName: doc.employerName,
      workLocation: doc.workLocation,
      hourlyWageOrSalary: doc.hourlyWageOrSalary || '$38.50 CAD / hr',
      workingHours: doc.workingHours || '40 hrs / week',
      status: doc.status,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
      officialDocNumber: doc.officialDocNumber || '',
      lmiaNumber: doc.lmiaNumber || '',
      notes: doc.notes || '',
      documentFileName: doc.documentFileName,
      documentFileUrl: doc.documentFileUrl,
    });
    setActiveTab('add-post');
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.candidateName.trim()) {
      showToast('Error: Candidate name is required.');
      return;
    }
    if (!docForm.passportNumber.trim()) {
      showToast('Error: Passport number is required.');
      return;
    }

    if (editingDocId) {
      updateCanadaDocument(editingDocId, docForm);
      showToast(`Canada post for "${docForm.candidateName}" updated.`);
    } else {
      addCanadaDocument(docForm);
      showToast(`New Canada post for "${docForm.candidateName}" added.`);
    }

    setDocuments(getStoredCanadaDocuments());
    setActiveTab('all-posts');
  };

  const handleDeletePost = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Canada post for "${name}"?`)) {
      deleteCanadaDocument(id);
      setDocuments(getStoredCanadaDocuments());
      showToast(`Canada post for "${name}" deleted.`);
    }
  };

  // Document attachment handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDocForm((prev) => ({
        ...prev,
        documentFileName: file.name,
        documentFileUrl: reader.result as string,
      }));
      showToast(`Document "${file.name}" attached.`);
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // CATEGORY ACTIONS (Canada right 3-line menu)
  // -------------------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingConfig(null);
    setCatFormData({
      mainTitle: '',
      subMenu: '',
      fieldLabel: 'TIN / Reference Number',
      searchFieldKey: 'tinOrRef',
      placeholder: 'Enter Reference Number (e.g. REF-CA-928410)...',
      samplePlaceholder: 'REF-CA-928410',
      description: 'Verify official Canada documentation and employment authorization.',
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cfg: CanadaMenuItemConfig) => {
    setEditingConfig(cfg);
    setCatFormData({
      mainTitle: cfg.mainTitle,
      subMenu: cfg.subMenu,
      fieldLabel: cfg.fieldLabel,
      searchFieldKey: cfg.searchFieldKey,
      placeholder: cfg.placeholder,
      samplePlaceholder: cfg.samplePlaceholder,
      description: cfg.description,
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.mainTitle.trim() || !catFormData.subMenu.trim()) {
      showToast('Error: Main Title and SubMenu are required.');
      return;
    }

    if (editingConfig) {
      updateStoredCanadaMenuConfig(editingConfig.id, catFormData);
      showToast(`Canada category "${catFormData.mainTitle}" updated.`);
    } else {
      addStoredCanadaMenuConfig(catFormData);
      showToast(`New Canada category "${catFormData.mainTitle}" added to right 3-line menu.`);
    }

    setMenuConfigs(getStoredCanadaMenuConfigs());
    setIsCatModalOpen(false);
  };

  const handleDeleteCategory = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from Canada's 3-line menu?`)) {
      deleteStoredCanadaMenuConfig(id);
      setMenuConfigs(getStoredCanadaMenuConfigs());
      showToast(`Canada category "${title}" removed.`);
    }
  };

  const handleResetCategories = () => {
    if (window.confirm('Reset Canada menu categories to default official items?')) {
      resetStoredCanadaMenuConfigs();
      setMenuConfigs(getStoredCanadaMenuConfigs());
      showToast('Canada menu categories reset to default.');
    }
  };

  // Filtered lists
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.candidateName.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.passportNumber.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      (doc.tinOrRef && doc.tinOrRef.toLowerCase().includes(docSearchQuery.toLowerCase())) ||
      (doc.idNumber && doc.idNumber.toLowerCase().includes(docSearchQuery.toLowerCase())) ||
      doc.jobTitle.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.mainTitle.toLowerCase().includes(docSearchQuery.toLowerCase());
    const matchesCat = selectedCatFilter === 'ALL' || doc.categoryType === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  const filteredCategories = menuConfigs.filter((c) =>
    c.mainTitle.toLowerCase().includes(catSearchQuery.toLowerCase()) ||
    c.subMenu.toLowerCase().includes(catSearchQuery.toLowerCase()) ||
    c.fieldLabel.toLowerCase().includes(catSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-200">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1C1E23] p-6 rounded-2xl border border-[#2B2F38] shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Canada Operations
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                {documents.length} Posts · {menuConfigs.length} Categories
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Canada Post & Menu Manager (কানাডা ব্যবস্থাপনা)
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              ডান পাশের ৩ লাইনের মেনুর অপশনগুলো ক্যাটাগরি হিসেবে যুক্ত/রিমুভ করুন এবং কানাডা জব ও পারমিট পোস্ট পাবলিশ করুন।
            </p>
          </div>
        </div>

        {/* 3 Main Tabs Buttons */}
        <div className="flex items-center gap-2 bg-[#131417] p-1.5 rounded-xl border border-[#2B2E37] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('all-posts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all-posts'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1E2026]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Post ({documents.length})</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddPost}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'add-post'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1E2026]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Post</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1E2026]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Category (Add/Remove)</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 1. ALL POSTS TAB */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'all-posts' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1C1E23] p-4 rounded-xl border border-[#2B2F38]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, passport, reference ID, job title..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 max-w-[200px] truncate"
              >
                <option value="ALL">All Categories ({documents.length})</option>
                {menuConfigs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.mainTitle}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleOpenAddPost}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Post</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center bg-[#17191E] rounded-xl border border-[#26282E] text-gray-400 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-gray-500" />
              <p className="text-sm font-semibold text-gray-300">No Canada posts found.</p>
              <button
                type="button"
                onClick={handleOpenAddPost}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Canada Post</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[#1C1E23] border border-[#2B2F38] hover:border-red-500/50 rounded-xl p-5 space-y-3.5 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {doc.tinOrRef || doc.idNumber || doc.referenceNo || doc.officialDocNumber || 'DOC-CA'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.status === 'Verified' || doc.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {doc.candidateName}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Passport: <strong className="text-gray-200">{doc.passportNumber}</strong> · {doc.nationality}
                      </p>
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center gap-2">
                      <span className="text-red-400 font-semibold">{doc.mainTitle}</span>
                    </div>

                    <div className="p-2.5 bg-[#141517] rounded-lg border border-[#252830] text-xs space-y-1">
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Position:</span>
                        <strong className="text-white">{doc.jobTitle}</strong>
                      </div>
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Employer:</span>
                        <span className="text-white">{doc.employerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-gray-300">{doc.workLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#272A32]">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForView(doc)}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPost(doc)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2B2E37] rounded-lg transition-colors cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(doc.id, doc.candidateName)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* 2. ADD / EDIT CANADA POST TAB */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'add-post' && (
        <form onSubmit={handleSavePost} className="bg-[#1C1E23] p-6 rounded-2xl border border-[#2B2F38] space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
            <div>
              <h4 className="font-bold text-base text-white">
                {editingDocId ? 'Edit Canada Post' : 'Add New Canada Post (নতুন কানাডা পোস্ট যোগ করুন)'}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                কানাডা ডান পাশের ৩ লাইনের মেনু ক্যাটাগরি সিলেক্ট করুন এবং প্রার্থীর তথ্য ও ভেরিফিকেশন আইডি প্রদান করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('all-posts')}
              className="px-3 py-1.5 bg-[#252830] text-gray-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Category selection from Canada 3-line menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Canada Category (ডান পাশের ৩ লাইনের মেনু অপশন) <span className="text-red-400">*</span>
              </label>
              <select
                value={docForm.categoryType}
                onChange={(e) => handleCategorySelectChange(e.target.value)}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {menuConfigs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.mainTitle} ({c.subMenu})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Status (স্ট্যাটাস)</label>
              <select
                value={docForm.status}
                onChange={(e) => setDocForm({ ...docForm, status: e.target.value as any })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="Verified">Verified (ভেরিফাইড)</option>
                <option value="Approved">Approved (অনুমোদিত)</option>
                <option value="Pending">Pending (অপেক্ষমান)</option>
                <option value="Under Review">Under Review (পর্যালোচনাধীন)</option>
              </select>
            </div>
          </div>

          {/* Candidate Details */}
          <div className="p-4 bg-[#141517] rounded-xl border border-[#282B33] space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-400" />
              Candidate & Identity Information (প্রার্থীর বিবরণ)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Candidate Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammad Rafiqul Islam"
                  value={docForm.candidateName}
                  onChange={(e) => setDocForm({ ...docForm, candidateName: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Passport Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A08934211"
                  value={docForm.passportNumber}
                  onChange={(e) => setDocForm({ ...docForm, passportNumber: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Nationality</label>
                <input
                  type="text"
                  placeholder="e.g. Bangladeshi"
                  value={docForm.nationality}
                  onChange={(e) => setDocForm({ ...docForm, nationality: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Candidate Photo / Picture Upload & URL (প্রার্থীর ছবি যা PDF এ দেখাবে) */}
            <div className="p-3 bg-[#1A1C21] rounded-xl border border-[#2D313A] space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-16 h-20 rounded-lg border-2 border-dashed border-[#444] bg-[#121316] flex items-center justify-center overflow-hidden shrink-0 relative">
                    {docForm.candidatePhotoUrl ? (
                      <img
                        src={docForm.candidatePhotoUrl}
                        alt="Candidate Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Candidate Picture / Photo (প্রার্থীর ছবি)
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      এই ছবি বা ফটো সরাসরি অফিসিয়াল PDF সার্টিফিকেটে প্রদর্শিত হবে।
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="ca-candidate-photo-upload"
                  />
                  <label
                    htmlFor="ca-candidate-photo-upload"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture (ছবি আপলোড)</span>
                  </label>

                  {docForm.candidatePhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setDocForm({ ...docForm, candidatePhotoUrl: '' })}
                      className="px-2.5 py-1.5 bg-[#252830] hover:bg-[#30333C] text-gray-300 hover:text-red-400 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  অথবা ছবির লিঙ্ক দিন (Or Paste Image URL):
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or data:image/..."
                  value={docForm.candidatePhotoUrl || ''}
                  onChange={(e) => setDocForm({ ...docForm, candidatePhotoUrl: e.target.value })}
                  className="w-full bg-[#121316] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Reference Numbers matching search keys */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">TIN / Reference Number</label>
                <input
                  type="text"
                  placeholder="REF-CA-928410"
                  value={docForm.tinOrRef}
                  onChange={(e) => setDocForm({ ...docForm, tinOrRef: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Offer ID Number</label>
                <input
                  type="text"
                  placeholder="CA-ED-88412"
                  value={docForm.idNumber}
                  onChange={(e) => setDocForm({ ...docForm, idNumber: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Verification ID / WPD No</label>
                <input
                  type="text"
                  placeholder="VRF-CAN-99420 / WPD-CAN-55102"
                  value={docForm.verificationIdNo || docForm.referenceNo}
                  onChange={(e) =>
                    setDocForm({
                      ...docForm,
                      verificationIdNo: e.target.value,
                      referenceNo: e.target.value,
                    })
                  }
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="p-4 bg-[#141517] rounded-xl border border-[#282B33] space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-red-400" />
              Job & Canadian Employer Authorization (কাজের তথ্য)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Industrial Electrician"
                  value={docForm.jobTitle}
                  onChange={(e) => setDocForm({ ...docForm, jobTitle: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Employer / Sponsor</label>
                <input
                  type="text"
                  placeholder="e.g. BHP Canada Operations Ltd"
                  value={docForm.employerName}
                  onChange={(e) => setDocForm({ ...docForm, employerName: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Work Location</label>
                <input
                  type="text"
                  placeholder="e.g. Saskatoon, Saskatchewan, Canada"
                  value={docForm.workLocation}
                  onChange={(e) => setDocForm({ ...docForm, workLocation: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Hourly Wage / Salary</label>
                <input
                  type="text"
                  placeholder="e.g. $42.50 CAD / hr"
                  value={docForm.hourlyWageOrSalary}
                  onChange={(e) => setDocForm({ ...docForm, hourlyWageOrSalary: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={docForm.issueDate}
                  onChange={(e) => setDocForm({ ...docForm, issueDate: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={docForm.expiryDate}
                  onChange={(e) => setDocForm({ ...docForm, expiryDate: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Notes & File Attachment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Notes / Authority Statement</label>
              <textarea
                rows={3}
                placeholder="Employment Application approved under Global Skills Strategy Stream A."
                value={docForm.notes}
                onChange={(e) => setDocForm({ ...docForm, notes: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Attach Document File (PDF / Image)</label>
              <div className="p-3 bg-[#141517] rounded-lg border border-[#2D313A] space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="ca-doc-upload"
                />
                <label
                  htmlFor="ca-doc-upload"
                  className="w-full py-2 bg-[#252830] hover:bg-[#323640] text-gray-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{docForm.documentFileName ? 'Change Document' : 'Choose Document File'}</span>
                </label>
                {docForm.documentFileName && (
                  <div className="text-[11px] text-emerald-400 truncate flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{docForm.documentFileName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
            <button
              type="button"
              onClick={() => setActiveTab('all-posts')}
              className="px-4 py-2 bg-[#252830] text-gray-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer shadow-lg shadow-red-600/30 transition-all"
            >
              {editingDocId ? 'Save Changes' : 'Publish Canada Post'}
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------- */}
      {/* 3. CATEGORY (ADD / REMOVE) TAB */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1C1E23] p-4 rounded-xl border border-[#2B2F38]">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-400" />
                <span>Canada 3-Line Menu Categories (ডান পাশের ড্রয়ার মেনু অপশনসমূহ)</span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                এখানে ক্যাটাগরি যোগ বা রিমুভ করলে ওয়েবসাইটের ডান পাশের ৩ লাইনের মেনু স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetCategories}
                className="px-3 py-2 bg-[#262A33] hover:bg-[#323742] text-gray-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#3A404E]"
                title="Restore default categories"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Category</span>
              </button>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-[#1C1E23] rounded-xl border border-[#2B2F38] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141517] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#2B2F38]">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Main Title (প্রধান শিরোনাম)</th>
                    <th className="py-3 px-4">SubMenu Link (সাবমেনু লিঙ্ক)</th>
                    <th className="py-3 px-4">Search Field Label</th>
                    <th className="py-3 px-4">Search Key</th>
                    <th className="py-3 px-4 text-right">Actions (নিয়ন্ত্রণ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26282E]">
                  {menuConfigs.map((cfg, idx) => (
                    <tr key={cfg.id} className="hover:bg-[#1E2026] transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white uppercase">{cfg.mainTitle}</td>
                      <td className="py-3 px-4 text-red-400">{cfg.subMenu}</td>
                      <td className="py-3 px-4 text-gray-300">{cfg.fieldLabel}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-400">{cfg.searchFieldKey}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cfg)}
                            className="p-1.5 text-blue-400 hover:bg-blue-950/40 rounded transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cfg.id, cfg.mainTitle)}
                            className="p-1.5 text-red-400 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                            title="Remove Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* ------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT CANADA CATEGORY */}
      {/* ------------------------------------------------------- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-400" />
                <h4 className="font-bold text-base text-white">
                  {editingConfig ? `Edit Category: ${editingConfig.mainTitle}` : 'Add New Canada Category (নতুন ক্যাটাগরি যোগ করুন)'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Main Title (প্রধান শিরোনাম) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canada Work Permit Documents"
                  value={catFormData.mainTitle}
                  onChange={(e) => setCatFormData({ ...catFormData, mainTitle: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  SubMenu Link Label (সাবমেনু লিঙ্ক লেখা) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Employment Application Document See"
                  value={catFormData.subMenu}
                  onChange={(e) => setCatFormData({ ...catFormData, subMenu: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Search Field Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TIN / Reference Number"
                    value={catFormData.fieldLabel}
                    onChange={(e) => setCatFormData({ ...catFormData, fieldLabel: e.target.value })}
                    className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Search Key</label>
                  <select
                    value={catFormData.searchFieldKey}
                    onChange={(e) => setCatFormData({ ...catFormData, searchFieldKey: e.target.value })}
                    className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="tinOrRef">tinOrRef (TIN/Reference)</option>
                    <option value="idNumber">idNumber (ID Number)</option>
                    <option value="verificationIdNo">verificationIdNo (Verification ID)</option>
                    <option value="transitionIdNo">transitionIdNo (Transition ID)</option>
                    <option value="referenceNo">referenceNo (Reference No)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description (বর্ণনা)</label>
                <textarea
                  rows={2}
                  placeholder="Verify official Canada Employment Application..."
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 bg-[#252830] text-gray-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  {editingConfig ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* MODAL: VIEW CANADA FULL PDF POST DETAILS */}
      {/* ------------------------------------------------------- */}
      {selectedDocForView && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#17181B] border border-[#3A3F4C] text-white w-full max-w-5xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-400" />
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Canada Full Official Document & PDF Preview ({selectedDocForView.tinOrRef || selectedDocForView.candidateName})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocForView(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#252830] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FullPdfDocumentViewer
              document={canadaRecordToUnifiedDoc(selectedDocForView)}
              onClose={() => setSelectedDocForView(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
