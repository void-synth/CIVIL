/**
 * Milestones Page
 * 
 * Phase 5: Legacy & Memory Layer (LifeBank)
 * 
 * View and manage life milestones
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listMilestones, createMilestone } from '../services/api-milestones';
import type { MilestoneResponse } from '../services/api-milestones';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Alert } from '../components/ui/Alert';

export function MilestonesPage() {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState<MilestoneResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Get ownerId from auth
      const ownerId = 'anonymous';
      const result = await listMilestones(ownerId);
      setMilestones(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load milestones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    
    try {
      // TODO: Implement delete when API supports it
      // For now, just show a message
      alert('Delete functionality coming soon. API endpoint needs to be implemented.');
      // await deleteMilestone(id);
      // await loadMilestones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete milestone');
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Life Milestones</h1>
          <p className="text-gray-600">
            Mark and remember significant moments in your life
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          size="lg"
        >
          + Create Milestone
        </Button>
      </header>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {milestones.length === 0 ? (
        <Card>
          <EmptyState
            icon="🎯"
            title="No Milestones Yet"
            description="Create your first milestone to mark a significant life event. Milestones can be locked until a specific date."
            action={{
              label: 'Create Milestone',
              onClick: () => setShowCreateModal(true),
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestones.map((milestone) => (
            <Card key={milestone.id} hover>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {milestone.title}
                    </h3>
                    <Badge
                      variant={milestone.status === 'UNLOCKED' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                  
                  {milestone.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {milestone.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div>
                      <span className="font-medium">Milestone Date:</span>{' '}
                      {new Date(milestone.milestoneDate).toLocaleDateString()}
                    </div>
                    {milestone.unlockDate && (
                      <div>
                        <span className="font-medium">Unlocks:</span>{' '}
                        {new Date(milestone.unlockDate).toLocaleDateString()}
                      </div>
                    )}
                    {milestone.memoryRecordIds && milestone.memoryRecordIds.length > 0 && (
                      <div>
                        <span className="font-medium">Memory Records:</span>{' '}
                        {milestone.memoryRecordIds.length}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/milestones/${milestone.id}`)}
                    className="flex-1"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(milestone.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateMilestoneModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadMilestones();
          }}
        />
      )}

      <div className="mt-8 text-center">
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function CreateMilestoneModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    milestoneDate: new Date().toISOString().slice(0, 16),
    unlockDate: '',
    memoryRecordIds: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // TODO: Get ownerId from auth
      const ownerId = 'anonymous';
      
      await createMilestone({
        ownerId,
        title: formData.title,
        description: formData.description || undefined,
        milestoneDate: new Date(formData.milestoneDate).toISOString(),
        unlockDate: formData.unlockDate ? new Date(formData.unlockDate).toISOString() : undefined,
        memoryRecordIds: formData.memoryRecordIds,
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create milestone');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Milestone</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milestone Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.milestoneDate}
                onChange={(e) => setFormData({ ...formData, milestoneDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unlock Date (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.unlockDate}
                onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                If set, this milestone will be locked until this date
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Create Milestone
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
