'use client';

import React from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import Modal from '../Modal/Modal';
import { BASE_URL } from '@/lib/api';
import { getAttachmentDisplayName } from '@/lib/fileUtils';

export default function AttachmentsModal({
  isOpen,
  onClose,
  reportId,
  attachments = [],
  saveButtonClass,
}) {
  const handleDownload = async (e, fileUrl, displayName) => {
    e.preventDefault();
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed, falling back to open:', error);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Attachments for Report #${reportId}`}
      footer={
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.85rem 1.75rem',
            background: 'white',
            border: '2px solid #e2e8f0',
            color: '#64748b',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.background = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.background = 'white';
          }}
        >
          Close
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
        {attachments.length > 0 ? (
          attachments.map((file, index) => {
            const fileUrl = `${BASE_URL}/${file.path}`;
            const sizeInKb = file.size ? (file.size / 1024).toFixed(1) : null;
            const isImage = file.mimetype && file.mimetype.startsWith('image/');
            const displayName = getAttachmentDisplayName(file);

            return (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        color: '#DC143C',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={24} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4
                        dir="auto"
                        style={{
                          margin: 0,
                          fontWeight: '700',
                          color: '#1e293b',
                          wordBreak: 'break-word',
                          fontSize: '0.95rem',
                        }}
                        title={displayName}
                      >
                        {displayName}
                      </h4>
                      {sizeInKb && (
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                          {sizeInKb} KB
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDownload(e, fileUrl, displayName)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#DC143C',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      width: '40px',
                      height: '40px',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                    title="View / Download File"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {isImage && (
                  <div
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #cbd5e1',
                      background: '#f1f5f9',
                    }}
                  >
                    <img
                      src={fileUrl}
                      alt={displayName}
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No attachments found.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
