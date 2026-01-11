/**
 * Posthumous Delivery Page
 * 
 * Phase 5: Legacy & Memory Layer (LifeBank)
 * 
 * Configure posthumous delivery of memories
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getPosthumousDelivery,
  createPosthumousDelivery,
  updatePosthumousDelivery,
} from '../services/api-posthumous';
import type { PosthumousDeliveryResponse } from '../services/api-posthumous';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

export function PosthumousDeliveryPage() {
  const [config, setConfig] = useState<PosthumousDeliveryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Get ownerId from auth
      const ownerId = 'anonymous';
      const data = await getPosthumousDelivery(ownerId);
      setConfig(data);
    } catch (err) {
      // If 404, config doesn't exist yet - that's okay
      if (err instanceof Error && err.message.includes('404')) {
        setConfig(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      }
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Posthumous Delivery</h1>
        <p className="text-gray-600">
          Configure how your memories will be delivered after your death
        </p>
      </header>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {!config ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📮</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Configuration Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Set up posthumous delivery to ensure your memories reach your loved ones
              after you're gone.
            </p>
            <Button
              onClick={() => setShowEditModal(true)}
              variant="primary"
              size="lg"
            >
              Create Configuration
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Current Configuration</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Last updated: {new Date(config.updatedAt).toLocaleString()}
                </p>
              </div>
              <Badge
                variant={config.enabled ? 'success' : 'default'}
                size="md"
              >
                {config.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Status
                </label>
                <Badge
                  variant={
                    config.deliveryStatus === 'DELIVERED'
                      ? 'success'
                      : config.deliveryStatus === 'VERIFIED'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {config.deliveryStatus}
                </Badge>
              </div>

              {config.deliveryDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(config.deliveryDate).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipients
                </label>
                {config.recipients.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recipients configured</p>
                ) : (
                  <div className="space-y-2">
                    {config.recipients.map((recipient, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="font-medium text-gray-900">
                          {recipient.name || recipient.email}
                        </div>
                        {recipient.name && (
                          <div className="text-sm text-gray-600">{recipient.email}</div>
                        )}
                        {recipient.relationship && (
                          <div className="text-sm text-gray-500">
                            Relationship: {recipient.relationship}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Memory Records
                </label>
                <p className="text-gray-900">
                  {config.memoryRecordIds.length} memory record(s) will be delivered
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Required
                </label>
                <Badge variant={config.verificationRequired ? 'warning' : 'default'}>
                  {config.verificationRequired ? 'Yes' : 'No'}
                </Badge>
                {config.verificationMethod && (
                  <p className="text-sm text-gray-600 mt-1">
                    Method: {config.verificationMethod}
                  </p>
                )}
              </div>

              {config.verifiedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verified At
                  </label>
                  <p className="text-gray-900">
                    {new Date(config.verifiedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={() => setShowEditModal(true)}
                variant="primary"
                className="flex-1"
              >
                Edit Configuration
              </Button>
              {config.verificationRequired && config.deliveryStatus === 'PENDING' && (
                <Button
                  onClick={() => {
                    // TODO: Implement verification modal
                    alert('Verification functionality coming soon');
                  }}
                  variant="outline"
                >
                  Verify Death
                </Button>
              )}
            </div>
          </Card>

          <Alert variant="info">
            <strong>Important:</strong> Posthumous delivery requires verification of death
            before memories can be delivered. Make sure to configure verification methods
            and inform your recipients about the process.
          </Alert>
        </div>
      )}

      {showEditModal && (
        <PosthumousDeliveryModal
          config={config}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            loadConfig();
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

function PosthumousDeliveryModal({
  config,
  onClose,
  onSuccess,
}: {
  config: PosthumousDeliveryResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    enabled: config?.enabled ?? true,
    deliveryDate: config?.deliveryDate
      ? new Date(config.deliveryDate).toISOString().slice(0, 16)
      : '',
    recipients: config?.recipients || [{ email: '', name: '', relationship: '', message: '' }],
    memoryRecordIds: config?.memoryRecordIds || [],
    verificationRequired: config?.verificationRequired ?? false,
    verificationMethod: config?.verificationMethod || '',
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

      if (config) {
        await updatePosthumousDelivery(config.id, {
          enabled: formData.enabled,
          deliveryDate: formData.deliveryDate
            ? new Date(formData.deliveryDate).toISOString()
            : undefined,
          recipients: formData.recipients.filter((r) => r.email),
          memoryRecordIds: formData.memoryRecordIds,
          verificationRequired: formData.verificationRequired,
          verificationMethod: formData.verificationMethod || undefined,
        });
      } else {
        await createPosthumousDelivery({
          ownerId,
          enabled: formData.enabled,
          deliveryDate: formData.deliveryDate
            ? new Date(formData.deliveryDate).toISOString()
            : undefined,
          recipients: formData.recipients.filter((r) => r.email),
          memoryRecordIds: formData.memoryRecordIds,
          verificationRequired: formData.verificationRequired,
          verificationMethod: formData.verificationMethod || undefined,
        });
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRecipient = () => {
    setFormData({
      ...formData,
      recipients: [...formData.recipients, { email: '', name: '', relationship: '', message: '' }],
    });
  };

  const removeRecipient = (index: number) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter((_, i) => i !== index),
    });
  };

  const updateRecipient = (index: number, field: string, value: string) => {
    const newRecipients = [...formData.recipients];
    newRecipients[index] = { ...newRecipients[index], [field]: value };
    setFormData({ ...formData, recipients: newRecipients });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {config ? 'Edit' : 'Create'} Posthumous Delivery Configuration
          </h2>
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
          <div className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="enabled" className="ml-2 text-sm font-medium text-gray-700">
                Enable posthumous delivery
              </label>
            </div>

            <Input
              label="Delivery Date (optional)"
              type="datetime-local"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              helperText="If set, delivery will occur on this specific date"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <div className="space-y-4">
                {formData.recipients.map((recipient, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Recipient {index + 1}</h4>
                        {formData.recipients.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecipient(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        label="Email *"
                        type="email"
                        required
                        value={recipient.email}
                        onChange={(e) =>
                          updateRecipient(index, 'email', e.target.value)
                        }
                      />
                      <Input
                        label="Name"
                        value={recipient.name}
                        onChange={(e) =>
                          updateRecipient(index, 'name', e.target.value)
                        }
                      />
                      <Input
                        label="Relationship"
                        value={recipient.relationship}
                        onChange={(e) =>
                          updateRecipient(index, 'relationship', e.target.value)
                        }
                        helperText="e.g., Spouse, Child, Friend"
                      />
                      <Textarea
                        label="Personal Message (optional)"
                        value={recipient.message}
                        onChange={(e) =>
                          updateRecipient(index, 'message', e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRecipient}
                >
                  + Add Recipient
                </Button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="verificationRequired"
                checked={formData.verificationRequired}
                onChange={(e) =>
                  setFormData({ ...formData, verificationRequired: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="verificationRequired"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Require death verification before delivery
              </label>
            </div>

            {formData.verificationRequired && (
              <Input
                label="Verification Method"
                value={formData.verificationMethod}
                onChange={(e) =>
                  setFormData({ ...formData, verificationMethod: e.target.value })
                }
                helperText="e.g., Death certificate, Legal notice, etc."
              />
            )}

            <Alert variant="warning">
              <strong>Note:</strong> Memory record selection will be implemented in a future update.
              For now, all memories will be delivered.
            </Alert>
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
              {config ? 'Update' : 'Create'} Configuration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
