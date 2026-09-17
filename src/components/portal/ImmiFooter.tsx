import React from 'react';
import { Lock, ShieldCheck, ExternalLink, Globe } from 'lucide-react';

export const ImmiFooter: React.FC = () => {
  return (
    <footer className="bg-[#001D33] text-gray-300 border-t-4 border-[#C88A24] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#0A3D63]">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="text-[#FFCD00]">Australian Government</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Department of Home Affairs • ImmiAccount Online Document Verification Service (DVS). Supporting lawful migration and verified skilled employment.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-[#C88A24]" />
              <span>TLS 1.3 Certified • 256-Bit</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">
              Immigration Portals
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#verification-search" className="hover:text-white transition-colors">DVS Document Verification</a></li>
              <li><a href="#positive-list-section" className="hover:text-white transition-colors">Positive List for Skilled Work</a></li>
              <li><a href="#vevo-section" className="hover:text-white transition-colors">VEVO Entitlements Check</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SkillSelect Expression of Interest (EOI)</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">
              Assessing Authorities
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><span>Engineers Australia (CDR / Migration)</span></li>
              <li><span>Trades Recognition Australia (TRA)</span></li>
              <li><span>Australian Computer Society (ACS)</span></li>
              <li><span>VETASSESS Vocational Assessment</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">
              Statutory Security
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              Unauthorized access, tampering, or dissemination of Commonwealth migration records is prohibited under the Crimes Act 1914 and Privacy Act 1988.
            </p>
            <div className="p-2.5 rounded bg-[#002B49] border border-[#0A3D63] text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>DVS Central Service: NORMAL</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div>
            © Commonwealth of Australia 2026. Administered under the Migration Act 1958.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-300">Accessibility</span>
            <span>•</span>
            <span className="hover:text-gray-300">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-gray-300">Freedom of Information (FOI)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
