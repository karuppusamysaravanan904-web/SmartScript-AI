import React from 'react';
import { HistoryList } from '../components/History/HistoryList';
import { FolderClock, RefreshCw } from 'lucide-react';

interface HistoryPageProps {
  documents: any[];
  onOpenDocument: (docId: string) => void;
  onRenameDocument: (docId: string, newTitle: string) => void;
  onDeleteDocument: (docId: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  documents,
  onOpenDocument,
  onRenameDocument,
  onDeleteDocument,
  onRefresh,
  isLoading = false
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)'
            }}
          >
            <FolderClock size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Document Archive & History</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Manage, rename, review, and export previously digitized handwritten records
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={onRefresh}
          disabled={isLoading}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* History List */}
      <HistoryList
        documents={documents}
        onOpenDocument={onOpenDocument}
        onRenameDocument={onRenameDocument}
        onDeleteDocument={onDeleteDocument}
        isCompact={false}
      />
    </div>
  );
};
