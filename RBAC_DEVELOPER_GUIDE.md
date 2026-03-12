# RBAC Developer Quick-Start Guide

## 🚀 Getting Started with RBAC

This guide shows you how to use the RBAC system in your components and pages.

---

## 📚 Core Concepts

### **1. Permissions**
Permissions are strings that define what a user can do:
- `panel:produksi` - Can view production panel
- `export:pdf` - Can export PDF
- `capability:cashflow_approval` - Can approve cashflow

### **2. Roles**
Roles are collections of permissions:
- `petani` - Farmer member
- `ketua` - Koperasi chairman
- `sysadmin` - System administrator

### **3. Access Levels**
Panels can have different access levels:
- `full` - Complete access
- `view_only` - Read-only
- `own_only` - User's own data only
- `aggregate` - Aggregated data only

---

## 🔧 Basic Usage

### **1. Using the `useAuth` Hook**

```tsx
import { useAuth } from '@/lib/auth'

function MyComponent() {
  const { user, can, logout } = useAuth()
  
  // Check if user is logged in
  if (!user) {
    return <div>Please login</div>
  }
  
  // Check a single permission
  if (can('panel:cashflow')) {
    return <CashflowPanel />
  }
  
  // Check multiple permissions (OR logic)
  if (can(['panel:produksi', 'panel:stok'])) {
    return <ProductionOrStockPanel />
  }
  
  return <div>No access</div>
}
```

### **2. Using `<RequirePermission>` Component**

```tsx
import { RequirePermission } from '@/components/auth/require-permission'

function Dashboard() {
  return (
    <div>
      {/* Show component only if user has permission */}
      <RequirePermission permission="panel:cashflow">
        <CashflowPanel />
      </RequirePermission>
      
      {/* Show component if user has ANY of the permissions */}
      <RequirePermission permission={['panel:produksi', 'panel:stok']}>
        <ProductionOrStockPanel />
      </RequirePermission>
      
      {/* Compact mode - shows smaller access denied message */}
      <RequirePermission permission="export:pdf" compact>
        <ExportButton />
      </RequirePermission>
    </div>
  )
}
```

### **3. Using `<RoleGate>` Component**

```tsx
import { RoleGate } from '@/components/auth/role-gate'

function AdminPanel() {
  return (
    <div>
      {/* Show component only for specific roles */}
      <RoleGate roles={['ketua', 'sysadmin']}>
        <AdminSettings />
      </RoleGate>
      
      {/* Show component for single role */}
      <RoleGate roles="sysadmin">
        <SystemConfiguration />
      </RoleGate>
    </div>
  )
}
```

---

## 🎯 Common Patterns

### **Pattern 1: Conditional Rendering Based on Permission**

```tsx
import { useAuth } from '@/lib/auth'

function DataTable() {
  const { can } = useAuth()
  
  return (
    <div>
      <table>
        {/* Table content */}
      </table>
      
      {/* Show export buttons only if user can export */}
      {can('export:pdf') && (
        <Button onClick={exportPDF}>Export PDF</Button>
      )}
      
      {can('export:excel') && (
        <Button onClick={exportExcel}>Export Excel</Button>
      )}
    </div>
  )
}
```

### **Pattern 2: Different UI Based on Access Level**

```tsx
import { useAuth } from '@/lib/auth'

function CashflowPanel() {
  const { panelAccess } = useAuth()
  const accessLevel = panelAccess('cashflow')
  
  if (accessLevel === 'none') {
    return <AccessDenied />
  }
  
  if (accessLevel === 'view_only') {
    return <CashflowView readOnly />
  }
  
  if (accessLevel === 'full') {
    return <CashflowView editable />
  }
  
  return null
}
```

### **Pattern 3: Protecting Entire Pages**

```tsx
'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, canRoute } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (!canRoute('/admin/roles')) {
      router.push('/dashboard')
    }
  }, [user, canRoute, router])
  
  if (!user || !canRoute('/admin/roles')) {
    return null
  }
  
  return <AdminContent />
}
```

