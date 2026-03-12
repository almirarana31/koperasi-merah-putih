# RBAC Backend Integration Guide

## 🎯 Overview

This guide shows how to migrate from the current mock authentication to a production-ready backend system.

---

## 🔄 Migration Strategy

### **Phase 1: Keep Frontend, Add Backend** (Recommended)
- Keep all RBAC logic in frontend
- Add API endpoints for authentication
- Add JWT token management
- Minimal code changes

### **Phase 2: Hybrid Approach**
- Move some permission checks to backend
- Keep UI-level checks in frontend
- Add server-side validation
- Moderate code changes

### **Phase 3: Full Backend RBAC**
- Move all RBAC logic to backend
- Frontend only displays what backend allows
- Maximum security
- Significant code changes

**Recommendation:** Start with Phase 1, then gradually move to Phase 2.

---

## 📋 Phase 1: Add Backend Authentication

### **Step 1: Choose Authentication Provider**

#### **Option A: NextAuth.js (Recommended for Next.js)**

```bash
npm install next-auth
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { Role } from '@/lib/rbac/types'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Call your backend API
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })
        
        const user = await res.json()
        
        if (res.ok && user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as Role,
            koperasiId: user.koperasiId,
          }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.koperasiId = user.koperasiId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role
        session.user.koperasiId = token.koperasiId as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
```

#### **Option B: Supabase Auth**

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// lib/supabase/auth.ts
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  // Fetch user role from your database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, koperasi_id')
    .eq('id', data.user.id)
    .single()
  
  return {
    user: data.user,
    role: profile.role,
    koperasiId: profile.koperasi_id,
  }
}
```

#### **Option C: Custom JWT Implementation**

```typescript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function signToken(payload: { userId: string; role: Role }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth/jwt'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  // Validate credentials against your database
  const user = await validateCredentials(email, password)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }
  
  const token = signToken({ userId: user.id, role: user.role })
  
  const response = NextResponse.json({ user })
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  
  return response
}
```

---

### **Step 2: Update AuthContext**

```typescript
// lib/auth/auth-context.tsx
'use client'

import { createContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react' // If using NextAuth
import type { User } from '@/lib/rbac/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() // NextAuth
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role,
        koperasiId: session.user.koperasiId,
      })
    } else {
      setUser(null)
    }
  }, [session])
  
  const logout = async () => {
    await signOut({ callbackUrl: '/login' }) // NextAuth
    setUser(null)
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
```

---

### **Step 3: Update Login Page**

```typescript
// app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react' // If using NextAuth
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        setError('Email atau password salah')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
```

---

### **Step 4: Add Middleware for Route Protection**

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    
    // Allow public routes
    if (path === '/login' || path === '/') {
      return NextResponse.next()
    }
    
    // Require authentication for all other routes
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## 📋 Phase 2: Add Server-Side Permission Checks

### **Step 1: Create Permission Check Middleware**

```typescript
// lib/auth/server-permissions.ts
import { getServerSession } from 'next-auth'
import { hasPermission, canAccessRoute } from '@/lib/rbac'
import type { Permission } from '@/lib/rbac/types'

export async function requirePermission(permission: Permission) {
  const session = await getServerSession()
  
  if (!session?.user?.role) {
    throw new Error('Unauthorized')
  }
  
  if (!hasPermission(session.user.role, permission)) {
    throw new Error('Forbidden')
  }
  
  return session.user
}

export async function requireRoute(route: string) {
  const session = await getServerSession()
  
  if (!session?.user?.role) {
    throw new Error('Unauthorized')
  }
  
  if (!canAccessRoute(session.user.role, route)) {
    throw new Error('Forbidden')
  }
  
  return session.user
}
```

---

### **Step 2: Protect API Routes**

```typescript
// app/api/cashflow/route.ts
import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth/server-permissions'

export async function GET() {
  try {
    // Check permission on server
    const user = await requirePermission('panel:cashflow')
    
    // Fetch data based on user's data scope
    const data = await fetchCashflowData(user)
    
    return NextResponse.json(data)
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    if (error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fetchCashflowData(user: User) {
  const { role, koperasiId, id: userId } = user
  
  // Apply data scope filtering
  if (role === 'petani') {
    // Only own data
    return await db.cashflow.findMany({
      where: { userId }
    })
  }
  
  if (role === 'koperasi_manager' || role === 'ketua') {
    // Koperasi-wide data
    return await db.cashflow.findMany({
      where: { koperasiId }
    })
  }
  
  if (role === 'pemda') {
    // District aggregate
    return await db.cashflow.aggregate({
      where: { district: user.district },
      _sum: { amount: true },
      _avg: { amount: true },
    })
  }
  
  // ... other roles
}
```

---

### **Step 3: Protect Server Components**

```typescript
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { canAccessRoute } from '@/lib/rbac'

export default async function DashboardPage() {
  const session = await getServerSession()
  
  // Server-side auth check
  if (!session?.user) {
    redirect('/login')
  }
  
  // Server-side permission check
  if (!canAccessRoute(session.user.role, '/dashboard')) {
    redirect('/access-denied')
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Client components with client-side checks */}
    </div>
  )
}
```

---

## 🗄️ Database Schema

### **Users Table**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'petani',
    'kasir',
    'logistik_manager',
    'koperasi_manager',
    'ketua',
    'pemda',
    'bank',
    'kementerian',
    'sysadmin'
  )),
  koperasi_id UUID REFERENCES koperasi(id),
  district VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_koperasi ON users(koperasi_id);
```

### **Koperasi Table**

```sql
CREATE TABLE koperasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Audit Log Table**

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### **Sessions Table (if not using NextAuth)**

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

---

## 🔐 Security Best Practices

### **1. Password Hashing**

```typescript
import bcrypt from 'bcrypt'

// Hash password before storing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Verify password during login
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

### **2. Rate Limiting**

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
})

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
  
  if (!success) {
    throw new Error('Rate limit exceeded')
  }
  
  return { limit, reset, remaining }
}

