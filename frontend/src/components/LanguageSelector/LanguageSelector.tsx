import { ArrowRight, Languages, CircleAlert, CircleCheck } from 'lucide-react';
import { LanguageInfo, LanguageDetectionResult } from '../../types';

interface LanguageSelectorProps {
  languages: LanguageInfo[];
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (lang: string) => void;
  onTargetLanguageChange: (lang: string) => void;
  detectionResult?: LanguageDetectionResult;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  detectionResult,
  disabled = false
}) => {
  const currentSourceInfo = languages.find((l) => l.name === sourceLanguage);
  const currentTargetInfo = languages.find((l) => l.name === targetLanguage);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              padding: '0.4rem',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--secondary)'
            }}
          >
            <Languages size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
              Multilingual Script Pipeline
            </h4>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Auto-detect or configure from 23 scheduled Indian languages
            </p>
          </div>
        </div>

        {/* Live Detection Badge if available */}
        {detectionResult && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--success-border)',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              color: 'var(--success)',
              fontWeight: 600
            }}
          >
            <CircleCheck size={13} />
            <span>
              {detectionResult.is_mixed
                ? `Mixed Scripts Detected (${detectionResult.breakdown.map((b) => `${b.language}: ${b.percentage}%`).join(', ')})`
                : `Detected: ${detectionResult.detected_language} (${detectionResult.confidence}%)`}
            </span>
          </div>
        )}
      </div>

      {/* Selectors Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        {/* Source Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Source Handwriting Script</span>
            {currentSourceInfo?.native_name && (
              <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                {currentSourceInfo.native_name}
              </span>
            )}
          </label>
          <select
            value={sourceLanguage}
            onChange={(e) => onSourceLanguageChange(e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {languages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name} {lang.native_name ? `(${lang.native_name})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Direction arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '1.2rem',
            color: 'var(--primary)'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowRight size={15} />
          </div>
        </div>

        {/* Target Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Convert Output To</span>
            {currentTargetInfo?.native_name && (
              <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                {currentTargetInfo.native_name}
              </span>
            )}
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => onTargetLanguageChange(e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {languages
              .filter((l) => l.name !== 'Auto Detect')
              .map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.name} {lang.native_name ? `(${lang.native_name})` : ''}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Model capability note if any language is experimental */}
      {currentSourceInfo && !currentSourceInfo.ocr_supported && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--warning-bg)',
            color: 'var(--warning)',
            fontSize: '0.76rem',
            border: '1px solid var(--warning-border)'
          }}
        >
          <CircleAlert size={14} />
          <span>
            OCR model has limited experimental training for {sourceLanguage}. Latin/Devanagari scripts are prioritized.
          </span>
        </div>
      )}
    </div>
  );
};
