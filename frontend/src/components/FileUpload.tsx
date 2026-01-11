/**
 * File Upload Component
 * 
 * Handles file uploads with:
 * - Drag and drop support
 * - Multiple file selection
 * - File preview
 * - SHA-256 hash calculation
 * - Upload progress
 * - File type validation
 */

import { useState, useRef, useCallback } from 'react';

export interface FileWithHash {
  file: File;
  hash: string;
  preview?: string;
  uploadProgress?: number;
  uploaded?: boolean;
  error?: string;
}

interface FileUploadProps {
  files: FileWithHash[];
  onFilesChange: (files: FileWithHash[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

/**
 * Calculate SHA-256 hash of a file
 */
async function calculateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generate preview URL for image/video files
 */
function generatePreview(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    } else {
      resolve(undefined);
    }
  });
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB default
  acceptedTypes,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const fileArray = Array.from(fileList);

      // Validate file count
      if (files.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setIsProcessing(true);

      try {
        const processedFiles: FileWithHash[] = await Promise.all(
          fileArray.map(async (file) => {
            // Validate file size
            if (file.size > maxSize) {
              throw new Error(`${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
            }

            // Validate file type
            if (acceptedTypes && !acceptedTypes.includes(file.type)) {
              throw new Error(`${file.name} has unsupported file type`);
            }

            // Calculate hash and generate preview
            const [hash, preview] = await Promise.all([
              calculateFileHash(file),
              generatePreview(file),
            ]);

            return {
              file,
              hash,
              preview,
              uploadProgress: 0,
              uploaded: false,
            };
          })
        );

        onFilesChange([...files, ...processedFiles]);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to process files');
      } finally {
        setIsProcessing(false);
      }
    },
    [files, maxFiles, maxSize, acceptedTypes, onFilesChange]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        // Reset input so same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles);
    },
    [files, onFilesChange]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
    return '📎';
  };

  return (
    <div>
      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>
        Attachments (optional)
      </label>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#2d3748' : '#cbd5e0'}`,
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          backgroundColor: isDragging ? '#f7fafc' : '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '16px',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes?.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        {isProcessing ? (
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            <p style={{ color: '#718096' }}>Processing files...</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📎</div>
            <p style={{ marginBottom: '4px', fontWeight: 500 }}>
              {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
            </p>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              Supports images, videos, audio, documents, and archives
            </p>
            <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>
              Max {maxFiles} files, {formatFileSize(maxSize)} each
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          {files.map((fileWithHash, index) => (
            <div
              key={`${fileWithHash.file.name}-${index}`}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '12px',
                alignItems: 'start',
              }}
            >
              {/* Preview or Icon */}
              {fileWithHash.preview ? (
                <img
                  src={fileWithHash.preview}
                  alt={fileWithHash.file.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}
                >
                  {getFileIcon(fileWithHash.file.type)}
                </div>
              )}

              {/* File Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px', wordBreak: 'break-word' }}>
                  {fileWithHash.file.name}
                </div>
                <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                  {formatFileSize(fileWithHash.file.size)} • {fileWithHash.file.type}
                </div>
                {fileWithHash.hash && (
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: '#a0aec0',
                      wordBreak: 'break-all',
                    }}
                  >
                    Hash: {fileWithHash.hash.substring(0, 16)}...
                  </div>
                )}
                {fileWithHash.error && (
                  <div style={{ fontSize: '12px', color: '#742a2a', marginTop: '4px' }}>
                    {fileWithHash.error}
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  flexShrink: 0,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: '14px', color: '#718096', marginTop: '8px' }}>
        File hashes are calculated and included in the sealed record for integrity verification.
      </div>
    </div>
  );
}
