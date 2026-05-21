# MicroFin Platform - Deployment Guide

## Quick Deploy to Vercel

### 1. Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/microfin-platform.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
5. Click **"Deploy"**

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and API keys to Vercel environment variables
4. Create an admin user in Supabase Auth dashboard

### 4. Post-Deploy Setup

1. In Supabase Dashboard → Authentication → URL Configuration:
   - Add your Vercel URL to **Site URL**
   - Add `https://your-app.vercel.app/api/auth/callback` to **Redirect URLs**

2. Create your first admin user:
   - Go to Authentication → Users → Add User
   - Create user with email/password
   - Go to SQL Editor and run:
   ```sql
   INSERT INTO users (id, email, first_name, last_name, role)
   VALUES ('USER_UUID_FROM_AUTH', 'admin@microfin.com', 'Admin', 'User', 'admin');
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL | Yes |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS v4
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI**: Shadcn UI, Framer Motion, Lucide Icons
- **Validation**: Zod v4
