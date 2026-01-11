/**
 * Posthumous Delivery API Service
 * 
 * Handles posthumous delivery API calls to Edge Functions
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

export interface PosthumousDeliveryResponse {
  id: string;
  ownerId: string;
  enabled: boolean;
  deliveryDate?: string;
  recipients: Array<{
    email: string;
    name?: string;
    relationship?: string;
    message?: string;
  }>;
  memoryRecordIds: string[];
  verificationRequired: boolean;
  verificationMethod?: string;
  deliveryStatus: 'PENDING' | 'VERIFIED' | 'DELIVERED';
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createPosthumousDelivery(data: {
  ownerId: string;
  enabled: boolean;
  deliveryDate?: string;
  recipients?: Array<{
    email: string;
    name?: string;
    relationship?: string;
    message?: string;
  }>;
  memoryRecordIds?: string[];
  verificationRequired?: boolean;
  verificationMethod?: string;
}): Promise<PosthumousDeliveryResponse> {
  const response = await fetch(`${API_BASE_URL}/posthumous-delivery`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<PosthumousDeliveryResponse> = await response.json();
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

export async function getPosthumousDelivery(ownerId: string): Promise<PosthumousDeliveryResponse> {
  const response = await fetch(`${API_BASE_URL}/posthumous-delivery?ownerId=${ownerId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<PosthumousDeliveryResponse> = await response.json();
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

export async function updatePosthumousDelivery(
  id: string,
  data: {
    enabled?: boolean;
    deliveryDate?: string;
    recipients?: Array<{
      email: string;
      name?: string;
      relationship?: string;
      message?: string;
    }>;
    memoryRecordIds?: string[];
    verificationRequired?: boolean;
    verificationMethod?: string;
  }
): Promise<PosthumousDeliveryResponse> {
  const response = await fetch(`${API_BASE_URL}/posthumous-delivery?id=${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<unknown> = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<PosthumousDeliveryResponse> = await response.json();
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}

export async function verifyDeathAndTriggerDelivery(
  id: string,
  data: {
    verificationMethod: string;
    verificationData: unknown;
  }
): Promise<{
  id: string;
  verified: boolean;
  verifiedAt: string;
  deliveryStatus: string;
}> {
  const response = await fetch(`${API_BASE_URL}/posthumous-delivery/verify?id=${id}`, {
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
    verified: boolean;
    verifiedAt: string;
    deliveryStatus: string;
  }> = await response.json();
  
  if (!result.data) {
    throw new Error('Invalid response: missing data');
  }

  return result.data;
}
