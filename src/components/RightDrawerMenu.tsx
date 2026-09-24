import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { CanadaMenuItemConfig } from '../types/canada';
import {
  getStoredCanadaMenuConfigs,
  CANADA_MENU_CONFIGS_UPDATED_EVENT,
} from '../utils/canadaStorage';

interface RightDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCanadaItem: (config: CanadaMenuItemConfig) => void;
  onSelectAustraliaItem?: (menuItemId: string) => void;
}

export const RightDrawerMenu: React.FC<RightDrawerMenuProps> = ({
  isOpen,
  onClose,
  onSelectCanadaItem,
}) => {
  const [menuConfigs, setMenuConfigs] = useState<CanadaMenuItemConfig[]>(() => getStoredCanadaMenuConfigs());

  useEffect(() => {
    const handleUpdate = () => {
      setMenuConfigs(getStoredCanadaMenuConfigs());
    };
    window.addEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      id="right-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="right-drawer-panel"
        className="w-full max-w-[420px] bg-[#111215] h-full shadow-2xl border-l border-[#23252B] flex flex-col text-white animate-in slide-in-from-right duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header - Clean BHP logo and Close Button */}
        <div className="px-6 py-5 border-b border-[#23252B] flex items-center justify-between bg-[#111215]">
          <span className="font-extrabold text-2xl tracking-tight text-[#F25C05]">BHP</span>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1E2026] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-0">
            {menuConfigs.map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={item.id}
                  className="py-4 border-b border-[#23252B] last:border-b-0 group"
                >
                  {/* Main Title: Exact Bold White Uppercase */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectCanadaItem(item);
                    }}
                    className="text-left w-full text-[13px] sm:text-[14px] font-black uppercase tracking-wide text-white hover:text-[#F25C05] transition-colors mb-1.5 cursor-pointer block"
                  >
                    {item.mainTitle.toUpperCase()}
                  </button>

                  {/* Submenu Link with Arrow (Orange for first item or hover) */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectCanadaItem(item);
                    }}
                    className={`w-full flex items-center justify-between text-left text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer ${
                      isFirst
                        ? 'text-[#F25C05] hover:text-[#ff7426]'
                        : 'text-[#9ca3af] hover:text-[#F25C05]'
                    }`}
                  >
                    <span>{item.subMenu}</span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-all duration-150 ${
                        isFirst
                          ? 'text-[#F25C05] opacity-100'
                          : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-[#F25C05]'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-[#23252B] bg-[#0E0F12] flex items-center justify-between text-xs text-gray-500">
          <span>Official Verification Menu</span>
          <span>© BHP 2026</span>
        </div>
      </div>
    </div>
  );
};
