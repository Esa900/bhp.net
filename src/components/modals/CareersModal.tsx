import React, { useState } from 'react';
import { X, Search, MapPin, Briefcase, Filter, ArrowRight, CheckCircle2, FileText, Send, User, Mail, Phone, Upload } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobRole {
  id: string;
  title: string;
  location: string;
  country: string;
  discipline: string;
  type: string;
  posted: string;
  reference: string;
}

const SAMPLE_JOBS: JobRole[] = [
  {
    id: 'job-1',
    title: 'Senior Reliability Engineer – Fixed Plant',
    location: 'Newman, Western Australia',
    country: 'Australia',
    discipline: 'Engineering & Maintenance',
    type: 'Full-time / FIFO 8:6',
    posted: '2 days ago',
    reference: 'REQ-WAIO-49201',
  },
  {
    id: 'job-2',
    title: 'Superintendente de Operaciones Mina',
    location: 'Antofagasta, Minera Escondida',
    country: 'Chile',
    discipline: 'Mining Operations',
    type: 'Full-time / 7x7 Turno',
    posted: 'Just now',
    reference: 'REQ-CHL-88210',
  },
  {
    id: 'job-3',
    title: 'Shaft Sinking & Mechanical Lead – Jansen Project',
    location: 'Saskatoon & Jansen Site, SK',
    country: 'Canada',
    discipline: 'Engineering & Maintenance',
    type: 'Full-time Permanent',
    posted: '1 week ago',
    reference: 'REQ-CAN-10293',
  },
  {
    id: 'job-4',
    title: 'Global Graduate Program 2027 Intake – Engineering & Data Science',
    location: 'Perth, Brisbane, Adelaide',
    country: 'Australia',
    discipline: 'Graduate & Student Programs',
    type: 'Graduate Program 2 Years',
    posted: '3 days ago',
    reference: 'GRAD-BHP-2027',
  },
  {
    id: 'job-5',
    title: 'Principal Decarbonisation & Power Systems Specialist',
    location: 'Santiago or Melbourne',
    country: 'Global',
    discipline: 'Sustainability & Environment',
    type: 'Full-time Flexible',
    posted: '5 days ago',
    reference: 'REQ-SUS-77123',
  },
  {
    id: 'job-6',
    title: 'Autonomous Haulage Fleet Controller',
    location: 'Perth Integrated Remote Operations Centre (IROC)',
    country: 'Australia',
    discipline: 'Technology & Automation',
    type: 'Full-time Shiftwork',
    posted: '4 days ago',
    reference: 'REQ-AUTO-33491',
  },
];

