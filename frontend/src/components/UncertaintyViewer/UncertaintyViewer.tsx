import React, { useState } from 'react';
import { WordToken } from '../../types';
import { Pen, X, ShieldAlert } from 'lucide-react';

interface UncertaintyViewerProps {
  token: WordToken | null;
  onClose: () => void;
  onApplyCorrection: (tokenId: string, action: 'accept' | 'edit' | 'mark_illegible', correctedText?: string) => void;
}

export const UncertaintyViewer: React.FC<UncertaintyViewerProps> = ({
  token,
  onClose,
  onApplyCorrection
}) => {
  if (!token) return null;

  const [editText, setEditText] = useState(token.text);
  const [isEditing, setIsEditing] = useState(false);

  const confidencePct = Math.round(token.confidence * 100);

  const handleSelectCandidate = (candidateText: string) => {
    onApplyCorrection(token.id, 'edit', candidateText);
  };

  const handleSaveManualEdit = () => {
    if (editText.trim()) {
      onApplyCorrection(token.id, 'edit', editText.trim());
      setIsEditing(false);
    }
  };

  const handleMarkIllegible = () => {
    onApplyCorrection(token.id, 'mark_illegible');
  };

  const handleAcceptCurrent = () => {
    onApplyCorrection(token.id, 'accept');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '380px',
        maxHeight: '85vh',
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px var(--primary-glow)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="var(--warning)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
            Uncertainty Region Inspector
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            color: 'var(--text-dim)',
            padding: '0.2rem',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        {/* Original Region Stroke Crop */}
        <div>
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: '0.4rem'
            }}
          >
            Original Handwriting Region:
          </div>

          <div
            style={{
              backgroundColor: '#05070c',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80px'
            }}
          >
            {token.crop_base64 ? (
              <img
                src={token.crop_base64}
                alt="Handwriting stroke crop"
                style={{
                  maxHeight: '90px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                }}
              />
            ) : (
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No stroke crop available</span>
            )}
          </div>
        </div>

        {/* Current status & Confidence */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.5rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Calibrated Confidence:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color:
                  confidencePct >= 85
                    ? 'var(--success)'
                    : confidencePct >= 50
                    ? 'var(--warning)'
                    : 'var(--danger)'
              }}
            >
              {confidencePct}%
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                padding: '1px 5px',
                borderRadius: '4px',
                background:
                  confidencePct >= 85
                    ? 'var(--success-bg)'
                    : confidencePct >= 50
                    ? 'var(--warning-bg)'
                    : 'var(--danger-bg)',
                color:
                  confidencePct >= 85
                    ? 'var(--success)'
                    : confidencePct >= 50
                    ? 'var(--warning)'
                    : 'var(--danger)',
                fontWeight: 600
              }}
            >
              {confidencePct >= 85 ? 'High' : confidencePct >= 50 ? 'Low' : 'Unreadable'}
            </span>
          </div>
        </div>

        {/* AI Candidates */}
        <div>
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: '0.4rem'
            }}
          >
            AI Candidate Interpretations:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {token.candidates && token.candidates.length > 0 ? (
              token.candidates.map((cand: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCandidate(cand)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: cand === token.text ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${cand === token.text ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                    color: '#fff',
                    fontSize: '0.84rem',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      cand === token.text ? 'var(--border-accent)' : 'var(--border-subtle)')
                  }
                >
                  <span>
                    <strong style={{ color: 'var(--text-dim)', marginRight: '0.4rem' }}>{idx + 1}.</strong>
                    {cand}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>Select</span>
                </button>
              ))
            ) : (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>No alternative candidates found</span>
            )}
          </div>
        </div>

        {/* Manual Editing Section */}
        <div>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Type accurate reading..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: '#05070c',
                  border: '1px solid var(--primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  color: '#fff'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSaveManualEdit}
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                >
                  Save Edit
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditing(true)}
                style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', gap: '0.35rem' }}
              >
                <Pen size={13} />
                <span>Edit Manually</span>
              </button>
              <button
                type="button"
                onClick={handleMarkIllegible}
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.78rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  color: 'var(--danger)',
                  fontWeight: 600
                }}
              >
                Flag Illegible
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
