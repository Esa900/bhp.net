import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Share2,
  ArrowLeft,
  Check,
  ShieldCheck,
  FileText,
  User,
  Briefcase,
  MapPin,
  Hash,
  Paperclip,
  File,
  Maximize2,
  Building,
  Award,
} from 'lucide-react';
import { NewsItem, AdminPost } from '../../types';
import { getStoredAdminPosts } from '../../utils/postsStorage';
import { FullPdfDocumentViewer, postToUnifiedDoc } from '../FullPdfDocumentViewer';
import { PdfCanvasRenderer } from '../PdfCanvasRenderer';

interface ArticleModalProps {
  article: NewsItem | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [matchingPost, setMatchingPost] = useState<AdminPost | null>(null);
  const [isFullDossierOpen, setIsFullDossierOpen] = useState(false);

  useEffect(() => {
    if (!article) {
      setMatchingPost(null);
      setIsFullDossierOpen(false);
      return;
    }

    try {
      const allPosts = getStoredAdminPosts();
      const found = allPosts.find(
        (p) =>
          p.id === article.id ||
          (p.title && article.title && p.title.trim().toLowerCase() === article.title.trim().toLowerCase())
      );
      setMatchingPost(found || null);
    } catch {
      setMatchingPost(null);
    }
    setIsFullDossierOpen(false);
  }, [article]);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // If user opened full dossier mode for this post
  if (isFullDossierOpen && matchingPost) {
    return (
      <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-[#17181B] border border-[#3A3F4C] text-white w-full max-w-5xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150 relative">
          <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
              <h4 className="font-bold text-sm sm:text-base text-white">
                Official Document & Dossier ({matchingPost.refNumber || matchingPost.title})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsFullDossierOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#252830] transition-colors cursor-pointer"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <FullPdfDocumentViewer
            document={postToUnifiedDoc(matchingPost, 'australia')}
            onClose={() => setIsFullDossierOpen(false)}
          />
        </div>
      </div>
    );
  }

  const hasCandidateDetails = Boolean(
    matchingPost &&
      (matchingPost.candidateName ||
        matchingPost.passportNumber ||
        matchingPost.jobTitle ||
        matchingPost.workLocation ||
        matchingPost.salaryPackage ||
        matchingPost.visaSubclass)
  );

  const attachedDocs = matchingPost?.attachedDocuments || [];
  const galleryImages = matchingPost?.galleryImages || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#14161A] border border-[#2B2E36] text-white rounded-2xl shadow-2xl overflow-hidden my-6 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#252830] bg-[#101215]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05] tracking-tight">BHP</span>
            <span className="text-gray-400 text-xs sm:text-sm border-l border-gray-700/80 pl-3 font-medium">
              Corporate Intelligence & Verification Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            {matchingPost && (
              <button
                type="button"
                onClick={() => setIsFullDossierOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0284c7]/20 hover:bg-[#0284c7]/30 text-[#38bdf8] text-xs font-bold border border-[#0284c7]/40 transition-colors cursor-pointer"
                title="Open interactive document viewer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Document View</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#22252C] rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 max-h-[82vh] overflow-y-auto space-y-6">
          {/* Badges, Reference Number & Metadata */}
          <div className="flex flex-wrap items-center gap-2.5">
            {matchingPost?.refNumber && (
              <span className="px-2.5 py-1 rounded bg-[#0284c7]/20 text-[#38bdf8] font-mono text-xs font-bold border border-[#0284c7]/40 flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{matchingPost.refNumber}</span>
              </span>
            )}
            {article.badges.map((b, i) => (
              <span
                key={i}
                className="px-3 py-0.5 bg-white text-[#111315] font-extrabold text-[11px] tracking-wider uppercase rounded-full"
              >
                {b}
              </span>
            ))}
            {matchingPost?.category && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#22252C] text-gray-300 text-xs font-medium border border-[#31353E]">
                {matchingPost.category}
              </span>
            )}
            <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {article.title}
          </h1>

          {/* Candidate Particulars Strip (Rendered cleanly if candidate info exists) */}
          {hasCandidateDetails && matchingPost && (
            <div className="bg-[#181B21] border border-[#2D313B] rounded-xl p-4 sm:p-5 space-y-3 shadow-md">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#292D36]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Verified Candidate Particulars
                </span>
                <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold">
                  Authorised
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {matchingPost.candidateName && (
                  <div className="bg-[#111215] p-2.5 rounded-lg border border-[#23262D]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Candidate Name</span>
                    <span className="text-white font-bold text-sm">{matchingPost.candidateName}</span>
                  </div>
                )}
                {matchingPost.passportNumber && (
                  <div className="bg-[#111215] p-2.5 rounded-lg border border-[#23262D]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Passport Number</span>
                    <span className="text-[#38bdf8] font-mono font-bold text-sm">{matchingPost.passportNumber}</span>
                  </div>
                )}
                {matchingPost.jobTitle && (
                  <div className="bg-[#111215] p-2.5 rounded-lg border border-[#23262D]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Designation</span>
                    <span className="text-white font-medium">{matchingPost.jobTitle}</span>
                  </div>
                )}
                {matchingPost.workLocation && (
                  <div className="bg-[#111215] p-2.5 rounded-lg border border-[#23262D]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Location</span>
                    <span className="text-gray-200">{matchingPost.workLocation}</span>
                  </div>
                )}
                {matchingPost.salaryPackage && (
                  <div className="bg-[#111215] p-2.5 rounded-lg border border-[#23262D]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Compensation Package</span>
                    <span className="text-emerald-400 font-bold">{matchingPost.salaryPackage}</span>
                  </div>
                )}
                {matchingPost.visaSubclass && (
                  <div className="bg-[#111215] p-2.5 rounded-lg border border-[#23262D]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Subclass / Stream</span>
                    <span className="text-amber-400 font-semibold">{matchingPost.visaSubclass}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Primary Featured Image (If available and not redundant) */}
          {article.imageUrl && (
            <div className="w-full h-[260px] sm:h-[360px] rounded-xl overflow-hidden bg-gray-900 border border-[#282B33] shadow-md">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Narrative Content / Post Directives */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#F25C05]" />
              <span>Official Release & Narrative</span>
            </h3>

            {matchingPost?.content ? (
              <div className="text-gray-200 text-sm sm:text-base leading-relaxed bg-[#111215] p-5 rounded-xl border border-[#24272F] whitespace-pre-line font-normal">
                {matchingPost.content}
              </div>
            ) : (
              <div className="text-[#D8DCE3] text-sm sm:text-base leading-relaxed space-y-4 bg-[#111215] p-5 rounded-xl border border-[#24272F]">
                <p className="font-semibold text-white">
                  BHP is committed to providing clear, transparent public information and official operational circulars across our global resources and authorized employment networks.
                </p>
                <p>
                  All programs and initiatives are strictly governed under verified standards of environmental sustainability, safety compliance, and official statutory authorization.
                </p>
              </div>
            )}
          </div>

          {/* Additional Gallery Images */}
          {galleryImages.length > 1 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Associated Photo Records ({galleryImages.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="h-28 sm:h-36 rounded-xl overflow-hidden border border-[#2A2E38] bg-black/40 group relative"
                  >
                    <img
                      src={img}
                      alt={`Record photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/80 text-gray-300 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Documents / PDFs: OPEN SERIAL BY SERIAL, VERTICALLY STACKED (NO DOWNLOADS) */}
          {attachedDocs.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#252830]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                    Attached Official Documents ({attachedDocs.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullDossierOpen(true)}
                  className="text-xs text-[#38bdf8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand All Pages</span>
                </button>
              </div>

              {/* Stacked Vertically, One by One */}
              <div className="space-y-6">
                {attachedDocs.map((doc, index) => {
                  const isPdf =
                    doc.type === 'pdf' ||
                    doc.name.toLowerCase().endsWith('.pdf') ||
                    doc.dataUrl.startsWith('data:application/pdf');

                  return (
                    <div
                      key={doc.id || index}
                      className="rounded-xl border border-[#2B2E36] bg-[#101215] overflow-hidden shadow-lg"
                    >
                      {/* Document Sub-Header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#17191E] border-b border-[#252830]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[11px] font-bold font-mono">
                            Document #{index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-white truncate">
                            {doc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">Verified</span>
                        </div>
                      </div>

                      {/* Document Viewer Frame (Open state, strictly view-only, toolbar disabled) */}
                      <div className="p-2 sm:p-3 bg-[#0B0C0E]">
                        {isPdf ? (
                          <div className="w-full bg-[#1a1b1e] rounded-lg overflow-hidden border border-[#252830] relative">
                            <PdfCanvasRenderer
                              dataUrl={doc.dataUrl}
                              docName={doc.name}
                            />
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-center bg-black/40 rounded-lg p-2 border border-[#252830]">
                            <img
                              src={doc.dataUrl}
                              alt={doc.name}
                              className="max-h-[750px] w-auto object-contain rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#252830] flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#F25C05] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all releases</span>
            </button>

            <div className="flex items-center gap-2.5">
              {matchingPost && (
                <button
                  type="button"
                  onClick={() => setIsFullDossierOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0284c7]/20 hover:bg-[#0284c7]/30 text-[#38bdf8] border border-[#0284c7]/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Open Full Screen Dossier</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#22252C] hover:bg-[#2C3038] rounded-lg text-xs font-bold text-gray-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#F25C05]" />}
                <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
