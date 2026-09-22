import React, { useState, useEffect, useRef } from 'react';
import {
  Pin,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  Eye,
  Tag,
  FileText,
  Calendar,
  Image as ImageIcon,
  FolderPlus,
  CheckCircle2,
  Clock,
  User,
  ArrowLeft,
  ExternalLink,
  Layers,
  Filter,
  Upload,
  File,
  Download,
  X,
  Hash,
  Sparkles,
  Paperclip,
  AlertCircle,
  FileCheck,
  Maximize2,
  Lock,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { NewsItem } from '../../types';

export interface AttachedDoc {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'other';
  dataUrl: string; // Base64 or external URL
  uploadDate: string;
}

export interface AdminPost {
  id: string;
  title: string;
  refNumber: string;
  content: string; // Description
  category: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
  imageUrl: string; // Primary featured image
  galleryImages: string[]; // All uploaded pictures ("jotogula pic upload dear suystem ase sob jeno saport neai")
  attachedDocuments: AttachedDoc[]; // PDF & Document pic upload option
  readTime: string;
  badges: string[];
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface AdminPostsManagerProps {
  subView: 'all' | 'new' | 'categories';
  onSwitchSubView: (view: 'all' | 'new' | 'categories') => void;
  showToast: (msg: string) => void;
}

const DEFAULT_CATEGORIES: PostCategory[] = [
  {
    id: 'cat-1',
    name: 'Mining & Resources',
    slug: 'mining-resources',
    description: 'Operational updates, extraction technology, and global commodity extraction.',
  },
  {
    id: 'cat-2',
    name: 'Sustainability & ESG',
    slug: 'sustainability-esg',
    description: 'Decarbonisation targets, environmental biodiversity, and ethical governance.',
  },
  {
    id: 'cat-3',
    name: 'Financial & Results',
    slug: 'financial-results',
    description: 'Quarterly reports, shareholder distribution, and corporate capital expenditure.',
  },
  {
    id: 'cat-4',
    name: 'Technology & Innovation',
    slug: 'technology-innovation',
    description: 'Autonomous haulage, electric smelting, and automation developments.',
  },
  {
    id: 'cat-5',
    name: 'Workforce & Community',
    slug: 'workforce-community',
    description: 'Indigenous partnerships, apprenticeship programs, and employee safety.',
  },
];

export const AdminPostsManager: React.FC<AdminPostsManagerProps> = ({
  subView,
  onSwitchSubView,
  showToast,
}) => {
  const { news, addNews, updateNews, deleteNews } = useAdminData();

  // Local storage keys
  const POSTS_STORAGE_KEY = 'bhp_admin_posts_v2';
  const CATEGORIES_STORAGE_KEY = 'bhp_admin_post_categories_v2';

  // Initialize Categories
  const [categories, setCategories] = useState<PostCategory[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // Save categories on change
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  // Initialize Posts
  const [posts, setPosts] = useState<AdminPost[]>(() => {
    try {
      const saved = localStorage.getItem(POSTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    // Default seed based on initial news
    return news.map((item, idx) => ({
      id: item.id || `post-${idx + 1}`,
      title: item.title,
      refNumber: `BHP-DOC-2025-${String(idx + 101).padStart(4, '0')}`,
      content:
        'BHP continues to advance its global operational priorities, delivering essential resources to empower economic development and clean energy transition across five continents.',
      category: idx % 2 === 0 ? 'Mining & Resources' : 'Sustainability & ESG',
      author: 'BHP Corporate Media',
      date: item.date || '2025-01-15',
      status: 'Published',
      imageUrl:
        item.imageUrl ||
        'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        item.imageUrl ||
          'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      ],
      attachedDocuments: [
        {
          id: `doc-${idx}-1`,
          name: `BHP_Official_Report_${idx + 1}.pdf`,
          size: '1.42 MB',
          type: 'pdf',
          dataUrl: '#',
          uploadDate: '2025-01-15',
        },
      ],
      readTime: item.readTime || '4 min read',
      badges: item.badges && item.badges.length > 0 ? item.badges : ['PRESS RELEASE'],
    }));
  });

  // Save posts to storage on change
  useEffect(() => {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bhp_posts_updated', { detail: posts }));
      }
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all');

  // Preview Post Modal State
  const [previewingPost, setPreviewingPost] = useState<AdminPost | null>(null);

  // Editing Post State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form State for "Add New Post"
  const [formData, setFormData] = useState({
    title: '',
    refNumber: '',
    content: '', // Description
    category: 'Mining & Resources',
    author: 'BHP Communications Desk',
    date: new Date().toISOString().split('T')[0],
    status: 'Published' as 'Published' | 'Draft',
    imageUrl: '', // Primary cover image
    galleryImages: [] as string[], // Multiple pictures
    attachedDocuments: [] as AttachedDoc[], // PDF and doc pic upload
    readTime: '4 min read',
    badges: 'NEWS, OFFICIAL',
  });

  // Inputs for manual URL adds
  const [singleImgUrlInput, setSingleImgUrlInput] = useState('');
  const [pdfUrlInput, setPdfUrlInput] = useState('');
  const [pdfNameInput, setPdfNameInput] = useState('');

  // Refs for hidden file inputs
  const imageFilesInputRef = useRef<HTMLInputElement>(null);
  const pdfFilesInputRef = useRef<HTMLInputElement>(null);

  // New Category Form State
  const [catFormData, setCatFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  // Open Post Form (Edit Mode)
  const handleOpenEdit = (post: AdminPost) => {
    setEditingPostId(post.id);
    setFormData({
      title: post.title,
      refNumber: post.refNumber || '',
      content: post.content,
      category: post.category,
      author: post.author,
      date: post.date,
      status: post.status,
      imageUrl: post.imageUrl,
      galleryImages: post.galleryImages || (post.imageUrl ? [post.imageUrl] : []),
      attachedDocuments: post.attachedDocuments || [],
      readTime: post.readTime,
      badges: post.badges.join(', '),
    });
    onSwitchSubView('new');
  };

  const handleResetForm = () => {
    setEditingPostId(null);
    setFormData({
      title: '',
      refNumber: '',
      content: '',
      category: categories[0]?.name || 'Mining & Resources',
      author: 'BHP Communications Desk',
      date: new Date().toISOString().split('T')[0],
      status: 'Published',
      imageUrl: '',
      galleryImages: [],
      attachedDocuments: [],
      readTime: '4 min read',
      badges: 'NEWS, OFFICIAL',
    });
    setSingleImgUrlInput('');
    setPdfUrlInput('');
    setPdfNameInput('');
  };

  // Helper: Auto-generate reference number
  const handleAutoGenerateRef = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRef = `BHP-DOC-${year}-${randomNum}`;
    setFormData((prev) => ({ ...prev, refNumber: newRef }));
    showToast(`Generated reference number: ${newRef}`);
  };

  // Handle Multiple Images File Upload
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let loadedCount = 0;
    const newImgs: string[] = [];

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          newImgs.push(result);
        }
        loadedCount++;
        if (loadedCount === files.length) {
          setFormData((prev) => {
            const updatedGallery = [...prev.galleryImages, ...newImgs];
            return {
              ...prev,
              galleryImages: updatedGallery,
              imageUrl: prev.imageUrl || updatedGallery[0] || '',
            };
          });
          showToast(`Successfully uploaded ${newImgs.length} image(s)!`);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Add Image by URL
  const handleAddImageUrl = () => {
    if (!singleImgUrlInput.trim()) return;
    const url = singleImgUrlInput.trim();
    setFormData((prev) => {
      const updatedGallery = [...prev.galleryImages, url];
      return {
        ...prev,
        galleryImages: updatedGallery,
        imageUrl: prev.imageUrl || url,
      };
    });
    setSingleImgUrlInput('');
    showToast('Image URL added to gallery.');
  };

  // Remove Image from Gallery
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const updatedGallery = prev.galleryImages.filter((_, idx) => idx !== indexToRemove);
      const updatedPrimary =
        prev.imageUrl === prev.galleryImages[indexToRemove]
          ? updatedGallery[0] || ''
          : prev.imageUrl;
      return {
        ...prev,
        galleryImages: updatedGallery,
        imageUrl: updatedPrimary,
      };
    });
  };

  // Set specific image as Cover / Primary
  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: imgUrl }));
    showToast('Primary cover image updated.');
  };

  // Handle PDF & Document Picture Upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let loadedCount = 0;
    const newDocs: AttachedDoc[] = [];

    (Array.from(files) as File[]).forEach((file: File) => {
      const isPdf =
        file.name.toLowerCase().endsWith('.pdf') ||
        file.type.includes('pdf') ||
        file.type.includes('application/pdf');
      const isImg = file.type.includes('image');
      const docType: 'pdf' | 'image' | 'other' = isPdf ? 'pdf' : isImg ? 'image' : 'other';

      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          newDocs.push({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            size: sizeStr,
            type: docType,
            dataUrl: result,
            uploadDate: new Date().toISOString().split('T')[0],
          });
        }
        loadedCount++;
        if (loadedCount === files.length) {
          setFormData((prev) => ({
            ...prev,
            attachedDocuments: [...prev.attachedDocuments, ...newDocs],
          }));
          showToast(`Attached ${newDocs.length} PDF / document file(s)!`);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Add PDF by External Link
  const handleAddPdfUrl = () => {
    if (!pdfUrlInput.trim()) return;
    const url = pdfUrlInput.trim();
    const docName =
      pdfNameInput.trim() || url.split('/').pop()?.split('?')[0] || 'Official_Document.pdf';

    const newDoc: AttachedDoc = {
      id: `doc-${Date.now()}`,
      name: docName,
      size: 'Cloud Link',
      type: docName.toLowerCase().endsWith('.pdf') ? 'pdf' : 'other',
      dataUrl: url,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setFormData((prev) => ({
      ...prev,
      attachedDocuments: [...prev.attachedDocuments, newDoc],
    }));
    setPdfUrlInput('');
    setPdfNameInput('');
    showToast('Document link attached.');
  };

  // Remove Attached Document
  const handleRemoveDoc = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachedDocuments: prev.attachedDocuments.filter((d) => d.id !== docId),
    }));
  };

  // Save Post
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a post title.');
      return;
    }

    const badgeArray = formData.badges
      .split(',')
      .map((b) => b.trim().toUpperCase())
      .filter(Boolean);

    // Fallback primary image
    const finalPrimaryImage =
      formData.imageUrl ||
      formData.galleryImages[0] ||
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80';

    const postToSave: AdminPost = {
      id: editingPostId || `post-${Date.now()}`,
      title: formData.title.trim(),
      refNumber: formData.refNumber.trim() || `BHP-DOC-${Date.now().toString().slice(-4)}`,
      content: formData.content.trim(),
      category: formData.category,
      author: formData.author.trim() || 'BHP Team',
      date: formData.date,
      status: formData.status,
      imageUrl: finalPrimaryImage,
      galleryImages:
        formData.galleryImages.length > 0 ? formData.galleryImages : [finalPrimaryImage],
      attachedDocuments: formData.attachedDocuments,
      readTime: formData.readTime,
      badges: badgeArray.length > 0 ? badgeArray : ['NEWS'],
    };

    if (editingPostId) {
      setPosts((prev) => prev.map((p) => (p.id === editingPostId ? postToSave : p)));
      showToast(`Post "${postToSave.title}" updated successfully.`);

      // Sync with News in AdminDataContext if published
      if (postToSave.status === 'Published') {
        const newsItem: NewsItem = {
          id: postToSave.id,
          title: postToSave.title,
          badges: postToSave.badges,
          date: postToSave.date,
          readTime: postToSave.readTime,
          imageUrl: postToSave.imageUrl,
          linkText: 'Read article',
        };
        const existsInNews = news.some((n) => n.id === postToSave.id);
        if (existsInNews) {
          updateNews(postToSave.id, newsItem);
        } else {
          addNews(newsItem);
        }
      } else {
        deleteNews(postToSave.id);
      }
    } else {
      setPosts((prev) => [postToSave, ...prev]);
      showToast(`Post published! Searchable by ID/Ref: "${postToSave.refNumber}"`);

      if (postToSave.status === 'Published') {
        addNews({
          id: postToSave.id,
          title: postToSave.title,
          badges: postToSave.badges,
          date: postToSave.date,
          readTime: postToSave.readTime,
          imageUrl: postToSave.imageUrl,
          linkText: 'Read article',
        });
      }
    }

    handleResetForm();
    onSwitchSubView('all');
  };

  // Delete Post
  const handleDeletePost = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete post "${title}"?`)) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      deleteNews(id);
      showToast(`Post "${title}" deleted.`);
    }
  };

  // Add Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.name.trim()) return;

    const newSlug =
      catFormData.slug.trim() ||
      catFormData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const newCat: PostCategory = {
      id: `cat-${Date.now()}`,
      name: catFormData.name.trim(),
      slug: newSlug,
      description: catFormData.description.trim() || 'Custom created topic category.',
    };

    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully.`);
    setCatFormData({ name: '', slug: '', description: '' });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast(`Category "${name}" deleted.`);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.refNumber && p.refNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-200">
      {/* Top Banner Navigation between the 3 Views */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2C2F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
              <Pin className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {subView === 'new'
                ? editingPostId
                  ? 'Edit Post'
                  : 'Add New Post (নতুন পোস্ট যোগ করুন)'
                : subView === 'categories'
                ? 'Categories'
                : 'All Posts'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {subView === 'new'
              ? 'টাইটেল, রেফারেন্স নম্বর, একাধিক ছবি গ্যালারি, বিস্তারিত বিবরণ ও পিডিএফ ডকুমেন্ট আপলোড করুন।'
              : subView === 'categories'
              ? 'Organize your articles and corporate releases with taxonomy categories.'
              : 'Manage published posts, drafts, authors, reference numbers, and attachments.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              handleResetForm();
              onSwitchSubView('new');
            }}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subView === 'new' && !editingPostId
                ? 'bg-[#0284c7] text-white shadow-md'
                : 'bg-[#1E2228] hover:bg-[#2A2E36] text-gray-200 hover:text-white border border-[#343942]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Add New Post</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchSubView('all')}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subView === 'all'
                ? 'bg-[#0284c7] text-white shadow-md'
                : 'bg-[#1E2228] hover:bg-[#2A2E36] text-gray-200 hover:text-white border border-[#343942]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-gray-300" />
            <span>All Posts ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchSubView('categories')}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subView === 'categories'
                ? 'bg-[#0284c7] text-white shadow-md'
                : 'bg-[#1E2228] hover:bg-[#2A2E36] text-gray-200 hover:text-white border border-[#343942]'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: ADD NEW POST / EDIT POST (WITH ALL 5 REQUESTED OPTIONS)
         ========================================================================= */}
      {subView === 'new' && (
        <form onSubmit={handleSavePost} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: 
              1. Title (add tytel)
              2. Reference Number (refarence number)
              3. Description (ad description)
              4. Add Picture - Unlimited multiple images (add pitcure)
              5. PDF & Document Pic Upload (pdf pic upload er option)
          */}
          <div className="lg:col-span-2 space-y-5">
            {/* OPTION 1: ADD TITLE (add tytel) */}
            <div className="bg-[#181A1E] p-4 sm:p-5 rounded-xl border border-[#2B2E35] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
                  <span>Post Title (টাইটেল যোগ করুন)</span>
                  <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {formData.title.length} characters
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title here (যেমন: BHP Expands Operations in Western Australia)..."
                className="w-full bg-[#101114] border border-[#31353E] focus:border-[#0284c7] rounded-lg px-4 py-3 text-base text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284c7] transition-all placeholder:text-gray-500"
              />
            </div>

            {/* OPTION 2: REFERENCE NUMBER (refarence number) */}
            <div className="bg-[#181A1E] p-4 sm:p-5 rounded-xl border border-[#2B2E35] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reference Number (রেফারেন্স নম্বর)</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateRef}
                  className="text-[11px] text-[#38bdf8] hover:text-[#7dd3fc] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Auto Generate Ref</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-mono text-xs">
                  REF:
                </div>
                <input
                  type="text"
                  value={formData.refNumber}
                  onChange={(e) => setFormData({ ...formData, refNumber: e.target.value })}
                  placeholder="e.g. BHP-REF-2026-0089 or Notice/Circular Number"
                  className="w-full bg-[#101114] border border-[#31353E] focus:border-[#0284c7] rounded-lg pl-14 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#0284c7] transition-all placeholder:text-gray-500"
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Official document or press circular tracking number for audits and search.
              </p>
            </div>

            {/* OPTION 3: ADD PICTURES (Multiple Pictures Support - unlimited) */}
            <div className="bg-[#181A1E] p-4 sm:p-5 rounded-xl border border-[#2B2E35] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#38bdf8]" />
                  <span>
                    Add Pictures (ছবি আপলোড করুন - একাধিক ছবির সাপোর্ট)
                  </span>
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30">
                  {formData.galleryImages.length} Image(s) Attached
                </span>
              </div>

              {/* Upload Dropzone & Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File picker button */}
                <div>
                  <input
                    type="file"
                    ref={imageFilesInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleImagesUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageFilesInputRef.current?.click()}
                    className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-[#38404D] hover:border-[#0284c7] bg-[#121417] hover:bg-[#16191E] flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
                  >
                    <div className="p-2 rounded-full bg-[#1E2228] group-hover:bg-[#0284c7]/20 text-[#38bdf8] transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#38bdf8]">
                        Click to Upload Photos
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Supports multiple files at once (JPG, PNG, WebP)
                      </div>
                    </div>
                  </button>
                </div>

                {/* Add by Image URL */}
                <div className="p-3.5 bg-[#121417] rounded-xl border border-[#2B2E35] flex flex-col justify-between gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      Or Add Image by URL
                    </label>
                    <input
                      type="url"
                      value={singleImgUrlInput}
                      onChange={(e) => setSingleImgUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#181A1E] border border-[#31353E] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0284c7]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="w-full py-1.5 bg-[#1F242C] hover:bg-[#282F3A] text-gray-200 hover:text-white text-xs font-semibold rounded-lg border border-[#333A44] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Add to Gallery</span>
                  </button>
                </div>
              </div>

              {/* Uploaded Gallery Grid */}
              {formData.galleryImages.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-[#282B33]">
                  <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                    <span>Uploaded Gallery Pictures:</span>
                    <span className="text-[11px] text-gray-400">
                      Click "Set as Cover" to select primary thumbnail
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.galleryImages.map((img, idx) => {
                      const isPrimary = formData.imageUrl === img;
                      return (
                        <div
                          key={idx}
                          className={`relative group rounded-lg overflow-hidden border transition-all ${
                            isPrimary
                              ? 'border-[#0284c7] ring-2 ring-[#0284c7]/40'
                              : 'border-[#31353E] hover:border-gray-400'
                          }`}
                        >
                          <div className="h-24 bg-black/40">
                            <img
                              src={img}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          </div>

                          {/* Index Badge */}
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                            #{idx + 1}
                          </span>

                          {/* Primary Cover Badge */}
                          {isPrimary && (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0284c7] text-white">
                              Cover Image
                            </span>
                          )}

                          {/* Actions on hover */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(img)}
                                className="px-2 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10px] font-bold rounded shadow cursor-pointer"
                                title="Set as Cover"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded shadow cursor-pointer"
                              title="Delete this image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-[#121417] text-center text-xs text-gray-500 border border-[#26282E]">
                  No pictures uploaded yet. Select files or add a URL above.
                </div>
              )}
            </div>

            {/* OPTION 4: ADD DESCRIPTION (ad description) */}
            <div className="bg-[#181A1E] p-4 sm:p-5 rounded-xl border border-[#2B2E35] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Description / Post Body (বিস্তারিত বিবরণ)</span>
                </label>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                  <span>
                    Words:{' '}
                    {
                      formData.content
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length
                    }
                  </span>
                  <span>•</span>
                  <span>{formData.content.length} characters</span>
                </div>
              </div>

              {/* Formatting Helper Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[#2A2E36]">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      content: prev.content + '\n• Key Takeaway / Bullet Point',
                    }))
                  }
                  className="px-2.5 py-1 rounded bg-[#22262E] hover:bg-[#2D333E] text-gray-300 text-xs font-medium cursor-pointer"
                >
                  + Add Bullet
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      content:
                        prev.content +
                        '\n\n### Official Statement:\n"Delivering sustainable mining and community partnership across our global footprints."',
                    }))
                  }
                  className="px-2.5 py-1 rounded bg-[#22262E] hover:bg-[#2D333E] text-gray-300 text-xs font-medium cursor-pointer"
                >
                  + Quote Block
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      content:
                        prev.content +
                        '\n\nFor media enquiries or further documentation, please contact the BHP Media Desk at media.relations@bhp.com',
                    }))
                  }
                  className="px-2.5 py-1 rounded bg-[#22262E] hover:bg-[#2D333E] text-gray-300 text-xs font-medium cursor-pointer"
                >
                  + Contact Note
                </button>
              </div>

              <textarea
                rows={11}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write full article description, corporate release, operational announcement or report details here..."
                className="w-full bg-[#101114] border border-[#31353E] focus:border-[#0284c7] rounded-lg p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0284c7] transition-all leading-relaxed font-sans"
              />
            </div>

            {/* OPTION 5: PDF & DOCUMENT PICTURE UPLOAD (pdf pic upload er option) */}
            <div className="bg-[#181A1E] p-4 sm:p-5 rounded-xl border border-[#2B2E35] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-red-400" />
                  <span>
                    PDF & Document Upload (পিডিএফ ও ডকুমেন্ট আপলোড অপশন)
                  </span>
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  {formData.attachedDocuments.length} Document(s) Attached
                </span>
              </div>

              {/* Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PDF File Picker */}
                <div>
                  <input
                    type="file"
                    ref={pdfFilesInputRef}
                    multiple
                    accept=".pdf, application/pdf, image/*, .doc, .docx"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pdfFilesInputRef.current?.click()}
                    className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-[#4D3838] hover:border-red-500 bg-[#171212] hover:bg-[#201515] flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
                  >
                    <div className="p-2 rounded-full bg-[#261A1A] group-hover:bg-red-500/20 text-red-400 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-red-400">
                        Upload PDF / Document Files
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Supports PDF files, circular scans & document pics
                      </div>
                    </div>
                  </button>
                </div>

                {/* Add PDF by Direct Link */}
                <div className="p-3.5 bg-[#141212] rounded-xl border border-[#352B2B] flex flex-col justify-between gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-300 block">
                      Or Add PDF / Document by URL
                    </label>
                    <input
                      type="text"
                      value={pdfNameInput}
                      onChange={(e) => setPdfNameInput(e.target.value)}
                      placeholder="Document Name (e.g. Annual_Report.pdf)"
                      className="w-full bg-[#181A1E] border border-[#31353E] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <input
                      type="url"
                      value={pdfUrlInput}
                      onChange={(e) => setPdfUrlInput(e.target.value)}
                      placeholder="https://.../document.pdf"
                      className="w-full bg-[#181A1E] border border-[#31353E] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPdfUrl}
                    className="w-full py-1.5 bg-[#261C1C] hover:bg-[#342424] text-red-200 hover:text-white text-xs font-semibold rounded-lg border border-[#442D2D] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-400" />
                    <span>Attach Document Link</span>
                  </button>
                </div>
              </div>

              {/* Attached Documents List */}
              {formData.attachedDocuments.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-[#2B2E35]">
                  <div className="text-xs font-bold text-gray-300">
                    Attached PDF Documents & Scans:
                  </div>
                  <div className="space-y-2">
                    {formData.attachedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#121316] border border-[#2C2F36] hover:border-[#3E434D] transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              doc.type === 'pdf'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30'
                            }`}
                          >
                            <File className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white truncate">
                              {doc.name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                              <span className="uppercase font-mono text-[10px]">{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>{doc.uploadDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {doc.dataUrl && doc.dataUrl !== '#' && (
                            <a
                              href={doc.dataUrl}
                              target="_blank"
                              rel="noreferrer"
                              download={doc.name}
                              className="p-1.5 rounded text-gray-400 hover:text-[#38bdf8] hover:bg-[#1E222A] transition-colors cursor-pointer"
                              title="Download or View Document"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Remove Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-[#121417] text-center text-xs text-gray-500 border border-[#26282E]">
                  No PDF or document files attached yet. Select a file above to attach.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column: Publish Box, Category, Badges, Author */}
          <div className="space-y-5">
            {/* Publish Settings Box */}
            <div className="bg-[#181A1E] rounded-xl border border-[#2B2E35] overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#202328] border-b border-[#2B2E35] font-bold text-xs text-white flex items-center justify-between">
                <span>Publish Settings</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1 font-semibold">Post Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })
                    }
                    className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-white font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Published">Published (লাইভ প্রকাশিত)</option>
                    <option value="Draft">Draft (খসড়া হিসেবে সংরক্ষণ)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-semibold">Publication Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-semibold">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-semibold">
                    Tags / Badges (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.badges}
                    onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                    placeholder="e.g. NEWS, BHP PRESS, 2026"
                    className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 font-semibold">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 4 min read"
                    className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#2A2D33] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-3 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#25282E] transition-colors cursor-pointer text-xs"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingPostId ? 'Update Post' : 'Publish Post'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Box */}
            <div className="bg-[#181A1E] rounded-xl border border-[#2B2E35] overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#202328] border-b border-[#2B2E35] font-bold text-xs text-white flex items-center justify-between">
                <span>Categories (ক্যাটাগরি)</span>
                <button
                  type="button"
                  onClick={() => onSwitchSubView('categories')}
                  className="text-[11px] text-[#38bdf8] hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-52 overflow-y-auto">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2.5 text-xs text-gray-200 cursor-pointer hover:text-white p-1 rounded hover:bg-[#202227]"
                  >
                    <input
                      type="radio"
                      name="post-category"
                      checked={formData.category === cat.name}
                      onChange={() => setFormData({ ...formData, category: cat.name })}
                      className="text-[#0284c7] focus:ring-0"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Primary Cover Image Preview */}
            <div className="bg-[#181A1E] rounded-xl border border-[#2B2E35] overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#202328] border-b border-[#2B2E35] font-bold text-xs text-white flex items-center justify-between">
                <span>Primary Cover Preview</span>
                <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="p-4 space-y-3">
                {formData.imageUrl || formData.galleryImages[0] ? (
                  <div className="h-36 rounded-lg overflow-hidden border border-[#31353E] relative group">
                    <img
                      src={formData.imageUrl || formData.galleryImages[0]}
                      alt="Featured Cover"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                      Selected Cover
                    </div>
                  </div>
                ) : (
                  <div className="h-28 rounded-lg bg-[#121417] border border-dashed border-[#2B2E35] flex items-center justify-center text-xs text-gray-500">
                    No cover image selected
                  </div>
                )}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1 font-semibold">
                    Direct Cover URL Override
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          VIEW 2: ALL POSTS TABLE (WITH REF NO, PICS & PDF COUNTS)
         ========================================================================= */}
      {subView === 'all' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#181A1E] p-3.5 rounded-xl border border-[#2B2E35] flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title, ref number or author..."
                className="w-full bg-[#101114] border border-[#31353E] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0284c7]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Drafts Only</option>
              </select>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-[#181A1E] rounded-xl border border-[#2B2E35] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1F2227] text-gray-400 uppercase font-bold text-[11px] border-b border-[#2C2F36]">
                  <tr>
                    <th className="py-3 px-4">Title & Ref Number</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Attachments</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26282E]">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-gray-400">
                        No posts found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => {
                      const picCount = post.galleryImages?.length || (post.imageUrl ? 1 : 0);
                      const docCount = post.attachedDocuments?.length || 0;

                      return (
                        <tr key={post.id} className="hover:bg-[#1E2126] transition-colors group">
                          {/* Title & Preview */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-11 rounded-md overflow-hidden bg-black/40 border border-[#31353E] shrink-0 relative">
                                <img
                                  src={post.imageUrl || post.galleryImages?.[0]}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=120&q=80';
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="font-semibold text-white text-xs group-hover:text-[#38bdf8] transition-colors line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                  {post.refNumber && (
                                    <span className="font-mono text-[#38bdf8] bg-[#0284c7]/15 px-1.5 py-0.2 rounded text-[10px] font-semibold border border-[#0284c7]/30">
                                      #{post.refNumber}
                                    </span>
                                  )}
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                      post.status === 'Published'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}
                                  >
                                    {post.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#272B33] text-[#38bdf8] font-medium text-[11px]">
                              {post.category}
                            </span>
                          </td>

                          {/* Attachments: Pictures and PDF badges */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              {picCount > 0 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1A222E] text-[#38bdf8] text-[10px] font-semibold border border-[#2B3B52]">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>{picCount} Pics</span>
                                </span>
                              )}
                              {docCount > 0 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#2B1B1B] text-red-300 text-[10px] font-semibold border border-[#4D2E2E]">
                                  <FileText className="w-3 h-3" />
                                  <span>{docCount} PDF</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Author */}
                          <td className="py-3 px-4 text-gray-300 font-medium">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span className="truncate max-w-[120px]">{post.author}</span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                            {post.date}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewingPost(post)}
                                className="p-1.5 rounded text-gray-400 hover:text-[#38bdf8] hover:bg-[#2C3038] transition-colors cursor-pointer"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(post)}
                                className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#2C3038] transition-colors cursor-pointer"
                                title="Edit post"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id, post.title)}
                                className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                title="Delete post"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: CATEGORIES MANAGEMENT
         ========================================================================= */}
      {subView === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Add New Category Form */}
          <div className="bg-[#181A1E] p-5 rounded-xl border border-[#2B2E35] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#38bdf8]" />
              <span>Add New Category</span>
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  placeholder="e.g. Clean Energy Transition"
                  className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#0284c7]"
                />
                <span className="text-[10px] text-gray-500 block mt-1">
                  The name is how it appears on your site.
                </span>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Slug</label>
                <input
                  type="text"
                  value={catFormData.slug}
                  onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                  placeholder="e.g. clean-energy-transition"
                  className="w-full bg-[#101114] border border-[#31353E] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#0284c7]"
                />
                <span className="text-[10px] text-gray-500 block mt-1">
                  URL-friendly version of the name (lowercase, hyphens).
                </span>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  placeholder="Brief description of this topic category..."
                  className="w-full bg-[#101114] border border-[#31353E] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#0284c7]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </form>
          </div>

          {/* Right Column: Categories Table */}
          <div className="md:col-span-2 bg-[#181A1E] rounded-xl border border-[#2B2E35] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#1F2227] border-b border-[#2C2F36] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Existing Categories ({categories.length})
              </span>
              <span className="text-[11px] text-gray-400">Total taxonomy topics</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#141517] text-gray-400 uppercase font-bold text-[10px] border-b border-[#26282E]">
                  <tr>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Slug</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-center">Posts Count</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26282E]">
                  {categories.map((cat) => {
                    const postCount = posts.filter((p) => p.category === cat.name).length;
                    return (
                      <tr key={cat.id} className="hover:bg-[#1E2126] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-amber-400" />
                            <span>{cat.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">
                          {cat.slug}
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-[11px] max-w-[200px] truncate">
                          {cat.description}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#38bdf8]">
                          {postCount}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PREVIEW POST MODAL (SHOWS REF NO, FULL TEXT, PICTURES & PDFS)
         ========================================================================= */}
      {previewingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#181A1E] border border-[#2B2E35] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#2A2E36]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#0284c7]/20 text-[#38bdf8] font-mono text-xs font-bold border border-[#0284c7]/40">
                    #{previewingPost.refNumber || 'N/A'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#272B33] text-gray-300 text-xs">
                    {previewingPost.category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {previewingPost.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>Author: {previewingPost.author}</span>
                  <span>•</span>
                  <span>Date: {previewingPost.date}</span>
                  <span>•</span>
                  <span>Status: {previewingPost.status}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingPost(null)}
                className="p-2 rounded-lg bg-[#22252C] hover:bg-[#2C3038] text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Post Description / Content
              </h4>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line bg-[#101114] p-4 rounded-xl border border-[#26282E]">
                {previewingPost.content || 'No content written.'}
              </p>
            </div>

            {/* Pictures Gallery */}
            {previewingPost.galleryImages && previewingPost.galleryImages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>
                    Uploaded Pictures Gallery ({previewingPost.galleryImages.length})
                  </span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previewingPost.galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden border border-[#31353E] h-28 bg-black/40 relative group"
                    >
                      <img
                        src={img}
                        alt={`Post gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/70 text-white font-mono">
                        #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attached PDFs */}
            {previewingPost.attachedDocuments &&
              previewingPost.attachedDocuments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-red-400" />
                    <span>
                      Attached PDF Documents ({previewingPost.attachedDocuments.length})
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {previewingPost.attachedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#101114] border border-[#2B2E35]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-red-500/20 text-red-400">
                            <File className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{doc.name}</div>
                            <div className="text-[11px] text-gray-400">
                              {doc.size} • {doc.uploadDate}
                            </div>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Protected (Download Disabled)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Close Button */}
            <div className="pt-3 border-t border-[#2A2E36] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewingPost(null)}
                className="px-4 py-2 bg-[#22252C] hover:bg-[#2C3038] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
