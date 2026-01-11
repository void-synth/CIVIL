/**
 * Create Memory Page
 * 
 * Phase 5: Legacy & Memory Layer (LifeBank)
 * 
 * Create a memory record that wraps a CIVIL truth record.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMemoryRecord } from '../services/api';
import { createTruthRecord } from '../services/api';

export function CreateMemoryPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'truth' | 'memory'>('truth');
  const [truthRecord, setTruthRecord] = useState<any>(null);
  const [memoryData, setMemoryData] = useState({
    memoryType: 'text' as 'text' | 'audio' | 'video' | 'photo' | 'document',
    emotion: '',
    significance: '',
    people: [] as string[],
    isMilestone: false,
    milestoneType: '',
    milestoneDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTruthRecord = async (formData: {
    title: string;
    content: string;
    eventTimestamp: string;
  }) => {
    try {
      const record = await createTruthRecord({
        ...formData,
        description: '',
        tags: [],
      });
      setTruthRecord(record);
      setStep('memory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create truth record');
    }
  };

  const handleCreateMemory = async () => {
    if (!truthRecord) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Get ownerId from auth
      const ownerId = 'anonymous';
      
      await createMemoryRecord({
        ownerId,
        truthRecordId: truthRecord.id,
        title: memoryData.memoryType, // Using memoryType as title for now
        description: memoryData.significance || undefined,
        mediaType: memoryData.memoryType,
        emotionalContext: {
          emotion: memoryData.emotion || undefined,
          people: memoryData.people.length > 0 ? memoryData.people : undefined,
          isMilestone: memoryData.isMilestone,
          milestoneType: memoryData.milestoneType || undefined,
          milestoneDate: memoryData.milestoneDate || undefined,
        },
      });

      navigate('/memories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'truth') {
    return (
      <div className="container">
        <header style={{ marginBottom: '32px' }}>
          <h1>Create Memory</h1>
          <p style={{ color: '#718096', fontSize: '18px' }}>
            Step 1: Create a truth record, then add emotional context
          </p>
        </header>

        <div className="section">
          <h2>Create Truth Record</h2>
          <TruthRecordForm onSubmit={handleCreateTruthRecord} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '32px' }}>
        <h1>Create Memory</h1>
        <p style={{ color: '#718096', fontSize: '18px' }}>
          Step 2: Add emotional context to your truth record
        </p>
      </header>

      {error && (
        <div className="section">
          <div className="error">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="section" style={{ marginBottom: '24px' }}>
        <h3>Truth Record Created</h3>
        <p style={{ color: '#718096' }}>
          <strong>Title:</strong> {truthRecord?.title}
        </p>
        <p style={{ color: '#718096' }}>
          <strong>Record ID:</strong> {truthRecord?.id}
        </p>
      </div>

      <div className="section">
        <h2>Memory Details</h2>

        <div style={{ marginBottom: '24px' }}>
          <label>Memory Type</label>
          <select
            value={memoryData.memoryType}
            onChange={(e) => setMemoryData({ ...memoryData, memoryType: e.target.value as any })}
            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
          >
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="photo">Photo</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label>Emotion (optional)</label>
          <input
            type="text"
            value={memoryData.emotion}
            onChange={(e) => setMemoryData({ ...memoryData, emotion: e.target.value })}
            placeholder="e.g., joy, gratitude, love"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label>Significance (optional)</label>
          <textarea
            value={memoryData.significance}
            onChange={(e) => setMemoryData({ ...memoryData, significance: e.target.value })}
            placeholder="Why does this memory matter to you?"
            rows={4}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label>People (optional, comma-separated)</label>
          <input
            type="text"
            value={memoryData.people.join(', ')}
            onChange={(e) => setMemoryData({
              ...memoryData,
              people: e.target.value.split(',').map(p => p.trim()).filter(p => p),
            })}
            placeholder="e.g., John, Jane, Mom"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={memoryData.isMilestone}
              onChange={(e) => setMemoryData({ ...memoryData, isMilestone: e.target.checked })}
            />
            This is a life milestone
          </label>
        </div>

        {memoryData.isMilestone && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label>Milestone Type</label>
              <select
                value={memoryData.milestoneType}
                onChange={(e) => setMemoryData({ ...memoryData, milestoneType: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
              >
                <option value="">Select type...</option>
                <option value="birth">Birth</option>
                <option value="graduation">Graduation</option>
                <option value="marriage">Marriage</option>
                <option value="achievement">Achievement</option>
                <option value="loss">Loss</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label>Milestone Date</label>
              <input
                type="datetime-local"
                value={memoryData.milestoneDate}
                onChange={(e) => setMemoryData({ ...memoryData, milestoneDate: e.target.value })}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <button
            onClick={() => setStep('truth')}
            type="button"
          >
            Back
          </button>
          <button
            onClick={handleCreateMemory}
            disabled={isSubmitting}
            className="primary"
            type="button"
          >
            {isSubmitting ? 'Creating Memory...' : 'Create Memory'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TruthRecordForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    eventTimestamp: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      eventTimestamp: new Date(formData.eventTimestamp).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <label>Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label>Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={8}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label>Event Timestamp *</label>
        <input
          type="datetime-local"
          value={formData.eventTimestamp}
          onChange={(e) => setFormData({ ...formData, eventTimestamp: e.target.value })}
          required
        />
      </div>

      <button type="submit" className="primary">
        Create Truth Record
      </button>
    </form>
  );
}
