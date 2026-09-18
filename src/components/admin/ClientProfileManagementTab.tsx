import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  FileText,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  Eye,
  AlertCircle,
  ExternalLink,
  Award,
  FileCheck,
  Scale,
  Briefcase,
  Paperclip,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { ApplicantProfile, DocumentAttachment, CustomAttachment } from '../../types/portal';

const DOCUMENT_ATTACHMENT_KEYS = [
  { key: 'applicationForm', label: '1. Application Form (Form 1419)', category: 'Application & Job' },
  { key: 'jobAcceptance', label: '2. Job Acceptance Letter (ED required)', category: 'Application & Job' },
  { key: 'employmentOffer', label: '3. Employment Offer Letter', category: 'Application & Job' },
  { key: 'jobConfirmation', label: '4. Job Confirmation Letter', category: 'Application & Job' },
  { key: 'workPermit', label: '5. Work Permit (Condition 8107)', category: 'Legal & Tax' },
  { key: 'incomeTax', label: '6. Income Tax Returned Certificate (ATO)', category: 'Legal & Tax' },
  { key: 'taxCertificate', label: '7. Tax Returned Certificate', category: 'Legal & Tax' },
  { key: 'insurancePaper', label: '8. Insurance Paper (OVHC)', category: 'Insurance & Visa' },
  { key: 'travelInsurance', label: '9. Travel Insurance Letter', category: 'Insurance & Visa' },
  { key: 'healthCertificate', label: '10. Health Certificate Letter (DHA eMedical)', category: 'Insurance & Visa' },
  { key: 'visaReceived', label: '11. Visa Application Received Paper', category: 'Insurance & Visa' },
  { key: 'visaGranted', label: '12. Visa Granted Paper (Official Notice)', category: 'Insurance & Visa' },
] as const;

