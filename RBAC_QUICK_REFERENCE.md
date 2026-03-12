# RBAC Quick Reference Card

## 🚀 Quick Start (30 seconds)

```tsx
import { useAuth } from '@/lib/auth'
import { RequirePermission } from '@/components/auth/require-permission'

function MyComponent() {
  const { user, can } = useAuth()
  
  return (
    <div>
      {/* Method 1: Conditional rendering */}
      {can('panel:cashflow') && <CashflowPanel />}
      
      {/* Method 2: Component wrapper */}
      <RequirePermission permission="panel:cashflow">
        <CashflowPanel />
      </RequirePermission>
    </div>
  )
}
```

---

## 📚 Common Patterns

### **Check Single Permission**
```tsx
const { can } = useAuth()

if (can('panel:cashflow')) {
  // User has permission
}
```

### **Check Multiple Permissions (OR)**
```tsx
if (can(['panel:produksi', 'panel:stok'])) {
  // User has at least one permission
}
```

### **Check Multiple Permissions (AND)**
```tsx
if (can('panel:cashflow') && can('capability:cashflow_approval')) {
  // User has both permissions
}
```

### **Check Panel Access Level**
```tsx
const { panelAccess } = useAuth()
const level = panelAccess('cashflow')

if (level === 'full') {
  // Show edit UI
} else if (level === 'view_only') {
  // Show read-only UI
}
```

### **Check Export Permission**
```tsx
const { canExportAs } = useAuth()

{canExportAs('pdf') && <ExportPDFButton />}
{canExportAs('excel') && <ExportExcelButton />}
```

### **Check Route Access**
```tsx
const { canRoute } = useAuth()

if (canRoute('/admin/roles')) {
  // User can access admin routes
}
```

### **Get User Info**
```tsx
const { user } = useAuth()

console.log(user?.name)  // "Budi Santoso"
console.log(user?.role)  // "petani"
console.log(user?.email) // "budi.santoso@example.com"
```

### **Logout**
```tsx
const { logout } = useAuth()

<button onClick={logout}>Logout</button>
```

---

## 🎨 Component Wrappers

### **RequirePermission**
```tsx
<RequirePermission permission="panel:cashflow">
  <CashflowPanel />
</RequirePermission>

{/* Multiple permissions (OR logic) */}
<RequirePermission permission={['panel:produksi', 'panel:stok']}>
  <DataPanel />
</RequirePermission>

{/* Compact mode (smaller error message) */}
<RequirePermission permission="export:pdf" compact>
  <ExportButton />
</RequirePermission>
```

### **RoleGate**
```tsx
<RoleGate roles="sysadmin">
  <AdminPanel />
</RoleGate>

{/* Multiple roles */}
<RoleGate roles={['ketua', 'koperasi_manager']}>
  <ManagementPanel />
</RoleGate>
```

---

## 👥 The 9 Roles (Quick Reference)

| Icon | Role | Key | Can Export? | Data Scope |
|------|------|-----|-------------|------------|
| 👨‍🌾 | Petani Anggota | `petani` | ❌ | Own |
| 🏪 | Kasir / Operator | `kasir` | ❌ | Koperasi |
| 📦 | Manajer Logistik | `logistik_manager` | Excel (logistics) | Koperasi |
| 💼 | Manajer Koperasi | `koperasi_manager` | PDF + Excel | Koperasi |
| 🏦 | Ketua Koperasi | `ketua` | PDF + Excel | Koperasi |
| 🏛️ | Pemerintah Daerah | `pemda` | PDF | District |
| 💰 | Bank | `bank` | PDF | Koperasi |
| 🏢 | Kementerian | `kementerian` | PDF + Excel | National |
| 🔧 | System Admin | `sysadmin` | PDF + Excel | All |

---

## 🎯 Permission Types

### **Panel Permissions**
```
panel:produksi
panel:stok
panel:penjualan
panel:logistik
panel:cashflow
panel:performa_anggota
panel:performa_komoditas
panel:risiko
```

### **Export Permissions**
```
export:pdf
export:excel
export:excel_logistics
```

### **Capability Permissions**
```
capability:cashflow_approval
capability:configure_dashboard
capability:member_audit_trail
capability:manage_roles
capability:manage_integrations
capability:view_audit_logs
capability:manage_users
```

### **View Permissions**
```
view:commodity_prices
view:member_data
view:financial_data
```

