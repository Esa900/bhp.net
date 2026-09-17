import React, { useState } from 'react';
import { ApplicantProfile, DocumentType } from '../../types/portal';
import { DOCUMENT_METADATA_LIST } from '../../data/portalData';
import {
  FileText,
  Eye,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  HeartPulse,
  Receipt,
  Award,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface DocumentCardGridProps {
  profile: ApplicantProfile;
  onOpenDocument: (type: DocumentType) => void;
}

export const DocumentCardGrid: React.FC<DocumentCardGridProps> = ({
  profile,
  onOpenDocument,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'REF' | 'ED'>('ALL');
  const [searchDocQuery, setSearchDocQuery] = useState('');

  const getDocIcon = (type: DocumentType) => {
    switch (type) {
      case 'application-form':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'job-acceptance':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'employment-offer':
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case 'job-confirmation':
        return <Award className="w-5 h-5 text-indigo-600" />;
      case 'insurance-travel':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'health-certificate':
        return <HeartPulse className="w-5 h-5 text-sky-600" />;
      case 'tax-certificate':
        return <Receipt className="w-5 h-5 text-gray-700" />;
      case 'work-permit':
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case 'visa-received':
        return <Calendar className="w-5 h-5 text-cyan-600" />;
      case 'visa-granted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredDocs = DOCUMENT_METADATA_LIST.filter((doc) => {
    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'REF' && (doc.searchKey === 'REF' || doc.searchKey === 'BOTH')) ||
      (filterType === 'ED' && (doc.searchKey === 'ED' || doc.searchKey === 'BOTH'));

    const matchesSearch =
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchDocQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <section className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Section Header */}
      <div className="bg-[#002B49] text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-[#FFCD00] tracking-wider mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Repository & Official Verifications</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Verified Document Records ({DOCUMENT_METADATA_LIST.length} Files Available)
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Reconciled with Reference <strong className="text-white font-mono">{profile.referenceNumber}</strong> and Employer Directive <strong className="text-[#FFCD00] font-mono">{profile.edNumber}</strong>.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-[#C88A24] text-black shadow-sm'
                : 'bg-[#001D33] text-gray-300 hover:text-white border border-[#0A3D63]'
            }`}
          >
            All 10 Documents
          </button>
          <button
            onClick={() => setFilterType('REF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'REF'
                ? 'bg-[#C88A24] text-black shadow-sm'
                : 'bg-[#001D33] text-gray-300 hover:text-white border border-[#0A3D63]'
            }`}
          >
            Ref Searchable ({profile.referenceNumber})
          </button>
          <button
            onClick={() => setFilterType('ED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'ED'
                ? 'bg-[#C88A24] text-black shadow-sm'
                : 'bg-[#001D33] text-gray-300 hover:text-white border border-[#0A3D63]'
            }`}
          >
            ED Searchable ({profile.edNumber})
          </button>
        </div>
      </div>

      {/* Quick Search Within Documents */}
      <div className="p-4 bg-[#F8FAFC] border-b border-gray-200 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchDocQuery}
            onChange={(e) => setSearchDocQuery(e.target.value)}
            placeholder="Search documents by name (e.g. Work Permit, Health Certificate, Tax, Offer)..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold shrink-0">
          Showing {filteredDocs.length} of {DOCUMENT_METADATA_LIST.length}
        </span>
      </div>

      {/* Document Cards Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          return (
            <div
              key={doc.type}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#002B49] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Code & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {doc.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.searchKey === 'ED'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : doc.searchKey === 'REF'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {doc.badge}
                  </span>
                </div>

                {/* Card Title & Icon */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 shrink-0 group-hover:scale-105 transition-transform">
                    {getDocIcon(doc.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-950 group-hover:text-[#002B49] transition-colors leading-snug">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {doc.description}
                </p>
              </div>

              {/* Card Footer: Metadata & Action */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] font-mono text-gray-500">
                  {doc.searchKey === 'ED' && <span className="text-[#C88A24] font-bold">{profile.edNumber}</span>}
                  {doc.searchKey === 'REF' && <span className="text-blue-800 font-bold">{profile.referenceNumber}</span>}
                  {doc.searchKey === 'BOTH' && <span className="text-emerald-700 font-bold">Dual Verified</span>}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDocument(doc.type)}
                  className="px-3.5 py-1.5 bg-[#002B49] hover:bg-[#001D33] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer group-hover:shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FFCD00]" />
                  <span>View Document</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
