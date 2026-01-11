/**
 * API Service
 * 
 * Handles all HTTP requests to the backend.
 * 
 * Design decisions:
 * - Simple fetch-based implementation (no axios)
 * - Type-safe request/response handling
 * - Clear error messages
 * - No authentication yet (will add later)
 */

import type {
  CreateTruthRecordRequest,
  TruthRecordResponse,
  ApiResponse,
  PublicKeyResponse,
  VerificationBundle,
  MemoryRecordResponse,
} from '../types';

// Supabase Edge Functions base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://iitnfvqesrrninypeuvx.supabase.co/functions/v1';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Get headers for API requests
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (SUPABASE_ANON_KEY) {
    headers['apikey'] = SUPABASE_ANON_KEY;
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  return headers;
}

/**
 * Create a new truth record
 * 
 * @param data - Record creation data
 * @returns The created and sealed truth record
 */
export async function createTruthRecord(
  data: CreateTruthRecordRequest
): Promise<TruthRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/create-record`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<TruthRecordResponse> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Get a truth record by ID
 * 
 * @param recordId - The record ID
 * @returns The truth record
 */
export async function getTruthRecord(recordId: string): Promise<TruthRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/get-record?id=${recordId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<TruthRecordResponse> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Verify a record's integrity
 * 
 * @param recordId - The record ID
 * @returns Verification result
 */
export async function verifyRecord(recordId: string): Promise<{
  recordId: string;
  isValid: boolean;
  integrityValid: boolean;
  signatureValid: boolean;
  timestampValid: boolean | null;
  message: string;
}> {
  const response = await fetch(`${API_BASE_URL}/verify-record?id=${recordId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{
    recordId: string;
    isValid: boolean;
    integrityValid: boolean;
    signatureValid: boolean;
    timestampValid: boolean | null;
    message: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Get CIVIL's public key for verification
 * 
 * @returns Public key information
 */
export async function getPublicKey(): Promise<PublicKeyResponse> {
  const response = await fetch(`${API_BASE_URL}/public-key`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<PublicKeyResponse> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Get verification bundle for a record
 * 
 * @param recordId - The record ID
 * @returns Complete verification bundle
 */
export async function getVerificationBundle(recordId: string): Promise<VerificationBundle> {
  const response = await fetch(`${API_BASE_URL}/verification-bundle?id=${recordId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<VerificationBundle> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Create a memory record
 * 
 * @param data - Memory record data
 * @returns Created memory record
 */
export async function createMemoryRecord(data: {
  ownerId: string;
  truthRecordId: string;
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
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<MemoryRecordResponse> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Get a memory record by ID
 * 
 * @param memoryId - Memory record ID
 * @returns Memory record
 */
export async function getMemoryRecord(memoryId: string): Promise<MemoryRecordResponse> {
  const response = await fetch(`${API_BASE_URL}/get-memory?id=${memoryId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<MemoryRecordResponse> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * List memory records
 * 
 * @param ownerId - User ID
 * @param filters - Optional filters
 * @returns List of memory records
 */
export async function listMemoryRecords(
  ownerId: string,
  page = 1,
  limit = 20
): Promise<{
  data: MemoryRecordResponse[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams({ ownerId, page: page.toString(), limit: limit.toString() });

  const response = await fetch(`${API_BASE_URL}/list-memories?${params.toString()}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result;
}

/**
 * Update a memory record
 */
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
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<MemoryRecordResponse> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Upload a file
 */
export async function uploadFile(file: File, ownerId: string, recordId: string): Promise<{
  filename: string;
  mimeType: string;
  size: number;
  hash: string;
  url: string;
  storagePath: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ownerId', ownerId);
  formData.append('recordId', recordId);

  const headers: HeadersInit = {};
  if (SUPABASE_ANON_KEY) {
    headers['apikey'] = SUPABASE_ANON_KEY;
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{
    filename: string;
    mimeType: string;
    size: number;
    hash: string;
    url: string;
    storagePath: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  ownerId: string,
  recordId: string
): Promise<Array<{
  filename: string;
  mimeType: string;
  size: number;
  hash: string;
  url: string;
  storagePath: string;
}>> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('ownerId', ownerId);
  formData.append('recordId', recordId);

  const headers: HeadersInit = {};
  if (SUPABASE_ANON_KEY) {
    headers['apikey'] = SUPABASE_ANON_KEY;
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  const response = await fetch(`${API_BASE_URL}/upload-multiple`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<Array<{
    filename: string;
    mimeType: string;
    size: number;
    hash: string;
    url: string;
    storagePath: string;
  }>> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}
