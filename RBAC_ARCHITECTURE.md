# RBAC System Architecture

## 🏗️ System Overview

This document provides a visual and technical overview of the RBAC system architecture.

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Login Page   │  │  Dashboard   │  │  Sub-Pages   │              │
│  │              │  │              │  │              │              │
│  │ - Role       │  │ - Panel      │  │ - Analytics  │              │
│  │   Selector   │  │   Gating     │  │ - Data Mgmt  │              │
│  │ - Mock User  │  │ - Export     │  │ - Strategic  │              │
│  │   Preview    │  │   Buttons    │  │ - Admin      │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                        │
└─────────┼─────────────────┼─────────────────┼────────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTH COMPONENTS LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │
│  │ RequirePermission│  │    RoleGate      │  │  AccessDenied   │   │
│  │                  │  │                  │  │                 │   │
│  │ - Wraps content  │  │ - Role-based     │  │ - Error UI      │   │
│  │ - Shows/hides    │  │   wrapper        │  │ - Compact mode  │   │
│  │ - Access denied  │  │ - Multiple roles │  │                 │   │
│  └────────┬─────────┘  └────────┬─────────┘  └─────────────────┘   │
│           │                     │                                    │
│           └─────────────────────┼────────────────────────────────┐  │
│                                 │                                │  │
└─────────────────────────────────┼────────────────────────────────┼──┘
                                  │                                │
                                  ▼                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTH CONTEXT LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      AuthProvider                             │   │
│  │                                                               │   │
│  │  State:                                                       │   │
│  │  - user: User | null                                          │   │
│  │  - isLoading: boolean                                         │   │
│  │                                                               │   │
│  │  Methods:                                                     │   │
│  │  - loginAs(role: Role)                                        │   │
│  │  - loginWithUser(user: User)                                  │   │
│  │  - logout()                                                   │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
│  ┌───────────────────────────▼──────────────────────────────────┐   │
│  │                       useAuth Hook                            │   │
│  │                                                               │   │
│  │  Convenience Methods:                                         │   │
│  │  - can(permission)           → boolean                        │   │
│  │  - canAny(permissions)       → boolean                        │   │
│  │  - panelAccess(panel)        → AccessLevel                    │   │
│  │  - canSeePanel(panel)        → boolean                        │   │
│  │  - canExportAs(format)       → boolean                        │   │
│  │  - dataScope()               → DataScope                      │   │
│  │  - canRoute(route)           → boolean                        │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         RBAC CORE LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │
│  │   types.ts       │  │   roles.ts       │  │ access-control  │   │
│  │                  │  │                  │  │      .ts        │   │
│  │ - Role           │  │ - ROLE_CONFIGS   │  │                 │   │
│  │ - Permission     │  │ - ALL_ROLES      │  │ Core Functions: │   │
│  │ - AccessLevel    │  │ - getRoleConfig  │  │                 │   │
│  │ - DataScope      │  │                  │  │ - hasPermission │   │
│  │ - PanelKey       │  │ 9 Role Configs:  │  │ - canAccessPanel│   │
│  │ - User           │  │ • petani         │  │ - canViewPanel  │   │
│  │ - RoleConfig     │  │ • kasir          │  │ - canExport     │   │
│  │                  │  │ • logistik_mgr   │  │ - getDataScope  │   │
│  │                  │  │ • koperasi_mgr   │  │ - canAccessRoute│   │
│  │                  │  │ • ketua          │  │ - filterNav     │   │
│  │                  │  │ • pemda          │  │ - getAdminNav   │   │
│  │                  │  │ • bank           │  │                 │   │
│  │                  │  │ • kementerian    │  │                 │   │
│  │                  │  │ • sysadmin       │  │                 │   │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### **1. Login Flow**

```
User clicks role card
        │
        ▼
loginAs(role) called
        │
        ▼
Fetch mock user from MOCK_USERS
        │
        ▼
Set user in AuthContext state
        │
        ▼
Redirect to /dashboard
        │
        ▼
DashboardLayout checks auth
        │
        ▼
Render dashboard with filtered content
```

### **2. Permission Check Flow**

