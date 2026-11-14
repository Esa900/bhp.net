import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Building,
  User,
  ShieldCheck,
  Eye,
  X,
  MapPin,
  Calendar,
  Sparkles,
  Tag,
  Layers,
  Upload,
  File,
  Paperclip,
  ArrowRight,
  Hash,
  DollarSign,
  Briefcase,
  ArrowLeft,
  Cloud,
} from 'lucide-react';
import { AttachedDoc } from '../../types';
import { CanadaDocumentRecord, CanadaMenuItemConfig, CanadaCategoryType } from '../../types/canada';
import {
  getStoredCanadaDocuments,
  upsertCanadaDocumentAsync,
  addAttachedDocToCanadaAsync,
  deleteCanadaDocumentAsync,
  deleteAllCanadaDocumentsAsync,
  syncCanadaDocumentsFromServer,
  CANADA_DOCUMENTS_UPDATED_EVENT,
  getStoredCanadaMenuConfigs,
  addStoredCanadaMenuConfig,
  updateStoredCanadaMenuConfig,
  deleteStoredCanadaMenuConfig,
  resetStoredCanadaMenuConfigs,
  syncCanadaMenuConfigsFromServer,
  CANADA_MENU_CONFIGS_UPDATED_EVENT,
} from '../../utils/canadaStorage';
import { uploadBinaryDocument, uploadDataUrlDocument, inferDocumentType, formatFileSize } from '../../utils/fileUpload';
import {
  BHP_FIREBASE_AUTH_EVENT,
  isFirebaseAdminReady,
  signInWithFirebaseGoogle,
} from '../../utils/firebaseClient';
import {
  FullPdfDocumentViewer,
  canadaRecordToUnifiedDoc,
} from '../FullPdfDocumentViewer';

interface AdminCanadaManagerProps {
  showToast: (msg: string) => void;
}

type CanadaTab = 'add-post' | 'all-posts' | 'categories';

