import React from 'react';
import { FileText, Trash, CircleCheck, Clock, TriangleAlert, Play, Eye } from 'lucide-react';
import { FileItem } from '../../types';

interface FileListProps {
  files: FileItem[];
  selectedFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
  onProcessFile: (fileId: string) => void;
  isProcessing: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  onRemoveFile,
  onProcessFile,
  isProcessing
}) => {
  if (files.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.25rem'
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Queue Documents ({files.length})
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Select document to preview or process
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {files.map((file) => {
          const isSelected = file.id === selectedFileId;
          const isCompleted = file.processingStatus === 'completed';

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.1rem',
                backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                border: `1px solid ${
                  isSelected ? 'var(--primary)' : 'var(--border-subtle)'
                }`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 14px var(--primary-glow)' : 'none'
              }}
            >
              {/* File details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: isCompleted ? 'var(--success-bg)' : 'rgba(99, 102, 241, 0.12)',
                    color: isCompleted ? 'var(--success)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FileText size={20} />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {file.name}
                  </div>
                  
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.74rem',
                      color: 'var(--text-dim)',
                      marginTop: '2px'
                    }}
                  >
                    <span>{file.type}</span>
                    <span>•</span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'}</span>
                  </div>
                </div>
              </div>

              {/* Status pills & action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                {/* Upload Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.72rem',
                    color: 'var(--success)',
                    background: 'var(--success-bg)',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}
                >
                  <CircleCheck size={12} />
                  <span>Uploaded</span>
                </div>

                {/* Processing Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    background:
                      file.processingStatus === 'completed'
                        ? 'var(--success-bg)'
                        : file.processingStatus === 'processing'
                        ? 'var(--warning-bg)'
                        : 'rgba(255, 255, 255, 0.06)',
                    color:
                      file.processingStatus === 'completed'
                        ? 'var(--success)'
                        : file.processingStatus === 'processing'
                        ? 'var(--warning)'
                        : 'var(--text-muted)'
                  }}
                >
                  {file.processingStatus === 'completed' ? (
                    <>
                      <CircleCheck size={12} />
                      <span>Completed</span>
                    </>
                  ) : file.processingStatus === 'processing' ? (
                    <>
                      <Clock size={12} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Clock size={12} />
                      <span>Ready for processing</span>
                    </>
                  )}
                </div>

                {/* Process Button if ready */}
                {!isCompleted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProcessFile(file.id);
                    }}
                    disabled={isProcessing}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <Play size={12} fill="#fff" />
                    <span>Process</span>
                  </button>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                  }}
                  disabled={isProcessing}
                  title="Remove from queue"
                  style={{
                    background: 'transparent',
                    color: 'var(--text-dim)',
                    padding: '0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                >
                  <Trash size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