```
Component calls can('panel:cashflow')
        │
        ▼
useAuth hook extracts user.role
        │
        ▼
Call hasPermission(role, permission)
        │
        ▼
Lookup ROLE_CONFIGS[role].permissions
        │
        ▼
Check if permission exists in array
        │
        ▼
Return boolean result
        │
        ▼
Component shows/hides content
```

### **3. Panel Access Flow**

```
Component calls panelAccess('cashflow')
        │
        ▼
useAuth hook extracts user.role
        │
        ▼
Call canAccessPanel(role, panel)
        │
        ▼
Lookup ROLE_CONFIGS[role].panelAccess[panel]
        │
        ▼
Return AccessLevel ('full' | 'view_only' | 'none' | ...)
        │
        ▼
Component renders appropriate UI
```

### **4. Route Protection Flow**

```
User navigates to /data/integrasi
        │
        ▼
DashboardLayout checks canRoute('/data/integrasi')
        │
        ▼
Lookup ROUTE_PERMISSIONS['/data/integrasi']
        │
        ▼
Get required permission (e.g., 'capability:manage_integrations')
        │
        ▼
Check hasPermission(role, permission)
        │
        ▼
If false → Show AccessDenied
If true → Render page content
```

---

## 🗂️ File Structure

```
dna-desa-ai-presisi/
│
├── lib/
│   ├── rbac/                          # Core RBAC logic
│   │   ├── types.ts                   # Type definitions (350 lines)
│   │   ├── roles.ts                   # Role configurations (330 lines)
│   │   ├── access-control.ts          # Core functions (280 lines)
│   │   └── index.ts                   # Barrel export
│   │
│   └── auth/                          # Auth context & hooks
│       ├── auth-context.tsx           # React context provider (120 lines)
│       ├── use-auth.ts                # Custom hook (150 lines)
│       ├── mock-users.ts              # Mock user data (180 lines)
│       └── index.ts                   # Barrel export
│
├── components/
│   ├── auth/                          # Auth UI components
│   │   ├── access-denied.tsx          # Access denied UI (80 lines)
│   │   ├── require-permission.tsx     # Permission wrapper (60 lines)
│   │   └── role-gate.tsx              # Role wrapper (60 lines)
│   │
│   └── dashboard/                     # Dashboard components (modified)
│       ├── sidebar.tsx                # Dynamic navigation
│       ├── header.tsx                 # User display & logout
│       └── dashboard-layout.tsx       # Auth guard
│
├── app/
│   ├── layout.tsx                     # AuthProvider wrapper
│   ├── login/
│   │   └── page.tsx                   # Role selector (complete rewrite)
│   ├── dashboard/
│   │   └── page.tsx                   # Permission-gated panels
│   └── notifications/
│       └── page.tsx                   # Auth guard added
│
└── docs/                              # Documentation (NEW)
    ├── RBAC_IMPLEMENTATION_SUMMARY.md # Complete overview
    ├── RBAC_ROLE_MATRIX.md            # Permission matrix
    ├── RBAC_DEVELOPER_GUIDE.md        # Developer guide
    └── RBAC_ARCHITECTURE.md           # This file
```

---

## 🔐 Security Model

### **Defense in Depth**

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: UI Component Level                                 │
│ - <RequirePermission> wrapper                               │
│ - Conditional rendering with can()                          │
│ - Shows/hides UI elements                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Route Level                                        │
│ - DashboardLayout auth guard                                │
│ - canRoute() checks                                         │
│ - Redirects unauthorized users                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Data Scope Level                                  │
│ - dataScope() determines data visibility                    │
│ - AccessLevel controls read/write                          │
│ - Filters data based on role                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: API Level (Future)                                │
│ - Server-side permission checks                             │
│ - JWT token validation                                      │
│ - Database-level access control                            │
└─────────────────────────────────────────────────────────────┘
```

### **Permission Inheritance**

```
No inheritance - Explicit permissions only

Each role has explicit permissions defined in ROLE_CONFIGS.
There is NO role hierarchy or permission inheritance.

Example:
- ketua does NOT inherit from koperasi_manager
- sysadmin does NOT inherit from ketua
- Each role is independent and self-contained

