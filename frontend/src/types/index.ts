/**
 * Type Definitions
 * 
 * Shared TypeScript types for the frontend.
 * Matches backend API response types.
 */

export interface CreateTruthRecordRequest {
  title: string;
  content: string;
  eventTimestamp: string; // ISO 8601
  ownerId?: string;
  description?: string;
  tags?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  attachmentMetadata?: Array<{
    filename: string;
    mimeType: string;
    size: number;
    hash: string;
  }>;
}

export interface TruthRecordResponse {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  eventTimestamp: string;
  sealedTimestamp: string;
  contentHash: string;
  signature: string;
  version: number;
  status: string;
  sealingVersion: string;
  publicKeyVersion?: string;
  description?: string;
  tags?: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  timestampProof?: string | null;
}

export interface PublicKeyResponse {
  publicKeyPEM: string;
  version: string;
  algorithm: string;
  curve: string;
  createdAt: string;
}

export interface VerificationBundle {
  recordId: string;
  sealedTimestamp: string;
  eventTimestamp: string;
  sealingVersion: string;
  publicKeyVersion: string;
  sealableContent: Record<string, unknown>;
  contentHash: string;
  signature: string;
  publicKey: {
    pem: string;
    version: string;
    algorithm: string;
    curve: string;
    createdAt: string;
  };
  timestampProof?: string;
  verificationInstructions: {
    hashVerification: {
      description: string;
      steps: string[];
    };
    signatureVerification: {
      description: string;
      steps: string[];
    };
    timestampVerification?: {
      description: string;
      steps: string[];
      note?: string;
    };
  };
  guarantees: {
    integrity: string;
    authenticity: string;
    timestamp: string;
  };
  limitations: {
    contentTruth: string;
    authorship: string;
    timestampAccuracy?: string | null;
  };
}

export interface MemoryRecordResponse {
  id: string;
  truthRecordId: string;
  ownerId: string;
  memoryType: 'text' | 'audio' | 'video' | 'photo' | 'document';
  mediaUrl?: string;
  mediaHash?: string;
  emotion?: string;
  significance?: string;
  people?: string[];
  isMilestone: boolean;
  milestoneType?: string;
  milestoneDate?: string;
  posthumousDelivery?: unknown;
  aiStructured?: unknown;
  createdAt: string;
  updatedAt: string;
  accessRevokedAt?: string;
}

export interface MilestoneResponse {
  id: string;
  ownerId: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  truthRecordIds: string[];
  unlockDate?: string;
  unlockRecipients?: string[];
  createdAt: string;
  updatedAt: string;
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
  deliveryStatus: string;
  verifiedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}
