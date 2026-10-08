import React, { useState, useEffect } from 'react';
import {
  WordToken,
  DocumentTable,
  HandwritingAnalysis,
  RecheckSuggestion
} from '../../types';
import {
  Save,
  RotateCcw,
  Undo2,
  Redo2,
  Sparkles,
  Table as TableIcon,
  Check,
  X
} from 'lucide-react';

interface TextEditorProps {
  initialText: string;
  tokens: WordToken[];
  tables: DocumentTable[];
  analysis: HandwritingAnalysis;
  recheckSuggestions: RecheckSuggestion[];
  onSaveFullText: (newText: string) => void;
  onSelectToken: (token: WordToken) => void;
  onApplyRecheck: (suggestion: RecheckSuggestion, accept: boolean) => void;
  onUpdateTable?: (tableIndex: number, newTable: DocumentTable) => void;
  selectedTokenId?: string;
  isSaving?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialText,
  tokens,
  tables,
  analysis,
  recheckSuggestions,
  onSaveFullText,
  onSelectToken,
  onApplyRecheck,
  onUpdateTable,
  selectedTokenId,
  isSaving = false
}) => {
  const [editorText, setEditorText] = useState(initialText);
  const [history, setHistory] = useState<string[]>([initialText]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'tokens' | 'raw'>('tokens');
  const [showRecheckDrawer, setShowRecheckDrawer] = useState(false);
  const [editableTables, setEditableTables] = useState<DocumentTable[]>(tables);

  useEffect(() => {
    setEditorText(initialText);
    setHistory([initialText]);
    setHistoryIndex(0);
  }, [initialText]);

  useEffect(() => {
    setEditableTables(tables);
  }, [tables]);

  const handleTextChange = (newVal: string) => {
    setEditorText(newVal);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newVal);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setEditorText(history[newIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setEditorText(history[newIdx]);
    }
  };

  const handleReset = () => {
    setEditorText(initialText);
    const newHist = [...history, initialText];
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleSave = () => {
    onSaveFullText(editorText);
  };

  // Cell editing for tables
  const handleTableCellChange = (tableIdx: number, rowIdx: number, colIdx: number, val: string) => {
    const updated = [...editableTables];
    updated[tableIdx].rows[rowIdx][colIdx] = val;
    setEditableTables(updated);
    if (onUpdateTable) {
      onUpdateTable(tableIdx, updated[tableIdx]);
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
      {/* Handwriting Analysis Stats Panel (Requirement 9) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.65rem 1rem',
          gap: '0.5rem',
          textAlign: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Pages
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            {analysis.pages_processed || 1}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Words
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            {analysis.recognized_words || tokens.length}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--success)', textTransform: 'uppercase', fontWeight: 600 }}>
            High Conf.
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>
            {analysis.high_confidence || 0}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--warning)', textTransform: 'uppercase', fontWeight: 600 }}>
            Needs Review
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--warning)' }}>
            {analysis.needs_review || 0}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--danger)', textTransform: 'uppercase', fontWeight: 600 }}>
            Unreadable
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)' }}>
            {analysis.unreadable || 0}
          </div>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.55rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        {/* Toggle Mode */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-elevated)', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setViewMode('tokens')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'tokens' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'tokens' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Interactive Token Mode
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'raw' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'raw' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Full Plain Text
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              color: historyIndex <= 0 ? 'var(--text-dim)' : 'var(--text-main)',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Undo2 size={13} />
            <span>Undo</span>
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              color: historyIndex >= history.length - 1 ? 'var(--text-dim)' : 'var(--text-main)',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Redo2 size={13} />
            <span>Redo</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset to original OCR"
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {/* AI Re-Check Button (Requirement 15) */}
          <button
            type="button"
            onClick={() => setShowRecheckDrawer(!showRecheckDrawer)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: showRecheckDrawer ? 'rgba(6, 182, 212, 0.25)' : 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: 'var(--secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={13} />
            <span>AI Re-Check</span>
            {recheckSuggestions.length > 0 && (
              <span
                style={{
                  background: 'var(--secondary)',
                  color: '#000',
                  borderRadius: '999px',
                  padding: '1px 5px',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
              >
                {recheckSuggestions.length}
              </span>
            )}
          </button>

          {/* Save Correction Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
            style={{ padding: '0.38rem 0.85rem', fontSize: '0.78rem', gap: '0.3rem' }}
          >
            <Save size={13} />
            <span>{isSaving ? 'Saving...' : 'Save Correction'}</span>
          </button>
        </div>
      </div>

      {/* AI Re-Check Drawer if open */}
      {showRecheckDrawer && (
        <div
          style={{
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
            padding: '0.85rem 1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--secondary)' }}>
              AI Re-Check Recommendations ({recheckSuggestions.length})
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Human in the loop: Explicit accept or reject required
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
            {recheckSuggestions.map((sug, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ textDecoration: 'line-through', color: 'var(--danger)' }}>{sug.original}</span>
                    <span>&rarr;</span>
                    <strong style={{ color: 'var(--success)' }}>{sug.suggested}</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {sug.reason}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => onApplyRecheck(sug, true)}
                    style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '4px',
                      background: 'var(--success-bg)',
                      border: '1px solid var(--success-border)',
                      color: 'var(--success)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <Check size={12} />
                    <span>Accept</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onApplyRecheck(sug, false)}
                    style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '4px',
                      background: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      color: 'var(--danger)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <X size={12} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {viewMode === 'tokens' ? (
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-dim)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>Click on any word to inspect original handwriting crop and AI alternative candidates:</span>
            </div>

            <div
              style={{
                lineHeight: '2.2',
                fontSize: '1rem',
                color: 'var(--text-main)',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {tokens.map((tok) => {
                const isSelected = tok.id === selectedTokenId;
                const statusClass =
                  tok.status === 'unreadable'
                    ? 'unreadable'
                    : tok.status === 'needs_review'
                    ? 'needs-review'
                    : 'high';

                return (
                  <span
                    key={tok.id}
                    className={`word-token ${statusClass} ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectToken(tok)}
                    title={`Confidence: ${Math.round(tok.confidence * 100)}%`}
                  >
                    {tok.text}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <textarea
            value={editorText}
            onChange={(e) => handleTextChange(e.target.value)}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '260px',
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
              lineHeight: '1.7',
              color: 'var(--text-main)',
              resize: 'vertical',
              fontFamily: 'var(--font-sans)'
            }}
          />
        )}

        {/* Structured Document Tables (Requirement 16) */}
        {editableTables.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.65rem'
              }}
            >
              <TableIcon size={16} color="var(--primary)" />
              <span>Extracted Structured Tables (Editable):</span>
            </div>

            {editableTables.map((tbl, tblIdx) => (
              <div
                key={tbl.id || tblIdx}
                style={{
                  overflowX: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-elevated)',
                  marginBottom: '1rem'
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', borderBottom: '1px solid var(--border-medium)' }}>
                      {tbl.headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          style={{ padding: '0.6rem 0.85rem', color: '#fff', fontWeight: 600, borderRight: '1px solid var(--border-subtle)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.rows.map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{ padding: '0.4rem 0.6rem', borderRight: '1px solid var(--border-subtle)' }}>
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleTableCellChange(tblIdx, rIdx, cIdx, e.target.value)}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                fontSize: '0.84rem',
                                padding: '2px 4px'
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
