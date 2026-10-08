import React, { useRef, useState } from 'react';
import { Upload, FileText, Sparkles, CircleAlert } from 'lucide-react';
import { DemoSample } from '../../types';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onSelectSample: (sampleId: string) => void;
  samples: DemoSample[];
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  onSelectSample,
  samples,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary)' : 'rgba(255, 255, 255, 0.16)'}`,
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isDragging ? '0 0 25px var(--primary-glow)' : 'var(--shadow-sm)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.tiff,.bmp,.pdf,.doc,.docx,.ppt,.pptx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={disabled}
        />

        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.2rem auto',
            color: 'var(--primary)'
          }}
        >
          <Upload size={32} />
        </div>

        <h3
          style={{
            fontSize: '1.35rem',
            marginBottom: '0.4rem',
            color: '#fff',
            letterSpacing: '-0.01em'
          }}
        >
          Upload Handwritten Document
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.2rem' }}>
          Drag & Drop your file here <span style={{ color: 'var(--text-dim)', margin: '0 0.5rem' }}>OR</span>
        </p>

        <button
          type="button"
          className="btn-primary"
          style={{
            padding: '0.65rem 1.6rem',
            fontSize: '0.9rem',
            pointerEvents: 'none'
          }}
        >
          Browse Files
        </button>

        <div
          style={{
            marginTop: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'var(--text-dim)',
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.04em'
          }}
        >
          <span>JPG</span>
          <span>•</span>
          <span>PNG</span>
          <span>•</span>
          <span>PDF</span>
          <span>•</span>
          <span>DOCX</span>
          <span>•</span>
          <span>PPTX</span>
          <span>•</span>
          <span>TIFF</span>
          <span>•</span>
          <span>WEBP</span>
        </div>
      </div>

      {/* Realistic Benchmark / Test Scenarios Catalog */}
      {samples.length > 0 && (
        <div
          style={{
            background: 'var(--bg-glass-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.2rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Test with Real Extreme Handwriting Datasets:
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              1-Click Instant Evaluation
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.65rem'
            }}
          >
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSample(s.id)}
                disabled={disabled}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.7rem 0.85rem',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  color: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-accent)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    padding: '0.35rem',
                    borderRadius: '6px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--primary)',
                    marginTop: '2px'
                  }}
                >
                  <FileText size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginTop: '2px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background:
                          s.difficulty === 'Extreme'
                            ? 'var(--danger-bg)'
                            : s.difficulty === 'Severe'
                            ? 'var(--warning-bg)'
                            : 'rgba(99, 102, 241, 0.12)',
                        color:
                          s.difficulty === 'Extreme'
                            ? 'var(--danger)'
                            : s.difficulty === 'Severe'
                            ? 'var(--warning)'
                            : 'var(--primary)',
                        fontWeight: 600
                      }}
                    >
                      {s.difficulty}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-dim)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {s.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
