/**
 * Memories Page
 * 
 * Phase 5: Legacy & Memory Layer (LifeBank)
 * 
 * View and manage memory records that wrap CIVIL truth records.
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listMemoryRecords } from '../services/api';
import type { MemoryRecordResponse } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Alert } from '../components/ui/Alert';

export function MemoriesPage() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<MemoryRecordResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    memoryType?: string;
    isMilestone?: boolean;
    emotion?: string;
  }>({});

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMemories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Get ownerId from auth
      const ownerId = 'anonymous';
      const result = await listMemoryRecords(ownerId);
      setMemories(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memories');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Memories</h1>
          <p className="text-gray-600">
            Your memory records wrapping CIVIL truth records
          </p>
        </div>
        <Button
          onClick={() => navigate('/memories/create')}
          variant="primary"
          size="lg"
        >
          + Create Memory
        </Button>
      </header>

      {/* Filters */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.memoryType || ''}
            onChange={(e) => setFilters({ ...filters, memoryType: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="photo">Photo</option>
            <option value="document">Document</option>
          </select>

          <select
            value={filters.isMilestone === undefined ? '' : filters.isMilestone ? 'true' : 'false'}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                isMilestone: value === '' ? undefined : value === 'true',
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Memories</option>
            <option value="true">Milestones Only</option>
            <option value="false">Non-Milestones</option>
          </select>

          <input
            type="text"
            placeholder="Filter by emotion..."
            value={filters.emotion || ''}
            onChange={(e) => setFilters({ ...filters, emotion: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[200px]"
          />

          <Button
            onClick={() => setFilters({})}
            variant="outline"
            size="md"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && memories.length === 0 && (
        <Card>
          <EmptyState
            icon="💭"
            title="No Memories Yet"
            description="Create your first memory record to preserve a moment in time."
            action={{
              label: 'Create Memory',
              onClick: () => navigate('/memories/create'),
            }}
          />
        </Card>
      )}

      {/* Memories Grid */}
      {!isLoading && !error && memories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <Card
              key={memory.id}
              hover
              onClick={() => navigate(`/memories/${memory.id}`)}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {memory.isMilestone && <span className="mr-2">🎯</span>}
                      Memory Record
                    </h3>
                    <Badge variant="info" size="sm">
                      {memory.memoryType}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {memory.emotion && (
                      <Badge variant="default" size="sm">
                        {memory.emotion}
                      </Badge>
                    )}
                    {memory.isMilestone && memory.milestoneType && (
                      <Badge variant="warning" size="sm">
                        {memory.milestoneType}
                      </Badge>
                    )}
                  </div>
                  
                  {memory.significance && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {memory.significance}
                    </p>
                  )}
                  
                  {memory.people && memory.people.length > 0 && (
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="font-medium">People:</span> {memory.people.join(', ')}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-auto">
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
