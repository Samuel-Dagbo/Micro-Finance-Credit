# MicroFin Platform - Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Setup](#environment-setup)
5. [Database Setup](#database-setup)
6. [Architecture](#architecture)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)
9. [Security](#security)

---

## Overview

MicroFin Platform is a production-ready digital microfinance platform built for the Ghanaian market. It provides:

- **Public Website** - Corporate fintech website with premium UI/UX
- **Admin Dashboard** - Complete management system for staff
- **Authentication** - Secure Supabase Auth with email OTP
- **Financial Engine** - Ledger-based transaction system
- **Loan Management** - Full loan lifecycle (create → approve → disburse → repay)
- **Savings Management** - Multiple account types with deposits/withdrawals
- **Reporting** - Financial analytics and downloadable reports

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, TailwindCSS v4 |
| UI Components | Shadcn UI (v4), Framer Motion, Lucide Icons |
| Backend | Next.js Server Actions, Supabase |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth (Email/OTP, Password) |
| Storage | Supabase Storage |
| Deployment | Vercel (web), Supabase (backend) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase account (free tier works)

### Installation

```bash
# Navigate to project
cd microfin-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your Supabase credentials in .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

---

## Environment Setup

Create `.env.local` with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MicroFin Platform

# Currency
DEFAULT_CURRENCY=GHS
CURRENCY_SYMBOL=GH₵
```

### Getting Supabase Credentials

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## Database Setup

### Run Migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL

### Schema Overview

The database includes 16+ tables:

**Core Tables:**
- `users` - Staff and customer accounts (linked to auth.users)
- `branches` - Office locations
- `customers` - Customer profiles with KYC data

**Financial Tables:**
- `savings_accounts` - Savings with auto-generated account numbers
- `loans` - Loan applications with full lifecycle tracking
- `loan_repayment_schedules` - Auto-generated repayment plans
- `loan_repayments` - Actual payments made
- `transactions` - Immutable ledger of all financial activity
- `transaction_entries` - Double-entry bookkeeping records
- `penalties` - Late payment and fee tracking

**Security Tables:**
- `audit_logs` - Complete audit trail of all operations
- `activity_logs` - User activity tracking
- `notifications` - In-app notification system

**Operational Tables:**
- `settings` - Platform configuration
- `announcements` - System-wide announcements
- `support_messages` - Customer support tickets

### Row Level Security (RLS)

All tables have RLS policies enabled:
- Customers can only view their own data
- Staff can view data for their assigned branch
- Super admins have full access
- All financial operations are logged

---

## Architecture

### Folder Structure

```
microfin-platform/
├── src/
│   ├── app/
│   │   ├── (website)/          # Public website routes
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── loan-products/
│   │   │   ├── savings-products/
│   │   │   ├── how-it-works/
│   │   │   ├── faq/
│   │   │   ├── contact/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── (dashboard)/        # Admin dashboard routes
│   │   │   ├── layout.tsx
│   │   │   ├── overview/
│   │   │   ├── customers/
│   │   │   ├── loans/
│   │   │   ├── savings/
│   │   │   ├── transactions/
│   │   │   ├── staff/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── auth/               # Authentication routes
│   │   │   ├── login/
│   │   │   ├── activate/
│   │   │   └── otp/
│   │   └── api/                # API routes
│   │       └── auth/callback/
│   ├── actions/                # Server actions (business logic)
│   │   ├── auth.ts
│   │   ├── customers.ts
│   │   ├── loans.ts
│   │   ├── savings.ts
│   │   └── dashboard.ts
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── layout/             # Layout components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── website/            # Website components
│   │   ├── shared/             # Shared components
│   │   └── forms/              # Form components
│   ├── lib/
│   │   ├── supabase/           # Supabase client utilities
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   ├── admin.ts        # Admin client (service role)
│   │   │   └── middleware.ts   # Session middleware
│   │   ├── validations/        # Zod validation schemas
│   │   └── utils/              # Helper functions
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── middleware.ts           # Next.js middleware
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
└── package.json
```

### Key Architecture Decisions

1. **Server Actions for ALL Business Logic**
   - No financial calculations on the client
   - All mutations happen server-side
   - Input validated with Zod schemas

2. **Ledger-Based Transaction System**
   - Balances computed from transaction history
   - No direct balance mutations
   - Immutable transaction records

3. **Role-Based Access Control**
   - 7 roles: super_admin, branch_manager, loan_officer, cashier, collector, customer_support, customer
   - RLS policies enforce data isolation
   - Branch-level data segregation

4. **Auto-Generated IDs**
   - Customer IDs: MF000001, MF000002, ...
   - Loan Numbers: LN000001, LN000002, ...
   - Account Numbers: SA00000001, SA00000002, ...
   - Transaction Numbers: TXN + timestamp + random

---

## API Reference

### Server Actions

All business logic is exposed via Next.js Server Actions:

#### Authentication (`src/actions/auth.ts`)

| Action | Description |
|--------|-------------|
| `login(formData)` | Sign in with email/password |
| `logout()` | Sign out and clear session |
| `activateAccount(formData)` | Activate customer account with ID + phone |
| `verifyOtpAndSetupPassword(formData)` | Verify OTP and set password |
| `getCurrentUser()` | Get current authenticated user |
| `getUserRole()` | Get current user's role |

#### Customers (`src/actions/customers.ts`)

| Action | Description |
|--------|-------------|
| `registerCustomer(formData)` | Register new customer (staff only) |
| `updateCustomerStatus(id, status)` | Activate/suspend/close account |
| `getCustomers(branchId?)` | List all customers |
| `getCustomerById(id)` | Get customer by internal ID |
| `getCustomerByCustomerId(customerId)` | Get customer by public ID |

#### Loans (`src/actions/loans.ts`)

| Action | Description |
|--------|-------------|
| `createLoan(formData)` | Create new loan application |
| `approveLoan(formData)` | Approve or reject loan |
| `disburseLoan(loanId)` | Disburse approved loan |
| `processRepayment(formData)` | Process loan repayment |
| `getLoans(branchId?, status?)` | List loans with filters |
| `getLoanById(id)` | Get loan with full details |
| `getLoanStats()` | Get loan portfolio statistics |

#### Savings (`src/actions/savings.ts`)

| Action | Description |
|--------|-------------|
| `createSavingsAccount(customerId, type, target?, maturity?)` | Open savings account |
| `processDeposit(formData)` | Process savings deposit |
| `processWithdrawal(formData)` | Process savings withdrawal |
| `getSavingsAccounts(customerId?)` | List savings accounts |
| `getSavingsStats()` | Get savings statistics |

#### Dashboard (`src/actions/dashboard.ts`)

| Action | Description |
|--------|-------------|
| `getDashboardStats()` | Get overview statistics |
| `getTransactions(limit?)` | Get transaction ledger |
| `getBranches()` | List active branches |
| `getStaff()` | List all staff members |
| `getNotifications()` | Get user notifications |
| `getSettings()` | Get platform settings |
| `updateSetting(key, value)` | Update platform setting |

---

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

### Supabase Setup for Production

1. Run the migration SQL in your production Supabase project
2. Configure Supabase Auth settings:
   - Enable email OTP
   - Set redirect URLs to your production domain
3. Create storage bucket `kyc-documents` for document uploads

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Security

### Implemented Security Features

1. **Row Level Security (RLS)** - Database-level access control
2. **Role-Based Access** - 7 distinct roles with specific permissions
3. **Input Validation** - Zod schemas on all inputs
4. **Audit Logging** - All operations logged with user, action, and values
5. **Secure Auth** - Supabase Auth with JWT tokens
6. **Server-Side Logic** - No financial operations on client
7. **HTTPS Required** - All connections encrypted

### Security Best Practices

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Use environment variables for all secrets
- Enable Supabase Auth email confirmation
- Regularly review audit logs
- Keep dependencies updated

---

## Business Flow

### Customer Registration & Activation

```
1. Staff registers customer at office
   ↓
2. System generates unique Customer ID (MF000001)
   ↓
3. Customer downloads mobile app
   ↓
4. Customer enters Customer ID + phone number
   ↓
5. System sends OTP to customer's email
   ↓
6. Customer verifies OTP and creates password
   ↓
7. Account activated - customer can now use platform
```

### Loan Lifecycle

```
1. Staff creates loan application
   ↓
2. System generates repayment schedule
   ↓
3. Manager approves/rejects loan
   ↓
4. If approved, staff disburses loan
   ↓
5. System creates disbursement transaction record
   ↓
6. Customer makes repayments
   ↓
7. System tracks principal, interest, and penalty portions
   ↓
8. When fully repaid, loan marked as completed
```

### Savings Flow

```
1. Staff opens savings account for customer
   ↓
2. System generates account number (SA00000001)
   ↓
3. Customer makes deposits via staff
   ↓
4. System creates deposit transaction record
   ↓
5. Balance updated from transaction history
   ↓
6. Customer can request withdrawals
   ↓
7. System validates sufficient balance before processing
```

---

## Future Expansion

The system is architected for easy integration of:

- **Payment Gateways** - Paystack, Flutterwave, Mobile Money
- **SMS Notifications** - Twilio, Africa's Talking
- **Credit Scoring** - Integration with credit bureaus
- **Mobile App** - React Native app (separate codebase)
- **Multi-Currency** - Already designed with currency field
- **API Access** - REST API endpoints can be added

---

## Support

For issues or questions:
- Email: support@microfin.gh
- Phone: +233 30 000 0000

---

*Built with Next.js, Supabase, and TypeScript*
*© 2026 MicroFin Platform. All rights reserved.*