export const ClientProfileManagementTab: React.FC = () => {
  const {
    clientProfiles,
    addClientProfile,
    updateClientProfile,
    deleteClientProfile,
    resetClientProfiles,
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED_ACTIVE' | 'PENDING_REVIEW' | 'GRANTED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ApplicantProfile | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'profile' | 'attachments' | 'custom'>('profile');

  // New or Edited Profile State
  const initialFormState: ApplicantProfile = {
    id: '',
    referenceNumber: '',
    edNumber: '',
    fullName: '',
    nationality: 'Bangladeshi',
    documentNumber: '',
    dateOfBirth: '',
    documentIssueDate: '',
    documentExpiryDate: '',
    visaSubclass: '482 - Temporary Skill Shortage (TSS)',
    visaStream: 'Medium-Term Stream (Skilled Specialist)',
    nominatedOccupation: 'Mining Operations Specialist',
    anzscoCode: '233611',
    sponsorName: 'BHP Western Australia Operations Pty Ltd',
    sponsorAbn: '49 004 028 077',
    applicationDate: new Date().toISOString().split('T')[0],
    grantDate: '',
    visaExpiryDate: '',
    visaGrantNumber: '',
    hapId: '',
    tfnNumber: '',
    salaryPackage: '$142,500 AUD + 11.5% Superannuation',
    workLocation: 'Perth Corporate Office & Pilbara Mine Sites, WA',
    status: 'VERIFIED_ACTIVE',
    attachments: {},
    customAttachments: [],
  };

  const [formData, setFormData] = useState<ApplicantProfile>(initialFormState);

  // Custom attachment input state
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [newCustomNotes, setNewCustomNotes] = useState('');

  // ID & Reference Generator helpers
  const generateReferenceNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newRef = `REF-${randomNum}`;
    setFormData((prev) => ({ ...prev, referenceNumber: newRef }));
  };

  const generateEdNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newEd = `ED-${randomNum}`;
    setFormData((prev) => ({ ...prev, edNumber: newEd }));
  };

  const generateVisaGrantNumber = () => {
    // 13 digit grant number
    const part1 = Math.floor(1000000 + Math.random() * 9000000);
    const part2 = Math.floor(100000 + Math.random() * 900000);
    const newGrant = `${part1}${part2}`;
    setFormData((prev) => ({ ...prev, visaGrantNumber: newGrant }));
  };

  const handleOpenAddModal = () => {
    const newId = `profile-${Date.now()}`;
    const randomRef = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomEd = `ED-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomGrant = `${Math.floor(1000000 + Math.random() * 9000000)}${Math.floor(100000 + Math.random() * 900000)}`;

    setFormData({
      ...initialFormState,
      id: newId,
      referenceNumber: randomRef,
      edNumber: randomEd,
      visaGrantNumber: randomGrant,
    });
    setEditingProfile(null);
    setActiveFormTab('profile');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile: ApplicantProfile) => {
    setEditingProfile(profile);
    setFormData({
      ...profile,
      attachments: profile.attachments || {},
      customAttachments: profile.customAttachments || [],
    });
    setActiveFormTab('profile');
    setIsModalOpen(true);
  };

  const handleFileAttachmentChange = (
    key: keyof NonNullable<ApplicantProfile['attachments']>,
    file: File | null
  ) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        attachments: {
          ...prev.attachments,
          [key]: undefined,
        },
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        attachments: {
          ...prev.attachments,
          [key]: {
            fileUrl: dataUri,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            uploadedAt: new Date().toISOString(),
            notes: `Uploaded file: ${file.name} (${Math.round(file.size / 1024)} KB)`,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUrlAttachmentChange = (
    key: keyof NonNullable<ApplicantProfile['attachments']>,
    url: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      attachments: {
        ...prev.attachments,
        [key]: url.trim()
          ? {
              fileUrl: url.trim(),
              fileName: url.trim().split('/').pop() || 'Remote Document Link',
              fileType: 'link',
              uploadedAt: new Date().toISOString(),
              notes: 'External linked document',
            }
          : undefined,
      },
    }));
  };

  const handleAddCustomAttachment = (file: File | null) => {
    if (!newCustomTitle.trim()) {
      alert('Please enter a title for the custom attachment.');
      return;
    }

    const newId = `custom-att-${Date.now()}`;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUri = reader.result as string;
        const newAttachment: CustomAttachment = {
          id: newId,
          title: newCustomTitle.trim(),
          fileUrl: dataUri,
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          notes: newCustomNotes.trim() || undefined,
        };
        setFormData((prev) => ({
          ...prev,
          customAttachments: [...(prev.customAttachments || []), newAttachment],
        }));
        setNewCustomTitle('');
        setNewCustomNotes('');
      };
      reader.readAsDataURL(file);
    } else {
      const newAttachment: CustomAttachment = {
        id: newId,
        title: newCustomTitle.trim(),
        uploadedAt: new Date().toISOString(),
        notes: newCustomNotes.trim() || undefined,
      };
      setFormData((prev) => ({
        ...prev,
        customAttachments: [...(prev.customAttachments || []), newAttachment],
      }));
      setNewCustomTitle('');
      setNewCustomNotes('');
    }
  };

  const handleDeleteCustomAttachment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customAttachments: (prev.customAttachments || []).filter((a) => a.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Please provide Full Name');
      return;
    }
    if (!formData.referenceNumber.trim()) {
      alert('Please provide Reference Number');
      return;
    }
    if (!formData.edNumber.trim()) {
      alert('Please provide ED Number');
      return;
    }
    if (!formData.documentNumber.trim()) {
      alert('Please provide Passport / Document ID Number');
      return;
    }

    if (editingProfile) {
      updateClientProfile(editingProfile.id, formData);
    } else {
      addClientProfile(formData);
    }

    setIsModalOpen(false);
    setEditingProfile(null);
  };

  const filteredProfiles = clientProfiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.referenceNumber.toLowerCase().includes(q) ||
      p.edNumber.toLowerCase().includes(q) ||
      p.documentNumber.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A1D] p-5 rounded-xl border border-[#282A2F]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#F25C05]" />
            <h3 className="text-lg font-bold text-white">Client Verification Profiles & Documents</h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage applicant identity records, auto-generate Reference & ED numbers, and attach multi-format verification files.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all client profiles to initial default data?')) {
                resetClientProfiles();
              }
            }}
            className="px-3 py-2 bg-[#23262D] hover:bg-[#2A2E37] text-gray-300 hover:text-white rounded-lg text-xs font-semibold border border-[#353945] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reset to default mock profiles"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded-lg text-xs font-bold shadow-md shadow-[#F25C05]/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Profile</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, REF number, ED number, or Passport/ID..."
            className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED_ACTIVE">Verified Active</option>
            <option value="GRANTED">Granted</option>
            <option value="PENDING_REVIEW">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Profiles Table / Card Grid */}
      <div className="bg-[#181A1D] border border-[#282A2F] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#1F2227] text-gray-400 font-bold border-b border-[#2C3038] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Applicant Name & ID</th>
                <th className="px-4 py-3">Reference (REF)</th>
                <th className="px-4 py-3">ED Number</th>
                <th className="px-4 py-3">Passport & DOB</th>
                <th className="px-4 py-3">Visa Subclass</th>
                <th className="px-4 py-3">Attachments</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26282E]">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-xs">
                    No client profiles found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((profile) => {
                  const attachmentCount = Object.keys(profile.attachments || {}).filter(
                    (k) => (profile.attachments as any)?.[k]?.fileUrl
                  ).length;
                  const customCount = profile.customAttachments?.length || 0;

                  return (
                    <tr key={profile.id} className="hover:bg-[#1D2026] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-xs">{profile.fullName}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <span>{profile.nationality}</span>
                          <span>•</span>
                          <span className="text-gray-500">{profile.nominatedOccupation}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-[#FF8E4D]">
                        {profile.referenceNumber}
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-[#63B3ED]">
                        {profile.edNumber}
                      </td>

                      <td className="px-4 py-3 font-mono text-gray-300">
                        <div>{profile.documentNumber}</div>
                        <div className="text-[10px] text-gray-500">DOB: {profile.dateOfBirth}</div>
                      </td>

                      <td className="px-4 py-3 text-gray-300">
                        <div className="text-[11px] font-semibold">{profile.visaSubclass || '482 - TSS'}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[140px]">
                          {profile.sponsorName}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-[#002B49] text-[#90CDF4] border border-[#0A4A7A] text-[10px] font-mono font-bold">
                            {attachmentCount}/12 Docs
                          </span>
                          {customCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-[#2D2305] text-[#FFCD00] border border-[#8C6D1F] text-[10px] font-mono">
                              +{customCount} custom
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            profile.status === 'VERIFIED_ACTIVE' || profile.status === 'GRANTED'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{profile.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(profile)}
                            className="p-1.5 bg-[#23262D] hover:bg-[#2C313C] text-gray-300 hover:text-white rounded transition-colors cursor-pointer"
                            title="Edit applicant profile & attachments"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete client profile for "${profile.fullName}"?`)) {
                                deleteClientProfile(profile.id);
                              }
                            }}
                            className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/40 rounded transition-colors cursor-pointer"
                            title="Delete profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add / Edit Client Profile & Attachment Manager */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#16181C] border border-[#333842] text-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1C1F25] border-b border-[#2C3038] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F25C05]/10 border border-[#F25C05]/30 flex items-center justify-center text-[#F25C05]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    {editingProfile ? 'Edit Client Profile & Attachments' : 'Register New Client Profile'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Enter applicant personal data, auto-generate numbers, and link or upload document attachments.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Header */}
            <div className="flex items-center border-b border-[#2C3038] bg-[#14161A] px-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFormTab('profile')}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'profile'
                    ? 'border-[#F25C05] text-[#F25C05] font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Personal & Visa Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('attachments')}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'attachments'
                    ? 'border-[#F25C05] text-[#F25C05] font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>2. 12-Doc Attachment Manager</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('custom')}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'custom'
                    ? 'border-[#F25C05] text-[#F25C05] font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>3. Custom Extra Attachments ({formData.customAttachments?.length || 0})</span>
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: Profile & Identity Information */}
              {activeFormTab === 'profile' && (
                <div className="space-y-5">
                  {/* ID & Reference Generator Box */}
                  <div className="bg-[#1F232B] border border-[#323946] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FFCD00]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          ID & Reference Generator
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">Click to auto-generate or manually edit</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Reference Number Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-300">
                            Reference Number (রেফারেন্স নম্বর) *
                          </label>
                          <button
                            type="button"
                            onClick={generateReferenceNumber}
                            className="text-[10px] text-[#FF8E4D] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Auto-Generate REF</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.referenceNumber}
                          onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                          placeholder="e.g. REF-100200"
                          className="w-full bg-[#121417] border border-[#2D333F] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#FF8E4D] focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* ED Number Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-300">
                            ED Number (নিয়োগপত্র / ED নম্বর) *
                          </label>
                          <button
                            type="button"
                            onClick={generateEdNumber}
                            className="text-[10px] text-[#63B3ED] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Auto-Generate ED</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.edNumber}
                          onChange={(e) => setFormData({ ...formData, edNumber: e.target.value })}
                          placeholder="e.g. ED-800900"
                          className="w-full bg-[#121417] border border-[#2D333F] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#63B3ED] focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Personal Data Inputs */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Personal Identity Details
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Full Name (আবেদনকারীর সম্পূর্ণ নাম) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Md. Rafiqul Islam"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Nationality */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Nationality (জাতীয়তা) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          placeholder="e.g. Bangladeshi"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Passport / Document ID */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Passport / Document ID (পাসপোর্ট বা আইডি নম্বর) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.documentNumber}
                          onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                          placeholder="e.g. A01984271"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Date of Birth (DOB) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Date of Birth (জন্ম তারিখ) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          placeholder="e.g. 1991-04-14 or 14 APR 1991"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Document Issue Date */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Document Issue Date (ইস্যু তারিখ) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.documentIssueDate}
                          onChange={(e) => setFormData({ ...formData, documentIssueDate: e.target.value })}
                          placeholder="e.g. 2020-05-12"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Document Expiry Date */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Document Expiry Date (মেয়াদোত্তীর্ণ তারিখ)
                        </label>
                        <input
                          type="text"
                          value={formData.documentExpiryDate || ''}
                          onChange={(e) => setFormData({ ...formData, documentExpiryDate: e.target.value })}
                          placeholder="e.g. 2030-05-11"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visa & Employment Data */}
                  <div className="space-y-3 pt-3 border-t border-[#282B33]">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Visa & Nominated Employment
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nominated Occupation */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Nominated Occupation (মনোনীত পেশা)
                        </label>
                        <input
                          type="text"
                          value={formData.nominatedOccupation || ''}
                          onChange={(e) => setFormData({ ...formData, nominatedOccupation: e.target.value })}
                          placeholder="e.g. Mining Operations Specialist"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* ANZSCO Code */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          ANZSCO Code (অস্ট্রেলিয়ান পেশা কোড)
                        </label>
                        <input
                          type="text"
                          value={formData.anzscoCode || ''}
                          onChange={(e) => setFormData({ ...formData, anzscoCode: e.target.value })}
                          placeholder="e.g. 233611"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Visa Subclass */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Visa Subclass (ভিসা সাবক্লাস)
                        </label>
                        <input
                          type="text"
                          value={formData.visaSubclass || ''}
                          onChange={(e) => setFormData({ ...formData, visaSubclass: e.target.value })}
                          placeholder="e.g. 482 - Temporary Skill Shortage (TSS)"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Visa Grant Number */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-gray-300">
                            13-digit Visa Grant Number
                          </label>
                          <button
                            type="button"
                            onClick={generateVisaGrantNumber}
                            className="text-[10px] text-[#FFCD00] hover:underline cursor-pointer"
                          >
                            Auto-Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          value={formData.visaGrantNumber || ''}
                          onChange={(e) => setFormData({ ...formData, visaGrantNumber: e.target.value })}
                          placeholder="e.g. 1098452391048"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Sponsor Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Sponsor Name (স্পনসর প্রতিষ্ঠান)
                        </label>
                        <input
                          type="text"
                          value={formData.sponsorName || ''}
                          onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                          placeholder="e.g. BHP Western Australia Operations Pty Ltd"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Salary Package */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Salary Package (বেতন কাঠামো)
                        </label>
                        <input
                          type="text"
                          value={formData.salaryPackage || ''}
                          onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                          placeholder="e.g. $142,500 AUD + 11.5% Superannuation"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Work Location */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Work Location (কাজের স্থান)
                        </label>
                        <input
                          type="text"
                          value={formData.workLocation || ''}
                          onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                          placeholder="e.g. Perth & Pilbara Operations, WA"
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Verification Status (স্ট্যাটাস) *
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full bg-[#1A1C20] border border-[#2F333D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05] cursor-pointer"
                        >
                          <option value="VERIFIED_ACTIVE">VERIFIED_ACTIVE (যাচাইকৃত সক্রিয়)</option>
                          <option value="GRANTED">GRANTED (অনুমোদিত ভিসা)</option>
                          <option value="PENDING_REVIEW">PENDING_REVIEW (অপেক্ষমান পর্যালোচনা)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Multi-Format Document Attachment Manager */}
              {activeFormTab === 'attachments' && (
                <div className="space-y-4">
                  <div className="bg-[#1A222B] border border-[#2C3B4C] p-4 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#FFCD00] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Multi-Format Document Attachment Manager</h5>
                      <p className="text-[11px] text-gray-300 mt-0.5">
                        Upload custom PDF/PNG/JPG documents or specify remote download links for each of the 12 verified documents.
                        If no file is attached, the portal generates the official Commonwealth / BHP dynamic document automatically.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 divide-y divide-[#262A33]">
                    {DOCUMENT_ATTACHMENT_KEYS.map(({ key, label, category }) => {
                      const att = (formData.attachments as any)?.[key] as DocumentAttachment | undefined;

                      return (
                        <div key={key} className="pt-3 first:pt-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-2">
                                <span>{label}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-gray-400">
                                  {category}
                                </span>
                              </div>
                              {att?.fileName && (
                                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Attached: {att.fileName}</span>
                                </div>
                              )}
                            </div>

                            {att?.fileUrl && (
                              <button
                                type="button"
                                onClick={() => handleFileAttachmentChange(key as any, null)}
                                className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
                              >
                                Remove File
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* File Upload input */}
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                                Upload File (PDF, Word, or Image):
                              </label>
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileAttachmentChange(key as any, file);
                                }}
                                className="w-full text-xs text-gray-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-[#2A2E38] file:text-white hover:file:bg-[#383D4A] cursor-pointer"
                              />
                            </div>

                            {/* Or direct URL link */}
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                                Or Direct Document Link / URL:
                              </label>
                              <div className="relative">
                                <LinkIcon className="w-3 h-3 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="url"
                                  value={att?.fileUrl?.startsWith('data:') ? '' : att?.fileUrl || ''}
                                  onChange={(e) => handleUrlAttachmentChange(key as any, e.target.value)}
                                  placeholder="https://storage.googleapis.com/.../doc.pdf"
                                  className="w-full bg-[#121417] border border-[#2D333F] rounded pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Custom Extra Attachments */}
              {activeFormTab === 'custom' && (
                <div className="space-y-5">
                  {/* Add New Custom Attachment Form */}
                  <div className="bg-[#1C2028] border border-[#2F3644] p-4 rounded-xl space-y-3">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-[#F25C05]" />
                      <span>Add Extra Attachment (অতিরিক্ত সনদ বা ডকুমেন্ট যোগ করুন)</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Document Title (সনদের নাম) *
                        </label>
                        <input
                          type="text"
                          value={newCustomTitle}
                          onChange={(e) => setNewCustomTitle(e.target.value)}
                          placeholder="e.g. Police Clearance Certificate, IELTS Score Card, Degree Certificate"
                          className="w-full bg-[#121417] border border-[#2D333F] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Notes or Reference Info (তথ্য)
                        </label>
                        <input
                          type="text"
                          value={newCustomNotes}
                          onChange={(e) => setNewCustomNotes(e.target.value)}
                          placeholder="e.g. Authenticated by Ministry of Foreign Affairs"
                          className="w-full bg-[#121417] border border-[#2D333F] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Select File to Attach:
                      </label>
                      <input
                        id="custom-file-input"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#F25C05] file:text-white hover:file:bg-[#d84e00] cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const fileInput = document.getElementById('custom-file-input') as HTMLInputElement;
                          const file = fileInput?.files?.[0] || null;
                          handleAddCustomAttachment(file);
                          if (fileInput) fileInput.value = '';
                        }}
                        className="px-4 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Attachment to Profile</span>
                      </button>
                    </div>
                  </div>

                  {/* Existing Custom Attachments List */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Attached Custom Documents ({formData.customAttachments?.length || 0})
                    </h5>

                    {(!formData.customAttachments || formData.customAttachments.length === 0) ? (
                      <div className="p-4 bg-[#14161A] border border-[#252830] rounded-lg text-center text-xs text-gray-500">
                        No extra custom attachments added yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.customAttachments.map((att) => (
                          <div
                            key={att.id}
                            className="p-3 bg-[#191C22] border border-[#2A303D] rounded-lg flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <Paperclip className="w-4 h-4 text-[#F25C05] shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-white">{att.title}</div>
                                <div className="text-[10px] text-gray-400">
                                  {att.fileName ? `File: ${att.fileName}` : 'Information only'} • {att.uploadedAt.split('T')[0]}
                                  {att.notes && ` • ${att.notes}`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {att.fileUrl && (
                                <a
                                  href={att.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 text-xs text-gray-300 hover:text-white bg-[#252A34] rounded transition-colors"
                                  title="View file"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomAttachment(att.id)}
                                className="p-1.5 text-xs text-red-400 hover:text-red-200 bg-red-950/40 rounded transition-colors cursor-pointer"
                                title="Delete attachment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2C3038]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#23262D] text-gray-300 hover:text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-white rounded text-xs font-bold shadow-md shadow-[#F25C05]/20 cursor-pointer transition-all"
                >
                  {editingProfile ? 'Save Changes' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
