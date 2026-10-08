import React, { useState } from 'react';
import {
  FileItem,
  LanguageInfo,
  DemoSample,
  ProcessingStage,
  DocumentResult
} from '../types';
import { FileUploader } from '../components/FileUploader/FileUploader';
import { FileList } from '../components/FileList/FileList';
import { LanguageSelector } from '../components/LanguageSelector/LanguageSelector';
import { ProcessingStatus } from '../components/ProcessingStatus/ProcessingStatus';
import { HistoryList } from '../components/History/HistoryList';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Globe, FileText } from 'lucide-react';

interface DashboardProps {
  files: FileItem[];
  selectedFileId: string | null;
  onFilesSelected: (files: File[]) => void;
  onSelectSample: (sampleId: string) => void;
  onSelectFile: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
  onProcessFile: (fileId: string) => void;
  onProcessAll: () => void;
  isProcessing: boolean;
  processingStages: ProcessingStage[];
  currentProcessingStage: string;
  languages: LanguageInfo[];
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (lang: string) => void;
  onTargetLanguageChange: (lang: string) => void;
  recentDocuments: any[];
  onOpenDocument: (docId: string) => void;
  onRenameDocument: (docId: string, newTitle: string) => void;
  onDeleteDocument: (docId: string) => void;
  samples: DemoSample[];
  error?: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  files,
  selectedFileId,
  onFilesSelected,
  onSelectSample,
  onSelectFile,
  onRemoveFile,
  onProcessFile,
  onProcessAll,
  isProcessing,
  processingStages,
  currentProcessingStage,
  languages,
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  recentDocuments,
  onOpenDocument,
  onRenameDocument,
  onDeleteDocument,
  samples,
  error
}) => {
  const selectedFile = files.find((f) => f.id === selectedFileId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.08))',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid var(--border-accent)',
              color: '#c7d2fe',
              fontSize: '0.78rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            <ShieldCheck size={14} color="var(--primary)" />
            <span>HNX26EPS04 — Extreme Bad-Handwriting Digitization Stack</span>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: '1.15',
              marginBottom: '0.85rem',
              background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            HANDWRITE AI
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Transform severely messy clinical scrawls, cramped lines, margin annotations, and crossed-out prescriptions
            into verified editable text, tables, and 23 Indian languages with native Word, PDF, and PowerPoint export.
          </p>

          {/* Core Feature Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--text-main)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Cpu size={14} color="var(--secondary)" />
              <span>Anti-Hallucination Guardrails</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--text-main)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Globe size={14} color="var(--primary)" />
              <span>23 Indian Languages + Auto-Detect</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--text-main)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <FileText size={14} color="var(--success)" />
              <span>DOCX • PDF • PPTX • Tables</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Upload & Configuration Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '1.75rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Upload Area & Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FileUploader
            onFilesSelected={onFilesSelected}
            onSelectSample={onSelectSample}
            samples={samples}
            disabled={isProcessing}
          />

          <FileList
            files={files}
            selectedFileId={selectedFileId}
            onSelectFile={onSelectFile}
            onRemoveFile={onRemoveFile}
            onProcessFile={onProcessFile}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Column: Language Setup & Process CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <LanguageSelector
            languages={languages}
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSourceLanguageChange={onSourceLanguageChange}
            onTargetLanguageChange={onTargetLanguageChange}
            disabled={isProcessing}
          />

          {/* Primary Action Button */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.25rem' }}>
                Start Digitization Engine
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {files.length > 0
                  ? `${files.length} document(s) in queue ready for processing.`
                  : 'Select or upload a document to proceed.'}
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={onProcessAll}
              disabled={isProcessing || files.length === 0}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                gap: '0.5rem'
              }}
            >
              <Sparkles size={18} />
              <span>{isProcessing ? 'Processing Queue...' : 'Process Document'}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Live Processing Status (Requirement 8) */}
          {(isProcessing || processingStages.length > 0) && (
            <ProcessingStatus
              stages={processingStages}
              currentStage={currentProcessingStage}
              isProcessing={isProcessing}
              error={error}
            />
          )}
        </div>
      </div>

      {/* Recent Documents Section (Requirement 24) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Recent Documents</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            {recentDocuments.length} document(s) recorded in session
          </span>
        </div>

        <HistoryList
          documents={recentDocuments}
          onOpenDocument={onOpenDocument}
          onRenameDocument={onRenameDocument}
          onDeleteDocument={onDeleteDocument}
          isCompact={true}
        />
      </div>
    </div>
  );
};
