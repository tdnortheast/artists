# replit.md

## Overview

This is a music artist portal application where artists can view and manage their releases, tracks, and request changes to their catalog. The system uses a simple password-based authentication to route different artists to their respective dashboards. Artists can browse their album/single discography, view track details with featured artists, and submit change requests for metadata updates like cover art, track names, or audio swaps.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth transitions
- **File Uploads**: Uppy with AWS S3 integration

The frontend lives in `client/src/` with a standard structure:
- `pages/` - Route components (Login, ArtistPage)
- `components/` - Reusable UI components
- `components/ui/` - shadcn/ui primitives
- `hooks/` - Custom React hooks for data fetching
- `lib/` - Utilities and query client configuration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for server, Vite for client
- **API Pattern**: RESTful endpoints under `/api/`

The server lives in `server/` with:
- `index.ts` - Express app setup and middleware
- `routes.ts` - API route handlers
- `storage.ts` - Database abstraction layer
- `db.ts` - Drizzle ORM database connection
- `vite.ts` - Development server with HMR

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: `migrations/` directory via `drizzle-kit push`

Database tables:
- `artists` - Artist profiles (id, name, image)
- `releases` - Albums/singles (id, artistId, title, year, type, coverUrl)
- `tracks` - Individual tracks (id, releaseId, title, explicit)
- `features` - Featured artists on tracks
- `changeRequests` - Metadata change submissions

### Authentication
Simple password-based routing (not secure for production):
- Password "pass1" → routes to `/artist1`
- Password "pass2" → routes to `/artist2`

### File Storage
- **Provider**: Google Cloud Storage via Replit Object Storage integration
- **Upload Flow**: Presigned URL pattern (client gets URL, uploads directly)
- **Location**: `server/replit_integrations/object_storage/`

## External Dependencies

### Database
- PostgreSQL (configured via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe queries
- drizzle-kit for schema migrations

### Cloud Storage
- Google Cloud Storage via Replit sidecar endpoint
- Presigned URLs for direct client uploads

### UI Libraries
- Radix UI primitives for accessible components
- Framer Motion for animations
- Lucide React for icons
- Uppy for file upload UI

### Key npm packages
- `express` - Web server framework
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation
- `@tanstack/react-query` - Server state management
- `zod` - Schema validation
- `wouter` - Client-side routing
- `@google-cloud/storage` - Cloud file storage