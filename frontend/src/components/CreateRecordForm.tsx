/**
 * Create Record Form Component
 * 
 * Form for creating a new truth record.
 * 
 * Design decisions:
 * - Clear labels (not placeholders) for accessibility
 * - Required fields clearly marked
 * - Warning about immutability before submission
 * - Large textarea for content (user needs space to write)
 * - Event timestamp defaults to now but can be adjusted
 * - Optional fields clearly marked
 * - Submit button says "Seal This Record" (not "Create" or "Submit")
 */

import { useState, FormEvent } from 'react';
import { FileUpload, FileWithHash } from './FileUpload';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Alert } from './ui/Alert';

export interface CreateRecordFormData {
  title: string;
  content: string;
  eventTimestamp: string;
  description?: string;
  tags?: string[];
  attachmentMetadata?: Array<{
    filename: string;
    mimeType: string;
    size: number;
    hash: string;
  }>;
}

interface CreateRecordFormProps {
  onSubmit: (data: CreateRecordFormData) => void;
  isSubmitting: boolean;
}

export function CreateRecordForm({ onSubmit, isSubmitting }: CreateRecordFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    eventTimestamp: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    description: '',
    tags: '', // Keep as string for form input
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateRecordFormData, string>>>({});
  const [files, setFiles] = useState<FileWithHash[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CreateRecordFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateRecordFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 500) {
      newErrors.title = 'Title must be 500 characters or less';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length > 10_000_000) {
      newErrors.content = 'Content must be 10,000,000 characters or less';
    }

    if (!formData.eventTimestamp) {
      newErrors.eventTimestamp = 'Event timestamp is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Convert datetime-local format to ISO 8601
    const eventTimestamp = new Date(formData.eventTimestamp).toISOString();

    // Parse tags (comma-separated)
    const tags = formData.tags
      ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : [];

    // Prepare attachment metadata
    const attachmentMetadata =
      files.length > 0
        ? files.map((f) => ({
            filename: f.file.name,
            mimeType: f.file.type,
            size: f.file.size,
            hash: f.hash,
          }))
        : undefined;

    onSubmit({
      title: formData.title.trim(),
      content: formData.content.trim(),
      eventTimestamp,
      description: formData.description?.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      attachmentMetadata,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Truth Record</h2>
        <p className="text-gray-600 mb-6">
          This record will be cryptographically sealed and cannot be modified.
        </p>

        <Alert variant="warning" className="mb-6">
          <strong>Warning:</strong> Once sealed, this record cannot be modified.
          Only new versions can reference the original.
        </Alert>

        <Input
          label="Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength={500}
          required
          error={errors.title}
          helperText={`${formData.title.length}/500 characters`}
        />

        <Textarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={12}
          error={errors.content}
          helperText={`${formData.content.length.toLocaleString()} characters`}
        />

        <Input
          label="Event Timestamp"
          type="datetime-local"
          name="eventTimestamp"
          value={formData.eventTimestamp}
          onChange={handleChange}
          required
          error={errors.eventTimestamp}
          helperText="When did this event occur? (Defaults to now)"
        />

        <Textarea
          label="Description (optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          helperText="Additional notes. This is not part of the sealed content and can be modified later."
        />

        <Input
          label="Tags (optional)"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="tag1, tag2, tag3"
          helperText="Comma-separated tags for organization. Not part of sealed content."
        />

        <div className="mb-6">
          <FileUpload files={files} onFilesChange={setFiles} maxFiles={10} />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting || files.some((f) => !f.hash)}
          className="w-full"
        >
          Seal This Record
        </Button>
      </Card>
    </form>
  );
}
