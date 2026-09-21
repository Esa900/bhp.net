import React, { useState, useMemo } from 'react';
import { Award, Search, Filter, CheckCircle2, ChevronRight, Briefcase, DollarSign, Building, AlertTriangle, Info } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { PositiveListOccupation } from '../../types/portal';

interface PositiveListSectionProps {
  onSelectOccupation?: (occupation: PositiveListOccupation) => void;
}

export const PositiveListSection: React.FC<PositiveListSectionProps> = ({
  onSelectOccupation,
}) => {
  const { positiveList } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedVisa, setSelectedVisa] = useState<string>('ALL');
  const [activeModalOccupation, setActiveModalOccupation] = useState<PositiveListOccupation | null>(null);

  const sectors = ['ALL', 'Mining & Resources', 'Engineering', 'Construction & Trades', 'IT & Technology', 'Healthcare'];
  const visaOptions = ['ALL', '482', '186', '189', '190', '491'];

  const filteredList = useMemo(() => {
    return (positiveList || []).filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.anzscoCode.includes(searchQuery) ||
        item.assessingAuthority.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = selectedSector === 'ALL' || item.sector === selectedSector;
      const matchesVisa = selectedVisa === 'ALL' || item.eligibleVisas.includes(selectedVisa);

      return matchesSearch && matchesSector && matchesVisa;
    });
  }, [positiveList, searchQuery, selectedSector, selectedVisa]);

  return (
    <div id="positive-list-section" className="bg-white rounded-xl shadow-sm border border-[#D5D9DE] overflow-hidden mb-8">
      {/* Australian Department Header */}
      <div className="bg-[#002B49] text-white p-6 border-b-4 border-[#C88A24]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-xs font-semibold text-[#FFCD00] mb-2 border border-white/20">
              <Award className="w-3.5 h-3.5" />
              <span>Commonwealth Skilled Migration Framework</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Positive List for Skilled Work
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
              Official Australian National Skills Commission & Department of Home Affairs Priority Migration Skilled Occupation List (PMSOL & MLTSSL).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#001D33] px-4 py-2.5 rounded-lg border border-[#0A3D63] text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400">Total Approved Roles</div>
              <div className="text-lg font-black text-[#FFCD00]">{positiveList.length} Occupations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-6 bg-[#F8FAFC] border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by ANZSCO or Title */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search occupation title or ANZSCO code..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            />
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'ALL' ? 'All Industry Sectors' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Visa Subclass Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 shrink-0">Visa:</span>
            <select
              value={selectedVisa}
              onChange={(e) => setSelectedVisa(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]"
            >
              {visaOptions.map((v) => (
                <option key={v} value={v}>
                  {v === 'ALL' ? 'All Subclasses (482, 186, 189, etc.)' : `Subclass ${v}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              All occupations listed meet the statutory <strong>Temporary Skilled Migration Income Threshold (TSMIT)</strong> and Australian Skills Assessment requirements.
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-800 shrink-0 hidden sm:inline">Updated: 2026/2027 Schedule</span>
        </div>
      </div>

      {/* Occupations Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#EDF2F7] text-gray-700 uppercase text-[11px] font-bold border-b border-gray-300">
              <th className="py-3.5 px-4 font-mono">ANZSCO</th>
              <th className="py-3.5 px-4">Occupation Title</th>
              <th className="py-3.5 px-4">Sector</th>
              <th className="py-3.5 px-4">Assessing Authority</th>
              <th className="py-3.5 px-4">Eligible Visas</th>
              <th className="py-3.5 px-4">Demand Level</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No occupations matched your search criteria.
                </td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr
                  key={item.anzscoCode}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  onClick={() => setActiveModalOccupation(item)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#002B49]">
                    {item.anzscoCode}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {item.sector}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 font-medium">
                    {item.assessingAuthority}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.eligibleVisas.map((v) => (
                        <span
                          key={v}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E6F0FA] text-[#002B49]"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.demandStatus === 'Critical Shortage'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.demandStatus === 'Priority Migration'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.demandStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#002B49] group-hover:text-[#C88A24] transition-colors"
                    >
                      <span>Criteria</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Occupation Detail Modal */}
      {activeModalOccupation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#002B49] text-white p-5 flex items-center justify-between border-b-2 border-[#C88A24]">
              <div>
                <span className="text-xs font-mono text-[#FFCD00]">ANZSCO: {activeModalOccupation.anzscoCode}</span>
                <h3 className="text-lg font-bold text-white">{activeModalOccupation.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalOccupation(null)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-gray-700">
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                {activeModalOccupation.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Assessing Body</span>
                  <span className="font-bold text-gray-900">{activeModalOccupation.assessingAuthority}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Market Benchmark</span>
                  <span className="font-bold text-emerald-700 font-mono">{activeModalOccupation.minimumSalary}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">Eligible Visa Subclasses</span>
                <div className="flex flex-wrap gap-2">
                  {activeModalOccupation.eligibleVisas.map((v) => (
                    <span key={v} className="px-2.5 py-1 bg-[#002B49] text-white rounded text-xs font-bold font-mono">
                      Subclass {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">State Allocation Priority</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalOccupation.australianStates.map((st) => (
                    <span key={st} className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-semibold">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalOccupation(null)}
                  className="px-5 py-2 bg-[#002B49] hover:bg-[#001D33] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
