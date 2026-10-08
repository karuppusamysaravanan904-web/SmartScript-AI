import React, { useState } from 'react';
import { FileText, Download, Trash, Pen, ExternalLink, Calendar } from 'lucide-react';
import { downloadDocumentFile } from '../../services/export';

interface HistoryDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: string;
  source_language: string;
  target_language: string;
  created_at: string;
  is_processed: boolean;
  analysis?: any;
}

interface HistoryListProps {
  documents: HistoryDocument[];
  onOpenDocument: (docId: string) => void;
  onRenameDocument: (docId: string, newTitle: string) => void;
  onDeleteDocument: (docId: string) => void;
  isCompact?: boolean;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  documents,
  onOpenDocument,
  onRenameDocument,
  onDeleteDocument,
  isCompact = false
}) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const startRename = (doc: HistoryDocument) => {
    setRenamingId(doc.id);
    setNewTitle(doc.filename);
  };

  const handleSaveRename = (docId: string) => {
    if (newTitle.trim()) {
      onRenameDocument(docId, newTitle.trim());
      setRenamingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-dim)'
        }}
      >
        <FileText size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
        <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>No documents in history yet</div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
          Upload and process your first handwritten document to see it here.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isCompact ? '0.75rem 1rem' : '1rem 1.25rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          {/* Document metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: doc.is_processed ? 'var(--success-bg)' : 'rgba(99, 102, 241, 0.12)',
                color: doc.is_processed ? 'var(--success)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileText size={20} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {renamingId === doc.id ? (
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    autoFocus
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--primary)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSaveRename(doc.id)}
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setRenamingId(null)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {doc.filename}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginTop: '3px'
                }}
              >
                <span>{doc.source_language} &rarr; {doc.target_language}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={11} />
                  {doc.created_at}
                </span>
                <span>•</span>
                <span
                  style={{
                    color: doc.is_processed ? 'var(--success)' : 'var(--warning)',
                    fontWeight: 600
                  }}
                >
                  {doc.is_processed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onOpenDocument(doc.id)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                gap: '0.35rem'
              }}
            >
              <ExternalLink size={13} />
              <span>Open</span>
            </button>

            {doc.is_processed && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => downloadDocumentFile(doc.id, 'docx', doc.filename)}
                title="Quick export Word"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.78rem',
                  gap: '0.35rem'
                }}
              >
                <Download size={13} />
                <span>Export</span>
              </button>
            )}

            {!isCompact && (
              <>
                <button
                  type="button"
                  onClick={() => startRename(doc)}
                  title="Rename"
                  style={{
                    background: 'transparent',
                    color: 'var(--text-dim)',
                    padding: '0.4rem',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Pen size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteDocument(doc.id)}
                  title="Delete"
                  style={{
                    background: 'transparent',
                    color: 'var(--text-dim)',
                    padding: '0.4rem',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Trash size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