### **Pattern 4: Dynamic Navigation**

```tsx
import { useAuth } from '@/lib/auth'

function Sidebar() {
  const { canRoute } = useAuth()
  
  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics/dna-desa' },
    { label: 'Data Master', href: '/data/master-desa' },
    { label: 'Admin', href: '/admin/roles' },
  ]
  
  return (
    <nav>
      {navItems.map(item => (
        canRoute(item.href) && (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        )
      ))}
    </nav>
  )
}
```

### **Pattern 5: Role-Based Styling**

```tsx
import { useAuth } from '@/lib/auth'

function UserBadge() {
  const { user } = useAuth()
  
  if (!user) return null
  
  const roleConfig = ROLE_CONFIGS[user.role]
  
  return (
    <div className={`badge ${roleConfig.color}`}>
      <span>{roleConfig.icon}</span>
      <span>{roleConfig.label}</span>
    </div>
  )
}
```

---

## 🛡️ Advanced Usage

### **Checking Multiple Permissions**

```tsx
import { useAuth } from '@/lib/auth'

function ComplexComponent() {
  const { can, canAny } = useAuth()
  
  // Check if user has ALL permissions (AND logic)
  const canManageFinance = can('panel:cashflow') && can('capability:cashflow_approval')
  
  // Check if user has ANY permission (OR logic)
  const canViewData = canAny(['panel:produksi', 'panel:stok', 'panel:penjualan'])
  
  return (
    <div>
      {canManageFinance && <FinanceManagement />}
      {canViewData && <DataVisualization />}
    </div>
  )
}
```

### **Checking Panel Access Level**

```tsx
import { useAuth } from '@/lib/auth'

function MemberPerformancePanel() {
  const { panelAccess, user } = useAuth()
  const accessLevel = panelAccess('performa_anggota')
  
  return (
    <div>
      {accessLevel === 'own_only' && (
        <div className="alert">
          Anda hanya dapat melihat data pribadi Anda
        </div>
      )}
      
      {accessLevel === 'aggregate' && (
        <div className="alert">
          Data ditampilkan dalam bentuk agregat
        </div>
      )}
      
      {accessLevel === 'consent_required' && (
        <div className="alert">
          Akses memerlukan persetujuan anggota
        </div>
      )}
      
      <PerformanceData accessLevel={accessLevel} userId={user?.id} />
    </div>
  )
}
```

### **Checking Export Permissions**

```tsx
import { useAuth } from '@/lib/auth'

function ExportToolbar() {
  const { canExportAs } = useAuth()
  
  return (
    <div className="toolbar">
      {canExportAs('pdf') && (
        <Button onClick={exportPDF}>
          <FileText /> Export PDF
        </Button>
      )}
      
      {canExportAs('excel') && (
        <Button onClick={exportExcel}>
          <FileSpreadsheet /> Export Excel
        </Button>
      )}
      
      {!canExportAs('pdf') && !canExportAs('excel') && (
        <div className="text-muted">
          Anda tidak memiliki izin export
        </div>
      )}
    </div>
  )
}
```

### **Checking Data Scope**

```tsx
import { useAuth } from '@/lib/auth'

function DataFilter() {
  const { dataScope, user } = useAuth()
  const scope = dataScope()
  
  // Adjust API query based on data scope
  const apiParams = {
    ...(scope === 'own' && { userId: user?.id }),
    ...(scope === 'koperasi' && { koperasiId: user?.koperasiId }),
    ...(scope === 'district_aggregate' && { aggregateBy: 'district' }),
    ...(scope === 'national_aggregate' && { aggregateBy: 'national' }),
  }
  
  return <DataTable params={apiParams} />
}
```

---

## 🔐 Security Best Practices

### **1. Always Check Permissions on Both Client and Server**

