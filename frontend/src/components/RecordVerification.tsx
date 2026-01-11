/**
 * Record Verification Component
 * 
 * Displays the sealed record with all verification details.
 * Also includes a link to the public verification page.
 * 
 * Design decisions:
 * - All technical data (hashes, IDs, timestamps) in monospace font
 * - Copy buttons for all IDs and hashes (users need these)
 * - Clear sections for different types of information
 * - Verification button to check integrity
 * - Link to public verification page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TruthRecordResponse } from '../types';
import { verifyRecord } from '../services/api';

interface RecordVerificationProps {
  record: TruthRecordResponse;
}

export function RecordVerification({ record }: RecordVerificationProps) {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await verifyRecord(record.id);
      setVerificationResult({
        isValid: result.isValid,
        message: result.message,
      });
    } catch (error) {
      setVerificationResult({
        isValid: false,
        message: error instanceof Error ? error.message : 'Verification failed',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="section">
      <h2>Record Sealed Successfully</h2>

      <div className="success-message">
        <p>
          <strong>Your truth record has been cryptographically sealed.</strong>
        </p>
        <p style={{ marginBottom: 0 }}>
          This record is immutable and verifiable. The cryptographic proof below
          can be used to verify the record's integrity independently of CIVIL servers.
        </p>
      </div>

      <div style={{ marginBottom: '24px', padding: '16px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
        <p style={{ marginBottom: '8px' }}>
          <strong>Public Verification Link:</strong>
        </p>
        <p style={{ marginBottom: '8px', fontSize: '14px', color: '#718096' }}>
          Share this link with anyone to verify this record (no login required):
        </p>
        <div className="technical">
          {window.location.origin}/verify/{record.id}
          <button
            className="copy-button"
            onClick={() => handleCopy(`${window.location.origin}/verify/${record.id}`, 'link')}
            type="button"
          >
            {copiedField === 'link' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button
          onClick={() => navigate(`/verify/${record.id}`)}
          className="primary"
          type="button"
          style={{ marginTop: '8px' }}
        >
          View Public Verification Page
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Record Information</h3>
        <div style={{ marginBottom: '16px' }}>
          <div className="technical-label">Title</div>
          <div>{record.title}</div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div className="technical-label">Content</div>
          <div style={{ whiteSpace: 'pre-wrap', padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            {record.content}
          </div>
        </div>
        {record.description && (
          <div style={{ marginBottom: '16px' }}>
            <div className="technical-label">Description</div>
            <div>{record.description}</div>
          </div>
        )}
        {record.tags && record.tags.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div className="technical-label">Tags</div>
            <div>{record.tags.join(', ')}</div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>CIVIL Record ID</h3>
        <div className="technical">
          {record.id}
          <button
            className="copy-button"
            onClick={() => handleCopy(record.id, 'id')}
            type="button"
          >
            {copiedField === 'id' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
          This is your permanent record identifier. Save this for future reference.
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Timestamps</h3>
        <div style={{ marginBottom: '12px' }}>
          <div className="technical-label">Event Timestamp</div>
          <div className="technical">{new Date(record.eventTimestamp).toISOString()}</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div className="technical-label">Sealed Timestamp</div>
          <div className="technical">{new Date(record.sealedTimestamp).toISOString()}</div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Cryptographic Proof</h3>
        <div style={{ marginBottom: '12px' }}>
          <div className="technical-label">Content Hash (SHA-256)</div>
          <div className="technical">
            {record.contentHash}
            <button
              className="copy-button"
              onClick={() => handleCopy(record.contentHash, 'hash')}
              type="button"
            >
              {copiedField === 'hash' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
            This hash proves the record content has not been modified.
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div className="technical-label">Digital Signature</div>
          <div className="technical">
            {record.signature}
            <button
              className="copy-button"
              onClick={() => handleCopy(record.signature, 'signature')}
              type="button"
            >
              {copiedField === 'signature' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
            This signature proves the record's authenticity.
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div className="technical-label">Sealing Version</div>
          <div className="technical">{record.sealingVersion}</div>
          <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
            Version of the sealing algorithm used.
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Record Status</h3>
        <div>
          <span className={`status ${record.status === 'SEALED' ? 'success' : ''}`}>
            {record.status}
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#718096', marginTop: '8px' }}>
          Version: {record.version}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Verify Integrity</h3>
        <p style={{ marginBottom: '16px', color: '#718096' }}>
          Verify that this record has not been tampered with by checking the
          cryptographic proof.
        </p>
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="primary"
          type="button"
        >
          {isVerifying ? 'Verifying...' : 'Verify Record Integrity'}
        </button>

        {verificationResult && (
          <div
            className={verificationResult.isValid ? 'success-message' : 'error'}
            style={{ marginTop: '16px' }}
          >
            <p style={{ marginBottom: 0 }}>
              <strong>{verificationResult.isValid ? '✓ Verified' : '✗ Verification Failed'}</strong>
            </p>
            <p style={{ marginBottom: 0 }}>{verificationResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
