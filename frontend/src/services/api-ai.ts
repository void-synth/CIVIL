/**
 * AI Services API
 * 
 * Handles AI structuring and avatar API calls to Edge Functions
 */

import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://iitnfvqesrrninypeuvx.supabase.co/functions/v1';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
 * Request AI structuring for a memory
 */
export async function requestAIStructuring(memoryId: string): Promise<{
  memoryId: string;
  aiStructured: unknown;
  status: string;
}> {
  const response = await fetch(`${API_BASE_URL}/ai-structure?id=${memoryId}`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<{
    memoryId: string;
    aiStructured: unknown;
    status: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Get AI structured data for a memory
 */
export async function getAIStructured(memoryId: string): Promise<{
  memoryId: string;
  aiStructured: unknown | null;
}> {
  const response = await fetch(`${API_BASE_URL}/ai-structure?id=${memoryId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<{
    memoryId: string;
    aiStructured: unknown | null;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Accept or reject AI suggestions
 */
export async function acceptRejectAISuggestions(
  memoryId: string,
  action: 'accept' | 'reject'
): Promise<{
  memoryId: string;
  aiStructured: unknown | null;
  status: string;
}> {
  const response = await fetch(`${API_BASE_URL}/ai-structure?id=${memoryId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<{
    memoryId: string;
    aiStructured: unknown | null;
    status: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Create AI avatar
 */
export async function createAIAvatar(data: {
  ownerId: string;
  name: string;
  personality?: unknown;
  memoryRecordIds?: string[];
}): Promise<{
  id: string;
  ownerId: string;
  name: string;
  personality?: unknown;
  memoryRecordIds: string[];
  conversationHistory: unknown[];
  createdAt: string;
  updatedAt: string;
}> {
  const response = await fetch(`${API_BASE_URL}/ai-avatar`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<{
    id: string;
    ownerId: string;
    name: string;
    personality?: unknown;
    memoryRecordIds: string[];
    conversationHistory: unknown[];
    createdAt: string;
    updatedAt: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Get AI avatar
 */
export async function getAIAvatar(ownerId: string): Promise<{
  id: string;
  ownerId: string;
  name: string;
  personality?: unknown;
  memoryRecordIds: string[];
  conversationHistory: unknown[];
  createdAt: string;
  updatedAt: string;
}> {
  const response = await fetch(`${API_BASE_URL}/ai-avatar?ownerId=${ownerId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<{
    id: string;
    ownerId: string;
    name: string;
    personality?: unknown;
    memoryRecordIds: string[];
    conversationHistory: unknown[];
    createdAt: string;
    updatedAt: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Chat with AI avatar
 */
export async function chatWithAIAvatar(data: {
  avatarId: string;
  message: string;
  ownerId?: string;
}): Promise<{
  avatarId: string;
  response: string;
  conversationHistory: unknown[];
}> {
  const response = await fetch(`${API_BASE_URL}/ai-avatar/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<{
    avatarId: string;
    response: string;
    conversationHistory: unknown[];
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

/**
 * Update AI avatar
 */
export async function updateAIAvatar(id: string, data: {
  name?: string;
  personality?: unknown;
  memoryRecordIds?: string[];
}): Promise<{
  id: string;
  ownerId: string;
  name: string;
  personality?: unknown;
  memoryRecordIds: string[];
  conversationHistory: unknown[];
  createdAt: string;
  updatedAt: string;
}> {
  const response = await fetch(`${API_BASE_URL}/ai-avatar?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<{
    id: string;
    ownerId: string;
    name: string;
    personality?: unknown;
    memoryRecordIds: string[];
    conversationHistory: unknown[];
    createdAt: string;
    updatedAt: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}
