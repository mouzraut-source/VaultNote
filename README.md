# VaultNote — Academic Content Distribution Platform

A lightweight platform for students to purchase and access academic answer keys with manual UPI payment verification and secure in-browser PDF viewing.

## Features

- **Student Accounts**: Registration, login, password recovery via Supabase Auth
- **Product Catalog**: Browse academic materials with pricing and descriptions
- **Manual Payment Verification**: UPI payment with transaction reference submission
- **Admin Dashboard**: Manage products, review payments, view students & purchases
- **Secure PDF Viewing**: In-browser PDF.js viewer with page navigation, zoom, no download/print
- **Row Level Security**: Database-level access control for all data
- **Private Storage**: PDFs and payment proofs stored in private Supabase buckets
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| PDF Rendering | PDF.js |
| Routing | React Router v6 |
| State Management | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Hosting | Cloudflare Pages |

## Project Structure

```
vaultnote/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/        # Header, Footer, ProtectedRoute, AdminLayout
│   │   ├── auth/          # Auth forms (future)
│   │   ├── products/      # ProductCard, ProductGrid
│   │   ├── dashboard/     # Dashboard components (future)
│   │   ├── pdf-viewer/    # PDFViewer, Toolbar (future)
│   │   ├── admin/         # Admin components (future)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Product.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Reader.tsx
│   │   ├── Admin.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminPayments.tsx
│   │   ├── AdminStudents.tsx
│   │   └── AdminPurchases.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── products.ts
│   │   ├── payments.ts
│   │   ├── purchases.ts
│   │   └── storage.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── usePurchases.ts
│   │   └── usePaymentSubmissions.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── types/
│   │   ├── index.ts
│   │   └── database.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── migrations/
│   │   ├── 01_profiles.sql
│   │   ├── 02_products.sql
│   │   ├── 03_payment_submissions.sql
│   │   ├── 04_purchases.sql
│   │   └── 05_storage.sql
│   └── seed.sql
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare Pages account (for deployment)

### 1. Clone and Install

```bash
cd vaultnote
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API and copy your Project URL and anon key
3. Copy `.env.example` to `.env.local` and fill in your values:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_UPI_ID=your-upi-id@bank
VITE_UPI_QR_CODE_URL=https://your-qr-code-url.com/qr.png
VITE_APP_NAME=VaultNote
VITE_APP_URL=http://localhost:5173
```

### 3. Database Setup

Run the migrations in order in Supabase SQL Editor:

1. `supabase/migrations/01_profiles.sql`
2. `supabase/migrations/02_products.sql`
3. `supabase/migrations/03_payment_submissions.sql`
4. `supabase/migrations/04_purchases.sql`

For storage, create buckets in Supabase Dashboard > Storage:
- `academic-materials` (private)
- `payment-proofs` (private)

Apply the storage policies from `supabase/migrations/05_storage.sql`

### 4. Authentication Settings

In Supabase Dashboard > Authentication > Settings:
- Enable Email/Password provider
- Configure email templates if desired
- Set Site URL to your deployment URL (e.g., `https://your-app.pages.dev`)
- Add redirect URLs for password reset

### 5. Create Admin User

1. Sign up through the app at `/register`
2. In Supabase Dashboard > Table Editor > profiles, find your user
3. Change `role` from `student` to `admin`

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

## Deployment (Cloudflare Pages)

1. Push your code to GitHub
2. Go to Cloudflare Pages > Create a project
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variables in Cloudflare Pages settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_UPI_ID`
   - `VITE_UPI_QR_CODE_URL`
   - `VITE_APP_NAME`
   - `VITE_APP_URL` (your Cloudflare Pages URL)
6. Deploy!

## Database Schema

### Tables

- **profiles**: User profiles with role (student/admin)
- **products**: Academic materials with title, description, price, PDF storage path
- **payment_submissions**: Student payment references with status (pending/approved/rejected)
- **purchases**: Approved purchases linking users to products

### Key Constraints

- Unique active purchase per user per product
- Unique pending payment submission per user per product
- Foreign keys with cascade deletes
- RLS policies on all tables

### Storage Buckets

- **academic-materials**: Private PDF storage (admin upload only)
- **payment-proofs**: Private payment screenshot storage (student upload, admin view)

## Security Features

- Row Level Security (RLS) on all database tables
- Private Supabase Storage buckets (no public URLs)
- Signed URLs for PDF access (5-minute expiry)
- Server-side authorization checks
- Input validation with Zod
- File type/size validation
- No service role key in frontend

## Payment Flow

1. Student browses products on Home page
2. Clicks "View Details" → Product page
3. Clicks "Submit Payment Reference" → Payment modal
4. Sees UPI ID and QR code, enters transaction reference
5. Optionally uploads payment screenshot
6. Submits → Status: "Pending"
7. Admin reviews in Admin Dashboard > Payments
8. Admin Approves → Creates purchase record → Student gets access
9. Admin Rejects → Student can resubmit

## PDF Viewer Features

- Page navigation (prev/next, page number input)
- Zoom in/out (50% - 300%)
- Fit to width
- Responsive layout
- Hidden download/print controls
- Access only with valid purchase

## Admin Features

- **Overview**: Stats cards, recent activity
- **Products**: CRUD with PDF upload
- **Payments**: Review, approve/reject with screenshot view
- **Students**: List with purchase/submission counts
- **Purchases**: View all, revoke access

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `VITE_UPI_ID` | Admin UPI ID for payments | Yes |
| `VITE_UPI_QR_CODE_URL` | QR code image URL | No |
| `VITE_APP_NAME` | App name | No |
| `VITE_APP_URL` | App URL for redirects | Yes |

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Future Enhancements (Post-V0)

- Automated payment gateway integration
- Email notifications
- Advanced DRM/watermarking
- Subscription/recurring billing
- Analytics dashboard
- Multi-language support

## License

MIT License - see LICENSE file for details