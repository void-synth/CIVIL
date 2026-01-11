/**
 * Verify Record Page
 * 
 * Standalone verification view for CIVIL records.
 * Accessible without login - anyone with a record ID can verify.
 * 
 * Design decisions:
 * - No authentication required (public verification)
 * - Shows all cryptographic proof
 * - Explains how to verify independently
 * - Clear instructions for skeptics
 * - Copy buttons for all technical data
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTruthRecord, verifyRecord, getPublicKey, getVerificationBundle } from '../services/api';
import type { TruthRecordResponse, PublicKeyResponse, VerificationBundle } from '../types';

export function VerifyRecord() {
  const { recordId } = useParams<{ recordId: string }>();
  const [record, setRecord] = useState<TruthRecordResponse | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKeyResponse | null>(null);
  const [verificationBundle, setVerificationBundle] = useState<VerificationBundle | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    integrityValid: boolean;
    signatureValid: boolean;
    timestampValid: boolean | null;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!recordId) {
      setError('Record ID is required');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [recordData, publicKeyData, bundleData] = await Promise.all([
          getTruthRecord(recordId),
          getPublicKey(),
          getVerificationBundle(recordId).catch(() => null), // Optional, don't fail if missing
        ]);
        setRecord(recordData);
        setPublicKey(publicKeyData);
        setVerificationBundle(bundleData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load record');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

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
    if (!recordId) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await verifyRecord(recordId);
      setVerificationResult({
        isValid: result.isValid,
        integrityValid: result.integrityValid,
        signatureValid: result.signatureValid,
        timestampValid: result.timestampValid,
        message: result.message,
      });
    } catch (err) {
      setVerificationResult({
        isValid: false,
        integrityValid: false,
        signatureValid: false,
        timestampValid: null,
        message: err instanceof Error ? err.message : 'Verification failed',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="section">
          <div className="loading">
            <h2>Loading Record</h2>
            <p>Fetching record data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="container">
        <div className="section">
          <div className="error">
            <h2>Error</h2>
            <p>{error || 'Record not found'}</p>
            <p style={{ marginTop: '16px', marginBottom: 0 }}>
              Make sure you have the correct record ID.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1>CIVIL Record Verification</h1>
        <p style={{ color: '#718096', fontSize: '18px' }}>
          Independent verification of a sealed truth record
        </p>
      </header>

      <div className="section">
        <h2>Record Information</h2>
        <div style={{ marginBottom: '16px' }}>
          <div className="technical-label">Title</div>
          <div>{record.title}</div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div className="technical-label">Content</div>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              padding: '12px',
              background: '#f7fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
            }}
          >
            {record.content}
          </div>
        </div>
        {record.description && (
          <div style={{ marginBottom: '16px' }}>
            <div className="technical-label">Description</div>
            <div>{record.description}</div>
            <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
              Note: Description is not part of the sealed content and can be modified.
            </div>
          </div>
        )}
      </div>

      <div className="section">
        <h2>CIVIL Record ID</h2>
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
          This is the permanent identifier for this record.
        </div>
      </div>

      <div className="section">
        <h2>Timestamps</h2>
        <div style={{ marginBottom: '12px' }}>
          <div className="technical-label">Event Timestamp</div>
          <div className="technical">
            {new Date(record.eventTimestamp).toISOString()}
            <button
              className="copy-button"
              onClick={() => handleCopy(new Date(record.eventTimestamp).toISOString(), 'eventTimestamp')}
              type="button"
            >
              {copiedField === 'eventTimestamp' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
            When the event occurred (as recorded by the user).
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div className="technical-label">Sealed Timestamp</div>
          <div className="technical">
            {new Date(record.sealedTimestamp).toISOString()}
            <button
              className="copy-button"
              onClick={() => handleCopy(new Date(record.sealedTimestamp).toISOString(), 'sealedTimestamp')}
              type="button"
            >
              {copiedField === 'sealedTimestamp' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
            When CIVIL cryptographically sealed this record.
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Cryptographic Proof</h2>
        
        <div style={{ marginBottom: '16px' }}>
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
            SHA-256 hash of the sealed content. Any modification to the content
            will produce a different hash.
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
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
            Digital signature proving the record's authenticity.
          </div>
        </div>

        {publicKey && (
          <div style={{ marginBottom: '16px' }}>
            <div className="technical-label">Public Key (for signature verification)</div>
            <div className="technical" style={{ maxHeight: '150px', overflow: 'auto', fontSize: '12px' }}>
              {publicKey.publicKeyPEM}
              <button
                className="copy-button"
                onClick={() => handleCopy(publicKey.publicKeyPEM, 'publicKey')}
                type="button"
              >
                {copiedField === 'publicKey' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
              CIVIL's public key (version {publicKey.version}). Use this to verify the signature independently.
              Algorithm: {publicKey.algorithm} ({publicKey.curve})
            </div>
          </div>
        )}

        {record.timestampProof && (
          <div style={{ marginBottom: '16px' }}>
            <div className="technical-label">Timestamp Proof (RFC 3161)</div>
            <div className="technical" style={{ maxHeight: '150px', overflow: 'auto', fontSize: '12px' }}>
              {record.timestampProof}
              <button
                className="copy-button"
                onClick={() => handleCopy(record.timestampProof!, 'timestampProof')}
                type="button"
              >
                {copiedField === 'timestampProof' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
              Cryptographic proof that this record existed at the sealed timestamp. This prevents backdating.
            </div>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <div className="technical-label">Sealing Method</div>
          <div className="technical">{record.sealingVersion}</div>
          <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
            Version of the cryptographic sealing algorithm used.
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div className="technical-label">Record Version</div>
          <div className="technical">{record.version}</div>
          <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
            Version number. Original records are version 1.
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div className="technical-label">Record Status</div>
          <div>
            <span className={`status ${record.status === 'SEALED' ? 'success' : ''}`}>
              {record.status}
            </span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Automated Verification</h2>
        <p style={{ marginBottom: '16px', color: '#718096' }}>
          Click the button below to have CIVIL verify this record's integrity.
          This checks that the stored hash matches the computed hash from the content.
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
              <strong>
                {verificationResult.isValid ? '✓ Verified' : '✗ Verification Failed'}
              </strong>
            </p>
            <p style={{ marginBottom: 0 }}>{verificationResult.message}</p>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Independent Verification (For Skeptics)</h2>
        <p style={{ marginBottom: '16px', color: '#718096' }}>
          You don't need to trust CIVIL to verify this record. You can verify it
          yourself using standard cryptographic tools. Here's how:
        </p>

        <div style={{ marginBottom: '24px' }}>
          <h3>Step 1: Prepare the Sealable Content</h3>
          <p style={{ marginBottom: '12px' }}>
            The hash is computed from the following fields in this exact format:
          </p>
          <div className="technical" style={{ marginBottom: '12px' }}>
            {JSON.stringify(
              {
                id: record.id,
                ownerId: record.ownerId,
                title: record.title,
                content: record.content,
                eventTimestamp: record.eventTimestamp,
                ...(record.location && { location: record.location }),
              },
              null,
              2
            )}
          </div>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            Note: This JSON must be sorted by key names and have no extra whitespace.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3>Step 2: Compute the SHA-256 Hash</h3>
          <p style={{ marginBottom: '12px' }}>
            Use any SHA-256 hashing tool to compute the hash of the JSON above:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
            <li>
              <strong>Command line:</strong>{' '}
              <code>echo -n '[JSON]' | shasum -a 256</code> (macOS/Linux)
            </li>
            <li>
              <strong>Command line:</strong>{' '}
              <code>echo -n '[JSON]' | sha256sum</code> (Linux)
            </li>
            <li>
              <strong>Online:</strong> Use any SHA-256 hash calculator
            </li>
            <li>
              <strong>Python:</strong>{' '}
              <code>import hashlib; hashlib.sha256(json_string.encode()).hexdigest()</code>
            </li>
            <li>
              <strong>Node.js:</strong>{' '}
              <code>require('crypto').createHash('sha256').update(json_string).digest('hex')</code>
            </li>
          </ul>
          <div style={{ padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div className="technical-label">Expected Hash:</div>
            <div className="technical">{record.contentHash}</div>
          </div>
          <p style={{ fontSize: '14px', color: '#718096', marginTop: '8px' }}>
            If your computed hash matches the stored hash above, the record has not been modified.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3>Step 3: Verify the Timestamp</h3>
          <p style={{ marginBottom: '12px' }}>
            The sealed timestamp shows when the record was sealed. Verify that:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
            <li>The sealed timestamp is after the event timestamp</li>
            <li>The sealed timestamp is in the past (not future-dated)</li>
            <li>The timestamp format is valid ISO 8601</li>
          </ul>
          <div style={{ padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div className="technical-label">Event Timestamp:</div>
            <div className="technical">{new Date(record.eventTimestamp).toISOString()}</div>
            <div className="technical-label" style={{ marginTop: '8px' }}>Sealed Timestamp:</div>
            <div className="technical">{new Date(record.sealedTimestamp).toISOString()}</div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3>Step 4: Verify the Digital Signature</h3>
          <p style={{ marginBottom: '12px' }}>
            To verify the digital signature, you need:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
            <li>The public key used to sign the record (shown above)</li>
            <li>The signature algorithm (ECDSA P-256)</li>
            <li>The content hash that was signed</li>
          </ul>
          {publicKey && (
            <div style={{ padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px', marginBottom: '12px' }}>
              <div className="technical-label">Public Key:</div>
              <div className="technical" style={{ fontSize: '12px', maxHeight: '100px', overflow: 'auto' }}>
                {publicKey.publicKeyPEM}
              </div>
            </div>
          )}
          <div style={{ marginBottom: '12px' }}>
            <strong>Using OpenSSL:</strong>
            <pre style={{ padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'auto' }}>
{`# Save public key to file
echo "${publicKey?.publicKeyPEM || 'PUBLIC_KEY_PEM'}" > public_key.pem

# Convert hash from hex to binary
echo -n "${record.contentHash}" | xxd -r -p > content_hash.bin

# Convert signature from base64 to binary
echo -n "${record.signature}" | base64 -d > signature.bin

# Verify signature
openssl dgst -sha256 -verify public_key.pem -signature signature.bin content_hash.bin`}
            </pre>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Using Node.js:</strong>
            <pre style={{ padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'auto' }}>
{`const crypto = require('crypto');
const publicKey = \`${publicKey?.publicKeyPEM || 'PUBLIC_KEY_PEM'}\`;
const hash = Buffer.from('${record.contentHash}', 'hex');
const signature = Buffer.from('${record.signature}', 'base64');
const verify = crypto.createVerify('SHA256');
verify.update(hash);
const isValid = verify.verify(publicKey, signature);
console.log('Signature valid:', isValid);`}
            </pre>
          </div>
        </div>

        {record.timestampProof && (
          <div style={{ marginBottom: '24px' }}>
            <h3>Step 5: Verify Timestamp Proof (RFC 3161)</h3>
            <p style={{ marginBottom: '12px' }}>
              This record includes a cryptographic timestamp proof. To verify:
            </p>
            <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
              <li>Decode timestamp proof from base64</li>
              <li>Parse RFC 3161 ASN.1 timestamp token</li>
              <li>Verify timestamp authority signature</li>
              <li>Extract hash from token and compare with contentHash</li>
              <li>Verify timestamp is within acceptable range</li>
            </ul>
            <div className="warning">
              <p style={{ marginBottom: 0 }}>
                <strong>Note:</strong> Timestamp verification requires RFC 3161 ASN.1 parsing.
                Use pkijs/asn1js libraries for proper verification.
              </p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h3>What This Proves</h3>
          <p style={{ marginBottom: '12px' }}>
            If the hash matches, this proves:
          </p>
          <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
            <li>
              <strong>Integrity:</strong> The record content has not been modified since sealing
            </li>
            <li>
              <strong>Authenticity:</strong> The record was sealed by CIVIL (via signature)
            </li>
            <li>
              <strong>Temporal Proof:</strong> The record existed at the sealed timestamp
            </li>
          </ul>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            This verification works independently of CIVIL servers. You can export
            this data and verify it offline.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3>Export Verification Bundle</h3>
          <p style={{ marginBottom: '12px' }}>
            Download the complete verification bundle containing all data needed for offline verification:
          </p>
          {verificationBundle ? (
            <>
              <div className="technical" style={{ maxHeight: '300px', overflow: 'auto' }}>
                {JSON.stringify(verificationBundle, null, 2)}
              </div>
              <button
                className="copy-button"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(verificationBundle, null, 2),
                    'export'
                  )
                }
                type="button"
                style={{ marginTop: '8px' }}
              >
                {copiedField === 'export' ? 'Copied!' : 'Copy Verification Bundle'}
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(verificationBundle, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `civil-verification-bundle-${record.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="primary"
                type="button"
                style={{ marginTop: '8px', marginLeft: '8px' }}
              >
                Download Verification Bundle
              </button>
            </>
          ) : (
            <>
              <div className="technical" style={{ maxHeight: '300px', overflow: 'auto' }}>
                {JSON.stringify(
                  {
                    id: record.id,
                    ownerId: record.ownerId,
                    title: record.title,
                    content: record.content,
                    eventTimestamp: record.eventTimestamp,
                    sealedTimestamp: record.sealedTimestamp,
                    contentHash: record.contentHash,
                    signature: record.signature,
                    version: record.version,
                    status: record.status,
                    sealingVersion: record.sealingVersion,
                    ...(record.location && { location: record.location }),
                    ...(publicKey && { publicKey: publicKey.publicKeyPEM }),
                    ...(record.timestampProof && { timestampProof: record.timestampProof }),
                  },
                  null,
                  2
                )}
              </div>
              <button
                className="copy-button"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      {
                        id: record.id,
                        ownerId: record.ownerId,
                        title: record.title,
                        content: record.content,
                        eventTimestamp: record.eventTimestamp,
                        sealedTimestamp: record.sealedTimestamp,
                        contentHash: record.contentHash,
                        signature: record.signature,
                        version: record.version,
                        status: record.status,
                        sealingVersion: record.sealingVersion,
                        ...(record.location && { location: record.location }),
                        ...(publicKey && { publicKey: publicKey.publicKeyPEM }),
                        ...(record.timestampProof && { timestampProof: record.timestampProof }),
                      },
                      null,
                      2
                    ),
                    'export'
                  )
                }
                type="button"
                style={{ marginTop: '8px' }}
              >
                {copiedField === 'export' ? 'Copied!' : 'Copy All Data'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="section" style={{ textAlign: 'center' }}>
        <a href="/" style={{ color: '#2d3748', textDecoration: 'none' }}>
          ← Back to Create Record
        </a>
      </div>
    </div>
  );
}
