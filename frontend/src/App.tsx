import React, { useState, useEffect } from 'react';
import {
  FileItem,
  LanguageInfo,
  DemoSample,
  ProcessingStage,
  DocumentResult,
  RecheckSuggestion
} from './types';
import { api } from './services/api';
import { Dashboard } from './pages/Dashboard';
import { Workspace } from './pages/Workspace';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';
import {
  Sparkles,
  LayoutDashboard,
  FolderClock,
  Settings as SettingsIcon,
  CircleAlert,
  CircleCheck,
  FileText
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workspace' | 'history' | 'settings'>('dashboard');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  const [languages, setLanguages] = useState<LanguageInfo[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState<string>('Auto Detect');
  const [targetLanguage, setTargetLanguage] = useState<string>('English');
  
  const [samples, setSamples] = useState<DemoSample[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [currentDocument, setCurrentDocument] = useState<DocumentResult | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>([]);
  const [currentProcessingStage, setCurrentProcessingStage] = useState<string>('Ready');
  const [error, setError] = useState<string | null>(null);
  
  const [backendHealth, setBackendHealth] = useState<{ status: string; service: string; version: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Initial backend load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setError(null);
      const [healthRes, langRes, sampleRes, docRes] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getLanguages().catch(() => ({ languages: [] })),
        api.getSamples().catch(() => ({ samples: [] })),
        api.getDocuments().catch(() => ({ documents: [] }))
      ]);

      if (healthRes) setBackendHealth(healthRes);
      if (langRes && langRes.languages) setLanguages(langRes.languages);
      if (sampleRes && sampleRes.samples) setSamples(sampleRes.samples);
      if (docRes && docRes.documents) setRecentDocuments(docRes.documents);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setError('Backend service connecting... Please ensure FastAPI server is running on port 8000.');
    }
  };

  const handleFilesSelected = async (newFiles: File[]) => {
    try {
      setError(null);
      // Upload to backend
      const res = await api.uploadFiles(newFiles);
      if (res && res.uploaded) {
        const mappedItems: FileItem[] = res.uploaded.map((u) => ({
          id: u.id,
          name: u.filename,
          type: u.file_type,
          size: u.file_size,
          pageCount: u.page_count || 1,
          uploadStatus: 'uploaded',
          processingStatus: 'ready',
          documentId: u.id
        }));

        setFiles((prev) => [...prev, ...mappedItems]);
        if (!selectedFileId && mappedItems.length > 0) {
          setSelectedFileId(mappedItems[0].id);
        }
      }
    } catch (err: any) {
      setError(`Upload failed: ${err.message || 'Unable to upload file'}`);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = samples.find((s) => s.id === sampleId);
    if (!sample) return;

    const sampleItem: FileItem = {
      id: sample.id,
      name: sample.filename,
      type: 'JPG',
      size: 420000,
      pageCount: 1,
      uploadStatus: 'uploaded',
      processingStatus: 'ready',
      documentId: sample.id
    };

    setFiles((prev) => {
      // Avoid duplicate
      if (prev.some((p) => p.id === sample.id)) return prev;
      return [...prev, sampleItem];
    });
    setSelectedFileId(sample.id);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (selectedFileId === fileId) {
      setSelectedFileId(null);
    }
  };

  const handleProcessFile = async (fileId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Initialize stages preview
      setProcessingStages([
        { name: 'File uploaded', completed: true, percent: 10 },
        { name: 'Document analyzed', completed: false, percent: 25 },
        { name: 'Pages extracted', completed: false, percent: 40 },
        { name: 'Handwriting recognition', completed: false, percent: 60 },
        { name: 'Language detection', completed: false, percent: 75 },
        { name: 'AI correction', completed: false, percent: 85 },
        { name: 'Translation', completed: false, percent: 92 },
        { name: 'Structure reconstruction', completed: false, percent: 98 },
        { name: 'Final document generation', completed: false, percent: 100 }
      ]);
      setCurrentProcessingStage('Handwriting recognition');

      // Update file status
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, processingStatus: 'processing' } : f))
      );

      // Call processing endpoint
      const result = await api.processDocument(fileId, sourceLanguage, targetLanguage);

      // Mark complete
      setProcessingStages((prev) => prev.map((s) => ({ ...s, completed: true })));
      setCurrentProcessingStage('Completed');

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, processingStatus: 'completed' } : f))
      );

      setCurrentDocument(result);
      // Refresh documents
      const docsRes = await api.getDocuments();
      if (docsRes?.documents) setRecentDocuments(docsRes.documents);

      // Navigate to Workspace
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentPage('workspace');
      }, 700);
    } catch (err: any) {
      setIsProcessing(false);
      setError(`Processing error: ${err.message || 'Pipeline failed'}`);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, processingStatus: 'error' } : f))
      );
    }
  };

  const handleProcessAll = async () => {
    const readyFile = files.find((f) => f.processingStatus === 'ready');
    if (readyFile) {
      await handleProcessFile(readyFile.id);
    } else if (files.length > 0) {
      await handleProcessFile(files[0].id);
    }
  };

  const handleOpenDocument = async (docId: string) => {
    try {
      const doc = await api.getDocumentResult(docId);
      setCurrentDocument(doc);
      setCurrentPage('workspace');
    } catch (err: any) {
      setError(`Failed to open document: ${err.message}`);
    }
  };

  const handleRenameDocument = async (docId: string, newTitle: string) => {
    try {
      await api.renameDocument(docId, newTitle);
      const docsRes = await api.getDocuments();
      if (docsRes?.documents) setRecentDocuments(docsRes.documents);
      if (currentDocument && currentDocument.id === docId) {
        setCurrentDocument({ ...currentDocument, filename: newTitle });
      }
    } catch (err: any) {
      setError(`Failed to rename document: ${err.message}`);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await api.deleteDocument(docId);
      const docsRes = await api.getDocuments();
      if (docsRes?.documents) setRecentDocuments(docsRes.documents);
      if (currentDocument && currentDocument.id === docId) {
        setCurrentDocument(null);
        setCurrentPage('dashboard');
      }
    } catch (err: any) {
      setError(`Failed to delete document: ${err.message}`);
    }
  };

  const handleSaveFullText = async (newText: string) => {
    if (!currentDocument) return;
    try {
      setIsSaving(true);
      await api.correctFullText(currentDocument.id, newText);
      const updated = await api.getDocumentResult(currentDocument.id);
      setCurrentDocument(updated);
    } catch (err: any) {
      setError(`Failed to save corrections: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCorrectToken = async (
    tokenId: string,
    action: 'accept' | 'edit' | 'mark_illegible',
    correctedText?: string
  ) => {
    if (!currentDocument) return;
    try {
      const res = await api.correctToken(currentDocument.id, tokenId, action, correctedText);
      if (res && res.doc) {
        setCurrentDocument(res.doc);
      }
    } catch (err: any) {
      setError(`Token correction failed: ${err.message}`);
    }
  };

  const handleApplyRecheck = async (suggestion: RecheckSuggestion, accept: boolean) => {
    if (!currentDocument) return;
    if (accept) {
      await handleCorrectToken(suggestion.token_id, 'edit', suggestion.suggested);
    }
    // Remove suggestion from list
    setCurrentDocument((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        recheck_suggestions: prev.recheck_suggestions.filter((s) => s.token_id !== suggestion.token_id)
      };
    });
  };

  const handleChangeTargetLanguage = async (newTargetLang: string) => {
    if (!currentDocument) return;
    try {
      setIsTranslating(true);
      const res = await api.translateDocument(currentDocument.id, newTargetLang);
      setCurrentDocument((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          target_language: res.target_language,
          translated_text: res.translated_text
        };
      });
    } catch (err: any) {
      setError(`Translation update failed: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="app-navbar">
        <div className="brand-section">
          <div className="brand-logo-badge">
            <Sparkles size={22} color="#fff" />
          </div>
          <div className="brand-text">
            <h1>HANDWRITE AI</h1>
            <span>Extreme Bad-Handwriting Digitization Stack</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button
            type="button"
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          {currentDocument && (
            <button
              type="button"
              className={`nav-btn ${currentPage === 'workspace' ? 'active' : ''}`}
              onClick={() => setCurrentPage('workspace')}
            >
              <FileText size={16} />
              <span>Workspace</span>
            </button>
          )}

          <button
            type="button"
            className={`nav-btn ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentPage('history')}
          >
            <FolderClock size={16} />
            <span>History</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            <SettingsIcon size={16} />
            <span>Settings</span>
          </button>

          {/* Backend Status indicator */}
          <div className="nav-badge-pill">
            <span className="nav-pulse-dot" />
            <span>{backendHealth ? 'Backend 1.0.0' : 'Connecting...'}</span>
          </div>
        </nav>
      </header>

      {/* Global Alert Banner if error */}
      {error && (
        <div
          style={{
            backgroundColor: 'var(--danger-bg)',
            borderBottom: '1px solid var(--danger-border)',
            padding: '0.65rem 2rem',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CircleAlert size={16} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            style={{ background: 'transparent', color: 'var(--danger)', fontWeight: 700 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main style={{ flex: 1, padding: '1.75rem 2rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        {currentPage === 'dashboard' && (
          <Dashboard
            files={files}
            selectedFileId={selectedFileId}
            onFilesSelected={handleFilesSelected}
            onSelectSample={handleSelectSample}
            onSelectFile={setSelectedFileId}
            onRemoveFile={handleRemoveFile}
            onProcessFile={handleProcessFile}
            onProcessAll={handleProcessAll}
            isProcessing={isProcessing}
            processingStages={processingStages}
            currentProcessingStage={currentProcessingStage}
            languages={languages}
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSourceLanguageChange={setSourceLanguage}
            onTargetLanguageChange={setTargetLanguage}
            recentDocuments={recentDocuments}
            onOpenDocument={handleOpenDocument}
            onRenameDocument={handleRenameDocument}
            onDeleteDocument={handleDeleteDocument}
            samples={samples}
            error={error}
          />
        )}

        {currentPage === 'workspace' && currentDocument && (
          <Workspace
            document={currentDocument}
            onBackToDashboard={() => setCurrentPage('dashboard')}
            onSaveFullText={handleSaveFullText}
            onCorrectToken={handleCorrectToken}
            onApplyRecheck={handleApplyRecheck}
            onChangeTargetLanguage={handleChangeTargetLanguage}
            languages={languages}
            isSaving={isSaving}
            isTranslating={isTranslating}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            documents={recentDocuments}
            onOpenDocument={handleOpenDocument}
            onRenameDocument={handleRenameDocument}
            onDeleteDocument={handleDeleteDocument}
            onRefresh={loadInitialData}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage backendHealth={backendHealth} />
        )}
      </main>
    </div>
  );
};
export default App;
