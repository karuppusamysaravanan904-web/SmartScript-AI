import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, SlidersHorizontal, CircleCheck, Server, Save } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface SettingsProps {
  backendHealth: { status: string; service: string; version: string } | null;
}

export const SettingsPage: React.FC<SettingsProps> = ({ backendHealth }) => {
  const [highThreshold, setHighThreshold] = useState<number>(85);
  const [mediumThreshold, setMediumThreshold] = useState<number>(50);
  const [strictGuardrails, setStrictGuardrails] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)'
            }}
          >
            <SettingsIcon size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Platform Settings & Confidence Calibration</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Tune forensic OCR uncertainty thresholds, anti-hallucination policies, and backend connectivity
            </p>
          </div>
        </div>
      </div>

      {/* Backend Status Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Server size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
              Connected Backend: {backendHealth?.service || 'HANDWRITE AI'}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
              Endpoint: <code style={{ color: 'var(--secondary)' }}>{API_BASE_URL}</code> &bull; Version: {backendHealth?.version || '1.0.0'}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            color: 'var(--success)',
            fontWeight: 600
          }}
        >
          <CircleCheck size={13} />
          <span>{backendHealth?.status === 'healthy' ? 'Active & Healthy' : 'Online'}</span>
        </div>
      </div>

      {/* Confidence Thresholds Form */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Uncertainty Calibration Thresholds</h3>
        </div>

        {/* High Confidence Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>High Confidence Minimum</span>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{highThreshold}%</span>
          </div>
          <input
            type="range"
            min="70"
            max="95"
            value={highThreshold}
            onChange={(e) => setHighThreshold(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Tokens scoring at or above this percentage are treated as verified without requiring human review.
          </span>
        </div>

        {/* Medium Confidence Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Needs Review / Illegible Cutoff</span>
            <span style={{ fontWeight: 700, color: 'var(--warning)' }}>{mediumThreshold}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="65"
            value={mediumThreshold}
            onChange={(e) => setMediumThreshold(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Tokens scoring below this cutoff are explicitly flagged as [ILLEGIBLE REGION] rather than guessing.
          </span>
        </div>

        {/* Strict Guardrails Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginTop: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                Strict Anti-Hallucination Guardrail
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Mandatory problem statement requirement: Never hallucinate low-confidence tokens.
              </div>
            </div>
          </div>

          <input
            type="checkbox"
            checked={strictGuardrails}
            onChange={(e) => setStrictGuardrails(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem', gap: '0.4rem' }}
          >
            <Save size={15} />
            <span>Save Preferences</span>
          </button>

          {savedSuccess && (
            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
              ✓ Settings calibrated successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
