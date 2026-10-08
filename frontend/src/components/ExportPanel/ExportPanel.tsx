import React, { useState } from 'react';
import { FileText, Presentation, FileCode, Archive, CircleCheck, Loader, Sparkles } from 'lucide-react';
import { DocumentResult } from '../../types';
import { downloadDocumentFile } from '../../services/export';

interface ExportPanelProps {
  document: DocumentResult;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ document }) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'formatted' | 'recognized' | 'translated' | 'original'>('formatted');

  const handleDownload = async (format: 'docx' | 'pdf' | 'pptx' | 'txt' | 'md' | 'all') => {
    try {
      setDownloadingFormat(format);
      await downloadDocumentFile(document.id, format, document.filename);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 1200);
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
      {/* Export Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {/* Preview Tabs (Requirement 18) */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0, 0, 0, 0.3)', padding: '2px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setPreviewTab('formatted')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: previewTab === 'formatted' ? 'var(--primary)' : 'transparent',
              color: previewTab === 'formatted' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Formatted Document
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('recognized')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: previewTab === 'recognized' ? 'var(--primary)' : 'transparent',
              color: previewTab === 'recognized' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Recognized Text
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('translated')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: previewTab === 'translated' ? 'var(--primary)' : 'transparent',
              color: previewTab === 'translated' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Translated Output
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('original')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: previewTab === 'original' ? 'var(--primary)' : 'transparent',
              color: previewTab === 'original' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Original
          </button>
        </div>

        {/* Quick Download All (Requirement 23) */}
        <button
          type="button"
          onClick={() => handleDownload('all')}
          disabled={downloadingFormat !== null}
          className="btn-primary"
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.82rem',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}
        >
          {downloadingFormat === 'all' ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            <Archive size={14} />
          )}
          <span>{downloadingFormat === 'all' ? 'Bundling All Files...' : 'Download All (.ZIP)'}</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#090d16' }}>
        {previewTab === 'formatted' && (
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Header Title */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--primary)'
                }}
              >
                Digitized Document Summary
              </span>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '0.35rem' }}>
                {document.headings && document.headings[0] ? document.headings[0] : 'Handwriting Transcription'}
              </h2>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)',
                  marginTop: '0.5rem'
                }}
              >
                <span>File: {document.filename}</span>
                <span>•</span>
                <span>Language: {document.source_language} &rarr; {document.target_language}</span>
                <span>•</span>
                <span>Words: {document.analysis.recognized_words}</span>
              </div>
            </div>

            {/* Recognized Clean Body */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                Reconstructed Handwriting Text:
              </h4>
              <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                {document.clean_text}
              </div>
            </div>

            {/* Translated Output */}
            {document.translated_text && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid var(--success-border)'
                }}
              >
                <h4 style={{ fontSize: '0.95rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                  Multilingual Translation ({document.target_language}):
                </h4>
                <div style={{ fontSize: '0.92rem', lineHeight: '1.8', color: '#fff', whiteSpace: 'pre-wrap' }}>
                  {document.translated_text}
                </div>
              </div>
            )}

            {/* Tables */}
            {document.tables && document.tables.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  Structured Tables:
                </h4>
                {document.tables.map((t, idx) => (
                  <table
                    key={idx}
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      fontSize: '0.86rem'
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
                        {t.headers.map((h, hIdx) => (
                          <th key={hIdx} style={{ padding: '0.6rem 0.85rem', color: '#fff', textAlign: 'left' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.rows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          {row.map((c, cIdx) => (
                            <td key={cIdx} style={{ padding: '0.55rem 0.85rem', color: 'var(--text-main)' }}>
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            )}
          </div>
        )}

        {previewTab === 'recognized' && (
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontSize: '0.95rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {document.clean_text}
          </div>
        )}

        {previewTab === 'translated' && (
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontSize: '0.95rem',
              border: '1px solid var(--success-border)',
              color: '#fff'
            }}
          >
            {document.translated_text || 'No translation generated.'}
          </div>
        )}

        {previewTab === 'original' && (
          <div style={{ textAlign: 'center' }}>
            {document.pages && document.pages[0] && (
              <img
                src={document.pages[0].image_base64}
                alt="Original Document"
                style={{
                  maxHeight: '700px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Prominent Export Document Options (Requirements 19, 20, 21, 22) */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          PRODUCE PRODUCTION-READY EXPORT ARTIFACTS:
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {/* Word Export (.docx) - Requirement 20 */}
          <button
            type="button"
            onClick={() => handleDownload('docx')}
            disabled={downloadingFormat !== null}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.6rem'
            }}
          >
            {downloadingFormat === 'docx' ? (
              <Loader size={18} className="animate-spin" color="var(--primary)" />
            ) : (
              <FileText size={18} color="#3b82f6" />
            )}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                {downloadingFormat === 'docx' ? 'Preparing Word...' : 'Download Word'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>.docx with tables</div>
            </div>
          </button>

          {/* PDF Export (.pdf) - Requirement 21 */}
          <button
            type="button"
            onClick={() => handleDownload('pdf')}
            disabled={downloadingFormat !== null}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.6rem'
            }}
          >
            {downloadingFormat === 'pdf' ? (
              <Loader size={18} className="animate-spin" color="var(--primary)" />
            ) : (
              <FileText size={18} color="#ef4444" />
            )}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                {downloadingFormat === 'pdf' ? 'Generating PDF...' : 'Download PDF'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>.pdf vector document</div>
            </div>
          </button>

          {/* PowerPoint Export (.pptx) - Requirement 22 */}
          <button
            type="button"
            onClick={() => handleDownload('pptx')}
            disabled={downloadingFormat !== null}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.6rem'
            }}
          >
            {downloadingFormat === 'pptx' ? (
              <Loader size={18} className="animate-spin" color="var(--primary)" />
            ) : (
              <Presentation size={18} color="#f97316" />
            )}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                {downloadingFormat === 'pptx' ? 'Creating Slides...' : 'Download PowerPoint'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>.pptx multi-slide</div>
            </div>
          </button>

          {/* Plain Text (.txt) */}
          <button
            type="button"
            onClick={() => handleDownload('txt')}
            disabled={downloadingFormat !== null}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.6rem'
            }}
          >
            <FileCode size={18} color="#10b981" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Download TXT</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>.txt plain format</div>
            </div>
          </button>

          {/* Markdown (.md) */}
          <button
            type="button"
            onClick={() => handleDownload('md')}
            disabled={downloadingFormat !== null}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.6rem'
            }}
          >
            <FileCode size={18} color="#8b5cf6" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Download Markdown</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>.md structured</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