```tsx
// ❌ BAD - Client-side only
function DeleteButton({ itemId }) {
  const { can } = useAuth()
  
  if (!can('capability:delete_items')) return null
  
  return (
    <Button onClick={() => deleteItem(itemId)}>
      Delete
    </Button>
  )
}

// ✅ GOOD - Client-side + Server-side
function DeleteButton({ itemId }) {
  const { can } = useAuth()
  
  if (!can('capability:delete_items')) return null
  
  const handleDelete = async () => {
    // Server will also check permissions
    const response = await fetch(`/api/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.status === 403) {
      alert('Permission denied')
    }
  }
  
  return <Button onClick={handleDelete}>Delete</Button>
}
```

### **2. Never Expose Sensitive Data Based on UI Hiding**

```tsx
// ❌ BAD - Data is still in DOM
function UserList({ users }) {
  const { can } = useAuth()
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          {can('view:sensitive_data') && (
            <span>{user.ssn}</span> // Still in DOM even if hidden!
          )}
        </div>
      ))}
    </div>
  )
}

// ✅ GOOD - Fetch different data based on permissions
function UserList() {
  const { can } = useAuth()
  const includeSensitive = can('view:sensitive_data')
  
  const { data: users } = useSWR(
    `/api/users?includeSensitive=${includeSensitive}`
  )
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          {user.ssn && <span>{user.ssn}</span>}
        </div>
      ))}
    </div>
  )
}
```

### **3. Use Permission Checks, Not Role Checks**

```tsx
// ❌ BAD - Hardcoded role check
function ExportButton() {
  const { user } = useAuth()
  
  if (user?.role === 'ketua' || user?.role === 'koperasi_manager') {
    return <Button>Export</Button>
  }
  
  return null
}

// ✅ GOOD - Permission-based check
function ExportButton() {
  const { can } = useAuth()
  
  if (can('export:pdf')) {
    return <Button>Export</Button>
  }
  
  return null
}
```

### **4. Handle Loading and Error States**

```tsx
function ProtectedComponent() {
  const { user, isLoading } = useAuth()
  
  // Show loading state
  if (isLoading) {
    return <Spinner />
  }
  
  // Handle unauthenticated state
  if (!user) {
    return <LoginPrompt />
  }
  
  // Handle unauthorized state
  if (!can('panel:cashflow')) {
    return <AccessDenied />
  }
  
  // Render protected content
  return <CashflowPanel />
}
```

---

## 📝 Adding New Permissions

### **Step 1: Define Permission in Types**

```typescript
// lib/rbac/types.ts
export type Permission =
  | 'panel:produksi'
  | 'panel:new_feature' // Add new permission
  | 'export:pdf'
  // ... other permissions
```

### **Step 2: Add Permission to Roles**

```typescript
// lib/rbac/roles.ts
export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  ketua: {
    // ... other config
    permissions: [
      'panel:produksi',
      'panel:new_feature', // Add to relevant roles
      'export:pdf',
      // ... other permissions
    ],
  },
  // ... other roles
}
```

### **Step 3: Use Permission in Components**

```tsx
// components/new-feature.tsx
import { RequirePermission } from '@/components/auth/require-permission'

export function NewFeature() {
  return (
    <RequirePermission permission="panel:new_feature">
      <div>New feature content</div>
    </RequirePermission>
  )
}
```

---

## 🧪 Testing RBAC

### **Testing Permission Checks**

```typescript
import { hasPermission, canAccessPanel } from '@/lib/rbac'

describe('RBAC', () => {
  it('should allow ketua to access cashflow', () => {
    expect(hasPermission('ketua', 'panel:cashflow')).toBe(true)
    expect(canAccessPanel('ketua', 'cashflow')).toBe('full')
  })
  
  it('should deny petani access to logistik', () => {
    expect(hasPermission('petani', 'panel:logistik')).toBe(false)
    expect(canAccessPanel('petani', 'logistik')).toBe('none')
  })
  
  it('should allow koperasi_manager view-only cashflow', () => {
    expect(hasPermission('koperasi_manager', 'panel:cashflow')).toBe(true)
    expect(canAccessPanel('koperasi_manager', 'cashflow')).toBe('view_only')
  })
})
```

### **Testing Components with RBAC**

```typescript
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/lib/auth'
import { MOCK_USERS } from '@/lib/auth/mock-users'

