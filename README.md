# VisionBridge Admin Dashboard

Production-ready admin dashboard for VisionBridge visual intelligence platform.

## Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Radix UI
- **Charts**: Recharts
- **State**: React Context API
- **HTTP**: Axios

## Features

- ✅ Multi-tenant management (CRUD)
- ✅ Real-time system health monitoring
- ✅ File processing dashboard
- ✅ Analysis results viewer
- ✅ Report management
- ✅ Audit logging
- ✅ OAuth credential configuration
- ✅ Dark theme optimized for long sessions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Environment

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_BASE_URL` - VisionBridge API base URL (default: http://localhost:18088)
- `NEXT_PUBLIC_ADMIN_TOKEN` - Admin bearer token for API authentication

### Development

```bash
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── admin/              # Admin dashboard pages
│   ├── page.tsx       # Dashboard home
│   ├── tenants/       # Tenant management
│   ├── files/         # File explorer
│   ├── reports/       # Report viewer
│   └── settings/      # Admin settings
├── layout.tsx         # Root layout
└── globals.css        # Global styles

components/
└── admin/
    ├── layouts/       # Page layouts
    ├── shared/        # Reusable components
    ├── tables/        # Data tables
    ├── forms/         # Form components
    ├── dialogs/       # Modal dialogs
    └── charts/        # Data visualizations

lib/
└── admin/
    ├── api-client.ts  # HTTP client
    ├── polling-hook.ts # Real-time polling
    ├── auth.ts        # Authentication
    └── utils.ts       # Utilities
```

## API Integration

The dashboard communicates with the VisionBridge API via `AdminApiClient`:

```typescript
import { apiClient } from '@/lib/admin/api-client';

// List tenants
const tenants = await apiClient.listTenants();

// Get tenant details
const tenant = await apiClient.getTenant('tenant-id');

// Create tenant
const newTenant = await apiClient.createTenant({
  name: 'My Tenant',
  email: 'admin@example.com',
  storage_type: 'gdrive',
  storage_config: {},
  search_prompt: 'Detect people',
});
```

## Real-Time Updates

Polling hooks automatically fetch data at specified intervals:

```typescript
import { useTenantsPolling } from '@/lib/admin/polling-hook';

export function MyComponent() {
  const { data, loading, error, refetch } = useTenantsPolling(1, 5000);
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Tenants: {data.total}</p>}
    </div>
  );
}
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./
EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
```

### Environment Variables (Production)

Set these in your deployment platform:
- `NEXT_PUBLIC_API_BASE_URL` - Production API URL
- `NEXT_PUBLIC_ADMIN_TOKEN` - Production admin token

## Performance Optimization

- Code splitting enabled by default
- Image optimization with Next.js Image
- CSS-in-JS eliminated (Tailwind only)
- Lazy loading for heavy components
- Request batching for polling endpoints

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Proprietary - VisionBridge

## Support

For issues or questions, contact the VisionBridge team.
