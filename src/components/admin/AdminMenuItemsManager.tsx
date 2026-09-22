import React, { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Trash2,
  Edit3,
  Check,
  Search,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ShieldCheck,
  Tag,
  FileText,
  AlertCircle,
  HelpCircle,
  Eye,
  CheckCircle2,
  Layers,
  Sparkles,
  Sliders,
  X,
} from 'lucide-react';
import { DocumentMenuItem } from '../../data/menuNavigationItems';
import { DocumentType } from '../../types/portal';
import {
  getStoredMenuItems,
  addStoredMenuItem,
  updateStoredMenuItem,
  deleteStoredMenuItem,
  moveStoredMenuItem,
  resetStoredMenuItems,
  MENU_ITEMS_UPDATED_EVENT,
} from '../../utils/menuItemsStorage';

interface AdminMenuItemsManagerProps {
  showToast: (msg: string) => void;
  onTestMenuItem?: (item: DocumentMenuItem) => void;
}

export const AdminMenuItemsManager: React.FC<AdminMenuItemsManagerProps> = ({
  showToast,
  onTestMenuItem,
}) => {
  const [menuItems, setMenuItems] = useState<DocumentMenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentMenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    mainTitle: string;
    subMenu: string;
    fieldLabel: string;
    fieldKey: string;
    placeholder: string;
    sampleValue: string;
    category: string;
    badge: string;
    description: string;
    documentType: DocumentType;
  }>({
    mainTitle: '',
    subMenu: '',
    fieldLabel: '',
    fieldKey: '',
    placeholder: '',
    sampleValue: '',
    category: 'Work Permit',
    badge: 'Official DVS Verified',
    description: '',
    documentType: 'work-permit',
  });

  const [formError, setFormError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load menu items and listen to updates
  useEffect(() => {
    const loadItems = () => {
      setMenuItems(getStoredMenuItems());
    };

    loadItems();

    const handleUpdate = () => {
      loadItems();
    };

    window.addEventListener(MENU_ITEMS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(MENU_ITEMS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      mainTitle: '',
      subMenu: '',
      fieldLabel: 'Reference No',
      fieldKey: `field_${Date.now().toString().slice(-4)}`,
      placeholder: 'Enter Reference Number or ID...',
      sampleValue: 'REF-2026-001',
      category: 'Work Permit',
      badge: 'Official DVS Verified',
      description: 'Search official Commonwealth and BHP corporate verification record.',
      documentType: 'work-permit',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DocumentMenuItem) => {
    setEditingItem(item);
    setFormData({
      mainTitle: item.mainTitle,
      subMenu: item.subMenu,
      fieldLabel: item.fieldLabel,
      fieldKey: item.fieldKey,
      placeholder: item.placeholder,
      sampleValue: item.sampleValue,
      category: item.category,
      badge: item.badge,
      description: item.description,
      documentType: item.documentType,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mainTitle.trim()) {
      setFormError('Main Title (প্রধান শিরোনাম) দেওয়া আবশ্যক!');
      return;
    }
    if (!formData.subMenu.trim()) {
      setFormError('Sub-Menu Name (সাব-মেনু নাম) দেওয়া আবশ্যক!');
      return;
    }
    if (!formData.fieldLabel.trim()) {
      setFormError('Search Field Label (সার্চ ফিল্ড লেবেল) দেওয়া আবশ্যক!');
      return;
    }

    const fieldKey =
      formData.fieldKey.trim() ||
      formData.fieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '') ||
      `key_${Date.now()}`;

    if (editingItem) {
      updateStoredMenuItem(editingItem.id, {
        mainTitle: formData.mainTitle.trim(),
        subMenu: formData.subMenu.trim(),
        fieldLabel: formData.fieldLabel.trim(),
        fieldKey,
        placeholder:
          formData.placeholder.trim() || `Enter ${formData.fieldLabel.trim()}...`,
        sampleValue: formData.sampleValue.trim() || 'REF-928410',
        category: formData.category.trim() || 'General',
        badge: formData.badge.trim() || 'Verified',
        description:
          formData.description.trim() ||
          'Verified against official Commonwealth and BHP registry records.',
        documentType: formData.documentType,
      });
      showToast(`মেনু অপশন "${formData.mainTitle}" সফলভাবে আপডেট করা হয়েছে।`);
    } else {
      addStoredMenuItem({
        mainTitle: formData.mainTitle.trim(),
        subMenu: formData.subMenu.trim(),
        fieldLabel: formData.fieldLabel.trim(),
        fieldKey,
        placeholder:
          formData.placeholder.trim() || `Enter ${formData.fieldLabel.trim()}...`,
        sampleValue: formData.sampleValue.trim() || 'REF-928410',
        category: formData.category.trim() || 'General',
        badge: formData.badge.trim() || 'Verified',
        description:
          formData.description.trim() ||
          'Verified against official Commonwealth and BHP registry records.',
        documentType: formData.documentType,
      });
      showToast(`নতুন ৩-লাইন মেনু অপশন "${formData.mainTitle}" যুক্ত করা হয়েছে!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    deleteStoredMenuItem(id);
    setConfirmDeleteId(null);
    showToast(`মেনু অপশন "${title}" ৩-লাইন মেনু থেকে মুছে ফেলা হয়েছে।`);
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const success = moveStoredMenuItem(id, direction);
    if (success) {
      showToast('মেনু ক্রম সফলভাবে পরিবর্তিত হয়েছে।');
    }
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        'আপনি কি নিশ্চিত যে সমস্ত ৩-লাইন মেনু অপশন ডিফল্ট অবস্থায় রিস্টোর করতে চান? আপনার কাস্টম পরিবর্তনগুলো রিসেট হয়ে যাবে।'
      )
    ) {
      resetStoredMenuItems();
      showToast('৩-লাইন মেনু অপশন সফলভাবে ডিফল্ট অবস্থায় রিস্টোর হয়েছে।');
    }
  };

  // Filtered items
  const filteredItems = menuItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.mainTitle.toLowerCase().includes(q) ||
      item.subMenu.toLowerCase().includes(q) ||
      item.fieldLabel.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.sampleValue.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header Banner */}
      <div className="bg-[#191B1E] border border-[#2D3036] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#F25C05]/15 text-[#F25C05] rounded-xl border border-[#F25C05]/30">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#FF8E4D] uppercase tracking-wider">
              3-Line Menu Manager (৩-লাইন মেনু কন্ট্রোল)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              {menuItems.length} Active Options
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Manage Website 3-Line Document Search Items
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
            মেইন ওয়েবসাইটের উপরের বাম দিকের ৩-লাইনের (Hamburger) মেনুতে প্রদর্শিত ডকুমেন্ট অপশনগুলো এখান থেকে যোগ, এডিট, রিমুভ এবং ক্রম সাজাতে পারবেন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl bg-[#23262D] hover:bg-[#2C3038] text-gray-300 hover:text-white border border-[#373B45] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default 11 document items"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#F25C05] hover:bg-[#D94F04] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-md shadow-[#F25C05]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Menu Option (নতুন অপশন যোগ করুন)</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#17181B] p-4 rounded-xl border border-[#26282E]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu options by title, label or ID..."
            className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>লাইভ সিঙ্ক চালু রয়েছে: এখানে যোগ/মুছে ফেললেই মেইন ওয়েবসাইটে সাথে সাথে আপডেট হবে।</span>
          </span>
        </div>
      </div>

      {/* Menu Items Table / Cards */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-[#181A1D] border border-[#2D3036] rounded-xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#FF8E4D] mx-auto" />
            <h4 className="text-sm font-bold text-white">কোনো মেনু অপশন পাওয়া যায়নি</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              অনুসন্ধানের সাথে মিল রেখে কোনো আইটেম পাওয়া যায়নি। নতুন অপশন যোগ করতে উপরের বাটনে ক্লিক করুন।
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#F25C05] hover:bg-[#D94F04] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Menu Item</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#191B1E] border border-[#2B2E35] hover:border-[#3E434F] rounded-xl p-4 sm:p-5 transition-all shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left: Position & Titles */}
                <div className="flex items-start gap-3.5">
                  <div className="flex flex-col items-center justify-center bg-[#131416] border border-[#2A2C32] rounded-lg w-10 h-10 shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-400 font-mono">#{index + 1}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {item.mainTitle}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F25C05]/15 text-[#FF8E4D] border border-[#F25C05]/25">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#24272E] text-gray-300 border border-[#353A45]">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="text-gray-300 font-medium">
                        সাব-মেনু: <strong className="text-[#38bdf8]">{item.subMenu}</strong>
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-300">
                        সার্চ ফিল্ড: <strong className="text-emerald-400">{item.fieldLabel}</strong>
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 font-mono text-[11px]">
                        ডেমো মান: {item.sampleValue}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                  </div>
                </div>

                {/* Right: Actions & Order */}
                <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#26282E]">
                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-[#131417] p-1 rounded-lg border border-[#2B2E35]">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(item.id, 'up')}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-[#23262D] rounded disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === menuItems.length - 1}
                      onClick={() => handleMove(item.id, 'down')}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-[#23262D] rounded disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#23262D] hover:bg-[#2F333D] text-gray-200 hover:text-white border border-[#34373F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Edit (এডিট)</span>
                  </button>

                  {/* Delete Button / Confirm */}
                  {confirmDeleteId === item.id ? (
                    <div className="flex items-center gap-1.5 bg-red-950/60 p-1 rounded-lg border border-red-500/50 animate-in fade-in duration-150">
                      <span className="text-[11px] text-red-200 font-bold px-1.5">মুছে ফেলবেন?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.mainTitle)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                      >
                        হ্যাঁ
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-[#23262D] hover:bg-[#30343E] text-gray-300 rounded text-xs font-semibold cursor-pointer"
                      >
                        না
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="p-2 rounded-lg bg-[#23262D] hover:bg-red-950 hover:border-red-500/40 text-gray-400 hover:text-red-400 border border-[#34373F] transition-colors cursor-pointer"
                      title="Delete Option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Preview Box */}
      <div className="bg-[#17191C] border border-[#292C33] rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#25282E]">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#38bdf8]" />
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              Website 3-Line Hamburger Menu Live Simulation (ওয়েবসাইটে যেমন দেখা যাবে)
            </h4>
          </div>
          <span className="text-[11px] text-gray-400">Total {menuItems.length} Verification Items</span>
        </div>

        <div className="bg-[#0f1012] p-4 rounded-xl border border-[#23252A] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {menuItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#191B1F] rounded-lg border border-[#272A30] hover:border-[#F25C05]/50 transition-colors"
            >
              <div className="text-xs font-bold text-white truncate">{item.mainTitle}</div>
              <div className="text-[11px] text-[#FF8E4D] font-medium truncate mt-0.5">
                ↳ {item.subMenu}
              </div>
              <div className="mt-2 text-[10px] text-gray-400 bg-black/40 px-2 py-1 rounded flex items-center justify-between">
                <span>Input: {item.fieldLabel}</span>
                <span className="font-mono text-emerald-400">{item.sampleValue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ADD / EDIT MENU OPTION MODAL
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-[#17181B] border border-[#31353E] text-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#1F2228] px-6 py-4 border-b border-[#2C3038] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#F25C05]/15 text-[#F25C05] border border-[#F25C05]/30">
                  <Menu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingItem ? 'Edit 3-Line Menu Option' : 'Add New 3-Line Menu Option'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    মেইন ওয়েবসাইটের ৩-লাইনের মেনুতে প্রদর্শনের জন্য তথ্য পূরণ করুন।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#2C3038] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Main Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Main Title / প্রধান শিরোনাম <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mainTitle}
                    onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                    placeholder="যেমন: Work Permit Documents Pending বা Australia Work Permit Documents"
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                </div>

                {/* Sub-Menu Label */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Sub-Menu Name / সাব-মেনু নাম <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subMenu}
                    onChange={(e) => setFormData({ ...formData, subMenu: e.target.value })}
                    placeholder="যেমন: Work Permit Documents Pending See বা Employment Application Document C"
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                  <p className="text-[11px] text-gray-500">
                    এটি ৩-লাইনের মেনু ড্রপডাউনে ক্লিকযোগ্য লিঙ্ক হিসেবে প্রদর্শিত হবে।
                  </p>
                </div>

                {/* Search Input Field Label */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Search Field Label (সার্চ ফিল্ড নাম) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fieldLabel}
                    onChange={(e) => setFormData({ ...formData, fieldLabel: e.target.value })}
                    placeholder="যেমন: TIN / Reference Number, ID Number, Verification ID No, Reference No"
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                </div>

                {/* Sample / Default Value */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Sample / Demo Search ID (নমুনা আইডি)
                  </label>
                  <input
                    type="text"
                    value={formData.sampleValue}
                    onChange={(e) => setFormData({ ...formData, sampleValue: e.target.value })}
                    placeholder="যেমন: REF-928410 বা ED-78412-WA বা VRF-99420-AU"
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                </div>

                {/* Input Placeholder */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Input Placeholder Text (সার্চ বক্সের প্লেসহোল্ডার)
                  </label>
                  <input
                    type="text"
                    value={formData.placeholder}
                    onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                    placeholder="যেমন: Enter Reference No (e.g. REF-928410)..."
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                </div>

                {/* Category & Badge */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Category (ক্যাটাগরি)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="যেমন: Work Permit, Employment, Biometrics, Visa Lodgement"
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Verification Badge (ব্যাজ টেক্সট)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="যেমন: TIN & Reference Verified বা Condition 8107"
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                </div>

                {/* Document Type */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Document Classification (ডকুমেন্টের ধরন)
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      setFormData({ ...formData, documentType: e.target.value as DocumentType })
                    }
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
                  >
                    <option value="work-permit">Work Permit Documents (ওয়ার্ক পারমিট)</option>
                    <option value="employment-offer">Offer Letter of Employment (নিয়োগপত্র)</option>
                    <option value="job-confirmation">Job Confirmation Certificate (চাকরি নিশ্চিতকরণ)</option>
                    <option value="biometric-vfs">Biometric Received Paper of VFS Global (বায়োমেট্রিক)</option>
                    <option value="application-form">Employment Application Form (আবেদনপত্র)</option>
                    <option value="visa-received">Visa Acknowledgement Paper (ভিসা প্রাপ্তি)</option>
                    <option value="visa-granted">Visa Granted Notification (ভিসা গ্র্যান্ট)</option>
                    <option value="insurance-paper">Insurance Paper / OVHC (বীমা কাগজপত্র)</option>
                    <option value="plane-ticket">Plane Ticket Documents (বিমানের টিকিট)</option>
                    <option value="immi-card">Immi Card Official Document (ইমি কার্ড)</option>
                    <option value="health-certificate">Medical / Health Insurance (মেডিকেল ও স্বাস্থ্য)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Description (বিবরণ)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="যেমন: Search official Commonwealth statutory work authorization certificate and corporate records..."
                    className="w-full bg-[#101114] border border-[#2F323A] focus:border-[#F25C05] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F25C05]"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-[#2B2E35] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#23262D] hover:bg-[#2E323B] text-gray-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel (বাতিল)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F25C05] hover:bg-[#D94F04] text-white text-xs font-bold transition-all shadow-md shadow-[#F25C05]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingItem
                      ? 'Save Changes (পরিবর্তন সংরক্ষণ করুন)'
                      : 'Publish to 3-Line Menu (মেনুতে যোগ করুন)'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
