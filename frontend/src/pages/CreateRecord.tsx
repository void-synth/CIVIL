/**
 * Create Record Page
 * 
 * Page for creating a new truth record.
 * After creation, redirects to verification view.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRecordForm, type CreateRecordFormData } from '../components/CreateRecordForm';
import { RecordVerification } from '../components/RecordVerification';
import { createTruthRecord } from '../services/api';
import type { TruthRecordResponse } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function CreateRecordPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<'form' | 'loading' | 'success' | 'error'>('form');
  const [record, setRecord] = useState<TruthRecordResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CreateRecordFormData) => {
    setState('loading');
    setError(null);

    try {
      const createdRecord = await createTruthRecord({
        title: formData.title,
        content: formData.content,
        eventTimestamp: formData.eventTimestamp,
        description: formData.description,
        tags: formData.tags ? (Array.isArray(formData.tags) ? formData.tags : [formData.tags]) : undefined,
        attachmentMetadata: formData.attachmentMetadata,
      });

      setRecord(createdRecord);
      setState('success');
      
      // Redirect to verification page after a short delay
      setTimeout(() => {
        navigate(`/verify/${createdRecord.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create record');
      setState('error');
    }
  };

  const handleCreateAnother = () => {
    setState('form');
    setRecord(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {state === 'form' && (
        <CreateRecordForm onSubmit={handleSubmit} isSubmitting={false} />
      )}

      {state === 'loading' && (
        <Card>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sealing Your Record</h2>
            <div className="space-y-2 text-gray-600">
              <p>Creating cryptographic hash...</p>
              <p>Generating digital signature...</p>
              <p>Storing record...</p>
            </div>
          </div>
        </Card>
      )}

      {state === 'error' && (
        <Card>
          <Alert variant="error" title="Error">
            {error || 'An error occurred while creating the record.'}
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={handleCreateAnother} variant="primary">
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {state === 'success' && record && (
        <>
          <RecordVerification record={record} />
          <Card className="mt-6">
            <div className="text-center">
              <Alert variant="success" className="mb-4">
                Record successfully sealed! Redirecting to verification page...
              </Alert>
              <Button onClick={handleCreateAnother} variant="primary" size="lg">
                Create Another Record
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
