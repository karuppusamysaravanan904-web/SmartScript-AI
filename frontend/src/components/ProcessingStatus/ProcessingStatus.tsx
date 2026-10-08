import React from 'react';
import { CircleCheck, Circle, Loader, Sparkles, CircleAlert } from 'lucide-react';
import { ProcessingStage } from '../../types';

interface ProcessingStatusProps {
  stages: ProcessingStage[];
  currentStage: string;
  isProcessing: boolean;
  error?: string | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  stages,
  currentStage,
  isProcessing,
  error
}) => {
  // Compute overall progress percentage based on completed stages
  const completedCount = stages.filter((s) => s.completed).length;
  const totalStages = stages.length || 9;
  const currentPercentage = Math.round((completedCount / totalStages) * 100);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        boxShadow: '0 0 30px rgba(99, 102, 241, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            {isProcessing ? <Loader size={18} className="animate-spin" /> : <Sparkles size={18} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {isProcessing ? 'Processing Handwritten Document' : 'Document Pipeline Completed'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Active Stage: <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{currentStage}</span>
            </p>
          </div>
        </div>

        {/* Progress percent badge */}
        <div
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: isProcessing ? 'var(--primary)' : 'var(--success)'
          }}
        >
          {currentPercentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${currentPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            borderRadius: '999px',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {/* Error display if present */}
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CircleAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Stages Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.65rem',
          paddingTop: '0.25rem'
        }}
      >
        {stages.map((stage, idx) => {
          const isCurrent = stage.name === currentStage;
          const isDone = stage.completed;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isCurrent
                  ? 'rgba(99, 102, 241, 0.12)'
                  : isDone
                  ? 'rgba(16, 185, 129, 0.06)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isCurrent
                    ? 'var(--border-accent)'
                    : isDone
                    ? 'var(--success-border)'
                    : 'var(--border-subtle)'
                }`,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Icon */}
              {isDone ? (
                <CircleCheck size={16} color="var(--success)" />
              ) : isCurrent ? (
                <Loader size={16} color="var(--primary)" className="animate-spin" />
              ) : (
                <Circle size={14} color="var(--text-dim)" />
              )}

              {/* Stage Name */}
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: isCurrent || isDone ? 600 : 400,
                  color: isCurrent
                    ? '#fff'
                    : isDone
                    ? 'var(--text-main)'
                    : 'var(--text-dim)'
                }}
              >
                {stage.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