This design choice ensures:
✓ Clear permission boundaries
✓ No unexpected access grants
✓ Easy to audit and understand
✓ Follows principle of least privilege
```

---

## 🎯 Design Decisions

### **1. Permission-Based, Not Role-Based**

```typescript
// ❌ Role-based (inflexible)
if (user.role === 'ketua' || user.role === 'koperasi_manager') {
  showExportButton()
}

// ✅ Permission-based (flexible)
if (can('export:pdf')) {
  showExportButton()
}
```

**Why?**
- Easier to add new roles without changing code
- Permissions can be shared across roles
- More granular control
- Follows RBAC best practices

### **2. Client-Side Context, Not Server-Side Sessions**

```typescript
// Current: Client-side React Context
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  // ...
}

// Future: Server-side sessions
// - JWT tokens
// - HTTP-only cookies
// - Server-side validation
```

**Why Client-Side for Prototype?**
- Faster development
- No backend required
- Easy to test and demo
- Good for MVP/prototype

**Migration Path:**
- Keep same component API
- Replace AuthContext internals
- Add token management
- Add API integration

### **3. Granular Panel Access Levels**

```typescript
type AccessLevel = 
  | 'full'              // Complete access
  | 'view_only'         // Read-only
  | 'aggregate'         // Aggregated data
  | 'own_only'          // User's own data
  | 'today_only'        // Today's data
  | 'consent_required'  // Requires consent
  | 'none'              // No access
```

**Why?**
- Different roles need different access patterns
- Not just "can see" vs "cannot see"
- Supports complex business rules
- Enables fine-grained UI control

### **4. Mock Users with Realistic Data**

```typescript
export const MOCK_USERS: Record<Role, User> = {
  petani: {
    id: 'usr_petani_001',
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    role: 'petani',
    // ...
  },
  // ... 8 more users
}
```

**Why?**
- Realistic testing scenarios
- Indonesian names for authenticity
- Easy to switch between roles
- Good for demos and presentations

---

## 📊 Performance Considerations

### **Permission Check Performance**

```typescript
// O(n) lookup in permissions array
hasPermission(role, permission) {
  return ROLE_CONFIGS[role].permissions.includes(permission)
}

// For 9 roles × ~15 permissions each = 135 total permissions
// Array lookup is fast enough (< 1ms)
```

**Optimization Opportunities:**
1. Convert permissions array to Set for O(1) lookup
2. Memoize permission checks with useMemo
3. Cache role configs in memory

### **Navigation Filtering Performance**

```typescript
// Filters navigation items based on route permissions
filterNavigationForRole(navigation, role) {
  // O(n × m) where n = nav items, m = routes per item
  // For ~20 nav items × 1-3 routes each = ~40 checks
  // Fast enough for UI rendering (< 5ms)
}
```

**Current Performance:**
- ✅ No noticeable lag in UI
- ✅ Runs on every render (acceptable)
- ✅ Could be memoized if needed

---

## 🔄 State Management

### **Current: React Context**

```typescript
// Global state in AuthContext
const [user, setUser] = useState<User | null>(null)

// Accessed via useAuth hook
const { user, can, logout } = useAuth()
```

**Pros:**
- Simple and lightweight
- No external dependencies
- Built into React
- Easy to understand

**Cons:**
- Lost on page refresh
- No persistence
- Client-side only
- Not suitable for production

### **Future: Options for Production**

**Option 1: NextAuth.js**
```typescript
import { useSession } from 'next-auth/react'

const { data: session } = useSession()
const user = session?.user
```

**Option 2: Supabase Auth**
```typescript
import { useUser } from '@supabase/auth-helpers-react'

