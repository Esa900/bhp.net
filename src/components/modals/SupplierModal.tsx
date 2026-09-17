import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, FileCheck, Send, CheckCircle2 } from 'lucide-react';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    abnOrTaxId: '',
    contactPerson: '',
    email: '',
    serviceCategory: 'Engineering & Fabrication',
    region: 'Australia',
    isIndigenousOrLocal: false,
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1B1C1F] border border-[#34373F] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2F36] bg-[#151618]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05]">BHP</span>
            <span className="text-gray-300 text-sm font-semibold border-l border-gray-700 pl-3">
              Suppliers & Procurement Portal
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2D33] rounded transition-colors"
            aria-label="Close supplier modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-8">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Partner with BHP
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-300 leading-relaxed">
              We spend more than US$20 billion annually with thousands of suppliers worldwide. We welcome partners who share our commitment to safety, integrity, environmental responsibility, and local economic contribution.
            </p>
          </div>

          {/* Local Buying Program Banner */}
          <div className="p-5 bg-[#25231F] border border-[#523C24] rounded-lg flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#F25C05] shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[#FFA259] text-base">Local Buying Program (LBP)</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Small, local, and Indigenous enterprises in Western Australia, Queensland, New South Wales, Antofagasta (Chile), and Saskatchewan (Canada) benefit from preferential 7-day payment terms and dedicated procurement facilitators.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          {submitted ? (
            <div className="p-8 bg-[#23272F] border border-green-500/40 rounded-lg text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Pre-Registration Submitted</h3>
              <p className="text-sm text-gray-300 max-w-lg mx-auto">
                Thank you, <strong className="text-white">{formData.companyName}</strong>. Your expression of interest has been recorded in the BHP Global Procurement Database. An onboarding specialist will verify your credentials.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-[#2E323A] hover:bg-[#3C414C] text-white text-xs font-bold uppercase rounded"
              >
                Submit Another Company
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <h3 className="text-lg font-bold text-white">Supplier Pre-Registration Expression of Interest</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Company Registered Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Acme Industrial Pty Ltd"
                    className="w-full bg-[#25282F] border border-[#3B3F47] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    ABN / Tax ID / Registration # *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.abnOrTaxId}
                    onChange={(e) => setFormData({ ...formData, abnOrTaxId: e.target.value })}
                    placeholder="e.g. 12 345 678 901"
                    className="w-full bg-[#25282F] border border-[#3B3F47] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Primary Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full bg-[#25282F] border border-[#3B3F47] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="procurement@acme.com"
                    className="w-full bg-[#25282F] border border-[#3B3F47] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Service / Goods Category
                  </label>
                  <select
                    value={formData.serviceCategory}
                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                    className="w-full bg-[#25282F] border border-[#3B3F47] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                  >
                    <option>Engineering & Heavy Fabrication</option>
                    <option>Site Maintenance & Electrical Services</option>
                    <option>Logistics, Freight & Haulage</option>
                    <option>IT, Software & Automation Technology</option>
                    <option>Environmental Consulting & Water Monitoring</option>
                    <option>Civil Construction & Earthworks</option>
                    <option>Camp Services, Catering & Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Operational Region
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-[#25282F] border border-[#3B3F47] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                  >
                    <option>Australia (WAIO / BMA / Olympic Dam)</option>
                    <option>Chile (Escondida / Pampa Norte)</option>
                    <option>Canada (Jansen Potash Project)</option>
                    <option>United States / International</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isIndigenousOrLocal}
                    onChange={(e) => setFormData({ ...formData, isIndigenousOrLocal: e.target.checked })}
                    className="rounded text-[#F25C05] focus:ring-[#F25C05] w-4 h-4 bg-[#25282F] border-gray-600"
                  />
                  <span className="text-xs text-gray-300">
                    We are a registered Local / Traditional Owner / First Nations owned business
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#F25C05] hover:bg-[#d84e00] text-white text-sm font-bold uppercase tracking-wider rounded transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Pre-Registration</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#151618] border-t border-[#2C2F36] flex items-center justify-between text-xs text-gray-500">
          <span>Supplier Code of Conduct & Anti-Bribery Compliance applies to all tenders</span>
          <span className="text-white font-semibold">BHP Global Procurement</span>
        </div>

      </div>
    </div>
  );
};
