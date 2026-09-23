import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileText,
  Building,
  User,
  ShieldCheck,
  Eye,
  X,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { CanadaDocumentRecord, CanadaCategoryType } from '../../types/canada';
import {
  CANADA_MENU_CONFIGS,
  getStoredCanadaDocuments,
  addCanadaDocument,
  updateCanadaDocument,
  deleteCanadaDocument,
  resetCanadaDocuments,
  CANADA_DOCUMENTS_UPDATED_EVENT,
} from '../../utils/canadaStorage';

interface AdminCanadaManagerProps {
  showToast: (msg: string) => void;
}

export const AdminCanadaManager: React.FC<AdminCanadaManagerProps> = ({ showToast }) => {
  const [documents, setDocuments] = useState<CanadaDocumentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
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
  }>({
    categoryType: 'work-permit-docs',
    mainTitle: 'canada Work Permit Documents',
    subMenu: 'Employment Application Document C',
    candidateName: '',
    passportNumber: '',
    nationality: 'Bangladeshi',
    dateOfBirth: '1992-05-14',
    tinOrRef: '',
    idNumber: '',
    verificationIdNo: '',
    transitionIdNo: '',
    referenceNo: '',
    jobTitle: 'Industrial Electrician',
    employerName: 'BHP Canada Operations Ltd',
    workLocation: 'Saskatoon, Saskatchewan, Canada',
    hourlyWageOrSalary: '$40.00 CAD / hr',
    workingHours: '40 hrs / week',
    status: 'Verified',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2028-12-31',
    officialDocNumber: '',
    lmiaNumber: '',
    notes: '',
  });

  // Load documents
  const loadDocs = () => {
    const docs = getStoredCanadaDocuments();
    setDocuments(docs);
  };

  useEffect(() => {
    loadDocs();
    const handleUpdate = () => loadDocs();
    window.addEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Sync mainTitle and subMenu when categoryType changes in form
  const handleCategoryChange = (catType: CanadaCategoryType) => {
    const cfg = CANADA_MENU_CONFIGS.find((c) => c.id === catType) || CANADA_MENU_CONFIGS[0];
    setFormData((prev) => ({
      ...prev,
      categoryType: catType,
      mainTitle: cfg.mainTitle,
      subMenu: cfg.subMenu,
    }));
  };

  // Open modal for new record
  const handleOpenAdd = () => {
    setEditingDocId(null);
    setFormData({
      categoryType: 'work-permit-docs',
      mainTitle: 'canada Work Permit Documents',
      subMenu: 'Employment Application Document C',
      candidateName: '',
      passportNumber: '',
      nationality: 'Bangladeshi',
      dateOfBirth: '1993-01-01',
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
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (doc: CanadaDocumentRecord) => {
    setEditingDocId(doc.id);
    setFormData({
      categoryType: doc.categoryType,
      mainTitle: doc.mainTitle,
      subMenu: doc.subMenu,
      candidateName: doc.candidateName,
      passportNumber: doc.passportNumber,
      nationality: doc.nationality,
      dateOfBirth: doc.dateOfBirth || '',
      tinOrRef: doc.tinOrRef || '',
      idNumber: doc.idNumber || '',
      verificationIdNo: doc.verificationIdNo || '',
      transitionIdNo: doc.transitionIdNo || '',
      referenceNo: doc.referenceNo || '',
      jobTitle: doc.jobTitle,
      employerName: doc.employerName,
      workLocation: doc.workLocation,
      hourlyWageOrSalary: doc.hourlyWageOrSalary || '',
      workingHours: doc.workingHours || '',
      status: doc.status,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
      officialDocNumber: doc.officialDocNumber || '',
      lmiaNumber: doc.lmiaNumber || '',
      notes: doc.notes || '',
    });
    setIsModalOpen(true);
  };

  // Save record
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.candidateName.trim()) {
      showToast('Please enter candidate full name');
      return;
    }

    if (editingDocId) {
      updateCanadaDocument(editingDocId, {
        ...formData,
      });
      showToast(`Canada document record updated for ${formData.candidateName}`);
    } else {
      addCanadaDocument({
        ...formData,
      });
      showToast(`New Canada document record added for ${formData.candidateName}`);
    }

    setIsModalOpen(false);
    loadDocs();
  };

  // Delete record
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Canada document for "${name}"?`)) {
      deleteCanadaDocument(id);
      showToast(`Document record deleted for "${name}"`);
      loadDocs();
    }
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Reset all Canada document records to default samples?')) {
      resetCanadaDocuments();
      showToast('Default Canada documents restored');
      loadDocs();
    }
  };

  // Filter records
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'ALL' || doc.categoryType === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      doc.candidateName.toLowerCase().includes(q) ||
      doc.passportNumber.toLowerCase().includes(q) ||
      (doc.tinOrRef && doc.tinOrRef.toLowerCase().includes(q)) ||
      (doc.idNumber && doc.idNumber.toLowerCase().includes(q)) ||
      (doc.verificationIdNo && doc.verificationIdNo.toLowerCase().includes(q)) ||
      (doc.transitionIdNo && doc.transitionIdNo.toLowerCase().includes(q)) ||
      (doc.referenceNo && doc.referenceNo.toLowerCase().includes(q)) ||
      doc.jobTitle.toLowerCase().includes(q) ||
      doc.employerName.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🇨🇦</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Canada Work Permit Documents (কানাডা তালিকা)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage Canada work permit records, offer letters, job confirmations, and VFS biometrics list (Add / Edit / Remove).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-[#22252C] hover:bg-[#2C303A] text-gray-300 text-xs font-semibold rounded-lg border border-[#313540] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset default sample records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Record (নতুন রেকর্ড যোগ)</span>
          </button>
        </div>
      </div>

      {/* 5 Quick Category Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CANADA_MENU_CONFIGS.map((cfg) => {
          const count = documents.filter((d) => d.categoryType === cfg.id).length;
          const isSelected = selectedCategory === cfg.id;
          return (
            <button
              key={cfg.id}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? 'ALL' : cfg.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-600/20 border-red-500 text-white'
                  : 'bg-[#181A1F] border-[#292C36] hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-gray-400 truncate">
                {cfg.fieldLabel}
              </div>
              <div className="text-lg font-black text-white mt-1">
                {count}
              </div>
              <div className="text-[10px] text-gray-400 truncate mt-0.5">
                {cfg.subMenu}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-[#181A1F] rounded-xl border border-[#2B2E38] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, TIN, ID, verification no, passport..."
            className="w-full pl-9 pr-4 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-gray-400">
            Showing <strong className="text-white">{filteredDocs.length}</strong> of {documents.length} records
          </span>
          {selectedCategory !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Documents Table / Card List */}
      <div className="bg-[#181A1F] rounded-xl border border-[#2B2E38] overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="py-12 text-center text-gray-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-gray-600 opacity-50" />
            <p className="text-sm font-semibold text-gray-300">No Canada document records found</p>
            <p className="text-xs text-gray-500">Click "+ Add New Record" to add candidate details and permit numbers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#121316] text-gray-400 uppercase font-mono text-[10px] border-b border-[#282B35]">
                <tr>
                  <th className="px-4 py-3">Candidate & Passport</th>
                  <th className="px-4 py-3">Category & Sub-Menu</th>
                  <th className="px-4 py-3">Reference / Search Numbers</th>
                  <th className="px-4 py-3">Job & Employer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242732]">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#1D2027] transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>🇨🇦</span>
                        <span>{doc.candidateName}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        Passport: {doc.passportNumber} ({doc.nationality})
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-red-400 block truncate max-w-[180px]">
                        {doc.mainTitle}
                      </span>
                      <span className="text-[11px] text-gray-400 block truncate max-w-[180px]">
                        {doc.subMenu}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] space-y-0.5">
                      {doc.tinOrRef && (
                        <div>
                          <span className="text-gray-500">TIN/Ref:</span>{' '}
                          <span className="text-emerald-400 font-bold">{doc.tinOrRef}</span>
                        </div>
                      )}
                      {doc.idNumber && (
                        <div>
                          <span className="text-gray-500">ID:</span>{' '}
                          <span className="text-amber-400 font-bold">{doc.idNumber}</span>
                        </div>
                      )}
                      {doc.verificationIdNo && (
                        <div>
                          <span className="text-gray-500">VRF:</span>{' '}
                          <span className="text-blue-400 font-bold">{doc.verificationIdNo}</span>
                        </div>
                      )}
                      {doc.transitionIdNo && (
                        <div>
                          <span className="text-gray-500">TRN:</span>{' '}
                          <span className="text-purple-400 font-bold">{doc.transitionIdNo}</span>
                        </div>
                      )}
                      {doc.referenceNo && (
                        <div>
                          <span className="text-gray-500">WPD:</span>{' '}
                          <span className="text-rose-400 font-bold">{doc.referenceNo}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-200">{doc.jobTitle}</div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[170px]">
                        {doc.employerName}
                      </div>
                      <div className="text-[10px] text-gray-500">{doc.workLocation}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          doc.status === 'Verified' || doc.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {doc.status}
                      </span>
                      <div className="text-[10px] text-gray-500 mt-1 font-mono">
                        Exp: {doc.expiryDate}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(doc)}
                          className="p-1.5 rounded-lg bg-[#252832] hover:bg-[#303542] text-gray-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id, doc.candidateName)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Record"
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
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          id="admin-canada-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            id="admin-canada-modal-card"
            className="w-full max-w-2xl bg-[#181A1F] rounded-2xl border border-[#2D303B] shadow-2xl text-white overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#282B35] bg-[#1C1E25] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇨🇦</span>
                <h4 className="text-base font-bold text-white">
                  {editingDocId ? 'Edit Canada Record' : 'Add New Canada Document Record'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#2A2E39]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Main Category (ক্যাটাগরি) <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.categoryType}
                  onChange={(e) => handleCategoryChange(e.target.value as CanadaCategoryType)}
                  className="w-full px-3 py-2.5 bg-[#121316] border border-[#2D313C] rounded-lg text-white font-medium focus:border-red-500"
                >
                  {CANADA_MENU_CONFIGS.map((cfg) => (
                    <option key={cfg.id} value={cfg.id}>
                      {cfg.mainTitle} ({cfg.subMenu})
                    </option>
                  ))}
                </select>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Candidate Full Name (প্রার্থীর নাম) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    placeholder="e.g. Mohammad Rafiqul Islam"
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Passport No (পাসপোর্ট) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    placeholder="e.g. A08934211"
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              {/* Reference & Search Numbers */}
              <div className="p-3.5 bg-[#131518] rounded-xl border border-[#262932] space-y-3">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Identification & Verification Numbers (সার্চ ফিল্ড নম্বরসমূহ)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">
                      TIN / Reference Number (Category 1)
                    </label>
                    <input
                      type="text"
                      value={formData.tinOrRef}
                      onChange={(e) => setFormData({ ...formData, tinOrRef: e.target.value })}
                      placeholder="e.g. REF-CA-928410"
                      className="w-full px-3 py-1.5 bg-[#1A1C21] border border-[#2E313D] rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">
                      ID Number (Category 2)
                    </label>
                    <input
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      placeholder="e.g. CA-ED-88412"
                      className="w-full px-3 py-1.5 bg-[#1A1C21] border border-[#2E313D] rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">
                      Verification ID No (Category 3)
                    </label>
                    <input
                      type="text"
                      value={formData.verificationIdNo}
                      onChange={(e) => setFormData({ ...formData, verificationIdNo: e.target.value })}
                      placeholder="e.g. VRF-CAN-99420"
                      className="w-full px-3 py-1.5 bg-[#1A1C21] border border-[#2E313D] rounded text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">
                      Transition ID No (Category 4)
                    </label>
                    <input
                      type="text"
                      value={formData.transitionIdNo}
                      onChange={(e) => setFormData({ ...formData, transitionIdNo: e.target.value })}
                      placeholder="e.g. VFS-CAN-882190"
                      className="w-full px-3 py-1.5 bg-[#1A1C21] border border-[#2E313D] rounded text-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 mb-1">
                      Reference No (Category 5)
                    </label>
                    <input
                      type="text"
                      value={formData.referenceNo}
                      onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                      placeholder="e.g. WPD-CAN-55102"
                      className="w-full px-3 py-1.5 bg-[#1A1C21] border border-[#2E313D] rounded text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Job & Employer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Job Title / Occupation (পদবি)
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g. Industrial Electrician"
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Canadian Employer / Company
                  </label>
                  <input
                    type="text"
                    value={formData.employerName}
                    onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                    placeholder="e.g. BHP Canada Operations Ltd"
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Work Location in Canada
                  </label>
                  <input
                    type="text"
                    value={formData.workLocation}
                    onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                    placeholder="e.g. Saskatoon, Saskatchewan"
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Hourly Wage / Salary
                  </label>
                  <input
                    type="text"
                    value={formData.hourlyWageOrSalary}
                    onChange={(e) => setFormData({ ...formData, hourlyWageOrSalary: e.target.value })}
                    placeholder="e.g. $42.50 CAD / hr"
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Status & Validity Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Status (স্ট্যাটাস)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white font-bold"
                  >
                    <option value="Verified">Verified (ভেরিফাইড)</option>
                    <option value="Approved">Approved (অনুমোদিত)</option>
                    <option value="Pending">Pending (অপেক্ষমাণ)</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Officer Remarks / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Official IRCC validation note or visa condition remarks..."
                  className="w-full px-3 py-2 bg-[#121316] border border-[#2D313C] rounded-lg text-white"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-[#262832] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#252830] hover:bg-[#30333D] text-gray-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-md"
                >
                  {editingDocId ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
