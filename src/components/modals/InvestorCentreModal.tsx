import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, FileText, DollarSign, Download, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { STOCK_DATA } from '../../data';

interface InvestorCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'dividends' | 'calendar' | 'reports';
}

export const InvestorCentreModal: React.FC<InvestorCentreModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dividends' | 'calendar' | 'reports'>(initialTab);
  const [selectedEx, setSelectedEx] = useState<'ASX' | 'LSE' | 'NYSE' | 'JSE'>('ASX');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const currentStock = STOCK_DATA[selectedEx] || STOCK_DATA.ASX;

  const dividendHistory = [
    { type: 'Final Dividend 2026', amount: 'US$ 0.74 per share', exDate: '04 Sep 2026', payDate: '03 Oct 2026', franking: '100% Franked' },
    { type: 'Interim Dividend 2026', amount: 'US$ 0.72 per share', exDate: '06 Mar 2026', payDate: '28 Mar 2026', franking: '100% Franked' },
    { type: 'Final Dividend 2025', amount: 'US$ 0.74 per share', exDate: '05 Sep 2025', payDate: '02 Oct 2025', franking: '100% Franked' },
  ];

  const financialCalendar = [
    { date: '20 Oct 2026', event: 'Operational Review for the quarter ended 30 September 2026', time: '08:30 AEST' },
    { date: '05 Nov 2026', event: 'Annual General Meeting (AGM) 2026 – Melbourne & Online', time: '10:00 AEST' },
    { date: '21 Jan 2027', event: 'Operational Review for the half year ended 31 December 2026', time: '08:30 AEST' },
    { date: '23 Feb 2027', event: 'Half Year Financial Results Announcement 2027', time: '08:30 AEST' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1B1C1F] border border-[#353840] text-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2F36] bg-[#151618]">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl text-[#F25C05]">BHP</span>
            <span className="text-gray-300 text-sm font-semibold border-l border-gray-700 pl-3">
              Investor Centre & Shareholder Information
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2D33] rounded transition-colors cursor-pointer"
            aria-label="Close investor centre"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-[#202226] border-b border-[#2C2F36] overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Share Price & Summary' },
            { id: 'dividends', label: 'Dividends & Returns' },
            { id: 'calendar', label: 'Financial Calendar' },
            { id: 'reports', label: 'Reports & Presentations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#F25C05] text-[#F25C05]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification Banner if active */}
        {feedbackMessage && (
          <div className="mx-6 mt-4 p-3 bg-[#2A3B2A] border border-green-500/60 rounded flex items-center gap-2 text-green-200 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4 text-green-400" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Market Exchange Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                {(['ASX', 'LSE', 'NYSE', 'JSE'] as const).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setSelectedEx(ex)}
                    className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      selectedEx === ex
                        ? 'bg-[#F25C05] text-white'
                        : 'bg-[#282B33] text-gray-300 hover:bg-[#323640]'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Big Price Display */}
              <div className="p-6 bg-[#23262D] rounded-lg border border-[#333742] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {currentStock.name}
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-white mt-1">
                    {currentStock.price} <span className="text-lg font-normal text-gray-400">{currentStock.currency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#22C55E] text-sm font-bold mt-1">
                    <span>{currentStock.changePercent} today</span>
                    <span className="text-gray-400 font-normal">| {currentStock.timestamp}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-[#1C1E23] p-3 rounded">
                    <span className="text-gray-400 block">52-Week Range</span>
                    <span className="font-bold text-white">41.20 – 62.40 AUD</span>
                  </div>
                  <div className="bg-[#1C1E23] p-3 rounded">
                    <span className="text-gray-400 block">Market Cap</span>
                    <span className="font-bold text-white">~A$ 240+ Billion</span>
                  </div>
                </div>
              </div>

              {/* Key Investor Takeaways */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#23262D] rounded-lg border border-[#333742]">
                  <h4 className="text-sm font-bold text-white mb-1">Disciplined Capital Allocation</h4>
                  <p className="text-xs text-gray-400">
                    Net debt maintained inside our US$5–15B target band, supporting growth investments and resilient returns.
                  </p>
                </div>
                <div className="p-4 bg-[#23262D] rounded-lg border border-[#333742]">
                  <h4 className="text-sm font-bold text-white mb-1">Operational Margins</h4>
                  <p className="text-xs text-gray-400">
                    Industry-leading EBITDA margins of 54%+ driven by low-cost Pilbara iron ore and Chilean copper.
                  </p>
                </div>
                <div className="p-4 bg-[#23262D] rounded-lg border border-[#333742]">
                  <h4 className="text-sm font-bold text-white mb-1">Sustainability & ESG</h4>
                  <p className="text-xs text-gray-400">
                    Active decarbonisation programs targeting net zero operational GHG emissions by 2050.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIVIDENDS */}
          {activeTab === 'dividends' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#23262D] rounded-lg border border-[#333742]">
                <h3 className="font-bold text-white text-base">Dividend Policy</h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  BHP maintains a minimum 50% payout ratio of underlying attributable profit at every reporting period. Additional amounts may be returned via special dividends or buybacks.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#181A1D] text-xs font-bold uppercase text-gray-400 border-b border-[#2C2F36]">
                    <tr>
                      <th className="py-3 px-4">Dividend Event</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Ex-Date</th>
                      <th className="py-3 px-4">Payment Date</th>
                      <th className="py-3 px-4">Franking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2F36]">
                    {dividendHistory.map((div, i) => (
                      <tr key={i} className="hover:bg-[#24272E]">
                        <td className="py-3 px-4 font-bold text-white">{div.type}</td>
                        <td className="py-3 px-4 text-[#F25C05] font-semibold">{div.amount}</td>
                        <td className="py-3 px-4">{div.exDate}</td>
                        <td className="py-3 px-4">{div.payDate}</td>
                        <td className="py-3 px-4 text-green-400">{div.franking}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Key dates for financial result announcements, shareholder meetings, and quarterly operational reviews:
              </p>
              <div className="space-y-3">
                {financialCalendar.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#23262D] border border-[#333742] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#F25C05] uppercase tracking-wider">{item.date}</div>
                      <div className="text-base font-bold text-white mt-0.5">{item.event}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.time}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showNotification(`Reminder set: "${item.event}" added to calendar`)}
                      className="shrink-0 px-4 py-2 bg-[#2D3139] hover:bg-[#F25C05] text-white text-xs font-bold uppercase rounded transition-colors cursor-pointer"
                    >
                      Set Reminder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'BHP Annual Report 2026', size: '14.2 MB', pages: '194 pages', category: 'Annual Financials' },
                  { title: 'Climate Transition Action Plan 2026', size: '8.5 MB', pages: '88 pages', category: 'Sustainability & ESG' },
                  { title: 'Economic Contribution Report 2026', size: '6.1 MB', pages: '64 pages', category: 'Community & Tax' },
                  { title: 'Modern Slavery Statement 2026', size: '4.8 MB', pages: '42 pages', category: 'Governance & Ethics' },
                ].map((rep, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#23262D] border border-[#333742] rounded-lg flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#F25C05] uppercase tracking-wider">{rep.category}</span>
                      <h4 className="text-base font-bold text-white mt-1">{rep.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{rep.pages} • PDF • {rep.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showNotification(`Download initiated: ${rep.title} (${rep.size})`)}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F25C05] hover:underline cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#151618] border-t border-[#2C2F36] flex items-center justify-between text-xs text-gray-400">
          <span>Computershare Investor Services (Share Registry): 1300 656 780</span>
          <span className="text-white font-semibold">BHP Investor Relations Desk</span>
        </div>

      </div>
    </div>
  );
};
