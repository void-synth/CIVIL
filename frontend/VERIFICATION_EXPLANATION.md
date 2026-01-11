# Verification View - Design Decisions

## Overview

The verification view (`/verify/:recordId`) is a **public, standalone page** that allows anyone to verify a CIVIL record without requiring login or authentication. This is critical for CIVIL's mission of transparency and independent verification.

## Design Decisions

### 1. No Authentication Required

**Decision**: Verification page is completely public - no login, no API keys, no restrictions.

**Rationale**:
- **Transparency**: Anyone should be able to verify a record
- **Trust**: No barriers to verification builds confidence
- **Independence**: Verification works without CIVIL accounts
- **Legal Defensibility**: Third parties can verify without CIVIL's permission

### 2. Accessible by Record ID Only

**Decision**: Anyone with a record ID can access the verification page.

**Rationale**:
- **Simplicity**: Just need the ID, nothing else
- **Shareability**: Easy to share verification links
- **No Secrets**: No passwords or tokens needed
- **Public by Design**: Records can be verified publicly

### 3. Shows All Cryptographic Proof

**Decision**: Display hash, signature, timestamps, sealing method, and all metadata.

**Rationale**:
- **Transparency**: Everything needed for verification is visible
- **Trust**: No hidden information
- **Independence**: Users can verify without CIVIL's help
- **Education**: Users learn how verification works

### 4. Explains How Skeptics Can Verify

**Decision**: Detailed step-by-step instructions for independent verification.

**Rationale**:
- **Trust Building**: Shows CIVIL has nothing to hide
- **Education**: Teaches users about cryptographic verification
- **Independence**: Users don't need to trust CIVIL
- **Legal Defensibility**: Third parties can verify independently

## How a Skeptic Would Verify

### Step 1: Access the Verification Page

A skeptic receives a record ID (e.g., `550e8400-e29b-41d4-a716-446655440000`) and visits:
```
https://civil.example.com/verify/550e8400-e29b-41d4-a716-446655440000
```

**No login required** - the page loads immediately showing all record data.

### Step 2: Extract the Sealable Content

The skeptic sees the record content displayed on the page:
- Title
- Content
- Event timestamp
- Record ID
- Owner ID
- Location (if provided)

They can copy this data or export it as JSON.

### Step 3: Recreate the Canonical JSON

The skeptic needs to recreate the exact JSON format that was hashed. The page shows:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "ownerId": "user-uuid",
  "title": "Meeting Notes",
  "content": "The board met and decided...",
  "eventTimestamp": "2024-01-15T14:30:00.000Z"
}
```

**Critical**: The JSON must be:
- Sorted by key names (alphabetical)
- No extra whitespace
- Exact same format as when sealed

### Step 4: Compute SHA-256 Hash

The skeptic uses any SHA-256 tool to hash the JSON:

**Command Line (macOS/Linux):**
```bash
echo -n '{"content":"...","eventTimestamp":"...","id":"...","ownerId":"...","title":"..."}' | shasum -a 256
```

**Command Line (Linux):**
```bash
echo -n '{"content":"...","eventTimestamp":"...","id":"...","ownerId":"...","title":"..."}' | sha256sum
```

**Python:**
```python
import hashlib
import json

data = {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ownerId": "user-uuid",
    "title": "Meeting Notes",
    "content": "The board met and decided...",
    "eventTimestamp": "2024-01-15T14:30:00.000Z"
}

# Create canonical JSON (sorted keys, no whitespace)
canonical = json.dumps(data, sort_keys=True, separators=(',', ':'))

# Compute hash
hash_value = hashlib.sha256(canonical.encode('utf-8')).hexdigest()
print(hash_value)
```

**Node.js:**
```javascript
const crypto = require('crypto');

const data = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  ownerId: "user-uuid",
  title: "Meeting Notes",
  content: "The board met and decided...",
  eventTimestamp: "2024-01-15T14:30:00.000Z"
};