export const AdminCanadaManager: React.FC<AdminCanadaManagerProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<CanadaTab>('all-posts');

  // -------------------------------------------------------------
  // Categories (Canada right 3-line drawer menu items)
  // -------------------------------------------------------------
  const [menuConfigs, setMenuConfigs] = useState<CanadaMenuItemConfig[]>(() => getStoredCanadaMenuConfigs());
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<CanadaMenuItemConfig | null>(null);
  const [catFormData, setCatFormData] = useState<{
    mainTitle: string;
    subMenu: string;
    fieldLabel: string;
    searchFieldKey: string;
    placeholder: string;
    samplePlaceholder: string;
    description: string;
  }>({
    mainTitle: '',
    subMenu: '',
    fieldLabel: 'TIN / Reference Number',
    searchFieldKey: 'tinOrRef',
    placeholder: 'Enter Reference Number (e.g. REF-CA-928410)...',
    samplePlaceholder: 'REF-CA-928410',
    description: 'Verify official Canada documentation and employment authorization.',
  });

  // -------------------------------------------------------------
  // Canada Documents / Posts Data
  // -------------------------------------------------------------
  const [documents, setDocuments] = useState<CanadaDocumentRecord[]>(() => getStoredCanadaDocuments());
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('ALL');
  const [selectedDocForView, setSelectedDocForView] = useState<CanadaDocumentRecord | null>(null);

  // Form State for Add / Edit Canada Post
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docForm, setDocForm] = useState<{
    categoryType: CanadaCategoryType;
    mainTitle: string;
    subMenu: string;
    candidateName: string;
    passportNumber: string;
    nationality: string;
    dateOfBirth: string;
    tinOrRef: string;
    idNumber: string;
    verificationIdNo: string;
    transitionIdNo: string;
    referenceNo: string;
    jobTitle: string;
    employerName: string;
    workLocation: string;
    hourlyWageOrSalary: string;
    workingHours: string;
    status: 'Approved' | 'Pending' | 'Verified' | 'Under Review';
    issueDate: string;
    expiryDate: string;
    officialDocNumber: string;
    lmiaNumber: string;
    notes: string;
    candidatePhotoUrl?: string;
    documentFileName?: string;
    documentFileUrl?: string;
    attachedDocuments: AttachedDoc[];
  }>({
    categoryType: 'work-permit-docs',
    mainTitle: 'Canada Work Permit Documents',
    subMenu: 'Employment Application Document See',
    candidateName: '',
    passportNumber: '',
    nationality: 'Bangladeshi',
    dateOfBirth: '1993-01-01',
    candidatePhotoUrl: '',
    tinOrRef: '',
    idNumber: '',
    verificationIdNo: '',
    transitionIdNo: '',
    referenceNo: '',
    jobTitle: 'Industrial Electrician',
    employerName: 'BHP Canada Operations Ltd',
    workLocation: 'Saskatoon, Saskatchewan, Canada',
    hourlyWageOrSalary: '$38.50 CAD / hr',
    workingHours: '40 hrs / week',
    status: 'Verified',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2028-12-31',
    officialDocNumber: '',
    lmiaNumber: '',
    notes: 'Verified and authorized by IRCC and Canadian sponsor.',
    attachedDocuments: [],
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Quick Add PDF Modal State (For "All Posts" direct addition with section choice)
  const [quickPdfDoc, setQuickPdfDoc] = useState<CanadaDocumentRecord | null>(null);
  const [quickSectionTag, setQuickSectionTag] = useState<string>('Work Permit Documents (ওয়ার্ক পারমিট)');
  const [customSectionTag, setCustomSectionTag] = useState<string>('');
  const [quickIsPrimary, setQuickIsPrimary] = useState<boolean>(true);
  const [quickSelectedFiles, setQuickSelectedFiles] = useState<{ name: string; size: string; type: 'pdf' | 'image' | 'other'; dataUrl: string; rawFile?: File }[]>([]);
  const [isUploadingQuickPdf, setIsUploadingQuickPdf] = useState<boolean>(false);
  const [quickUploadError, setQuickUploadError] = useState<string | null>(null);
  const [quickUploadStatus, setQuickUploadStatus] = useState<string | null>(null);
  const [cloudReady, setCloudReady] = useState<boolean>(() => isFirebaseAdminReady());
  const [isConnectingCloud, setIsConnectingCloud] = useState<boolean>(false);
  const quickFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleConnectGoogleCloud = async () => {
    setIsConnectingCloud(true);
    try {
      const res = await signInWithFirebaseGoogle();
      setCloudReady(res.isAdmin);
      if (res.isAdmin) {
        setQuickUploadError(null);
        showToast(`Cloud Sync Connected (${res.user.email})! You can now upload PDFs from any device.`);
        syncCanadaDocumentsFromServer().then(setDocuments).catch(() => {});
      } else {
        showToast(`Signed in as ${res.user.email}. Use admin Google account (mdesaali391@gmail.com) for cloud writes.`);
      }
    } catch (err: any) {
      showToast(`Google Sign-In error: ${err?.message || 'Popup closed or blocked'}`);
    } finally {
      setIsConnectingCloud(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocForm((prev) => ({
        ...prev,
        candidatePhotoUrl: reader.result as string,
      }));
      showToast(`Candidate photo "${file.name}" uploaded successfully.`);
    };
    reader.readAsDataURL(file);
  };

  // Sync event listeners & initial server fetch
  useEffect(() => {
    syncCanadaDocumentsFromServer().then(setDocuments).catch(() => {});
    syncCanadaMenuConfigsFromServer().then(setMenuConfigs).catch(() => {});

    const handleDocsUpdate = () => {
      setDocuments(getStoredCanadaDocuments());
    };
    const handleConfigsUpdate = () => {
      setMenuConfigs(getStoredCanadaMenuConfigs());
    };
    const handleStorage = () => {
      setDocuments(getStoredCanadaDocuments());
      setMenuConfigs(getStoredCanadaMenuConfigs());
    };
    const handleFirebaseAuth = () => {
      const ready = isFirebaseAdminReady();
      setCloudReady(ready);
      if (ready) {
        syncCanadaDocumentsFromServer().then(setDocuments).catch(() => {});
        syncCanadaMenuConfigsFromServer().then(setMenuConfigs).catch(() => {});
      }
    };

    window.addEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleDocsUpdate);
    window.addEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleConfigsUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener(BHP_FIREBASE_AUTH_EVENT, handleFirebaseAuth);
    return () => {
      window.removeEventListener(CANADA_DOCUMENTS_UPDATED_EVENT, handleDocsUpdate);
      window.removeEventListener(CANADA_MENU_CONFIGS_UPDATED_EVENT, handleConfigsUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(BHP_FIREBASE_AUTH_EVENT, handleFirebaseAuth);
    };
  }, []);

  // Update default category when configs change
  useEffect(() => {
    if (menuConfigs.length > 0 && !docForm.categoryType) {
      setDocForm((prev) => ({
        ...prev,
        categoryType: menuConfigs[0].id,
        mainTitle: menuConfigs[0].mainTitle,
        subMenu: menuConfigs[0].subMenu,
      }));
    }
  }, [menuConfigs]);

  // Intercept Admin Back press and ESC key so user is NEVER kicked out of Admin
  useEffect(() => {
    const handleAdminBack = (e: Event) => {
      if (selectedDocForView) {
        e.preventDefault();
        setSelectedDocForView(null);
      } else if (isCatModalOpen) {
        e.preventDefault();
        setIsCatModalOpen(false);
      } else if (activeTab === 'add-post') {
        e.preventDefault();
        setActiveTab('all-posts');
        setEditingDocId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedDocForView) {
          e.stopPropagation();
          setSelectedDocForView(null);
        } else if (isCatModalOpen) {
          e.stopPropagation();
          setIsCatModalOpen(false);
        } else if (activeTab === 'add-post') {
          e.stopPropagation();
          setActiveTab('all-posts');
          setEditingDocId(null);
        }
      }
    };

    window.addEventListener('bhp_admin_back_press', handleAdminBack);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('bhp_admin_back_press', handleAdminBack);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDocForView, isCatModalOpen, activeTab]);

  // When category changes in form, sync title & subMenu
  const handleCategorySelectChange = (catId: string) => {
    const cfg = menuConfigs.find((c) => c.id === catId) || menuConfigs[0];
    setDocForm((prev) => ({
      ...prev,
      categoryType: catId,
      mainTitle: cfg.mainTitle,
      subMenu: cfg.subMenu,
    }));
  };

  // -------------------------------------------------------------
  // POST ACTIONS (Add / Edit / Delete)
  // -------------------------------------------------------------
  const handleOpenAddPost = () => {
    setEditingDocId(null);
    const firstCfg = menuConfigs[0] || {
      id: 'work-permit-docs',
      mainTitle: 'Canada Work Permit Documents',
      subMenu: 'Employment Application Document See',
    };
    setDocForm({
      categoryType: firstCfg.id,
      mainTitle: firstCfg.mainTitle,
      subMenu: firstCfg.subMenu,
      candidateName: '',
      passportNumber: '',
      nationality: 'Bangladeshi',
      dateOfBirth: '1993-01-01',
      candidatePhotoUrl: '',
      tinOrRef: `REF-CA-${Math.floor(100000 + Math.random() * 900000)}`,
      idNumber: `CA-ED-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationIdNo: `VRF-CAN-${Math.floor(10000 + Math.random() * 90000)}`,
      transitionIdNo: `VFS-CAN-${Math.floor(100000 + Math.random() * 900000)}`,
      referenceNo: `WPD-CAN-${Math.floor(10000 + Math.random() * 90000)}`,
      jobTitle: 'Industrial Electrician',
      employerName: 'BHP Canada Operations Ltd',
      workLocation: 'Saskatoon, Saskatchewan, Canada',
      hourlyWageOrSalary: '$38.50 CAD / hr',
      workingHours: '40 hrs / week',
      status: 'Verified',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2028-12-31',
      officialDocNumber: `IRCC-CAN-${Math.floor(100000 + Math.random() * 900000)}`,
      lmiaNumber: `LMIA-CAN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Verified and authorized by IRCC and Canadian sponsor.',
      attachedDocuments: [],
    });
    setActiveTab('add-post');
  };

  const handleOpenEditPost = (doc: CanadaDocumentRecord) => {
    setEditingDocId(doc.id);

    // Collect all existing attached documents, preserving backward-compatibility with single documentFileUrl
    const initialAttached: AttachedDoc[] = [];
    if (doc.attachedDocuments && doc.attachedDocuments.length > 0) {
      initialAttached.push(...doc.attachedDocuments);
    } else if (doc.documentFileUrl && doc.documentFileUrl !== '#') {
      initialAttached.push({
        id: `ca-attached-${doc.id}-1`,
        name: doc.documentFileName || 'Canada Official Document.pdf',
        size: 'Official PDF Document',
        type: 'pdf',
        dataUrl: doc.documentFileUrl,
        uploadDate: doc.issueDate || new Date().toISOString().split('T')[0],
      });
    }

    setDocForm({
      categoryType: doc.categoryType,
      mainTitle: doc.mainTitle,
      subMenu: doc.subMenu,
      candidateName: doc.candidateName,
      passportNumber: doc.passportNumber,
      nationality: doc.nationality,
      dateOfBirth: doc.dateOfBirth || '1993-01-01',
      candidatePhotoUrl: doc.candidatePhotoUrl || '',
      tinOrRef: doc.tinOrRef || '',
      idNumber: doc.idNumber || '',
      verificationIdNo: doc.verificationIdNo || '',
      transitionIdNo: doc.transitionIdNo || '',
      referenceNo: doc.referenceNo || '',
      jobTitle: doc.jobTitle,
      employerName: doc.employerName,
      workLocation: doc.workLocation,
      hourlyWageOrSalary: doc.hourlyWageOrSalary || '$38.50 CAD / hr',
      workingHours: doc.workingHours || '40 hrs / week',
      status: doc.status,
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate,
      officialDocNumber: doc.officialDocNumber || '',
      lmiaNumber: doc.lmiaNumber || '',
      notes: doc.notes || '',
      documentFileName: doc.documentFileName,
      documentFileUrl: doc.documentFileUrl,
      attachedDocuments: initialAttached,
    });
    setActiveTab('add-post');
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const candidateName = docForm.candidateName.trim() || 'BHP Canada Authorized Client';
    const passportNumber = docForm.passportNumber.trim() || `CAN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Ensure all reference numbers have valid searchable identifiers
    const baseRef =
      docForm.tinOrRef?.trim() ||
      docForm.referenceNo?.trim() ||
      docForm.idNumber?.trim() ||
      docForm.verificationIdNo?.trim() ||
      `REF-CA-${Math.floor(100000 + Math.random() * 900000)}`;

    const normalizedAttached = docForm.attachedDocuments.map((att) => ({
      ...att,
      sectionTag: att.sectionTag || docForm.mainTitle || 'Work Permit Documents (ওয়ার্ক পারমিট)',
    }));
    const primaryPdf = normalizedAttached[0];

    const postPayload = {
      ...docForm,
      candidateName,
      passportNumber,
      tinOrRef: docForm.tinOrRef?.trim() || baseRef,
      referenceNo: docForm.referenceNo?.trim() || baseRef,
      idNumber: docForm.idNumber?.trim() || baseRef,
      verificationIdNo: docForm.verificationIdNo?.trim() || baseRef,
      transitionIdNo: docForm.transitionIdNo?.trim() || baseRef,
      documentFileName: primaryPdf?.name || '',
      documentFileUrl: primaryPdf?.dataUrl || '',
      attachedDocuments: normalizedAttached,
    };

    const existingDoc = editingDocId ? documents.find((d) => d.id === editingDocId) : null;
    const recordToSave: CanadaDocumentRecord = editingDocId
      ? {
          ...(existingDoc || {}),
          ...postPayload,
          id: editingDocId,
          createdAt: existingDoc?.createdAt || new Date().toISOString(),
        }
      : {
          ...postPayload,
          id: `ca-doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: new Date().toISOString(),
        };

    const syncedDocs = await upsertCanadaDocumentAsync(recordToSave);
    if (editingDocId) {
      showToast(`Canada post for "${candidateName}" updated with ${normalizedAttached.length} PDF(s).`);
    } else {
      showToast(`Canada post published with ${normalizedAttached.length} PDF(s)! Searchable Ref: "${postPayload.tinOrRef}"`);
    }

    setDocuments(syncedDocs);
    setEditingDocId(null);
    setActiveTab('all-posts');
  };

  const handleDeletePost = async (id: string, name: string) => {
    const synced = await deleteCanadaDocumentAsync(id);
    setDocuments(synced);
    showToast(`Canada post for "${name}" deleted.`);
  };

  const handleDeleteAllCanadaPosts = async () => {
    if (window.confirm('Are you sure you want to delete all Canada posts? All items will be permanently removed.')) {
      await deleteAllCanadaDocumentsAsync();
      setDocuments([]);
      showToast('All Canada posts removed successfully.');
    }
  };

  // Multi-PDF and document upload handler (uploads binary to /api/upload-raw with fallback and auto-persists when editing)
  const handleMultiPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;

    const filesList = Array.from(files) as File[];
    const newDocs: AttachedDoc[] = [];
    const defaultSection = docForm.mainTitle || 'Work Permit Documents (ওয়ার্ক পারমিট)';
    let lastError = '';

    showToast(`Uploading ${filesList.length} PDF file(s)...`);

    try {
      for (const file of filesList) {
        const docType = inferDocumentType(file.name, file.type);
        try {
          const uploaded = await uploadBinaryDocument(file, docType);
          const newDoc: AttachedDoc = {
            id: `ca-pdf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: uploaded.fileName || file.name,
            size: uploaded.sizeStr || formatFileSize(file.size),
            type: uploaded.type,
            dataUrl: uploaded.fileUrl,
            sectionTag: defaultSection,
            uploadDate: new Date().toISOString().split('T')[0],
          };
          newDocs.push(newDoc);
        } catch (uploadErr: any) {
          console.error('Edit-form upload error:', uploadErr);
          lastError = uploadErr?.message || `Failed to upload ${file.name}`;
        }
      }

      if (newDocs.length > 0) {
        // If editing an existing saved client, persist newly uploaded PDFs immediately to central database (Firestore + Express)
        const editingRecord = editingDocId ? documents.find((d) => d.id === editingDocId) : null;
        if (editingDocId && editingRecord) {
          const targetRef =
            docForm.tinOrRef?.trim() ||
            docForm.referenceNo?.trim() ||
            docForm.idNumber?.trim() ||
            editingRecord.tinOrRef ||
            editingDocId;
          let latestDocs: CanadaDocumentRecord[] | null = null;
          for (const nd of newDocs) {
            try {
              latestDocs = await addAttachedDocToCanadaAsync({
                docId: editingDocId,
                referenceNo: targetRef,
                candidateName: docForm.candidateName || editingRecord.candidateName,
                passportNumber: docForm.passportNumber || editingRecord.passportNumber,
                fullDocument: { ...editingRecord, ...docForm, id: editingDocId },
                doc: nd,
              });
            } catch (err: any) {
              console.warn('Auto-persist edit upload error:', err);
              lastError = err?.message || lastError;
            }
          }
          if (latestDocs) {
            setDocuments(latestDocs);
          }
        }

        setDocForm((prev) => {
          const updated = [...prev.attachedDocuments, ...newDocs];
          showToast(
            editingDocId
              ? `Added & saved ${newDocs.length} PDF(s) to database! Total: ${updated.length} PDFs.`
              : `Attached ${newDocs.length} PDF(s)! Total: ${updated.length} PDFs (Click Publish/Save to finalize)`
          );
          return {
            ...prev,
            attachedDocuments: updated,
            documentFileName: updated[0]?.name || prev.documentFileName,
            documentFileUrl: updated[0]?.dataUrl || prev.documentFileUrl,
          };
        });
      } else if (lastError) {
        showToast(`Upload failed: ${lastError}`);
      }
    } finally {
      if (inputEl) inputEl.value = '';
    }
  };

  const handleRemoveAttachedDoc = (docId: string) => {
    setDocForm((prev) => {
      const updated = prev.attachedDocuments.filter((d) => d.id !== docId);
      return {
        ...prev,
        attachedDocuments: updated,
        documentFileName: updated[0]?.name || '',
        documentFileUrl: updated[0]?.dataUrl || '',
      };
    });
    showToast('Document removed.');
  };

  // Quick PDF Add Handlers (All Posts table quick action)
  const handleOpenQuickAddPdf = (doc: CanadaDocumentRecord) => {
    setQuickPdfDoc(doc);
    setQuickSectionTag('Work Permit Documents (ওয়ার্ক পারমিট)');
    setCustomSectionTag('');
    setQuickIsPrimary(true);
    setQuickSelectedFiles([]);
    setQuickUploadError(null);
    setQuickUploadStatus(null);
  };

  const handleQuickFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;
    const filesList = Array.from(files) as File[];
    setQuickUploadError(null);

    const immediateFiles = filesList.map((file) => {
      const docType = inferDocumentType(file.name, file.type);
      const sizeStr = formatFileSize(file.size);

      return {
        name: file.name,
        size: sizeStr,
        type: docType,
        dataUrl: '',
        rawFile: file,
      };
    });

    setQuickSelectedFiles((prev) => [...prev, ...immediateFiles]);
    setTimeout(() => {
      if (inputEl) inputEl.value = '';
    }, 0);
  };

  const handleRemoveQuickSelectedFile = (index: number) => {
    setQuickSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveQuickAddPdf = async () => {
    if (!quickPdfDoc) return;
    if (quickSelectedFiles.length === 0) {
      const msg = 'Please select at least one PDF or document to upload.';
      setQuickUploadError(msg);
      showToast(msg);
      return;
    }

    setIsUploadingQuickPdf(true);
    setQuickUploadError(null);
    setQuickUploadStatus('Preparing upload...');

    const finalSection =
      quickSectionTag === 'Other Custom Section' && customSectionTag.trim()
        ? customSectionTag.trim()
        : quickSectionTag;

    const targetRef =
      quickPdfDoc.tinOrRef ||
      quickPdfDoc.referenceNo ||
      quickPdfDoc.idNumber ||
      quickPdfDoc.id;

    try {
      let latestServerDocs: CanadaDocumentRecord[] | null = null;
      const total = quickSelectedFiles.length;

      for (let i = 0; i < total; i++) {
        const f = quickSelectedFiles[i];
        setQuickUploadStatus(`Uploading ${i + 1} of ${total}: ${f.name}...`);

        let uploadedUrl = f.dataUrl || '';
        let resolvedType: 'pdf' | 'image' | 'other' = f.type;
        let resolvedName = f.name;
        let resolvedSize = f.size;

        if (f.rawFile) {
          const uploaded = await uploadBinaryDocument(f.rawFile, f.type);
          uploadedUrl = uploaded.fileUrl;
          resolvedType = uploaded.type;
          resolvedName = uploaded.fileName || f.name;
          resolvedSize = uploaded.sizeStr || f.size;
        } else if (uploadedUrl && uploadedUrl.startsWith('data:')) {
          uploadedUrl = await uploadDataUrlDocument(f.name, uploadedUrl, f.type);
        }

        if (!uploadedUrl) {
          throw new Error(`No valid file content for "${f.name}"`);
        }

        setQuickUploadStatus(`Saving ${i + 1} of ${total} to cloud database...`);

        const newDoc: AttachedDoc = {
          id: `att-ca-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: resolvedName,
          size: resolvedSize,
          type: resolvedType,
          dataUrl: uploadedUrl,
          sectionTag: finalSection,
          isPrimary: i === 0 ? quickIsPrimary : false,
          uploadDate: new Date().toISOString().split('T')[0],
        };

        latestServerDocs = await addAttachedDocToCanadaAsync({
          docId: quickPdfDoc.id,
          referenceNo: targetRef,
          candidateName: quickPdfDoc.candidateName,
          passportNumber: quickPdfDoc.passportNumber,
          fullDocument: quickPdfDoc,
          doc: newDoc,
        });
        if (latestServerDocs) {
          setDocuments(latestServerDocs);
        }
      }

      if (latestServerDocs) {
        setDocuments(latestServerDocs);
      } else {
        const syncedDocs = await syncCanadaDocumentsFromServer();
        setDocuments(syncedDocs);
      }

      showToast(
        `Added ${quickSelectedFiles.length} PDF(s) to #${targetRef} (${finalSection})! Saved across all devices.`
      );
      setQuickPdfDoc(null);
      setQuickSelectedFiles([]);
      setQuickUploadStatus(null);
    } catch (err: any) {
      console.error('Failed to quick-add PDF:', err);
      const errMsg = err?.message || 'Error uploading PDF to server.';
      setQuickUploadError(errMsg);
      setQuickUploadStatus(null);
      showToast(`Upload failed: ${errMsg}`);
    } finally {
      setIsUploadingQuickPdf(false);
    }
  };

  // -------------------------------------------------------------
  // CATEGORY ACTIONS (Canada right 3-line menu)
  // -------------------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingConfig(null);
    setCatFormData({
      mainTitle: '',
      subMenu: '',
      fieldLabel: 'TIN / Reference Number',
      searchFieldKey: 'tinOrRef',
      placeholder: 'Enter Reference Number (e.g. REF-CA-928410)...',
      samplePlaceholder: 'REF-CA-928410',
      description: 'Verify official Canada documentation and employment authorization.',
    });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cfg: CanadaMenuItemConfig) => {
    setEditingConfig(cfg);
    setCatFormData({
      mainTitle: cfg.mainTitle,
      subMenu: cfg.subMenu,
      fieldLabel: cfg.fieldLabel,
      searchFieldKey: cfg.searchFieldKey,
      placeholder: cfg.placeholder,
      samplePlaceholder: cfg.samplePlaceholder,
      description: cfg.description,
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.mainTitle.trim() || !catFormData.subMenu.trim()) {
      showToast('Error: Main Title and SubMenu are required.');
      return;
    }

    if (editingConfig) {
      updateStoredCanadaMenuConfig(editingConfig.id, catFormData);
      showToast(`Canada category "${catFormData.mainTitle}" updated.`);
    } else {
      addStoredCanadaMenuConfig(catFormData);
      showToast(`New Canada category "${catFormData.mainTitle}" added to right 3-line menu.`);
    }

    setMenuConfigs(getStoredCanadaMenuConfigs());
    setIsCatModalOpen(false);
  };

  const handleDeleteCategory = (id: string, title: string) => {
    deleteStoredCanadaMenuConfig(id);
    setMenuConfigs(getStoredCanadaMenuConfigs());
    showToast(`Canada category "${title}" removed.`);
  };

  const handleResetCategories = () => {
    resetStoredCanadaMenuConfigs();
    setMenuConfigs(getStoredCanadaMenuConfigs());
    showToast('Canada menu categories reset to default.');
  };

  // Filtered lists
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.candidateName.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.passportNumber.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      (doc.tinOrRef && doc.tinOrRef.toLowerCase().includes(docSearchQuery.toLowerCase())) ||
      (doc.idNumber && doc.idNumber.toLowerCase().includes(docSearchQuery.toLowerCase())) ||
      doc.jobTitle.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.mainTitle.toLowerCase().includes(docSearchQuery.toLowerCase());
    const matchesCat = selectedCatFilter === 'ALL' || doc.categoryType === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  const filteredCategories = menuConfigs.filter((c) =>
    c.mainTitle.toLowerCase().includes(catSearchQuery.toLowerCase()) ||
    c.subMenu.toLowerCase().includes(catSearchQuery.toLowerCase()) ||
    c.fieldLabel.toLowerCase().includes(catSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-200">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1C1E23] p-6 rounded-2xl border border-[#2B2F38] shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Canada Operations
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                {documents.length} Posts · {menuConfigs.length} Categories
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Canada Post & Menu Manager (কানাডা ব্যবস্থাপনা)
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
              ডান পাশের ৩ লাইনের মেনুর অপশনগুলো ক্যাটাগরি হিসেবে যুক্ত/রিমুভ করুন এবং কানাডা জব ও পারমিট পোস্ট পাবলিশ করুন।
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
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1E2026]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Post ({documents.length})</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddPost}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'add-post'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
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
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
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
                placeholder="Search candidate, passport, reference ID, job title..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 max-w-[200px] truncate"
              >
                <option value="ALL">All Categories ({documents.length})</option>
                {menuConfigs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.mainTitle}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleOpenAddPost}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Post</span>
              </button>

              {documents.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAllCanadaPosts}
                  className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Delete all Canada posts completely"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete All Posts (সব মুছুন)</span>
                </button>
              )}
            </div>
          </div>

          {/* Posts List */}
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center bg-[#17191E] rounded-xl border border-[#26282E] text-gray-400 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-gray-500" />
              <p className="text-sm font-semibold text-gray-300">No Canada posts found.</p>
              <button
                type="button"
                onClick={handleOpenAddPost}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Canada Post</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[#1C1E23] border border-[#2B2F38] hover:border-red-500/50 rounded-xl p-5 space-y-3.5 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {doc.tinOrRef || doc.idNumber || doc.referenceNo || doc.officialDocNumber || 'DOC-CA'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.status === 'Verified' || doc.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {doc.candidateName}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Passport: <strong className="text-gray-200">{doc.passportNumber}</strong> · {doc.nationality}
                      </p>
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center gap-2">
                      <span className="text-red-400 font-semibold">{doc.mainTitle}</span>
                    </div>

                    <div className="p-2.5 bg-[#141517] rounded-lg border border-[#252830] text-xs space-y-1">
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Position:</span>
                        <strong className="text-white">{doc.jobTitle}</strong>
                      </div>
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Employer:</span>
                        <span className="text-white">{doc.employerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-gray-300">{doc.workLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#272A32] gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDocForView(doc)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenQuickAddPdf(doc)}
                        className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        title="Add New PDF to this client"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New PDF (নতুন পিডিএফ)</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.attachedDocuments && doc.attachedDocuments.length > 0 && (
                        <span className="text-[10px] font-mono font-bold bg-[#141518] text-gray-400 border border-[#2B2F38] px-2 py-0.5 rounded flex items-center gap-1">
                          <Paperclip className="w-3 h-3 text-red-400" />
                          <span>{doc.attachedDocuments.length} PDF</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditPost(doc)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2B2E37] rounded-lg transition-colors cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(doc.id, doc.candidateName)}
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
      {/* 2. ADD / EDIT CANADA POST TAB */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'add-post' && (
        <form onSubmit={handleSavePost} className="bg-[#1C1E23] p-6 rounded-2xl border border-[#2B2F38] space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
            <div>
              <h4 className="font-bold text-base text-white">
                {editingDocId ? 'Edit Canada Post' : 'Add New Canada Post (নতুন কানাডা পোস্ট যোগ করুন)'}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                কানাডা ডান পাশের ৩ লাইনের মেনু ক্যাটাগরি সিলেক্ট করুন এবং প্রার্থীর তথ্য ও ভেরিফিকেশন আইডি প্রদান করুন।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all-posts');
                  setEditingDocId(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#252830] hover:bg-[#323640] text-gray-200 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border border-[#3A3F4C]"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
                <span>← Back to Post List (ফিরে যান)</span>
              </button>
            </div>
          </div>

          {/* Category selection from Canada 3-line menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Canada Category (ডান পাশের ৩ লাইনের মেনু অপশন) <span className="text-red-400">*</span>
              </label>
              <select
                value={docForm.categoryType}
                onChange={(e) => handleCategorySelectChange(e.target.value)}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {menuConfigs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.mainTitle} ({c.subMenu})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Status (স্ট্যাটাস)</label>
              <select
                value={docForm.status}
                onChange={(e) => setDocForm({ ...docForm, status: e.target.value as any })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="Verified">Verified (ভেরিফাইড)</option>
                <option value="Approved">Approved (অনুমোদিত)</option>
                <option value="Pending">Pending (অপেক্ষমান)</option>
                <option value="Under Review">Under Review (পর্যালোচনাধীন)</option>
              </select>
            </div>
          </div>

          {/* Candidate Details */}
          <div className="p-4 bg-[#141517] rounded-xl border border-[#282B33] space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-400" />
              Candidate & Identity Information (প্রার্থীর বিবরণ)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Candidate Full Name (প্রার্থীর নাম)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mohammad Rafiqul Islam"
                  value={docForm.candidateName}
                  onChange={(e) => setDocForm({ ...docForm, candidateName: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Passport Number (পাসপোর্ট নম্বর)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A08934211"
                  value={docForm.passportNumber}
                  onChange={(e) => setDocForm({ ...docForm, passportNumber: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Nationality</label>
                <input
                  type="text"
                  placeholder="e.g. Bangladeshi"
                  value={docForm.nationality}
                  onChange={(e) => setDocForm({ ...docForm, nationality: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Candidate Photo / Picture Upload & URL (প্রার্থীর ছবি যা PDF এ দেখাবে) */}
            <div className="p-3 bg-[#1A1C21] rounded-xl border border-[#2D313A] space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-16 h-20 rounded-lg border-2 border-dashed border-[#444] bg-[#121316] flex items-center justify-center overflow-hidden shrink-0 relative">
                    {docForm.candidatePhotoUrl ? (
                      <img
                        src={docForm.candidatePhotoUrl}
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
                      এই ছবি বা ফটো সরাসরি অফিসিয়াল PDF সার্টিফিকেটে প্রদর্শিত হবে।
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                    id="ca-candidate-photo-upload"
                  />
                  <label
                    htmlFor="ca-candidate-photo-upload"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture (ছবি আপলোড)</span>
                  </label>

                  {docForm.candidatePhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setDocForm({ ...docForm, candidatePhotoUrl: '' })}
                      className="px-2.5 py-1.5 bg-[#252830] hover:bg-[#30333C] text-gray-300 hover:text-red-400 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                  অথবা ছবির লিঙ্ক দিন (Or Paste Image URL):
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or data:image/..."
                  value={docForm.candidatePhotoUrl || ''}
                  onChange={(e) => setDocForm({ ...docForm, candidatePhotoUrl: e.target.value })}
                  className="w-full bg-[#121316] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Reference Numbers matching search keys */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">TIN / Reference Number</label>
                <input
                  type="text"
                  placeholder="REF-CA-928410"
                  value={docForm.tinOrRef}
                  onChange={(e) => setDocForm({ ...docForm, tinOrRef: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Offer ID Number</label>
                <input
                  type="text"
                  placeholder="CA-ED-88412"
                  value={docForm.idNumber}
                  onChange={(e) => setDocForm({ ...docForm, idNumber: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Verification ID / WPD No</label>
                <input
                  type="text"
                  placeholder="VRF-CAN-99420 / WPD-CAN-55102"
                  value={docForm.verificationIdNo || docForm.referenceNo}
                  onChange={(e) =>
                    setDocForm({
                      ...docForm,
                      verificationIdNo: e.target.value,
                      referenceNo: e.target.value,
                    })
                  }
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="p-4 bg-[#141517] rounded-xl border border-[#282B33] space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-red-400" />
              Job & Canadian Employer Authorization (কাজের তথ্য)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Industrial Electrician"
                  value={docForm.jobTitle}
                  onChange={(e) => setDocForm({ ...docForm, jobTitle: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Employer / Sponsor</label>
                <input
                  type="text"
                  placeholder="e.g. BHP Canada Operations Ltd"
                  value={docForm.employerName}
                  onChange={(e) => setDocForm({ ...docForm, employerName: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Work Location</label>
                <input
                  type="text"
                  placeholder="e.g. Saskatoon, Saskatchewan, Canada"
                  value={docForm.workLocation}
                  onChange={(e) => setDocForm({ ...docForm, workLocation: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Hourly Wage / Salary</label>
                <input
                  type="text"
                  placeholder="e.g. $42.50 CAD / hr"
                  value={docForm.hourlyWageOrSalary}
                  onChange={(e) => setDocForm({ ...docForm, hourlyWageOrSalary: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={docForm.issueDate}
                  onChange={(e) => setDocForm({ ...docForm, issueDate: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={docForm.expiryDate}
                  onChange={(e) => setDocForm({ ...docForm, expiryDate: e.target.value })}
                  className="w-full bg-[#1A1C21] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Notes & File Attachment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Notes / Authority Statement</label>
              <textarea
                rows={3}
                placeholder="Employment Application approved under Global Skills Strategy Stream A."
                value={docForm.notes}
                onChange={(e) => setDocForm({ ...docForm, notes: e.target.value })}
                className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-400" />
                  <span>Attached PDF Documents & Scans (পিডিএফ ফাইলসমূহ)</span>
                </label>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
                  {docForm.attachedDocuments.length} PDF{docForm.attachedDocuments.length !== 1 ? 's' : ''} Attached (Up to 8)
                </span>
              </div>

              {/* Prominent Add New PDF Button & Controls */}
              <div className="p-3 bg-[#141517] rounded-xl border border-[#2D313A] space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept=".pdf, application/pdf, image/*"
                  onChange={handleMultiPdfUpload}
                  className="sr-only"
                  id="ca-doc-upload"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <label
                    htmlFor="ca-doc-upload"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-[#FF5500] hover:from-red-500 hover:to-[#FF6B1A] text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-red-600/20 active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>➕ Add New PDF (নতুন পিডিএফ যোগ করুন)</span>
                  </label>
                </div>

                <p className="text-[11px] text-gray-400 leading-normal">
                  💡 <strong>Edit অপশন থেকে একাধিক পিডিএফ যুক্ত করুন:</strong> পূর্বে পোস্ট করা ডকুমেন্টে Edit-এ গিয়ে 'Add New PDF' চেপে ৭ বা ৮ টি পর্যন্ত পিডিএফ ফাইল বা স্ক্যান কপি যোগ করতে পারবেন।
                </p>

                {/* List of Attached PDFs */}
                {docForm.attachedDocuments.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-[#23262E]">
                    {docForm.attachedDocuments.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#191C22] border border-[#2B303C] hover:border-red-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] font-bold shrink-0">
                            PDF 0{idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                              {doc.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <select
                                value={doc.sectionTag || 'Work Permit Documents (ওয়ার্ক পারমিট)'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDocForm((prev) => ({
                                    ...prev,
                                    attachedDocuments: prev.attachedDocuments.map((d) =>
                                      d.id === doc.id ? { ...d, sectionTag: val } : d
                                    ),
                                  }));
                                }}
                                className="bg-[#121317] border border-[#2D313A] rounded px-1.5 py-0.5 text-[10px] text-amber-300 focus:outline-none"
                              >
                                <option value="Work Permit Documents (ওয়ার্ক পারমিট)">Work Permit</option>
                                <option value="Job Confirmation & Offer Letter (অফার লেটার)">Offer Letter</option>
                                <option value="Biometrics & VFS Global (বায়োমেট্রিক ও ভিএফএস)">Biometrics VFS</option>
                                <option value="Medical Examination (মেডিকেল রিপোর্ট)">Medical Report</option>
                                <option value="IRCC Visa Approval / Statutory (ভিসা অনুমোদন)">Visa Approval</option>
                                <option value="Identity & Passport Dossier (আইডেন্টিটি রেকর্ড)">Identity Record</option>
                                <option value="Other Official Document (অন্যান্য নথি)">Other Document</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => {
                                  setDocForm((prev) => ({
                                    ...prev,
                                    attachedDocuments: prev.attachedDocuments.map((d) => ({
                                      ...d,
                                      isPrimary: d.id === doc.id,
                                    })),
                                  }));
                                }}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                                  doc.isPrimary
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'text-gray-400 hover:text-white bg-[#222630]'
                                }`}
                              >
                                {doc.isPrimary ? '★ Primary View' : 'Set as Primary'}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {doc.dataUrl && doc.dataUrl !== '#' && (
                            <a
                              href={doc.dataUrl}
                              target="_blank"
                              rel="noreferrer"
                              download={doc.name}
                              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#252A36] transition-colors"
                              title="Download / View"
                            >
                              <File className="w-3.5 h-3.5 text-[#38bdf8]" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachedDoc(doc.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Remove this PDF"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#101216] text-center text-[11px] text-gray-500 border border-[#22252C]">
                    কোনো পিডিএফ ফাইল এখনো যুক্ত করা হয়নি। 'Add New PDF' বাটনে ক্লিক করে ফাইল নির্বাচন করুন।
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2C303B]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all-posts');
                setEditingDocId(null);
              }}
              className="px-4 py-2 bg-[#252830] hover:bg-[#323640] text-gray-200 hover:text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors border border-[#3A3F4C]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
              <span>← Back to Post List (ফিরে যান)</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all-posts');
                  setEditingDocId(null);
                }}
                className="px-4 py-2 bg-[#252830] text-gray-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer shadow-lg shadow-red-600/30 transition-all"
              >
                {editingDocId ? 'Save Changes' : 'Publish Canada Post'}
              </button>
            </div>
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
                <Tag className="w-4 h-4 text-red-400" />
                <span>Canada 3-Line Menu Categories (ডান পাশের ড্রয়ার মেনু অপশনসমূহ)</span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                এখানে ক্যাটাগরি যোগ বা রিমুভ করলে ওয়েবসাইটের ডান পাশের ৩ লাইনের মেনু স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
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
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
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
                    <th className="py-3 px-4">Search Key</th>
                    <th className="py-3 px-4 text-right">Actions (নিয়ন্ত্রণ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26282E]">
                  {menuConfigs.map((cfg, idx) => (
                    <tr key={cfg.id} className="hover:bg-[#1E2026] transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white uppercase">{cfg.mainTitle}</td>
                      <td className="py-3 px-4 text-red-400">{cfg.subMenu}</td>
                      <td className="py-3 px-4 text-gray-300">{cfg.fieldLabel}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-400">{cfg.searchFieldKey}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cfg)}
                            className="p-1.5 text-blue-400 hover:bg-blue-950/40 rounded transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cfg.id, cfg.mainTitle)}
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
      {/* MODAL: ADD / EDIT CANADA CATEGORY */}
      {/* ------------------------------------------------------- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-400" />
                <h4 className="font-bold text-base text-white">
                  {editingConfig ? `Edit Category: ${editingConfig.mainTitle}` : 'Add New Canada Category (নতুন ক্যাটাগরি যোগ করুন)'}
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
                  placeholder="e.g. Canada Work Permit Documents"
                  value={catFormData.mainTitle}
                  onChange={(e) => setCatFormData({ ...catFormData, mainTitle: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
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
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
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
                    className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Search Key</label>
                  <select
                    value={catFormData.searchFieldKey}
                    onChange={(e) => setCatFormData({ ...catFormData, searchFieldKey: e.target.value })}
                    className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="tinOrRef">tinOrRef (TIN/Reference)</option>
                    <option value="idNumber">idNumber (ID Number)</option>
                    <option value="verificationIdNo">verificationIdNo (Verification ID)</option>
                    <option value="transitionIdNo">transitionIdNo (Transition ID)</option>
                    <option value="referenceNo">referenceNo (Reference No)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description (বর্ণনা)</label>
                <textarea
                  rows={2}
                  placeholder="Verify official Canada Employment Application..."
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  className="w-full bg-[#141517] border border-[#2D313A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
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
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  {editingConfig ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* MODAL: VIEW CANADA FULL PDF POST DETAILS */}
      {/* ------------------------------------------------------- */}
      {selectedDocForView && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#17181B] border border-[#3A3F4C] text-white w-full max-w-5xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-400" />
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Canada Full Official Document & PDF Preview ({selectedDocForView.tinOrRef || selectedDocForView.candidateName})
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocForView(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252830] hover:bg-[#323640] text-gray-200 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border border-[#3A3F4C]"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
                  <span>← Back to Post List (ফিরে যান)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDocForView(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#252830] transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <FullPdfDocumentViewer
              document={canadaRecordToUnifiedDoc(selectedDocForView)}
              onClose={() => setSelectedDocForView(null)}
            />

            <div className="flex items-center justify-between pt-3 border-t border-[#2C303B]">
              <button
                type="button"
                onClick={() => setSelectedDocForView(null)}
                className="flex items-center gap-2 px-4 py-2 bg-[#252830] hover:bg-[#323640] text-gray-200 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#3A3F4C]"
              >
                <ArrowLeft className="w-4 h-4 text-red-400" />
                <span>← Back to Canada Post List (ফিরে যান)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDocForView(null)}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close (বন্ধ করুন)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* MODAL: QUICK ADD PDF (WITH SECTION SELECTION FOR CLIENT) */}
      {/* ------------------------------------------------------- */}
      {quickPdfDoc && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#17181B] border border-[#3A3F4C] text-white w-full max-w-xl rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5 my-4 sm:my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    Add New PDF (নতুন পিডিএফ যোগ করুন)
                  </h4>
                  <p className="text-xs text-gray-400">
                    Client: <strong className="text-white">{quickPdfDoc.candidateName}</strong> · Ref: <strong className="text-amber-400 font-mono">#{quickPdfDoc.tinOrRef || quickPdfDoc.referenceNo}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuickPdfDoc(null);
                  setQuickSelectedFiles([]);
                }}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#252830] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Client Reference ID Lock Info */}
            <div className="p-3 bg-[#111316] rounded-xl border border-[#262A34] flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Candidate / Client</span>
                <span className="font-bold text-white text-sm">{quickPdfDoc.candidateName}</span>
                <span className="text-gray-400 block text-[11px]">Passport: {quickPdfDoc.passportNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Locked Reference Number</span>
                <span className="font-mono font-bold text-red-400 text-sm">
                  #{quickPdfDoc.tinOrRef || quickPdfDoc.referenceNo}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">✓ Auto-tied to this ID</span>
              </div>
            </div>

            {!cloudReady && (
              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-2 text-amber-200">
                  <Cloud className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    সব ডিভাইসে পিডিএফ সেভ করতে Admin Google Account (<strong>mdesaali391@gmail.com</strong>) কানেক্ট করুন।
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isConnectingCloud}
                  onClick={handleConnectGoogleCloud}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] shrink-0 cursor-pointer transition-colors"
                >
                  {isConnectingCloud ? 'Connecting...' : 'Connect Google Cloud'}
                </button>
              </div>
            )}

            {/* Section Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-red-400" />
                <span>Select Display Section (কোন সেকশনে পিডিএফটি দেখাবে নির্বাচন করুন):</span>
              </label>
              <select
                value={quickSectionTag}
                onChange={(e) => setQuickSectionTag(e.target.value)}
                className="w-full bg-[#111316] border border-[#2D313A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer font-medium"
              >
                <option value="Work Permit Documents (ওয়ার্ক পারমিট)">Work Permit Documents (ওয়ার্ক পারমিট)</option>
                <option value="Job Confirmation & Offer Letter (অফার লেটার)">Job Confirmation & Offer Letter (অফার লেটার)</option>
                <option value="Biometrics & VFS Global (বায়োমেট্রিক ও ভিএফএস)">Biometrics & VFS Global (বায়োমেট্রিক ও ভিএফএস)</option>
                <option value="Medical Examination (মেডিকেল রিপোর্ট)">Medical Examination (মেডিকেল রিপোর্ট)</option>
                <option value="IRCC Visa Approval / Statutory (ভিসা অনুমোদন)">IRCC Visa Approval / Statutory (ভিসা অনুমোদন)</option>
                <option value="Identity & Passport Dossier (আইডেন্টিটি রেকর্ড)">Identity & Passport Dossier (আইডেন্টিটি রেকর্ড)</option>
                <option value="Employment Agreement & Contract (চুক্তিপত্র)">Employment Agreement & Contract (চুক্তিপত্র)</option>
                <option value="Other Custom Section">Other Custom Section (অন্যান্য কাস্টম সেকশন)</option>
              </select>

              {quickSectionTag === 'Other Custom Section' && (
                <input
                  type="text"
                  placeholder="Enter custom section label (e.g. Police Clearance, Certificate)..."
                  value={customSectionTag}
                  onChange={(e) => setCustomSectionTag(e.target.value)}
                  className="w-full mt-2 bg-[#111316] border border-[#2D313A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              )}
            </div>

            {/* Set as Primary toggle */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#111316] border border-[#262A34] cursor-pointer hover:border-[#353A48] transition-colors">
              <input
                type="checkbox"
                checked={quickIsPrimary}
                onChange={(e) => setQuickIsPrimary(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">
                  Set as Primary View (ওপরে মূল পিডিএফ হিসেবে সরাসরি দেখান)
                </span>
                <span className="text-gray-400 text-[11px]">
                  সার্চ রেজাল্টে সবার ওপরে এই পিডিএফটি পূর্ণ পর্দায় দেখাবে, বাকিগুলো নিচে গ্যালারিতে থাকবে।
                </span>
              </div>
            </label>

            {/* File Upload Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Select PDF or Document Files (এক বা একাধিক পিডিএফ ফাইল সিলেক্ট করুন):</span>
              </label>

              <input
                type="file"
                ref={quickFileInputRef}
                multiple
                accept=".pdf, application/pdf, image/*"
                onChange={handleQuickFileSelect}
                className="sr-only"
                id="quick-pdf-file-input"
              />

              <label
                htmlFor="quick-pdf-file-input"
                className="block border-2 border-dashed border-[#343946] hover:border-red-500/60 bg-[#111316] hover:bg-[#15181E] rounded-xl p-5 text-center cursor-pointer transition-all space-y-2"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">
                  Click to Choose PDF / Scan Files (কম্পিউটার বা ফোন থেকে ফাইল বাছুন)
                </div>
                <div className="text-[11px] text-gray-400">
                  সাপোর্ট করে: PDF, JPG, PNG (একাধিক ফাইল একবারে সিলেক্ট করতে পারবেন)
                </div>
              </label>

              {/* Selected Files Preview */}
              {quickSelectedFiles.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 pt-1">
                  {quickSelectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#111316] border border-[#262A34] text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="font-semibold text-white truncate max-w-xs">{file.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono shrink-0">({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickSelectedFile(idx)}
                        className="text-gray-400 hover:text-red-400 p-1 rounded cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {quickUploadError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="break-words">{quickUploadError}</span>
                </div>
                {quickUploadError.includes('CLOUD_AUTH_REQUIRED') && (
                  <button
                    type="button"
                    disabled={isConnectingCloud}
                    onClick={handleConnectGoogleCloud}
                    className="w-full py-2 px-3 rounded-lg bg-white text-gray-900 hover:bg-gray-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Cloud className="w-4 h-4 text-blue-600" />
                    <span>
                      {isConnectingCloud
                        ? 'Signing in with Google...'
                        : 'Sign In with Google (mdesaali391@gmail.com) & Retry'}
                    </span>
                  </button>
                )}
              </div>
            )}

            {quickUploadStatus && !quickUploadError && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2 font-semibold">
                <RotateCcw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                <span>{quickUploadStatus}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C303B]">
              <button
                type="button"
                onClick={() => {
                  setQuickPdfDoc(null);
                  setQuickSelectedFiles([]);
                  setQuickUploadError(null);
                  setQuickUploadStatus(null);
                }}
                disabled={isUploadingQuickPdf}
                className="px-4 py-2 bg-[#252830] hover:bg-[#323640] text-gray-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel (বাতিল)
              </button>

              <button
                type="button"
                onClick={handleSaveQuickAddPdf}
                disabled={isUploadingQuickPdf || quickSelectedFiles.length === 0}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-[#FF5500] hover:from-red-500 hover:to-[#FF6B1A] disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95"
              >
                {isUploadingQuickPdf ? (
                  <span>{quickUploadStatus || 'Saving to Database...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Upload & Save to Central Database (ডাটাবেসে সেভ করুন)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