export const CareersModal: React.FC<CareersModalProps> = ({ isOpen, onClose }) => {
  const { addApplicant, jobs: adminJobs } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [appliedJob, setAppliedJob] = useState<JobRole | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states for actual job application
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resumeFileName: '',
    notes: '',
  });

  if (!isOpen) return null;

  // Merge admin created jobs with sample jobs
  const combinedJobs: JobRole[] = [
    ...adminJobs
      .filter((j) => j.status === 'Active')
      .map((j) => ({
        id: j.id,
        title: j.title,
        location: j.location,
        country: 'Global',
        discipline: j.department,
        type: j.type,
        posted: j.postedDate || 'Just now',
        reference: `REQ-${j.id.slice(-5).toUpperCase()}`,
      })),
    ...SAMPLE_JOBS,
  ];

  const filteredJobs = combinedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || job.country === selectedCountry;
    const matchesDiscipline = selectedDiscipline === 'All' || job.discipline === selectedDiscipline;
    return matchesSearch && matchesCountry && matchesDiscipline;
  });

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appliedJob) return;

    addApplicant({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      jobTitle: appliedJob.title,
      resumeFileName: formData.resumeFileName.trim() || `${formData.name.replace(/\s+/g, '_')}_CV.pdf`,
      notes: formData.notes.trim() || undefined,
    });

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAppliedJob(null);
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      resumeFileName: '',
      notes: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1B1C1E] border border-[#33353A] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2B2D31] bg-[#151618]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05]">BHP</span>
            <span className="text-gray-300 text-sm font-semibold border-l border-gray-700 pl-3">
              Careers & Opportunities Portal
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#25272B] rounded transition-colors"
            aria-label="Close careers modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-6 bg-[#212327] border-b border-[#2B2D31] space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#F25C05] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job title, skill or requisition ID..."
                className="w-full bg-[#18191B] border border-[#3A3C42] rounded pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-[#18191B] border border-[#3A3C42] rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
              >
                <option value="All">All Regions</option>
                <option value="Australia">Australia</option>
                <option value="Chile">Chile</option>
                <option value="Canada">Canada</option>
                <option value="Global">Global / Remote</option>
              </select>

              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="bg-[#18191B] border border-[#3A3C42] rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
              >
                <option value="All">All Disciplines</option>
                <option value="Engineering & Maintenance">Engineering & Maintenance</option>
                <option value="Mining Operations">Mining Operations</option>
                <option value="Technology & Automation">Technology & Automation</option>
                <option value="Sustainability & Environment">Sustainability</option>
                <option value="Graduate & Student Programs">Graduate Programs</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredJobs.length} open career opportunities</span>
            <span>Equal opportunity & inclusive employer</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-4">
          
          {isSubmitted ? (
            <div className="p-8 bg-[#22252B] border border-green-500/40 rounded-lg text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Application Submitted Successfully</h3>
              <p className="text-sm text-gray-300 max-w-lg mx-auto">
                Thank you, <strong className="text-white">{formData.name}</strong>. Your application for <strong className="text-white">{appliedJob?.title}</strong> has been registered. The HR & Talent Acquisition team has received your profile in the Admin portal.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#F25C05] hover:bg-[#d44e00] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Back to Opportunities
                </button>
              </div>
            </div>
          ) : appliedJob ? (
            <div className="p-6 sm:p-8 bg-[#22252B] border border-[#3A3C42] rounded-lg space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#32353C] gap-2">
                <div>
                  <span className="text-xs font-mono text-[#F25C05] uppercase tracking-wider font-bold">
                    Job Application • {appliedJob.reference}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{appliedJob.title}</h3>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                    <span>{appliedJob.location}</span>
                    <span>•</span>
                    <span>{appliedJob.type}</span>
                    <span>•</span>
                    <span>{appliedJob.discipline}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded bg-[#18191B] border border-[#32353C] self-start sm:self-auto cursor-pointer"
                >
                  Choose Different Role
                </button>
              </div>

              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. David MacIntyre"
                        className="w-full bg-[#18191B] border border-[#3A3C42] rounded pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. candidate@example.com"
                        className="w-full bg-[#18191B] border border-[#3A3C42] rounded pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +61 412 884 901"
                        className="w-full bg-[#18191B] border border-[#3A3C42] rounded pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Resume / CV File Name *
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-[#F25C05] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.resumeFileName}
                        onChange={(e) => setFormData({ ...formData, resumeFileName: e.target.value })}
                        placeholder="e.g. My_Updated_CV_2026.pdf"
                        className="w-full bg-[#18191B] border border-[#3A3C42] rounded pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Cover Note or Experience Summary (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly state your relevant background, mining/engineering experience, or certifications..."
                    className="w-full bg-[#18191B] border border-[#3A3C42] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-[#2B2D33] hover:bg-[#383B42] text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F25C05] hover:bg-[#d44e00] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-lg shadow-[#F25C05]/20 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 bg-[#23252A] border border-[#32353C] hover:border-[#F25C05]/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2.5 py-0.5 rounded bg-[#2D3037] text-gray-300 font-medium">
                          {job.discipline}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{job.reference}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-[#F25C05] transition-colors">
                        {job.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F25C05]" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                          {job.type}
                        </span>
                        <span className="text-gray-500">Posted {job.posted}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAppliedJob(job)}
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2D3037] hover:bg-[#F25C05] text-white text-xs font-bold uppercase tracking-wider rounded transition-all"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400">
                  No jobs matched your current criteria. Try adjusting the region or discipline filters.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#151618] border-t border-[#2B2D31] flex items-center justify-between text-xs text-gray-500">
          <span>Explore Graduate, Apprenticeship & Internships at BHP</span>
          <span className="text-white font-semibold">Join a diverse team of 80,000+ people</span>
        </div>

      </div>
    </div>
  );
};
