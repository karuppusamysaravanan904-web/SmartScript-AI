import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Layers } from 'lucide-react';
import { DocumentPage, WordToken } from '../../types';

interface DocumentViewerProps {
  pages: DocumentPage[];
  activePageNumber: number;
  onPageChange: (pageNum: number) => void;
  tokens: WordToken[];
  selectedTokenId?: string;
  onSelectToken: (token: WordToken) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  pages,
  activePageNumber,
  onPageChange,
  tokens,
  selectedTokenId,
  onSelectToken
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const activePage = pages.find((p) => p.page_number === activePageNumber) || pages[0];

  const handleZoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  // Filter tokens for this active page
  const pageTokens = tokens.filter((t) => t.page === activePageNumber);

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
      {/* Top Controls Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {/* Page selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {pages.length > 1 ? (
            pages.map((p) => (
              <button
                key={p.page_number}
                type="button"
                onClick={() => onPageChange(p.page_number)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor:
                    p.page_number === activePageNumber
                      ? 'var(--primary)'
                      : 'rgba(255, 255, 255, 0.05)',
                  color: p.page_number === activePageNumber ? '#fff' : 'var(--text-muted)'
                }}
              >
                Page {p.page_number}
              </button>
            ))
          ) : (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Original Document
            </span>
          )}
        </div>

        {/* Zoom & Rotation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Toggle Bounding Boxes */}
          <button
            type="button"
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            title="Toggle word bounding boxes"
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              background: showBoundingBoxes ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: showBoundingBoxes ? 'var(--primary)' : 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: showBoundingBoxes ? '1px solid var(--border-accent)' : 'none'
            }}
          >
            <Layers size={13} />
            <span>Tokens</span>
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 0.2rem' }} />

          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--text-muted)'
            }}
          >
            <ZoomOut size={16} />
          </button>

          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              minWidth: '40px',
              textAlign: 'center'
            }}
          >
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--text-muted)'
            }}
          >
            <ZoomIn size={16} />
          </button>

          <button
            type="button"
            onClick={handleRotate}
            title="Rotate 90°"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--text-muted)'
            }}
          >
            <RotateCw size={16} />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--text-muted)'
            }}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Interactive Image & Overlay Area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backgroundColor: '#05070c',
          position: 'relative'
        }}
      >
        {activePage ? (
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
              borderRadius: '6px',
              overflow: 'hidden'
            }}
          >
            <img
              src={activePage.image_base64}
              alt={`Page ${activePage.page_number}`}
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '680px',
                objectFit: 'contain',
                userSelect: 'none'
              }}
            />

            {/* Bounding box overlays */}
            {showBoundingBoxes &&
              pageTokens.map((tok) => {
                const isSelected = tok.id === selectedTokenId;
                const [bx, by, bw, bh] = tok.bbox;
                const pw = activePage.width || 800;
                const ph = activePage.height || 600;

                // Relative percentages
                const leftPct = (bx / pw) * 100;
                const topPct = (by / ph) * 100;
                const widthPct = (bw / pw) * 100;
                const heightPct = (bh / ph) * 100;

                return (
                  <div
                    key={tok.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectToken(tok);
                    }}
                    title={`${tok.text} (${Math.round(tok.confidence * 100)}%)`}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                      cursor: 'pointer',
                      border: `1.5px solid ${
                        isSelected
                          ? 'var(--primary)'
                          : tok.status === 'unreadable'
                          ? 'var(--danger)'
                          : tok.status === 'needs_review'
                          ? 'var(--warning)'
                          : 'rgba(16, 185, 129, 0.5)'
                      }`,
                      backgroundColor: isSelected
                        ? 'rgba(99, 102, 241, 0.35)'
                        : tok.status === 'unreadable'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : tok.status === 'needs_review'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(16, 185, 129, 0.08)',
                      borderRadius: '2px',
                      zIndex: isSelected ? 10 : 2,
                      boxShadow: isSelected ? '0 0 8px var(--primary)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                );
              })}
          </div>
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            No document page loaded
          </div>
        )}
      </div>
    </div>
  );
};
