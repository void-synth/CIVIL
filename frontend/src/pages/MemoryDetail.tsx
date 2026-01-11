/**
 * Memory Detail Page
 * 
 * Phase 5: Legacy & Memory Layer (LifeBank)
 * 
 * View detailed information about a memory record
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMemoryRecord } from '../services/api';
import type { MemoryRecordResponse } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Alert } from '../components/ui/Alert';

export function MemoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [memory, setMemory] = useState<MemoryRecordResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Memory ID is required');
      setIsLoading(false);
      return;
    }

    loadMemory();
  }, [id]);

  const loadMemory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMemoryRecord(id!);
      setMemory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memory');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="error">
          {error || 'Memory not found'}
        </Alert>
        <div className="mt-6 text-center">
          <Link to="/memories" className="text-primary-600 hover:text-primary-700">
            ← Back to Memories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/memories"
          className="text-primary-600 hover:text-primary-700 inline-flex items-center"
        >
          ← Back to Memories
        </Link>
      </div>

      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {memory.isMilestone && <span className="mr-2">🎯</span>}
              Memory Record
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="info" size="md">
                {memory.memoryType}
              </Badge>
              {memory.emotion && (
                <Badge variant="default" size="md">
                  {memory.emotion}
                </Badge>
              )}
              {memory.isMilestone && memory.milestoneType && (
                <Badge variant="warning" size="md">
                  {memory.milestoneType}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/verify/${memory.truthRecordId}`)}
          >
            View Truth Record
          </Button>
        </div>
        <p className="text-gray-600">
          Created: {new Date(memory.createdAt).toLocaleString()}
          {memory.updatedAt !== memory.createdAt && (
            <> • Updated: {new Date(memory.updatedAt).toLocaleString()}</>
          )}
        </p>
      </header>

      <div className="space-y-6">
        {memory.significance && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Significance</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{memory.significance}</p>
          </Card>
        )}

        {memory.people && memory.people.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">People</h2>
            <div className="flex flex-wrap gap-2">
              {memory.people.map((person, idx) => (
                <Badge key={idx} variant="default" size="md">
                  {person}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {memory.milestoneDate && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Milestone Information</h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <span className="font-medium">Type:</span> {memory.milestoneType || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Date:</span>{' '}
                {new Date(memory.milestoneDate).toLocaleString()}
              </div>
            </div>
          </Card>
        )}

        {memory.mediaUrl && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Media</h2>
            <div className="space-y-2">
              <a
                href={memory.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                View Media
              </a>
              {memory.mediaHash && (
                <div className="text-sm text-gray-500 font-mono">
                  Hash: {memory.mediaHash}
                </div>
              )}
            </div>
          </Card>
        )}

        {memory.aiStructured != null && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {(() => {
                  if (typeof memory.aiStructured === 'string') {
                    return memory.aiStructured;
                  }
                  try {
                    return JSON.stringify(memory.aiStructured as Record<string, unknown>, null, 2);
                  } catch {
                    return String(memory.aiStructured);
                  }
                })()}
              </pre>
            </div>
            <Alert variant="info" className="mt-4">
              <strong>Note:</strong> AI analysis is a secondary artifact and does not modify
              the original sealed truth record.
            </Alert>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Technical Details</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Memory ID:</span>
              <div className="font-mono text-gray-900 mt-1">{memory.id}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Truth Record ID:</span>
              <div className="font-mono text-gray-900 mt-1">{memory.truthRecordId}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Owner ID:</span>
              <div className="font-mono text-gray-900 mt-1">{memory.ownerId}</div>
            </div>
            {memory.accessRevokedAt && (
              <div>
                <span className="font-medium text-red-700">Access Revoked:</span>
                <div className="text-red-600 mt-1">
                  {new Date(memory.accessRevokedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/verify/${memory.truthRecordId}`)}
            className="flex-1"
          >
            Verify Truth Record
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/memories')}
            className="flex-1"
          >
            Back to Memories
          </Button>
        </div>
      </div>
    </div>
  );
}
