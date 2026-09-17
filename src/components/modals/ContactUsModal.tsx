import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const { addInquiry } = useAdminData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'General Inquiry',
    phone: '',
    country: 'Australia',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      phone: formData.phone,
      country: formData.country,
      message: formData.message,
    });
    setSubmitted(true);
  };

  const globalOffices = [
    {
      city: 'Melbourne (Global HQ)',
      country: 'Australia',
      address: '171 Collins Street, Melbourne VIC 3000',
      phone: '+61 1300 55 47 57',
      hours: 'Mon - Fri: 8:30am - 5:30pm AEST',
    },
    {
      city: 'Santiago (Minerals Americas)',
      country: 'Chile',
      address: 'Cerro El Plomo 5630, Las Condes, Santiago',
      phone: '+56 2 2574 5000',
      hours: 'Mon - Fri: 9:00am - 6:00pm CLT',
    },
    {
      city: 'Saskatoon (Potash Centre)',
      country: 'Canada',
      address: '475 2nd Ave S, Saskatoon, SK S7K 1P4',
      phone: '+1 306 385 8400',
      hours: 'Mon - Fri: 8:00am - 5:00pm CST',
    },
    {
      city: 'Singapore (Commercial Hub)',
      country: 'Singapore',
      address: '10 Marina Boulevard, Marina Bay Financial Centre',
      phone: '+65 6349 3333',
      hours: 'Mon - Fri: 9:00am - 6:00pm SGT',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1C1D1F] border border-[#34373C] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2E33] bg-[#161718]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05]">BHP</span>
            <span className="text-gray-300 text-sm font-semibold border-l border-gray-700 pl-3">
              Contact & Global Inquiries
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#282A2E] rounded transition-colors"
            aria-label="Close contact modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Form Column */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Send us an inquiry
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Please complete the form below. Our corporate relations team will respond within 1-2 business days.
              </p>

              {submitted ? (
                <div className="mt-6 p-8 bg-[#23272E] border border-green-500/40 rounded-lg text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
                  <p className="text-sm text-gray-300">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Reference ticket <strong className="text-[#F25C05]">#BHP-{(Math.random()*100000).toFixed(0)}</strong> has been generated and dispatched to our <strong className="text-white">{formData.inquiryType}</strong> desk.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', inquiryType: 'General Inquiry', phone: '', country: 'Australia', message: '' });
                    }}
                    className="mt-4 px-6 py-2 bg-[#2D3139] hover:bg-[#383D47] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-[#26282D] border border-[#3E4148] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                    >
                      <option>General Inquiry</option>
                      <option>Investor Relations & Shareholder Support</option>
                      <option>Careers & Recruitment</option>
                      <option>Media & Public Relations</option>
                      <option>Supplier Registration & Procurement</option>
                      <option>Community & Sustainability Feedback</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-[#26282D] border border-[#3E4148] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-[#26282D] border border-[#3E4148] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+61 400 123 456"
                        className="w-full bg-[#26282D] border border-[#3E4148] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        Country / Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#26282D] border border-[#3E4148] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Message Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify your question or inquiry..."
                      className="w-full bg-[#26282D] border border-[#3E4148] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F25C05]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#F25C05] hover:bg-[#d44e00] text-white text-sm font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>

            {/* Global Offices Column */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Global Key Locations
              </h3>

              <div className="space-y-4">
                {globalOffices.map((office, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#23252A] border border-[#32353B] rounded-lg space-y-2 hover:border-[#F25C05]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">{office.city}</h4>
                      <span className="text-xs bg-[#161718] px-2 py-0.5 rounded text-gray-400">
                        {office.country}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F25C05] shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>
                    <div className="text-xs text-gray-300 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#F25C05] shrink-0" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ethics / Whistleblower Point */}
              <div className="p-4 bg-[#2A231C] border border-[#523A25] rounded-lg">
                <h4 className="font-bold text-[#FF9B54] text-sm">Ethics & Business Conduct</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Confidential 24/7 hotline available worldwide for whistleblowing and compliance concerns: <strong className="text-white">+1 800 247 6378</strong>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
