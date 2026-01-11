# Frontend Design Decisions

This document explains the design decisions made in the CIVIL frontend implementation.

## Overall Approach

### Clarity Over Beauty

**Decision**: No styling framework, minimal CSS, functional over decorative.

**Rationale**:
- CIVIL is serious, not flashy
- Users need to understand what's happening, not be impressed
- Minimal styling reduces complexity and loading time
- System fonts ensure maximum readability
- No animations or transitions (yet) - just functional UI

### Single-Page Flow

**Decision**: No routing yet, single page with state management.

**Rationale**:
- MVP focus: core flow only
- Simpler to implement and debug
- No routing complexity needed yet
- Can add routing later when needed (dashboard, etc.)

### Type Safety

**Decision**: TypeScript strict mode, type-safe API calls.

**Rationale**:
- Catches errors at compile time
- Self-documenting code
- Matches backend types
- Better IDE support

## Component Design

### CreateRecordForm

**Decisions**:
- Clear labels (not placeholders) for accessibility
- Character counters for length limits
- Required fields clearly marked
- Warning about immutability
- Large textarea for content
- Event timestamp defaults to now

**Rationale**:
- Accessibility: screen readers need labels
- User feedback: character counters show limits
- Clarity: users know what's required
- Trust: warning builds confidence (transparency)
- Usability: large textarea for writing
- Convenience: default timestamp saves time

### RecordVerification

**Decisions**:
- All technical data in monospace font
- Copy buttons for all IDs and hashes
- Clear sections for different information types
- Verification button to check integrity
- Status indicators (subtle, not bright)

**Rationale**:
- Readability: monospace for technical data
- Usability: users need to copy IDs/hashes
- Organization: clear sections reduce cognitive load
- Trust: verification builds confidence
- Calm: subtle status, not alarming

## API Service Design

### Simple Fetch Implementation

**Decision**: Use native `fetch`, not axios or other libraries.

**Rationale**:
- No extra dependencies
- Native browser API
- Sufficient for MVP needs
- Can upgrade later if needed

### Type-Safe Responses

**Decision**: Type all API responses, validate data exists.

**Rationale**:
- Type safety catches errors
- Runtime validation ensures data exists
- Clear error messages if API changes

### Error Handling

**Decision**: Clear error messages, not technical jargon.

**Rationale**:
- Users need to understand errors
- Technical errors are logged to console
- User-facing errors are helpful

## Styling Decisions

### No CSS Framework

**Decision**: Pure CSS, no Tailwind, Bootstrap, etc.

**Rationale**:
- Maximum control
- No framework lock-in
- Smaller bundle size
- Clarity: see exactly what styles are applied

### System Fonts

**Decision**: Use system font stack.

**Rationale**:
- Maximum readability
- No loading delays
- Native feel
- Works everywhere

### Monospace for Technical Data

**Decision**: Hashes, IDs, timestamps in monospace font.

**Rationale**:
- Technical data needs fixed-width
- Easier to read and compare
- Standard practice for code/data

### Generous Spacing

**Decision**: 24px-32px padding, 16px-24px margins.

**Rationale**:
- Elements breathe
- Reduces visual clutter
- Easier to read
- Calm feeling

### No Colors (Almost)

**Decision**: Black, white, gray only. Green for success, amber for warnings, red for errors (subtle).

**Rationale**:
- Serious, not playful
- Calm, not urgent
- Trust-focused, not flashy
- Colors only for status, not decoration

## State Management

### useState Only

**Decision**: No Redux, Zustand, or other state management.

**Rationale**:
- Simple state needs simple solution
- No complex state yet
- Can add later if needed
- Less complexity for MVP

### Component State

**Decision**: State lives in components, not global.

**Rationale**:
- Simpler to understand
- No prop drilling yet
- Can refactor later if needed

## User Experience Decisions

### Loading States

**Decision**: Show what's happening ("Sealing record...", "Creating hash...").

**Rationale**:
- Users know what's happening
- Builds trust (transparency)
- Reduces anxiety
- Not just "Loading..."

### Error Messages

**Decision**: Clear, helpful messages, not technical errors.

**Rationale**:
- Users need to understand
- Technical details in console
- Actionable messages
- Calm, not alarming

### Copy Buttons

**Decision**: Copy buttons for all IDs and hashes.

**Rationale**:
- Users need these values
- Manual copying is error-prone
- Standard practice
- Builds trust (easy to use)

### Verification

**Decision**: Users can verify records themselves.

**Rationale**:
- Builds trust (transparency)
- Independent verification
- Educational (users learn how it works)
- Aligns with CIVIL Constitution

## What We're NOT Doing (Yet)

### No Authentication

**Rationale**: MVP focus on core flow. Auth adds complexity.

### No Routing

**Rationale**: Single-page flow is sufficient for MVP.

### No State Management Library

**Rationale**: Simple state doesn't need complex solution.

### No Styling Framework

**Rationale**: Pure CSS gives maximum control and clarity.

### No Animations

**Rationale**: Functional over decorative. Can add later.

### No File Uploads

**Rationale**: MVP accepts metadata only. File storage comes later.

### No Dashboard

**Rationale**: MVP focuses on creation flow. Dashboard comes later.

## Future Considerations

When adding features, consider:

1. **Authentication**: How to handle user state
2. **Routing**: When to add React Router
3. **State Management**: When to add Redux/Zustand
4. **Styling**: When to add CSS framework (if needed)
5. **File Uploads**: How to handle large files
6. **Dashboard**: How to list and manage records
7. **Sharing**: How to implement sharing UI
8. **Export**: How to generate export files

## Principles Applied

1. **Clarity**: Everything is clear and understandable
2. **Simplicity**: No unnecessary complexity
3. **Trust**: Every element builds confidence
4. **Calm**: No urgency, no pressure
5. **Functional**: Works well, not just looks good
6. **Accessible**: Usable by everyone
7. **Type-Safe**: Errors caught at compile time
8. **Maintainable**: Easy to understand and modify

These decisions ensure the frontend aligns with CIVIL's mission: serious, trustworthy, and focused on the core value proposition.