---

## 📊 Access Levels

| Level | Description | Example Use Case |
|-------|-------------|------------------|
| `full` | Complete read/write | Ketua viewing cashflow |
| `view_only` | Read-only | Koperasi Manager viewing cashflow |
| `aggregate` | Aggregated data | Pemda viewing production stats |
| `own_only` | User's own data | Petani viewing own production |
| `today_only` | Today's data | Kasir viewing today's sales |
| `consent_required` | Requires consent | Bank viewing member data |
| `none` | No access | Petani trying to view logistics |

---

## 🗺️ Route Permissions

| Route | Required Permission |
|-------|---------------------|
| `/dashboard` | (authenticated) |
| `/notifications` | (authenticated) |
| `/analytics/*` | `view:analytics` |
| `/data/master-desa` | `view:master_data` |
| `/data/master-penduduk` | `view:member_data` |
| `/data/master-komoditas` | `view:commodity_data` |
| `/data/sensor-iot` | `view:iot_data` |
| `/data/geospasial` | `view:geospatial_data` |
| `/data/integrasi` | `capability:manage_integrations` |
| `/strategic/peta-dna` | `view:strategic_planning` |
| `/strategic/laporan` | `view:reports` |
| `/admin/*` | `capability:manage_roles` |

---

## 🔧 Utility Functions

### **From `lib/rbac/access-control.ts`**

```typescript
// Check if role has permission
hasPermission(role: Role, permission: Permission): boolean

// Get panel access level
canAccessPanel(role: Role, panel: PanelKey): AccessLevel

// Check if can view panel (any access level except 'none')
canViewPanel(role: Role, panel: PanelKey): boolean

// Check export permission
canExport(role: Role, format: 'pdf' | 'excel'): boolean

// Get data scope
getDataScope(role: Role): DataScope

// Check route access
canAccessRoute(role: Role, route: string): boolean

// Filter navigation for role
filterNavigationForRole(navigation: NavGroup[], role: Role): NavGroup[]

// Get admin nav items
getAdminNavItems(role: Role): NavItem[]
```

---

## 🎨 Styling Role Badges

```tsx
import { ROLE_CONFIGS } from '@/lib/rbac/roles'

function RoleBadge({ role }: { role: Role }) {
  const config = ROLE_CONFIGS[role]
  
  return (
    <div className={`badge ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  )
}
```

**Available Colors:**
- `petani`: `bg-green-100 text-green-800`
- `kasir`: `bg-blue-100 text-blue-800`
- `logistik_manager`: `bg-purple-100 text-purple-800`
- `koperasi_manager`: `bg-indigo-100 text-indigo-800`
- `ketua`: `bg-yellow-100 text-yellow-800`
- `pemda`: `bg-orange-100 text-orange-800`
- `bank`: `bg-emerald-100 text-emerald-800`
- `kementerian`: `bg-red-100 text-red-800`
- `sysadmin`: `bg-gray-100 text-gray-800`

---

## 🐛 Common Mistakes

### ❌ Wrong: Hardcoded Role Check
```tsx
if (user?.role === 'ketua') {
  return <ExportButton />
}
```

### ✅ Correct: Permission Check
```tsx
if (can('export:pdf')) {
  return <ExportButton />
}
```

---

### ❌ Wrong: Not Checking Auth
```tsx
function MyComponent() {
  return <SensitiveData />
}
```

### ✅ Correct: Check Auth
```tsx
function MyComponent() {
  const { user } = useAuth()
  
  if (!user) {
    return <LoginPrompt />
  }
  
  return <SensitiveData />
}
```

---

### ❌ Wrong: Client-Side Only
```tsx
// Only checking on client
if (can('panel:cashflow')) {
  const data = await fetch('/api/cashflow')
}
```

### ✅ Correct: Client + Server
```tsx
// Check on client
if (can('panel:cashflow')) {
  // Server also checks permission
  const data = await fetch('/api/cashflow')
}

// app/api/cashflow/route.ts
export async function GET() {
  const user = await requirePermission('panel:cashflow')
  // ...
}
```

---

## 📝 Code Snippets

### **Protect a Page**
```tsx
'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { user, canRoute } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (!canRoute('/admin/roles')) {
      router.push('/dashboard')
    }
  }, [user, canRoute, router])
  
  if (!user || !canRoute('/admin/roles')) {
    return null
  }
  
  return <PageContent />
}
```

### **Dynamic Navigation**
```tsx
import { useAuth } from '@/lib/auth'

