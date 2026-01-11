/**
 * API Service for Supabase Edge Functions
 * 
 * Updated to use Supabase Edge Functions instead of Express backend.
 * 
 * All functions now call: https://iitnfvqesrrninypeuvx.supabase.co/functions/v1/[function-name]
 */

import type {
  CreateTruthRecordRequest,
  TruthRecordResponse,
  PublicKeyResponse,
  VerificationBundle,
  MemoryRecordResponse,
  MilestoneResponse,
} from '../types';

// Local type definitions
export interface VerificationResult {
  isValid: boolean;
  integrityValid: boolean;
  signatureValid: boolean;
  timestampValid: boolean | null;
  message: string;
}

export interface AttachmentMetadata {
  filename: string;
  mimeType: string;
  size: number;
  hash: string;
  url: string;
  storagePath: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://iitnfvqesrrninypeuvx.supabase.co/functions/v1';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Get authorization headers for Supabase Edge Functions
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add Supabase anon key if available (for authentication)
  if (SUPABASE_ANON_KEY) {
    headers['apikey'] = SUPABASE_ANON_KEY;
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  return headers;
}

/**
 * Create a truth record
 */
export async function createTruthRecord(data: CreateTruthRecordRequest): Promise<TruthRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/create-record`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get a truth record by ID
 */
export async function getTruthRecord(id: string): Promise<TruthRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/get-record?id=${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Record not found');
    }
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Verify record integrity
 */
export async function verifyRecord(id: string): Promise<VerificationResult> {
  const response = await fetch(`${API_BASE_URL}/verify-record?id=${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get public key
 */
export async function getPublicKey(): Promise<PublicKeyResponse> {
  const response = await fetch(`${API_BASE_URL}/public-key`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get verification bundle
 */
export async function getVerificationBundle(id: string): Promise<VerificationBundle> {
  const response = await fetch(`${API_BASE_URL}/verification-bundle?id=${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Upload a file
 */
export async function uploadFile(file: File, ownerId: string, recordId: string): Promise<AttachmentMetadata> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ownerId', ownerId);
  formData.append('recordId', recordId);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      // Don't set Content-Type for FormData - browser will set it with boundary
      ...(SUPABASE_ANON_KEY && {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  ownerId: string,
  recordId: string
): Promise<AttachmentMetadata[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('ownerId', ownerId);
  formData.append('recordId', recordId);

  const response = await fetch(`${API_BASE_URL}/upload-multiple`, {
    method: 'POST',
    headers: {
      ...(SUPABASE_ANON_KEY && {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Memory Records API
 */
export async function createMemoryRecord(data: {
  truthRecordId: string;
  ownerId: string;
  title?: string;
  description?: string;
  mediaUrls?: string[];
  mediaType?: string;
  emotionalContext?: unknown;
}): Promise<MemoryRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/create-memory`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getMemoryRecord(id: string): Promise<MemoryRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/get-memory?id=${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export async function listMemoryRecords(ownerId: string, page = 1, limit = 20): Promise<{
  data: MemoryRecordResponse[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const response = await fetch(`${API_BASE_URL}/list-memories?ownerId=${ownerId}&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return await response.json();
}

export async function updateMemoryRecord(id: string, data: {
  title?: string;
  description?: string;
  mediaUrls?: string[];
  mediaType?: string;
  emotionalContext?: unknown;
}): Promise<MemoryRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/update-memory?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Milestone API
 */
export async function createMilestone(data: {
  ownerId: string;
  title: string;
  description?: string;
  milestoneDate: string;
  unlockDate?: string;
  memoryRecordIds?: string[];
}): Promise<MilestoneResponse> {
  const response = await fetch(`${API_BASE_URL}/create-milestone`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getMilestone(id: string): Promise<MilestoneResponse> {
  const response = await fetch(`${API_BASE_URL}/get-milestone?id=${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export async function listMilestones(ownerId: string, page = 1, limit = 20): Promise<{
  data: MilestoneResponse[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const response = await fetch(`${API_BASE_URL}/list-milestones?ownerId=${ownerId}&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return await response.json();
}

export async function updateMilestone(id: string, data: {
  title?: string;
  description?: string;
  milestoneDate?: string;
  unlockDate?: string;
  memoryRecordIds?: string[];
}): Promise<MilestoneResponse> {
  const response = await fetch(`${API_BASE_URL}/update-milestone?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}