describe('CashflowPanel', () => {
  it('should show edit button for ketua', () => {
    render(
      <AuthProvider initialUser={MOCK_USERS.ketua}>
        <CashflowPanel />
      </AuthProvider>
    )
    
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })
  
  it('should hide edit button for koperasi_manager', () => {
    render(
      <AuthProvider initialUser={MOCK_USERS.koperasi_manager}>
        <CashflowPanel />
      </AuthProvider>
    )
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })
  
  it('should show access denied for petani', () => {
    render(
      <AuthProvider initialUser={MOCK_USERS.petani}>
        <CashflowPanel />
      </AuthProvider>
    )
    
    expect(screen.getByText(/tidak memiliki akses/i)).toBeInTheDocument()
  })
})
```

---

## 🐛 Troubleshooting

### **Problem: Permission check always returns false**

```tsx
// ❌ Wrong - typo in permission name
can('panel:cashfow') // Should be 'cashflow'

// ✅ Correct
can('panel:cashflow')
```

### **Problem: Component not re-rendering after login**

```tsx
// ❌ Wrong - not using auth context
function MyComponent() {
  const user = localStorage.getItem('user')
  // ...
}

// ✅ Correct - use auth context
function MyComponent() {
  const { user } = useAuth()
  // ...
}
```

### **Problem: User can access route by typing URL**

```tsx
// ❌ Wrong - no route protection
export default function AdminPage() {
  return <AdminContent />
}

// ✅ Correct - add route protection
export default function AdminPage() {
  const { user, canRoute } = useAuth()
  
  if (!user || !canRoute('/admin/roles')) {
    return <AccessDenied />
  }
  
  return <AdminContent />
}
```

---

## 📚 API Reference

### **useAuth Hook**

```typescript
const {
  user,              // Current user object or null
  isLoading,         // Loading state
  loginAs,           // Login as role: (role: Role) => void
  loginWithUser,     // Login with user object: (user: User) => void
  logout,            // Logout: () => void
  can,               // Check permission: (permission: Permission | Permission[]) => boolean
  canAny,            // Check any permission: (permissions: Permission[]) => boolean
  panelAccess,       // Get panel access level: (panel: PanelKey) => AccessLevel
  canSeePanel,       // Check if can view panel: (panel: PanelKey) => boolean
  canExportAs,       // Check export permission: (format: 'pdf' | 'excel') => boolean
  dataScope,         // Get data scope: () => DataScope
  canRoute,          // Check route access: (route: string) => boolean
} = useAuth()
```

### **RequirePermission Component**

```typescript
<RequirePermission
  permission="panel:cashflow"  // Single permission
  // OR
  permission={['panel:produksi', 'panel:stok']}  // Multiple permissions (OR logic)
  compact={false}  // Show compact access denied message
>
  {children}
</RequirePermission>
```

### **RoleGate Component**

```typescript
<RoleGate
  roles="ketua"  // Single role
  // OR
  roles={['ketua', 'sysadmin']}  // Multiple roles
  compact={false}  // Show compact access denied message
>
  {children}
</RoleGate>
```

---

## 🎓 Learning Resources

### **Key Files to Study**
1. `lib/rbac/types.ts` - Type definitions
2. `lib/rbac/roles.ts` - Role configurations
3. `lib/rbac/access-control.ts` - Core logic
4. `lib/auth/use-auth.ts` - Hook implementation
5. `components/auth/require-permission.tsx` - Component example

### **Example Implementations**
1. `app/dashboard/page.tsx` - Panel-level gating
2. `components/dashboard/sidebar.tsx` - Navigation filtering
3. `components/dashboard/header.tsx` - User display
4. `components/dashboard/dashboard-layout.tsx` - Route protection

---

**Last Updated:** March 12, 2026  
**Version:** 1.0  
**Maintainer:** DNA Desa AI Presisi Team