function Sidebar() {
  const { canRoute } = useAuth()
  
  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics/dna-desa' },
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

### **Conditional Export Buttons**
```tsx
import { useAuth } from '@/lib/auth'

function ExportToolbar() {
  const { canExportAs } = useAuth()
  
  return (
    <div className="flex gap-2">
      {canExportAs('pdf') && (
        <button onClick={exportPDF}>Export PDF</button>
      )}
      {canExportAs('excel') && (
        <button onClick={exportExcel}>Export Excel</button>
      )}
    </div>
  )
}
```

### **Access Level UI**
```tsx
import { useAuth } from '@/lib/auth'

function CashflowPanel() {
  const { panelAccess } = useAuth()
  const level = panelAccess('cashflow')
  
  if (level === 'none') {
    return <AccessDenied />
  }
  
  return (
    <div>
      {level === 'view_only' && (
        <div className="alert">Read-only mode</div>
      )}
      
      <CashflowData />
      
      {level === 'full' && (
        <button>Edit</button>
      )}
    </div>
  )
}
```

---

## 🧪 Testing

### **Test Permission Check**
```typescript
import { hasPermission } from '@/lib/rbac'

test('ketua can access cashflow', () => {
  expect(hasPermission('ketua', 'panel:cashflow')).toBe(true)
})

test('petani cannot access admin', () => {
  expect(hasPermission('petani', 'capability:manage_roles')).toBe(false)
})
```

### **Test Component**
```typescript
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/lib/auth'
import { MOCK_USERS } from '@/lib/auth/mock-users'

test('shows export button for ketua', () => {
  render(
    <AuthProvider initialUser={MOCK_USERS.ketua}>
      <ExportToolbar />
    </AuthProvider>
  )
  
  expect(screen.getByText('Export PDF')).toBeInTheDocument()
})
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `RBAC_IMPLEMENTATION_SUMMARY.md` | Complete overview & testing guide |
| `RBAC_ROLE_MATRIX.md` | Permission matrix & role profiles |
| `RBAC_DEVELOPER_GUIDE.md` | Developer patterns & examples |
| `RBAC_ARCHITECTURE.md` | System architecture & design |
| `RBAC_BACKEND_INTEGRATION.md` | Backend integration guide |
| `RBAC_QUICK_REFERENCE.md` | This file - quick reference |

---

## 🔗 Key Files

| File | Description |
|------|-------------|
| `lib/rbac/types.ts` | Type definitions |
| `lib/rbac/roles.ts` | Role configurations |
| `lib/rbac/access-control.ts` | Core logic |
| `lib/auth/auth-context.tsx` | Auth provider |
| `lib/auth/use-auth.ts` | Auth hook |
| `lib/auth/mock-users.ts` | Mock users |
| `components/auth/require-permission.tsx` | Permission wrapper |
| `components/auth/role-gate.tsx` | Role wrapper |
| `components/auth/access-denied.tsx` | Access denied UI |

---

## 💡 Pro Tips

1. **Always use permission checks, not role checks**
   - Permissions are more flexible and maintainable

2. **Check permissions on both client and server**
   - Client for UX, server for security

3. **Use `<RequirePermission>` for simple cases**
   - Cleaner than conditional rendering

4. **Use `panelAccess()` for complex UI**
   - Different UI for different access levels

5. **Test with different roles**
   - Use mock users to test all scenarios

6. **Document custom permissions**
   - Add to types.ts and update this guide

7. **Keep RBAC logic in lib/rbac**
   - Don't scatter permission checks everywhere

8. **Use TypeScript**
   - Catch permission typos at compile time

---

## 🆘 Need Help?

1. **Quick question?** Check this reference card
2. **How to use?** Read `RBAC_DEVELOPER_GUIDE.md`
3. **What can each role do?** Check `RBAC_ROLE_MATRIX.md`
4. **How does it work?** Read `RBAC_ARCHITECTURE.md`
5. **Need backend?** Read `RBAC_BACKEND_INTEGRATION.md`
6. **Testing?** Read `RBAC_IMPLEMENTATION_SUMMARY.md`

---

**Last Updated:** March 12, 2026  
**Version:** 1.0  
**Print this page and keep it handy! 📄**