// Create canonical JSON
const canonical = JSON.stringify(data, Object.keys(data).sort());

// Compute hash
const hash = crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
console.log(hash);
```

**Online Tools:**
- Any SHA-256 hash calculator
- Just paste the JSON string and compute

### Step 5: Compare Hashes

The skeptic compares their computed hash with the stored hash shown on the page:

**Stored Hash (from CIVIL):**
```
a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
```

**Computed Hash (from skeptic):**
```
a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
```

**If they match**: The record has not been modified. ✅
**If they don't match**: The record has been tampered with. ❌

### Step 6: Verify Timestamps

The skeptic checks:
1. **Event timestamp** is in the past (not future-dated)
2. **Sealed timestamp** is after the event timestamp
3. **Sealed timestamp** is in the past (not future-dated)
4. **Timestamps are valid ISO 8601** format

### Step 7: Verify Digital Signature (Advanced)

To verify the signature, the skeptic would need:
- The public key used to sign the record
- The signature algorithm (ECDSA P-256)
- The content hash that was signed

**Current MVP**: Signature verification is handled by CIVIL. Future versions will provide public keys for independent verification.

### Step 8: Export and Verify Offline

The skeptic can export all the data as JSON and verify it completely offline:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "ownerId": "user-uuid",
  "title": "Meeting Notes",
  "content": "The board met and decided...",
  "eventTimestamp": "2024-01-15T14:30:00.000Z",
  "sealedTimestamp": "2024-01-15T15:00:00.000Z",
  "contentHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "signature": "base64-signature",
  "version": 1,
  "status": "SEALED",
  "sealingVersion": "1.0.0"
}
```

They can then:
- Verify the hash offline
- Check timestamps
- Store for future verification
- Share with others for independent verification

## What This Proves

If the hash matches, this proves:

1. **Integrity**: The record content has not been modified since sealing
2. **Authenticity**: The record was sealed by CIVIL (via signature)
3. **Temporal Proof**: The record existed at the sealed timestamp
4. **Independence**: Verification works without CIVIL servers

## Security Considerations

### Why This is Safe

1. **Read-Only Access**: Verification page only reads data, doesn't modify
2. **Public Data**: Record content is meant to be verifiable
3. **No Secrets**: No passwords or tokens exposed
4. **Cryptographic Proof**: Hash proves integrity independently

### What's Protected

1. **Record Content**: Public (by design - for verification)
2. **Owner ID**: Public (needed for verification)
3. **Hashes/Signatures**: Public (needed for verification)
4. **Timestamps**: Public (needed for verification)

### What's Not Exposed

1. **User Account Info**: Not shown (no login required)
2. **Access Control**: Not relevant (public verification)
3. **Internal IDs**: Only record ID shown
4. **Server Secrets**: Never exposed

## User Experience

### For Record Creators

- After creating a record, they get a verification link
- They can share this link with anyone
- No need to explain how to verify - the page does it

### For Skeptics

- They receive a record ID or link
- They visit the verification page (no login)
- They see all the proof
- They can verify independently
- They can export data for offline verification

### For Third Parties

- Lawyers can verify records independently
- Auditors can verify without CIVIL's help
- Journalists can verify sources
- Anyone can verify without trusting CIVIL

## Future Enhancements

1. **Public Key Display**: Show public keys for signature verification
2. **Verification Scripts**: Provide ready-to-use verification scripts
3. **Batch Verification**: Verify multiple records at once
4. **Verification API**: Programmatic verification endpoint
5. **Export Formats**: PDF, JSON, XML export options

## Conclusion

The verification view is designed to be:
- **Transparent**: Everything is visible
- **Independent**: Works without CIVIL's help
- **Educational**: Teaches how verification works
- **Trust-Building**: Shows CIVIL has nothing to hide
- **Legally Defensible**: Third parties can verify independently

This aligns with CIVIL's Constitution: **"Trust cannot be requested. It must be inspectable."**
