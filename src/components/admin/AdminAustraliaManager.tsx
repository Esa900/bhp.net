import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  Eye,
  FileText,
  Calendar,
  Image as ImageIcon,
  FolderPlus,
  CheckCircle2,
  Clock,
  User,
  ExternalLink,
  Layers,
  Filter,
  Upload,
  File,
  X,
  Sparkles,
  Paperclip,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Tag,
  Hash,
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
import { AdminPost, AttachedDoc } from '../../types';
import {
  getStoredAdminPosts,
  saveStoredAdminPosts,
  addStoredAdminPost,
  updateStoredAdminPost,
  deleteStoredAdminPost,
  POSTS_STORAGE_KEY,
} from '../../utils/postsStorage';
import {
  FullPdfDocumentViewer,
  postToUnifiedDoc,
} from '../FullPdfDocumentViewer';

interface AdminAustraliaManagerProps {
  showToast: (msg: string) => void;
}

type AustraliaTab = 'add-post' | 'all-posts' | 'categories';

export const AdminAustraliaManager: React.FC<AdminAustraliaManagerProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<AustraliaTab>('all-posts');

  // -------------------------------------------------------------
  // Categories (Australia 3-line menu items above Job Circular)
  // -------------------------------------------------------------
  const [categories, setCategories] = useState<DocumentMenuItem[]>(() => getStoredMenuItems());
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DocumentMenuItem | null>(null);
  const [catFormData, setCatFormData] = useState<{
    mainTitle: string;
    subMenu: string;
    fieldLabel: string;
    fieldKey: string;
    placeholder: string;
    sampleValue: string;
    description: string;
    badge: string;
    category: string;
    documentType: DocumentType;
  }>({
    mainTitle: '',
    subMenu: '',
    fieldLabel: 'Reference / ID Number',
    fieldKey: 'tinOrRef',
    placeholder: 'Enter Reference Number...',
    sampleValue: 'REF-928410',
    description: 'Verify official Australia documentation and credentials.',
    badge: 'Official Verified',
    category: 'Work Permit',
    documentType: 'application-form',
  });

  // -------------------------------------------------------------
  // Posts Data
  // -------------------------------------------------------------
  const [posts, setPosts] = useState<AdminPost[]>(() => getStoredAdminPosts());
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');
  const [selectedPostForView, setSelectedPostForView] = useState<AdminPost | null>(null);

  // Form State for Add / Edit Post
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<{
    title: string;
    refNumber: string;
    category: string;
    author: string;
    status: 'Published' | 'Draft';
    content: string;
    imageUrl: string;
    galleryImages: string[];
    attachedDocuments: AttachedDoc[];
    readTime: string;
    badges: string;
    // Customer details
    candidateName: string;
    candidatePhotoUrl?: string;
    passportNumber: string;
    nationality: string;
    dateOfBirth: string;
    jobTitle: string;
    employerName: string;
    workLocation: string;
    salaryPackage: string;
    visaSubclass: string;
    issueDate: string;
    expiryDate: string;
  }>({
    title: '',
    refNumber: '',
    category: '',
    author: 'BHP Australia Operations',
    status: 'Published',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    attachedDocuments: [],
    readTime: '3 min read',
    badges: 'AUSTRALIA, VERIFIED',
    candidateName: '',
    candidatePhotoUrl: '',
    passportNumber: '',
    nationality: 'Bangladeshi',
    dateOfBirth: '1993-01-01',
    jobTitle: 'Senior Mining / Maintenance Specialist',
    employerName: 'BHP Group Operations (Australia)',
    workLocation: 'Perth, WA, Australia',
    salaryPackage: '$135,000 AUD / Year',
    visaSubclass: 'Subclass 482 - TSS (Medium-Term Stream)',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2028-12-31',
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const candidatePhotoInputRef = useRef<HTMLInputElement | null>(null);

  const handleCandidatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPostForm((prev) => ({
        ...prev,
        candidatePhotoUrl: dataUrl,
        imageUrl: dataUrl,
      }));
      showToast(`Candidate photo "${file.name}" uploaded successfully.`);
    };
    reader.readAsDataURL(file);
  };

  // Sync Categories & Posts with storage events
  useEffect(() => {
    const handleCatUpdate = () => {
      setCategories(getStoredMenuItems());
    };
    const handleStorage = () => {
      setCategories(getStoredMenuItems());
      setPosts(getStoredAdminPosts());
    };

    window.addEventListener(MENU_ITEMS_UPDATED_EVENT, handleCatUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(MENU_ITEMS_UPDATED_EVENT, handleCatUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Update default category in post form when categories change
  useEffect(() => {
    if (categories.length > 0 && !postForm.category) {
      setPostForm((prev) => ({
        ...prev,
        category: categories[0].mainTitle,
      }));
    }
  }, [categories]);

  // -------------------------------------------------------------
  // POST ACTIONS
  // -------------------------------------------------------------
  const handleOpenAddPost = () => {
    setEditingPostId(null);
    setPostForm({
      title: '',
      refNumber: `REF-AU-${Math.floor(100000 + Math.random() * 900000)}`,
      category: categories[0]?.mainTitle || 'Australia Work Permit Documents',
      author: 'BHP Australia Operations',
      status: 'Published',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      attachedDocuments: [],
      readTime: '3 min read',
      badges: 'AUSTRALIA, VERIFIED',
      candidateName: '',
      passportNumber: '',
      nationality: 'Bangladeshi',
      dateOfBirth: '1993-01-01',
      jobTitle: 'Senior Mining / Maintenance Specialist',
      employerName: 'BHP Group Operations (Australia)',
      workLocation: 'Perth, WA, Australia',
      salaryPackage: '$135,000 AUD / Year',
      visaSubclass: 'Subclass 482 - TSS (Medium-Term Stream)',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2028-12-31',
    });
    setActiveTab('add-post');
  };

  const handleOpenEditPost = (post: AdminPost) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      refNumber: post.refNumber,
      category: post.category,
      author: post.author,
      status: post.status,
      content: post.content,
      imageUrl: post.imageUrl || '',
      galleryImages: post.galleryImages || [],
      attachedDocuments: post.attachedDocuments || [],
      readTime: post.readTime || '3 min read',
      badges: post.badges?.join(', ') || 'AUSTRALIA, VERIFIED',
      candidateName: post.candidateName || '',
      candidatePhotoUrl: post.candidatePhotoUrl || post.imageUrl || '',
      passportNumber: post.passportNumber || '',
      nationality: post.nationality || 'Bangladeshi',
      dateOfBirth: post.dateOfBirth || '1993-01-01',
      jobTitle: post.jobTitle || 'Senior Mining Specialist',
      employerName: post.employerName || 'BHP Group Operations (Australia)',
      workLocation: post.workLocation || 'Perth, WA, Australia',
      salaryPackage: post.salaryPackage || '$135,000 AUD / Year',
      visaSubclass: post.visaSubclass || 'Subclass 482 - TSS',
      issueDate: post.issueDate || post.date || new Date().toISOString().split('T')[0],
      expiryDate: post.expiryDate || '2028-12-31',
    });
    setActiveTab('add-post');
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim()) {
      showToast('Error: Post title is required.');
      return;
    }
    if (!postForm.refNumber.trim()) {
      showToast('Error: Reference number is required.');
      return;
    }

    const badgesList = postForm.badges
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const postData: AdminPost = {
      id: editingPostId || `post-au-${Date.now()}`,
      title: postForm.title.trim(),
      refNumber: postForm.refNumber.trim(),
      category: postForm.category || categories[0]?.mainTitle || 'Australia Work Permit',
      author: postForm.author.trim() || 'BHP Australia Operations',
      date: new Date().toISOString().split('T')[0],
      status: postForm.status,
      content: postForm.content,
      imageUrl: postForm.candidatePhotoUrl || postForm.imageUrl || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      candidatePhotoUrl: postForm.candidatePhotoUrl || postForm.imageUrl,
      galleryImages: postForm.galleryImages,
      attachedDocuments: postForm.attachedDocuments,
      readTime: postForm.readTime || '3 min read',
      badges: badgesList.length > 0 ? badgesList : ['AUSTRALIA', 'VERIFIED'],
      candidateName: postForm.candidateName.trim(),
      passportNumber: postForm.passportNumber.trim(),
      nationality: postForm.nationality.trim(),
      dateOfBirth: postForm.dateOfBirth,
      jobTitle: postForm.jobTitle.trim(),
      employerName: postForm.employerName.trim(),
      workLocation: postForm.workLocation.trim(),
      salaryPackage: postForm.salaryPackage.trim(),
      visaSubclass: postForm.visaSubclass.trim(),
      issueDate: postForm.issueDate,
      expiryDate: postForm.expiryDate,
      verificationIdNo: `VRF-AU-${postForm.refNumber.replace(/[^0-9]/g, '') || '99420'}`,
    };

    if (editingPostId) {
      updateStoredAdminPost(editingPostId, postData);
      showToast(`Post "${postData.title}" updated successfully.`);
    } else {
      addStoredAdminPost(postData);
      showToast(`New post "${postData.title}" added to Australia.`);
    }

    setPosts(getStoredAdminPosts());
    setActiveTab('all-posts');
  };

  const handleDeletePost = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete post "${title}"?`)) {
      deleteStoredAdminPost(id);
      setPosts(getStoredAdminPosts());
      showToast(`Post "${title}" deleted.`);
    }
  };

  // Document attachment handler (Base64 file reader)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const isPdf = file.type.includes('pdf');
        const isImg = file.type.includes('image');
        const newDoc: AttachedDoc = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          type: isPdf ? 'pdf' : isImg ? 'image' : 'other',
          dataUrl: reader.result as string,
          uploadDate: new Date().toISOString().split('T')[0],
        };
        setPostForm((prev) => ({
          ...prev,
          attachedDocuments: [...prev.attachedDocuments, newDoc],
        }));
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Document attached.');
  };

  const handleRemoveDoc = (docId: string) => {
    setPostForm((prev) => ({
      ...prev,
      attachedDocuments: prev.attachedDocuments.filter((d) => d.id !== docId),
    }));
  };

  // Gallery image upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPostForm((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    showToast('Gallery image added.');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setPostForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
    }));
  };

  // -------------------------------------------------------------
  // CATEGORY ACTIONS (Australia 3-line Menu)
  // -------------------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatFormData({
      mainTitle: '',
      subMenu: '',
      fieldLabel: 'Reference / ID Number',
      fieldKey: 'tinOrRef',
      placeholder: 'Enter Reference Number...',
      sampleValue: 'REF-928410',
      description: 'Verify official Australia documentation and credentials.',
      badge: 'Official Verified',
      category: 'Work Permit',
      documentType: 'application-form',
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (item: DocumentMenuItem) => {
    setEditingCategory(item);
    setCatFormData({
      mainTitle: item.mainTitle,
      subMenu: item.subMenu,
      fieldLabel: item.fieldLabel,
      fieldKey: item.fieldKey,
      placeholder: item.placeholder,
      sampleValue: item.sampleValue,
      description: item.description,
      badge: item.badge,
      category: item.category,
      documentType: item.documentType,
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.mainTitle.trim() || !catFormData.subMenu.trim()) {
      showToast('Error: Main Title and SubMenu are required.');
      return;
    }

    if (editingCategory) {
      updateStoredMenuItem(editingCategory.id, catFormData);
      showToast(`Category "${catFormData.mainTitle}" updated in Australia menu.`);
    } else {
      addStoredMenuItem(catFormData);
      showToast(`New category "${catFormData.mainTitle}" added to Australia 3-line menu.`);
    }

    setCategories(getStoredMenuItems());
    setIsCatModalOpen(false);
  };

  const handleDeleteCategory = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the Australia 3-line menu?`)) {
      deleteStoredMenuItem(id);
      setCategories(getStoredMenuItems());
      showToast(`Category "${title}" removed from Australia menu.`);
    }
  };

  const handleResetCategories = () => {
    if (window.confirm('Reset Australia menu categories to default official items?')) {
      resetStoredMenuItems();
      setCategories(getStoredMenuItems());
      showToast('Australia menu categories reset to default.');
    }
  };

  // Filtered lists
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      p.refNumber.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(postSearchQuery.toLowerCase());
    const matchesCat = selectedCatFilter === 'ALL' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  const filteredCategories = categories.filter((c) =>
    c.mainTitle.toLowerCase().includes(catSearchQuery.toLowerCase()) ||
    c.subMenu.toLowerCase().includes(catSearchQuery.toLowerCase()) ||
    c.fieldLabel.toLowerCase().includes(catSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-200">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1C1E23] p-6 rounded-2xl border border-[#2B2F38] shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Australia Operations
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {posts.length} Posts · {categories.length} Categories
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Australia Post & Menu Manager (অস্ট্রেলিয়া ব্যবস্থাপনা)
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              বাম পাশের ৩ লাইনের মেনু (Job Circular এর উপরের অপশনগুলো) ক্যাটাগরি হিসেবে যুক্ত/রিমুভ করুন এবং পোস্ট পাবলিশ করুন।
            </p>
          </div>
        </div>

        {/* 3 Main Tabs Buttons */}
        <div className="flex items-center gap-2 bg-[#131417] p-1.5 rounded-xl border border-[#2B2E37] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('all-posts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all-posts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1E2026]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Post ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddPost}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'add-post'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1E2026]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Post</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1E2026]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Category (Add/Remove)</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 1. ALL POSTS TAB */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'all-posts' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1C1E23] p-4 rounded-xl border border-[#2B2F38]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, REF number, or content..."
                value={postSearchQuery}
                onChange={(e) => setPostSearchQuery(e.target.value)}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 max-w-[200px] truncate"
              >
                <option value="ALL">All Categories ({posts.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.mainTitle}>
                    {c.mainTitle}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleOpenAddPost}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Post</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-[#17191E] rounded-xl border border-[#26282E] text-gray-400 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-gray-500" />
              <p className="text-sm font-semibold text-gray-300">No Australia posts found.</p>
              <button
                type="button"
                onClick={handleOpenAddPost}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Australia Post</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#1C1E23] border border-[#2B2F38] hover:border-blue-500/50 rounded-xl p-5 space-y-3.5 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {post.refNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          post.status === 'Published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {post.title}
                    </h4>

                    <div className="text-[11px] text-gray-400 flex items-center gap-2">
                      <span className="text-blue-400 font-semibold">{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Attachments preview */}
                    {post.attachedDocuments && post.attachedDocuments.length > 0 && (
                      <div className="pt-1 flex items-center gap-2 text-[11px] text-gray-400">
                        <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                        <span>{post.attachedDocuments.length} Document(s) Attached</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#272A32]">
                    <button
                      type="button"
                      onClick={() => setSelectedPostForView(post)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPost(post)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2B2E37] rounded-lg transition-colors cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* 2. ADD / EDIT POST TAB */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'add-post' && (
        <form onSubmit={handleSavePost} className="bg-[#1C1E23] p-6 rounded-2xl border border-[#2B2F38] space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
            <div>
              <h4 className="font-bold text-base text-white">
                {editingPostId ? 'Edit Australia Post' : 'Add New Australia Post (নতুন পোস্ট যোগ করুন)'}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                ক্যাটাগরি সিলেক্ট করুন (যা বাম পাশের ৩ লাইনের মেনু অপশনগুলো থেকে আসে) এবং ডকুমেন্টস আপলোড করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('all-posts')}
              className="px-3 py-1.5 bg-[#252830] text-gray-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Post Title (শিরোনাম) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Australia Work Permit Documents Verification Clearance"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Reference Number (রেফারেন্স নং) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. REF-928410"
                value={postForm.refNumber}
                onChange={(e) => setPostForm({ ...postForm, refNumber: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category selection from Australia 3-line menu */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Category (৩ লাইনের মেনু অপশন) <span className="text-red-400">*</span>
              </label>
              <select
                value={postForm.category}
                onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.mainTitle}>
                    {c.mainTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Author / Authority</label>
              <input
                type="text"
                value={postForm.author}
                onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Status (স্ট্যাটাস)</label>
              <select
                value={postForm.status}
                onChange={(e) => setPostForm({ ...postForm, status: e.target.value as 'Published' | 'Draft' })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Published">Published (লাইভ দেখা যাবে)</option>
                <option value="Draft">Draft (খসড়া)</option>
              </select>
            </div>
          </div>

          {/* Customer / Candidate Information Block for Full PDF Certificate */}
          <div className="p-4 bg-[#141517] rounded-xl border border-[#282B33] space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-400" />
              Customer / Candidate Information for Full PDF (গ্রাহকের তথ্য যা পূর্ণাঙ্গ PDF সার্টিফিকেটে থাকবে)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Candidate Full Name (প্রার্থীর নাম)</label>
                <input
                  type="text"
                  placeholder="e.g. Mohammad Tanvir Ahmed"
                  value={postForm.candidateName}
                  onChange={(e) => setPostForm({ ...postForm, candidateName: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Passport Number (পাসপোর্ট নং)</label>
                <input
                  type="text"
                  placeholder="e.g. A09482103"
                  value={postForm.passportNumber}
                  onChange={(e) => setPostForm({ ...postForm, passportNumber: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Nationality (জাতীয়তা)</label>
                <input
                  type="text"
                  placeholder="e.g. Bangladeshi"
                  value={postForm.nationality}
                  onChange={(e) => setPostForm({ ...postForm, nationality: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Candidate Photo / Picture Upload & URL (প্রার্থীর ছবি যা PDF এ দেখাবে) */}
            <div className="p-3 bg-[#1A1C21] rounded-xl border border-[#2D313A] space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-16 h-20 rounded-lg border-2 border-dashed border-[#444] bg-[#121316] flex items-center justify-center overflow-hidden shrink-0 relative">
                    {postForm.candidatePhotoUrl || postForm.imageUrl ? (
                      <img
                        src={postForm.candidatePhotoUrl || postForm.imageUrl}
                        alt="Candidate Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Candidate Picture / Photo (প্রার্থীর ছবি)
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      এই ছবিটি সরাসরি অস্ট্রেলিয়া অফিসিয়াল PDF সার্টিফিকেটে প্রদর্শিত হবে।
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={candidatePhotoInputRef}
                    accept="image/*"
                    onChange={handleCandidatePhotoUpload}
                    className="hidden"
                    id="au-candidate-photo-upload"
                  />
                  <label
                    htmlFor="au-candidate-photo-upload"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture (ছবি আপলোড)</span>
                  </label>

                  {(postForm.candidatePhotoUrl || postForm.imageUrl) && (
                    <button
                      type="button"
                      onClick={() => setPostForm({ ...postForm, candidatePhotoUrl: '', imageUrl: '' })}
                      className="px-2.5 py-1.5 bg-[#252830] hover:bg-[#30333C] text-gray-300 hover:text-red-400 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  অথবা ছবির অনলাইন লিঙ্ক দিন (Or Paste Image URL):
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or data:image/..."
                  value={postForm.candidatePhotoUrl || postForm.imageUrl || ''}
                  onChange={(e) =>
                    setPostForm({
                      ...postForm,
                      candidatePhotoUrl: e.target.value,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full bg-[#121316] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Designated Job Title (পদবী)</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Geotechnical Specialist"
                  value={postForm.jobTitle}
                  onChange={(e) => setPostForm({ ...postForm, jobTitle: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Employer / Sponsor (প্রতিষ্ঠান)</label>
                <input
                  type="text"
                  placeholder="e.g. BHP Group Operations (Australia)"
                  value={postForm.employerName}
                  onChange={(e) => setPostForm({ ...postForm, employerName: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Work Location (কাজের স্থান)</label>
                <input
                  type="text"
                  placeholder="e.g. Perth, WA, Australia"
                  value={postForm.workLocation}
                  onChange={(e) => setPostForm({ ...postForm, workLocation: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Salary Package / Remuneration (বেতন)</label>
                <input
                  type="text"
                  placeholder="e.g. $135,000 AUD / Year"
                  value={postForm.salaryPackage}
                  onChange={(e) => setPostForm({ ...postForm, salaryPackage: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Visa Subclass / Category</label>
                <input
                  type="text"
                  placeholder="e.g. Subclass 482 - TSS (Medium-Term)"
                  value={postForm.visaSubclass}
                  onChange={(e) => setPostForm({ ...postForm, visaSubclass: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date (মেয়াদ)</label>
                <input
                  type="date"
                  value={postForm.expiryDate}
                  onChange={(e) => setPostForm({ ...postForm, expiryDate: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Description / Content (বিস্তারিত বিবরণ)
            </label>
            <textarea
              rows={5}
              placeholder="Enter verified directive details, authorization status, conditions..."
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* Primary Featured Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Featured Cover Image URL
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={postForm.imageUrl}
                onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Badges (কমা দিয়ে লিখুন)</label>
              <input
                type="text"
                placeholder="AUSTRALIA, WORK PERMIT, VERIFIED"
                value={postForm.badges}
                onChange={(e) => setPostForm({ ...postForm, badges: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Attach PDF / Documents upload */}
          <div className="p-4 bg-[#141517] rounded-xl border border-[#282B33] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-blue-400" />
                  Attach Official Documents (PDF বা ছবি ফাইল আপলোড)
                </span>
                <p className="text-[11px] text-gray-400">PDF, JPG, PNG ফাইলগুলো ক্লায়েন্টরা সরাসরি ডাউনলোড ও দেখতে পারবেন।</p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="au-doc-upload"
              />
              <label
                htmlFor="au-doc-upload"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Files</span>
              </label>
            </div>

            {postForm.attachedDocuments.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {postForm.attachedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-[#1E2026] px-3 py-2 rounded-lg text-xs border border-[#2B2F38]"
                  >
                    <div className="flex items-center gap-2 text-gray-200 truncate">
                      <File className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-semibold truncate">{doc.name}</span>
                      <span className="text-[10px] text-gray-400">({doc.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
            <button
              type="button"
              onClick={() => setActiveTab('all-posts')}
              className="px-4 py-2 bg-[#252830] text-gray-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer shadow-lg shadow-blue-600/30 transition-all"
            >
              {editingPostId ? 'Save Changes' : 'Publish Australia Post'}
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------- */}
      {/* 3. CATEGORY (ADD / REMOVE) TAB */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1C1E23] p-4 rounded-xl border border-[#2B2F38]">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                <span>Australia 3-Line Menu Categories (বাম পাশের মেনু অপশনসমূহ)</span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                এখানে ক্যাটাগরি যোগ বা রিমুভ করলে ওয়েবসাইটের বাম পাশের ৩ লাইনের মেনু (Job Circular এর উপরে) স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetCategories}
                className="px-3 py-2 bg-[#262A33] hover:bg-[#323742] text-gray-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#3A404E]"
                title="Restore default categories"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Category</span>
              </button>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-[#1C1E23] rounded-xl border border-[#2B2F38] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141517] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#2B2F38]">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Main Title (প্রধান শিরোনাম)</th>
                    <th className="py-3 px-4">SubMenu Link (সাবমেনু লিঙ্ক)</th>
                    <th className="py-3 px-4">Search Field Label</th>
                    <th className="py-3 px-4">Badge</th>
                    <th className="py-3 px-4 text-right">Actions (নিয়ন্ত্রণ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26282E]">
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-[#1E2026] transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white">{cat.mainTitle}</td>
                      <td className="py-3 px-4 text-blue-400">{cat.subMenu}</td>
                      <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">{cat.fieldLabel}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {cat.badge || 'Verified'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => moveStoredMenuItem(cat.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStoredMenuItem(cat.id, 'down')}
                            disabled={idx === categories.length - 1}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cat)}
                            className="p-1.5 text-blue-400 hover:bg-blue-950/40 rounded transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.mainTitle)}
                            className="p-1.5 text-red-400 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                            title="Remove Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ------------------------------------------------------- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-base text-white">
                  {editingCategory ? `Edit Category: ${editingCategory.mainTitle}` : 'Add New Category (নতুন ক্যাটাগরি যোগ করুন)'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Main Title (প্রধান শিরোনাম) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Australia Work Permit Documents"
                  value={catFormData.mainTitle}
                  onChange={(e) => setCatFormData({ ...catFormData, mainTitle: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  SubMenu Link Label (সাবমেনু লিঙ্ক লেখা) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Employment Application Document See"
                  value={catFormData.subMenu}
                  onChange={(e) => setCatFormData({ ...catFormData, subMenu: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Search Field Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TIN / Reference Number"
                    value={catFormData.fieldLabel}
                    onChange={(e) => setCatFormData({ ...catFormData, fieldLabel: e.target.value })}
                    className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. TIN & Reference Verified"
                    value={catFormData.badge}
                    onChange={(e) => setCatFormData({ ...catFormData, badge: e.target.value })}
                    className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description (বর্ণনা)</label>
                <textarea
                  rows={2}
                  placeholder="Verify official Commonwealth Employment Application..."
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 bg-[#252830] text-gray-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  {editingCategory ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* MODAL: VIEW FULL PDF POST DETAILS */}
      {/* ------------------------------------------------------- */}
      {selectedPostForView && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#17181B] border border-[#3A3F4C] text-white w-full max-w-5xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Australia Full Official Document & PDF Preview ({selectedPostForView.refNumber})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPostForView(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#252830] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FullPdfDocumentViewer
              document={postToUnifiedDoc(selectedPostForView, 'australia')}
              onClose={() => setSelectedPostForView(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
