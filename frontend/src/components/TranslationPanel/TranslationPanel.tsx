import React, { useState } from 'react';
import { Languages, Copy, Check, RefreshCw } from 'lucide-react';

interface TranslationPanelProps {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  availableLanguages: string[];
  onLanguageChange: (newLang: string) => void;
  isTranslating?: boolean;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  originalText,
  translatedText,
  sourceLanguage,
  targetLanguage,
  availableLanguages,
  onLanguageChange,
  isTranslating = false
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'original' | 'translation'>('both');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslation, setCopiedTranslation] = useState(false);

  const handleCopy = (text: string, isOriginal: boolean) => {
    navigator.clipboard.writeText(text);
    if (isOriginal) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedTranslation(true);
      setTimeout(() => setCopiedTranslation(false), 2000);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        {/* View Mode Buttons */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0, 0, 0, 0.25)', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setViewMode('both')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'both' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'both' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Show Both
          </button>
          <button
            type="button"
            onClick={() => setViewMode('original')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'original' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'original' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Show Original
          </button>
          <button
            type="button"
            onClick={() => setViewMode('translation')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'translation' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'translation' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Show Translation
          </button>
        </div>

        {/* Change Target Language Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Output Language:</span>
          <select
            value={targetLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={isTranslating}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              fontSize: '0.78rem',
              color: '#fff',
              fontWeight: 600
            }}
          >
            {availableLanguages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          {isTranslating && <RefreshCw size={13} className="animate-spin" color="var(--primary)" />}
        </div>
      </div>

      {/* Main Panels */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: viewMode === 'both' ? '1fr 1fr' : '1fr',
          gap: '1.25rem'
        }}
      >
        {/* Original Recognition */}
        {(viewMode === 'both' || viewMode === 'original') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Original Recognition ({sourceLanguage})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(originalText, true)}
                title="Copy Original"
                style={{
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.72rem'
                }}
              >
                {copiedOriginal ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                <span>{copiedOriginal ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div
              style={{
                padding: '1rem',
                flex: 1,
                fontSize: '0.92rem',
                lineHeight: '1.7',
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap',
                overflowY: 'auto'
              }}
            >
              {originalText || <span style={{ color: 'var(--text-dim)' }}>No text extracted</span>}
            </div>
          </div>
        )}

        {/* Converted Output Translation */}
        {(viewMode === 'both' || viewMode === 'translation') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.85rem',
                backgroundColor: 'rgba(16, 185, 129, 0.06)',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--success)' }}>
                Converted Output ({targetLanguage})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(translatedText, false)}
                title="Copy Translation"
                style={{
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.72rem'
                }}
              >
                {copiedTranslation ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                <span>{copiedTranslation ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div
              style={{
                padding: '1rem',
                flex: 1,
                fontSize: '0.92rem',
                lineHeight: '1.7',
                color: '#fff',
                whiteSpace: 'pre-wrap',
                overflowY: 'auto'
              }}
            >
              {translatedText || (
                <span style={{ color: 'var(--text-dim)' }}>Translation unavailable</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