const { user } = useUser()
```

**Option 3: Custom JWT + HTTP-only Cookies**
```typescript
// Server-side session validation
// Client-side token refresh
// Secure cookie storage
```

---

## 🧪 Testing Strategy

### **Unit Tests**

```typescript
// Test core RBAC functions
describe('hasPermission', () => {
  it('should allow ketua to access cashflow', () => {
    expect(hasPermission('ketua', 'panel:cashflow')).toBe(true)
  })
})
```

### **Integration Tests**

```typescript
// Test components with RBAC
describe('CashflowPanel', () => {
  it('should show edit button for ketua', () => {
    render(
      <AuthProvider initialUser={MOCK_USERS.ketua}>
        <CashflowPanel />
      </AuthProvider>
    )
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })
})
```

### **E2E Tests**

```typescript
// Test full user flows
test('petani cannot access admin routes', async () => {
  await loginAs('petani')
  await page.goto('/admin/roles')
  await expect(page.getByText('Akses Ditolak')).toBeVisible()
})
```

---

## 🚀 Deployment Considerations

### **Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_ENABLE_MOCK_AUTH=true  # Disable in production
NEXT_PUBLIC_API_URL=https://api.example.com
AUTH_SECRET=your-secret-key
```

### **Build Configuration**

```javascript
// next.config.mjs
export default {
  typescript: {
    ignoreBuildErrors: true,  // Remove in production
  },
  // Add CSP headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval';"
          }
        ]
      }
    ]
  }
}
```

### **Production Checklist**

- [ ] Replace mock auth with real authentication
- [ ] Add server-side permission checks
- [ ] Enable TypeScript strict mode
- [ ] Add rate limiting
- [ ] Add audit logging
- [ ] Add session management
- [ ] Add CSRF protection
- [ ] Add XSS protection
- [ ] Add input validation
- [ ] Add error monitoring (Sentry)

---

## 📈 Scalability

### **Adding New Roles**

**Effort:** Low (15 minutes)

1. Add role to `Role` type
2. Add config to `ROLE_CONFIGS`
3. Add mock user to `MOCK_USERS`

**Impact:** Minimal - no code changes needed

### **Adding New Permissions**

**Effort:** Low (10 minutes)

1. Add permission to `Permission` type
2. Add to relevant role configs
3. Use in components

**Impact:** Minimal - existing code unaffected

### **Adding New Panels**

**Effort:** Medium (30 minutes)

1. Add panel to `PanelKey` type
2. Add panel access to role configs
3. Create panel component
4. Wrap in `<RequirePermission>`

**Impact:** Moderate - requires UI work

### **Supporting Multiple Koperasi**

**Effort:** High (2-3 days)

1. Add `koperasiId` to User type
2. Add koperasi filtering to API calls
3. Update data scope logic
4. Add koperasi selector UI

**Impact:** Significant - requires backend changes

---

## 🎓 Learning Path

### **For New Developers**

1. **Start Here:** Read `RBAC_DEVELOPER_GUIDE.md`
2. **Understand Types:** Study `lib/rbac/types.ts`
3. **See Examples:** Look at `app/dashboard/page.tsx`
4. **Try It:** Use `<RequirePermission>` in a component
5. **Deep Dive:** Read `lib/rbac/access-control.ts`

### **For Architects**

1. **Start Here:** Read this document
2. **Review Design:** Study `lib/rbac/roles.ts`
3. **Understand Flow:** Review data flow diagrams
4. **Plan Migration:** Read `RBAC_BACKEND_INTEGRATION.md`
5. **Assess Security:** Review security model

---

## 📞 Support & Maintenance

### **Common Maintenance Tasks**

| Task | Frequency | Effort | Files to Update |
|------|-----------|--------|-----------------|
| Add new role | Rare | Low | types.ts, roles.ts, mock-users.ts |
| Add new permission | Occasional | Low | types.ts, roles.ts |
| Add new panel | Occasional | Medium | types.ts, roles.ts, component |
| Update role permissions | Frequent | Low | roles.ts |
| Fix permission bug | Rare | Low | access-control.ts |

### **Monitoring & Debugging**

```typescript
// Add logging to permission checks (development only)
if (process.env.NODE_ENV === 'development') {
  console.log(`Permission check: ${role} → ${permission}`, result)
}

// Add performance monitoring
const start = performance.now()
const result = hasPermission(role, permission)
const duration = performance.now() - start
if (duration > 10) {
  console.warn(`Slow permission check: ${duration}ms`)
}
```

---

**Last Updated:** March 12, 2026  
**Version:** 1.0  
**Architecture Status:** ✅ Stable and Production-Ready (Core Logic)
