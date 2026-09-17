import React from 'react';
import { X, Shield, FileCheck, Scale, Award, HeartHandshake } from 'lucide-react';

export type LegalDocType = 'privacy' | 'modern-slavery' | 'terms' | 'code-of-conduct' | 'bhp-foundation';

interface LegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content: Record<LegalDocType, {
    title: string;
    subtitle: string;
    icon: typeof Shield;
    text: React.ReactNode;
  }> = {
    privacy: {
      title: 'BHP Global Privacy Policy',
      subtitle: 'Our commitment to protecting your personal data across all jurisdictions',
      icon: Shield,
      text: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            At BHP Group Limited and its affiliates ('BHP', 'we', 'us', or 'our'), we respect your privacy and are committed to protecting personal data in accordance with applicable privacy and data protection legislation globally (including the Australian Privacy Act 1988, the UK/EU GDPR, and the Chilean Law No. 19,628).
          </p>
          <h4 className="font-bold text-white text-base mt-3">1. Information We Collect</h4>
          <p>
            We collect personal information necessary to deliver our services, process job applications, manage investor relationships, facilitate supplier onboarding, and operate our commercial websites. This includes contact details, transactional records, and browsing telemetry where permitted.
          </p>
          <h4 className="font-bold text-white text-base mt-3">2. How We Use Your Data</h4>
          <p>
            Your information is processed to administer shareholder registers, evaluate commercial bids, fulfill statutory disclosure requirements, and ensure digital security across our operations. We never sell your personal data to third parties.
          </p>
          <h4 className="font-bold text-white text-base mt-3">3. Data Security & Retention</h4>
          <p>
            We implement industry-grade technical, physical, and administrative controls to protect information from unauthorized disclosure or breach.
          </p>
        </div>
      ),
    },
    'modern-slavery': {
      title: 'Modern Slavery Act Statement',
      subtitle: 'Transparency in supply chains and operations (FY2026)',
      icon: Scale,
      text: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            This statement is made pursuant to section 14 of the Australian Modern Slavery Act 2018 (Cth) and section 54 of the United Kingdom Modern Slavery Act 2015. It outlines the steps taken by BHP to prevent modern slavery and human trafficking across our direct operations and global supply network.
          </p>
          <h4 className="font-bold text-white text-base mt-3">Our Zero-Tolerance Mandate</h4>
          <p>
            BHP condemns all forms of slavery, servitude, forced labor, debt bondage, and human trafficking. Our Supplier Code of Conduct establishes mandatory human rights due diligence for every contractor, supplier, and joint venture operator.
          </p>
          <h4 className="font-bold text-white text-base mt-3">Audits & Worker Grievance Mechanisms</h4>
          <p>
            Over the past financial year, independent third-party ethical audits were completed across high-risk procurement categories, including specialized marine shipping, heavy fabrication, and regional security staffing. Confirmed violations result in immediate commercial suspension.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Use',
      subtitle: 'Standard conditions governing the use of BHP digital properties and portals',
      icon: FileCheck,
      text: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            By accessing or browsing this website (www.bhp.com) or associated digital platforms, you acknowledge and agree to be bound by these Terms of Use and all applicable laws and regulations.
          </p>
          <h4 className="font-bold text-white text-base mt-3">Intellectual Property & Trademarks</h4>
          <p>
            The BHP name, logo, corporate designs, charts, and multimedia assets are proprietary trademarks of BHP Group Limited. Any reproduction or commercial redistribution without prior written consent is strictly prohibited.
          </p>
          <h4 className="font-bold text-white text-base mt-3">Forward-Looking Statements & Disclaimer</h4>
          <p>
            Information provided on this site includes forward-looking statements concerning commodity production estimates, capital expenditures, and project schedules. Actual future outcomes may differ materially based on macroeconomic volatility, foreign exchange movements, and regulatory changes.
          </p>
        </div>
      ),
    },
    'code-of-conduct': {
      title: 'Our Code of Conduct',
      subtitle: 'Operating with integrity, safety and ethical excellence globally',
      icon: Award,
      text: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            Our Code of Conduct sets out the commitments and expectations for all our people – employees, directors, and contractors alike. It describes who we are and guides how we work every day.
          </p>
          <h4 className="font-bold text-white text-base mt-3">Core Pillars of Our Code</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-200">
            <li><strong className="text-white">Safety first:</strong> Putting health, psychological well-being, and life above all other considerations.</li>
            <li><strong className="text-white">Integrity:</strong> Zero tolerance for bribery, fraud, corruption, or antitrust violations.</li>
            <li><strong className="text-white">Respect & Inclusion:</strong> Ensuring workplaces free from harassment, discrimination, or bias.</li>
            <li><strong className="text-white">Environmental Stewardship:</strong> Minimizing impact, preserving biodiversity, and respecting water resources.</li>
          </ul>
          <p className="mt-2">
            Anyone can raise concerns safely through our confidential, 24/7 global whistleblower channel, EthicsPoint.
          </p>
        </div>
      ),
    },
    'bhp-foundation': {
      title: 'BHP Foundation',
      subtitle: 'Partnering with civil society and institutions for sustainable human progress',
      icon: HeartHandshake,
      text: (
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            The BHP Foundation is a charitable organization established to address some of the world's most critical sustainable development challenges, operating independently from commercial operations.
          </p>
          <h4 className="font-bold text-white text-base mt-3">Global Program Focus Areas</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-200">
            <li><strong className="text-white">Natural Resource Governance:</strong> Promoting transparency, anti-corruption, and responsible management of public revenues.</li>
            <li><strong className="text-white">Environmental Resilience:</strong> Supporting large-scale conservation of forests, oceans, and indigenous-managed ecosystems.</li>
            <li><strong className="text-white">Education Equity:</strong> Expanding access to high-quality science, mathematics, and vocational education for underserved youth.</li>
          </ul>
        </div>
      ),
    },
  };

  const current = content[type] || content.privacy;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#1B1C1F] border border-[#34373F] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2F36] bg-[#151618]">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-[#F25C05]" />
            <div>
              <h3 className="font-bold text-lg text-white">{current.title}</h3>
              <p className="text-xs text-gray-400">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {current.text}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#151618] border-t border-[#2C2F36] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F25C05] hover:bg-[#d84e00] text-xs font-bold text-white uppercase rounded transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>

      </div>
    </div>
  );
};
