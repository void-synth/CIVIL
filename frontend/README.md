# CIVIL Frontend

Frontend application for CIVIL - A neutral system for sealing real-world events into verifiable truth records.

## Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Minimal CSS (no framework)

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── CreateRecordForm.tsx
│   │   └── RecordVerification.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
└── package.json             # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` and proxy API requests to the backend.

### Environment Variables

Create a `.env` file (optional):
```bash
VITE_API_URL=http://localhost:3000/api/v1
```

## Features

### Current Implementation

- ✅ Create truth record form
- ✅ Submit to backend API
- ✅ Display CIVIL Record ID
- ✅ Display verification details (hash, signature, timestamp)
- ✅ Verify record integrity
- ✅ Copy IDs and hashes to clipboard

### Not Yet Implemented

- ❌ Authentication
- ❌ Dashboard (list of records)
- ❌ View existing records
- ❌ Share records
- ❌ Export records
- ❌ File uploads

## Design Decisions

### Clarity Over Beauty

- **No styling framework**: Pure CSS for maximum control and clarity
- **System fonts**: Maximum readability, no loading delays
- **Monospace for technical data**: Hashes, IDs, timestamps in code font
- **Clear labels**: Not placeholders, for accessibility
- **Generous spacing**: Elements breathe, no clutter
- **No animations**: Functional, not decorative

### User Experience

- **Single-page flow**: No routing complexity yet
- **Clear error messages**: Helpful, not technical
- **Loading states**: User knows what's happening
- **Copy buttons**: Users need IDs and hashes
- **Verification**: Users can verify records themselves

### Code Organization

- **Type safety**: TypeScript throughout
- **Service layer**: API calls separated from components
- **Component separation**: Form and verification are separate
- **Simple state**: useState, no complex state management yet

## API Integration

The frontend calls the backend API at `/api/v1/records`:

- `POST /api/v1/records` - Create record
- `GET /api/v1/records/:id` - Get record
- `GET /api/v1/records/:id/verify` - Verify integrity

See `src/services/api.ts` for implementation.

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Type check without building
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode
- Functional components with hooks
- No class components
- Clear component names
- Descriptive variable names

## Next Steps

1. Add authentication
2. Add dashboard to list records
3. Add routing (React Router)
4. Add state management (if needed)
5. Add file upload support
6. Add sharing functionality
7. Add export functionality

## License

MIT
