import React, { useState } from 'react';
import { DocumentResult, WordToken, DocumentTable, RecheckSuggestion, LanguageInfo } from '../types';
import { DocumentViewer } from '../components/DocumentViewer/DocumentViewer';
import { TextEditor } from '../components/TextEditor/TextEditor';
import { UncertaintyViewer } from '../components/UncertaintyViewer/UncertaintyViewer';
import { TranslationPanel } from '../components/TranslationPanel/TranslationPanel';
import { ExportPanel } from '../components/ExportPanel/ExportPanel';
import {
  FileText,
  Languages,
  Download,
  ArrowLeft
} from 'lucide-react';

interface WorkspaceProps {
  document: DocumentResult;
  onBackToDashboard: () => void;
  onSaveFullText: (text: string) => void;
  onCorrectToken: (tokenId: string, action: 'accept' | 'edit' | 'mark_illegible', correctedText?: string) => void;
  onApplyRecheck: (suggestion: RecheckSuggestion, accept: boolean) => void;
  onChangeTargetLanguage: (targetLang: string) => void;
  languages: LanguageInfo[];
  isSaving?: boolean;
  isTranslating?: boolean;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  document,
  onBackToDashboard,
  onSaveFullText,
  onCorrectToken,
  onApplyRecheck,
  onChangeTargetLanguage,
  languages,
  isSaving = false,
  isTranslating = false
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'translation' | 'export'>('editor');
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [selectedToken, setSelectedToken] = useState<WordToken | null>(null);

  const handleSelectToken = (token: WordToken) => {
    setSelectedToken(token);
  };

  const handleCloseUncertaintyViewer = () => {
    setSelectedToken(null);
  };

  const handleApplyTokenCorrection = (
    tokenId: string,
    action: 'accept' | 'edit' | 'mark_illegible',
    correctedText?: string
  ) => {
    onCorrectToken(tokenId, action, correctedText);
    setSelectedToken(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 100px)' }}>
      {/* Workspace Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1.25rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        {/* Back button & Document details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onBackToDashboard}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '0.3rem' }}
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </button>

          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.85rem' }}>
            <h2 style={{ fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>
              {document.filename}
            </h2>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              <span>Script: {document.source_language}</span>
              <span style={{ margin: '0 0.35rem' }}>&bull;</span>
              <span>Target: {document.target_language}</span>
              <span style={{ margin: '0 0.35rem' }}>&bull;</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                {document.analysis.recognized_words} words detected
              </span>
            </div>
          </div>
        </div>

        {/* View Workspace Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-elevated)', padding: '3px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'editor' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'editor' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <FileText size={14} />
            <span>Side-by-Side Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('translation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'translation' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'translation' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <Languages size={14} />
            <span>Multilingual Output</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'export' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'export' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <Download size={14} />
            <span>Export Artifacts</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'editor' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
              gap: '1rem',
              height: '100%',
              minHeight: 0
            }}
          >
            {/* Left: Original Document Viewer */}
            <DocumentViewer
              pages={document.pages}
              activePageNumber={activePageNumber}
              onPageChange={setActivePageNumber}
              tokens={document.tokens}
              selectedTokenId={selectedToken?.id}
              onSelectToken={handleSelectToken}
            />

            {/* Right: Clean Text Editor & Tables */}
            <TextEditor
              initialText={document.clean_text}
              tokens={document.tokens}
              tables={document.tables}
              analysis={document.analysis}
              recheckSuggestions={document.recheck_suggestions}
              onSaveFullText={onSaveFullText}
              onSelectToken={handleSelectToken}
              onApplyRecheck={onApplyRecheck}
              selectedTokenId={selectedToken?.id}
              isSaving={isSaving}
            />
          </div>
        )}

        {activeTab === 'translation' && (
          <TranslationPanel
            originalText={document.clean_text}
            translatedText={document.translated_text}
            sourceLanguage={document.source_language}
            targetLanguage={document.target_language}
            availableLanguages={languages.filter((l) => l.name !== 'Auto Detect').map((l) => l.name)}
            onLanguageChange={onChangeTargetLanguage}
            isTranslating={isTranslating}
          />
        )}

        {activeTab === 'export' && (
          <ExportPanel document={document} />
        )}
      </div>

      {/* Uncertainty Region Inspector Modal / Floating Drawer */}
      <UncertaintyViewer
        token={selectedToken}
        onClose={handleCloseUncertaintyViewer}
        onApplyCorrection={handleApplyTokenCorrection}
      />
    </div>
  );
};