// Use in API route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  try {
    await checkRateLimit(ip)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // ... rest of handler
}
```

### **3. CSRF Protection**

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token')
    const sessionToken = request.cookies.get('csrf-token')?.value
    
    if (!csrfToken || csrfToken !== sessionToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
  }
  
  return NextResponse.next()
}
```

### **4. Input Validation**

```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  const body = await request.json()
  
  // Validate input
  const result = loginSchema.safeParse(body)
  
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.errors },
      { status: 400 }
    )
  }
  
  const { email, password } = result.data
  
  // ... rest of handler
}
```

### **5. Audit Logging**

```typescript
// lib/audit.ts
export async function logAudit({
  userId,
  action,
  resource,
  resourceId,
  details,
  request,
}: {
  userId: string
  action: string
  resource: string
  resourceId?: string
  details?: any
  request: Request
}) {
  await db.auditLog.create({
    data: {
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    },
  })
}

// Use in API route
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requirePermission('capability:delete_items')
  
  await db.item.delete({ where: { id: params.id } })
  
  // Log the action
  await logAudit({
    userId: user.id,
    action: 'DELETE',
    resource: 'item',
    resourceId: params.id,
    request,
  })
  
  return NextResponse.json({ success: true })
}
```

---

## 🧪 Testing Backend Integration

### **Test Authentication**

```typescript
// __tests__/auth.test.ts
import { POST } from '@/app/api/auth/login/route'

describe('Authentication', () => {
  it('should login with valid credentials', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.user).toBeDefined()
    expect(data.user.role).toBe('petani')
  })
  
  it('should reject invalid credentials', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(401)
  })
})
```

### **Test Permission Checks**

```typescript
// __tests__/permissions.test.ts
import { requirePermission } from '@/lib/auth/server-permissions'
import { getServerSession } from 'next-auth'

jest.mock('next-auth')

describe('Server-side permissions', () => {
  it('should allow ketua to access cashflow', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'ketua' }
    })
    
    await expect(
      requirePermission('panel:cashflow')
    ).resolves.toBeDefined()
  })
  
  it('should deny petani access to admin', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: 'petani' }
    })
    
    await expect(
      requirePermission('capability:manage_roles')
    ).rejects.toThrow('Forbidden')
  })
})
```

---

## 📊 Migration Checklist

### **Pre-Migration**
- [ ] Review current RBAC implementation
- [ ] Choose authentication provider
- [ ] Design database schema
- [ ] Plan data migration strategy
- [ ] Set up staging environment

### **Phase 1: Backend Auth**
- [ ] Install authentication library
- [ ] Create API routes for auth
- [ ] Update AuthContext to use real auth
- [ ] Update login page
- [ ] Add middleware for route protection
- [ ] Test authentication flow
- [ ] Deploy to staging

### **Phase 2: Server-Side Checks**
- [ ] Create server permission utilities
- [ ] Protect API routes
- [ ] Add data scope filtering
- [ ] Protect server components
- [ ] Add audit logging
- [ ] Test permission checks
- [ ] Deploy to staging

### **Phase 3: Security Hardening**
- [ ] Add rate limiting
- [ ] Add CSRF protection
- [ ] Add input validation
- [ ] Add password hashing
- [ ] Add session management
- [ ] Security audit
- [ ] Penetration testing

### **Phase 4: Production**
- [ ] Final testing on staging
- [ ] Data migration
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] User training
- [ ] Documentation update

---

## 🚀 Deployment

### **Environment Variables**

```bash
# .env.production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
API_URL=https://api.yourdomain.com

# Optional
REDIS_URL=redis://localhost:6379
SENTRY_DSN=https://...
```

### **Docker Deployment**

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

## 📞 Support

For questions about backend integration:
1. Review this guide
2. Check NextAuth.js documentation
3. Review security best practices
4. Test thoroughly on staging

---

**Last Updated:** March 12, 2026  
**Version:** 1.0  
**Status:** Ready for Implementation
