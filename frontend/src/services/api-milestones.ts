/**
 * Milestone API Service
 * 
 * Handles milestone-related API calls to Edge Functions
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

export interface MilestoneResponse {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  milestoneDate: string;
  unlockDate?: string;
  memoryRecordIds: string[];
  status: 'LOCKED' | 'UNLOCKED';
  createdAt: string;
  updatedAt: string;
}

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
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<MilestoneResponse> = await response.json();
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

export async function getMilestone(id: string): Promise<MilestoneResponse> {
  const response = await fetch(`${API_BASE_URL}/get-milestone?id=${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<MilestoneResponse> = await response.json();
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

export async function listMilestones(
  ownerId: string,
  page = 1,
  limit = 20
): Promise<{
  data: MilestoneResponse[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams({ ownerId, page: page.toString(), limit: limit.toString() });

  const response = await fetch(`${API_BASE_URL}/list-milestones?${params.toString()}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
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
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<MilestoneResponse> = await response.json();
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

export async function deleteMilestone(_id: string): Promise<void> {
  // Note: Delete endpoint may not exist yet, this is a placeholder
  // For now, we'll just throw an error or implement a workaround
  throw new Error('Delete milestone not yet implemented in API');
}
