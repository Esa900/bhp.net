import React, { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Award,
  ShieldCheck,
  FileText,
  Upload,
  Send,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  Home,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { JobCategory, JobRequirement, JobApplication } from '../types/jobCircular';
import {
  getJobRequirementByCategoryId,
  addJobApplication,
} from '../utils/jobCircularStorage';

interface JobCircularModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: JobCategory | null;
}

export const JobCircularModal: React.FC<JobCircularModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [requirement, setRequirement] = useState<JobRequirement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [nidOrPassport, setNidOrPassport] = useState('');
  const [notes, setNotes] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [formError, setFormError] = useState('');

  // Load requirements for the active category
  useEffect(() => {
    if (isOpen && category) {
      const req = getJobRequirementByCategoryId(category.id);
      if (req) {
        setRequirement(req);
      } else {
        // Fallback temporary requirement if not explicitly created yet
        setRequirement({
          id: `req-${category.id}`,
          categoryId: category.id,
          categoryName: category.name,
          jobTitle: `${category.name} Operations Specialist`,
          vacancy: '20+ Posts (২০+ জন)',
          salary: '$3,800 - $5,000 AUD / Month',
          location: 'BHP Sites & Operations Hubs',
          dutyHours: '8 Hours / Day',
          experience: 'Minimum 1 year experience or fresher with vocational skill',
          ageLimit: '21 to 45 Years',
          education: 'SSC / Vocational / Equivalent',
          requirements: [
            `Trade knowledge and technical aptitude in ${category.name}`,
            'Good physical fitness and adherence to occupational safety standards',
            'Positive attitude and ability to work in team environments',
          ],
          benefits: [
            'Company provided accommodation & dining',
            'Full medical coverage & insurance',
            'Overtime allowance and annual leave',
          ],
          deadline: 'Open / Ongoing 2026 Recruitment',
          description: `BHP গ্লোবাল অপারেশনে ${category.name} পদের জন্য আগ্রহী প্রার্থীদের নিকট হতে দরখাস্ত আহবান করা যাচ্ছে। আবেদন করতে নিচের ফর্মটি পূরণ করুন।`,
          status: 'Active',
          updatedAt: new Date().toISOString().split('T')[0],
        });
      }

      // Reset form
      setFullName('');
      setPhone('');
      setEmail('');
      setAge('');
      setEducation('');
      setExperience('');
      setPresentAddress('');
      setNidOrPassport('');
      setNotes('');
      setAttachedFile(null);
      setFormError('');
      setSubmittedApp(null);
    }
  }, [isOpen, category]);

  // File upload handler (Max 5MB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('ফাইল সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        dataUrl: event.target?.result as string,
      });
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !requirement) return;

    // Validation
    if (!fullName.trim()) {
      setFormError('অনুগ্রহ করে প্রার্থীর পূর্ণ নাম লিখুন (Please enter full name).');
      return;
    }
    if (!phone.trim()) {
      setFormError('অনুগ্রহ করে মোবাইল নম্বর লিখুন (Please enter valid phone number).');
      return;
    }
    if (!age.trim()) {
      setFormError('অনুগ্রহ করে প্রার্থীর বয়স উল্লেখ করুন (Please enter age).');
      return;
    }
    if (!education.trim()) {
      setFormError('অনুগ্রহ করে শিক্ষাগত যোগ্যতা উল্লেখ করুন (Please enter education).');
      return;
    }
    if (!experience.trim()) {
      setFormError('অনুগ্রহ করে কাজের অভিজ্ঞতা উল্লেখ করুন (Please enter experience).');
      return;
    }
    if (!presentAddress.trim()) {
      setFormError('অনুগ্রহ করে বর্তমান ঠিকানা বা জেলা লিখুন (Please enter present address).');
      return;
    }
    if (!nidOrPassport.trim()) {
      setFormError('অনুগ্রহ করে এনআইডি অথবা পাসপোর্ট নম্বর লিখুন (NID or Passport number required).');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    setTimeout(() => {
      const newApp = addJobApplication({
        categoryId: category.id,
        categoryName: category.name,
        jobTitle: requirement.jobTitle,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        age: age.trim(),
        education: education.trim(),
        experience: experience.trim(),
        presentAddress: presentAddress.trim(),
        nidOrPassport: nidOrPassport.trim(),
        notes: notes.trim() || undefined,
        resumeFileName: attachedFile?.name,
        resumeDataUrl: attachedFile?.dataUrl,
      });

      setIsSubmitting(false);
      setSubmittedApp(newApp);
    }, 400);
  };

  if (!isOpen || !category) return null;

  return (
    <div
      id="job-circular-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="job-circular-modal-container"
        className="w-full max-w-4xl bg-[#16181B] border border-[#2D3037] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 relative text-gray-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#1B1E23] via-[#1E2127] to-[#1B1E23] px-5 py-4 border-b border-[#2C3038] flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-[#F25C05]/15 text-[#F25C05] border border-[#F25C05]/30 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FF8E4D] uppercase tracking-wider">
                  BHP Official Job Circular
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {requirement?.status === 'Active' ? 'Recruiting 2026' : 'Closed'}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white truncate mt-0.5">
                {requirement?.jobTitle || category.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2C3038] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* SUCCESS VIEW IF SUBMITTED */}
          {submittedApp ? (
            <div className="p-6 sm:p-8 bg-[#1B2220] border border-emerald-500/30 rounded-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  আবেদন সফলভাবে গৃহীত হয়েছে (Application Submitted)
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-3">
                  ধন্যবাদ, {submittedApp.fullName}!
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mt-1">
                  আপনার চাকরির আবেদন সফলভাবে BHP ক্যারিয়ার সিস্টেমে জমা পড়েছে। আমাদের রিক্রুটমেন্ট টিম আপনার তথ্য যাচাই করে দ্রুত যোগাযোগ করবে।
                </p>
              </div>

              {/* Application Tracking Card */}
              <div className="bg-[#141816] p-5 rounded-xl border border-emerald-500/20 max-w-md mx-auto text-left space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs text-gray-400">Application Reference ID:</span>
                  <span className="text-sm font-mono font-extrabold text-[#FF8E4D]">
                    {submittedApp.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Applied Position:</span>
                  <span className="text-white font-semibold">{submittedApp.jobTitle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-gray-200">{submittedApp.categoryName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Candidate Mobile:</span>
                  <span className="text-white font-mono">{submittedApp.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Submission Date:</span>
                  <span className="text-gray-300">{submittedApp.appliedAt}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-gray-400">Initial Status:</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Under Review (যাচাই চলছে)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl bg-[#F25C05] hover:bg-[#D94F04] text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  Done / সম্পন্ন
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: KEY JOB SUMMARY TILES */}
              {requirement && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-1">
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#F25C05]" />
                      <span>পদ সংখ্যা (Vacancy)</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      {requirement.vacancy}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-1">
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>মাসিক বেতন (Salary)</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-400 truncate">
                      {requirement.salary}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-1">
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>কাজের স্থান (Location)</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-200 truncate">
                      {requirement.location}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#1C1E23] rounded-xl border border-[#2D313A] space-y-1">
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>কাজের সময় (Duty)</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-200">
                      {requirement.dutyHours}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: REQUIREMENTS & FACILITIES (2-COLUMNS) */}
              {requirement && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Qualifications & Requirements Box */}
                  <div className="p-5 bg-[#1A1C20] rounded-xl border border-[#2B2F38] space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#2A2E38]">
                      <Award className="w-4 h-4 text-[#F25C05]" />
                      <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                        কাজের যোগ্যতা ও রিকোয়ারমেন্ট (Job Requirements)
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-400 shrink-0">অভিজ্ঞতা (Exp):</span>
                        <span className="text-white font-medium">{requirement.experience}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-400 shrink-0">বয়সসীমা (Age):</span>
                        <span className="text-white font-medium">{requirement.ageLimit}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-400 shrink-0">শিক্ষাগত যোগ্যতা:</span>
                        <span className="text-white font-medium">{requirement.education}</span>
                      </div>
                    </div>

                    {requirement.requirements && requirement.requirements.length > 0 && (
                      <div className="pt-2 border-t border-[#262A33] space-y-1.5">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase block">
                          বিশেষ কারিগরি দক্ষতা ও দায়িত্ব:
                        </span>
                        <ul className="space-y-1 text-xs text-gray-300">
                          {requirement.requirements.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#F25C05] mt-0.5">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Benefits & Facilities Box */}
                  <div className="p-5 bg-[#1A1C20] rounded-xl border border-[#2B2F38] space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#2A2E38]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                        কোম্পানি প্রদত্ত সুযোগ-সুবিধা (Facilities & Benefits)
                      </h4>
                    </div>

                    {requirement.benefits && requirement.benefits.length > 0 ? (
                      <ul className="space-y-2 text-xs text-gray-300">
                        {requirement.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">কোম্পানির বিধি অনুযায়ী সকল সুযোগ-সুবিধা প্রযোজ্য।</p>
                    )}

                    <div className="pt-3 border-t border-[#262A33] flex items-center justify-between text-xs">
                      <span className="text-gray-400">আবেদনের শেষ সময়:</span>
                      <span className="text-[#FF8E4D] font-semibold">{requirement.deadline}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: DESCRIPTION */}
              {requirement?.description && (
                <div className="p-4 bg-[#141518] rounded-xl border border-[#252830] text-xs text-gray-300 leading-relaxed space-y-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    অফিসিয়াল বিবরণ (Official Circular Overview):
                  </span>
                  <p>{requirement.description}</p>
                </div>
              )}

              {/* SECTION 4: ONLINE JOB APPLICATION FORM */}
              <div className="p-5 sm:p-6 bg-[#181A1E] rounded-xl border border-[#2E323A] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#2A2E37]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#F25C05]" />
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      অনলাইন চাকরির আবেদন ফরম (Submit Your Job Application)
                    </h3>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Applying for: <strong className="text-[#FF8E4D]">{category.name}</strong>
                  </span>
                </div>

                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        প্রার্থীর পূর্ণ নাম (Full Name as per NID/Passport) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                          className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                        />
                      </div>
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        মোবাইল নম্বর / WhatsApp (Mobile Number) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="যেমন: +880 1712-345678"
                          className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        ইমেইল এড্রেস (Email Address - ঐচ্ছিক)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="applicant@example.com"
                          className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                        />
                      </div>
                    </div>

                    {/* Age / Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        বয়স / জন্মতারিখ (Age) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="যেমন: 26 Years (বা 15/04/1999)"
                          className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                        />
                      </div>
                    </div>

                    {/* Educational Qualification */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        সর্বোচ্চ শিক্ষাগত যোগ্যতা (Education) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="যেমন: SSC / HSC / Diploma / Trade Certificate"
                        className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                      />
                    </div>

                    {/* Experience in this trade */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        কাজের অভিজ্ঞতা (Experience in {category.name}) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="যেমন: ২ বছর কাজের অভিজ্ঞতা (বা নতুন/Fresher)"
                        className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                      />
                    </div>

                    {/* Present Address / District */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        বর্তমান ঠিকানা ও জেলা (Present Address & District) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Home className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={presentAddress}
                          onChange={(e) => setPresentAddress(e.target.value)}
                          placeholder="গ্রাম/রোড, থানা, জেলা (যেমন: মিরপুর, ঢাকা)"
                          className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                        />
                      </div>
                    </div>

                    {/* NID / Passport Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        এনআইডি অথবা পাসপোর্ট নম্বর (NID / Passport No) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={nidOrPassport}
                          onChange={(e) => setNidOrPassport(e.target.value)}
                          placeholder="NID বা পাসপোর্ট নম্বর লিখুন"
                          className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload Resume / Photo / Trade Certificate */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-300">
                      সিভি / ছবি / সার্টিফিকেট সংযুক্ত করুন (Upload CV, Photo or Certificate - ঐচ্ছিক)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 border-2 border-dashed border-[#343842] hover:border-[#F25C05] rounded-xl p-3 text-center cursor-pointer transition-colors bg-[#121316]">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white">
                          <Upload className="w-4 h-4 text-[#F25C05]" />
                          <span>
                            {attachedFile ? (
                              <strong className="text-emerald-400 truncate">{attachedFile.name}</strong>
                            ) : (
                              'ফাইল নির্বাচন করুন (PDF, JPG, PNG - Max 5MB)'
                            )}
                          </span>
                        </div>
                      </label>
                      {attachedFile && (
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Remarks / Notes */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-300">
                      অতিরিক্ত তথ্য বা মন্তব্য (Additional Notes / Remarks - ঐচ্ছিক)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="আপনার কাজের কোনো বিশেষ অভিজ্ঞতা বা প্রশ্ন থাকলে এখানে লিখতে পারেন..."
                      className="w-full bg-[#121316] border border-[#343842] focus:border-[#F25C05] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>সকল তথ্য নিরাপদ ও সরাসরি BHP ডাটাবেজে সংরক্ষিত হবে।</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-7 py-3 bg-[#F25C05] hover:bg-[#D94F04] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      {isSubmitting ? (
                        <span>প্রসেস হচ্ছে...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Application (আবেদন জমা দিন)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
