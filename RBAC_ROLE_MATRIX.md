# RBAC Role Permission Matrix

## Quick Reference Guide for All 9 Roles

---

## 📊 Panel Access Matrix

| Panel | Petani | Kasir | Logistik Mgr | Koperasi Mgr | Ketua | Pemda | Bank | Kementerian | Sysadmin |
|-------|--------|-------|--------------|--------------|-------|-------|------|-------------|----------|
| **Produksi** | 🟢 Own | ❌ | ❌ | 🟢 Full | 🟢 Full | 🟡 Agg | ❌ | 🟡 Agg | 🔵 View |
| **Stok** | ❌ | 🟢 Full | 🟢 Full | 🟢 Full | 🟢 Full | ❌ | ❌ | ❌ | 🔵 View |
| **Penjualan** | ❌ | 🟡 Today | ❌ | 🟢 Full | 🟢 Full | ❌ | ❌ | ❌ | 🔵 View |
| **Logistik** | ❌ | ❌ | 🟢 Full | 🟢 Full | 🟢 Full | 🟡 Agg | ❌ | 🟡 Agg | 🔵 View |
| **Cashflow** | 🟢 Own | ❌ | ❌ | 🔵 View | 🟢 Full | ❌ | 🟡 Agg | ❌ | 🔵 View |
| **Performa Anggota** | 🟢 Own | ❌ | ❌ | 🟢 Full | 🟢 Full | 🟡 Agg | 🟠 Consent | ❌ | 🔵 View |
| **Performa Komoditas** | 🔵 View | 🔵 View | 🔵 View | 🟢 Full | 🟢 Full | 🟡 Agg | 🔵 View | 🟡 Agg | 🔵 View |
| **Risiko** | ❌ | ❌ | 🟢 Full | 🟢 Full | 🟢 Full | ❌ | 🔵 View | ❌ | 🔵 View |

**Legend:**
- 🟢 **Full** - Complete read/write access
- 🔵 **View** - Read-only access
- 🟡 **Agg** - Aggregated/anonymized data only
- 🟢 **Own** - User's own data only
- 🟡 **Today** - Today's data only
- 🟠 **Consent** - Requires user consent
- ❌ **None** - No access

---

## 📤 Export Permissions

| Export Type | Petani | Kasir | Logistik Mgr | Koperasi Mgr | Ketua | Pemda | Bank | Kementerian | Sysadmin |
|-------------|--------|-------|--------------|--------------|-------|-------|------|-------------|----------|
| **PDF** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Excel (Full)** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Excel (Logistics)** | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

## 🗺️ Route Access Matrix

| Route | Petani | Kasir | Logistik Mgr | Koperasi Mgr | Ketua | Pemda | Bank | Kementerian | Sysadmin |
|-------|--------|-------|--------------|--------------|-------|-------|------|-------------|----------|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/notifications` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/analytics/*` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/data/master-desa` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/data/master-penduduk` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| `/data/master-komoditas` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/data/sensor-iot` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `/data/geospasial` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/data/integrasi` | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `/strategic/peta-dna` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/strategic/laporan` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/admin/*` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 Special Capabilities

| Capability | Petani | Kasir | Logistik Mgr | Koperasi Mgr | Ketua | Pemda | Bank | Kementerian | Sysadmin |
|------------|--------|-------|--------------|--------------|-------|-------|------|-------------|----------|
| **Cashflow Approval** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Configure Dashboard** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Member Audit Trail** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Manage Roles** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Manage Integrations** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **View Audit Logs** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Manage Users** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 📋 Role Profiles

### 👨‍🌾 Petani Anggota (Farmer Member)
**Data Scope:** Own data only  
**Primary Use Case:** View personal production, cashflow, and performance data  
**Key Restrictions:** Cannot see other members' data, no export capabilities, no access to management features

**Can Access:**
- Own production data
- Own cashflow records
- Own performance metrics
- Commodity prices (view-only)

**Cannot Access:**
- Other members' data
- Koperasi-wide analytics
- Management tools
- Export functions

---

### 🏪 Kasir / Operator (Koperasi Staff)
**Data Scope:** Koperasi-wide  
**Primary Use Case:** Daily operations - sales, stock management  
**Key Restrictions:** Today's sales only, no financial data, no export

**Can Access:**
- Today's sales data
- Stock levels
- Commodity information

**Cannot Access:**
- Historical sales data
- Cashflow/financial data
- Member performance data
- Export functions

---

### 📦 Manajer Logistik (Logistics Manager)
**Data Scope:** Koperasi-wide  
**Primary Use Case:** Supply chain and logistics management  
**Key Restrictions:** No financial data, limited export (logistics only)

**Can Access:**
- Full logistics data
- Stock management
- Risk assessment
- Commodity information
- Excel export (logistics data only)

**Cannot Access:**
- Cashflow/financial data
- Member performance data
- PDF export

---

### 💼 Manajer Koperasi (Koperasi Manager)
**Data Scope:** Koperasi-wide  
**Primary Use Case:** Operational management and oversight  
**Key Restrictions:** Cashflow is view-only (no approval rights)

**Can Access:**
- All 8 panels (cashflow view-only)
- Full export capabilities (PDF + Excel)
- All data management routes
- Strategic planning tools

**Cannot Access:**
- Cashflow approval
- Dashboard configuration
- Admin functions

---

### 🏦 Ketua Koperasi (Koperasi Chairman)
**Data Scope:** Koperasi-wide  
**Primary Use Case:** Strategic leadership and final approvals  
**Key Restrictions:** None (full koperasi access)

**Can Access:**
- All 8 panels (full access)
- Cashflow approval
- Dashboard configuration
- Member audit trail
- Full export capabilities
- All management routes

**Cannot Access:**
- System administration functions
- Other koperasi data

---

### 🏛️ Pemerintah Daerah (Local Government)
**Data Scope:** District-level aggregate  
**Primary Use Case:** Regional planning and oversight  
**Key Restrictions:** Aggregated data only, no individual member data

**Can Access:**
- Aggregated production data
- Aggregated logistics data
- Aggregated member performance
- Aggregated commodity data
- PDF export

**Cannot Access:**
- Individual member data
- Financial data (cashflow)
- Stock/sales data
- Excel export

---

### 💰 Bank / Lembaga Keuangan (Financial Institution)
**Data Scope:** Koperasi-wide (with consent)  
**Primary Use Case:** Credit assessment and financial monitoring  
**Key Restrictions:** Member data requires consent, aggregated cashflow only

**Can Access:**
- Aggregated cashflow data
- Member performance (with consent)
- Commodity information
- Risk assessment
- PDF export

**Cannot Access:**
- Individual production data
- Logistics/stock data
- Detailed financial records
- Excel export

---

### 🏢 Kementerian / Bappenas (National Ministry)
**Data Scope:** National-level aggregate  
**Primary Use Case:** National policy and planning  
**Key Restrictions:** Aggregated data only, no financial/member data

**Can Access:**
- Aggregated production data
- Aggregated logistics data
- Aggregated commodity data
- Full export capabilities (PDF + Excel)

**Cannot Access:**
- Individual member data
- Financial data (cashflow)
- Member performance data
- Stock/sales data

---

### 🔧 System Administrator
**Data Scope:** All koperasi (cross-organization)  
**Primary Use Case:** System management and technical support  
**Key Restrictions:** No cashflow approval (separation of duties)

**Can Access:**
- All 8 panels (view-only for sensitive data)
- Admin functions (roles, integrations, audit logs)
- Full export capabilities
- All routes (including admin)

**Cannot Access:**
- Cashflow approval (business decision, not technical)

---

## 🔐 Security Principles

### **Separation of Duties**
- Sysadmin cannot approve cashflow (technical vs. business decision)
- Koperasi Manager cannot approve cashflow (requires chairman authority)
- Kasir can only see today's sales (prevents historical data manipulation)

### **Data Minimization**
- Petani only sees own data (privacy)
- External stakeholders (Pemda, Bank, Kementerian) see aggregated data only
- Consent required for Bank to access member performance data

### **Least Privilege**
- Each role has minimum permissions needed for their function
- Export capabilities limited to roles that need reporting
- Admin functions isolated to sysadmin role only

### **Audit Trail**
- Ketua and Sysadmin can view member audit trail
- All permission checks can be logged (future enhancement)
- Role changes tracked (future enhancement)

---

## 📝 Usage Examples

### Example 1: Petani Checks Their Performance
```typescript
// User: Budi Santoso (Petani)
// Can access: Own production, cashflow, performance
// Cannot access: Other members' data, koperasi-wide analytics

// ✅ Allowed
canAccessPanel('petani', 'produksi') // 'own_only'
canAccessPanel('petani', 'cashflow') // 'own_only'

// ❌ Denied
canAccessPanel('petani', 'logistik') // 'none'
canExport('petani', 'pdf') // false
```

### Example 2: Koperasi Manager Reviews Operations
```typescript
// User: Dewi Lestari (Koperasi Manager)
// Can access: All panels, full export
// Cannot access: Cashflow approval

// ✅ Allowed
canAccessPanel('koperasi_manager', 'produksi') // 'full'
canAccessPanel('koperasi_manager', 'cashflow') // 'view_only'
canExport('koperasi_manager', 'pdf') // true
canExport('koperasi_manager', 'excel') // true

// ❌ Denied
hasPermission('koperasi_manager', 'capability:cashflow_approval') // false
```

### Example 3: Sysadmin Manages System
```typescript
// User: Andi Wijaya (Sysadmin)
// Can access: All panels (view), admin functions
// Cannot access: Cashflow approval

// ✅ Allowed
canAccessRoute('sysadmin', '/admin/roles') // true
canAccessRoute('sysadmin', '/admin/audit-logs') // true
hasPermission('sysadmin', 'capability:manage_roles') // true

// ❌ Denied
hasPermission('sysadmin', 'capability:cashflow_approval') // false
```

---

## 🎓 Best Practices

### **For Developers**
1. Always use `<RequirePermission>` for sensitive components
2. Use `canAccessRoute()` for route-level protection
3. Use `canAccessPanel()` to determine access level, not just visibility
4. Never hardcode role checks - always use permission checks
5. Document new permissions in this matrix

### **For Administrators**
1. Review role assignments regularly
2. Use least privilege principle when assigning roles
3. Monitor audit logs for suspicious activity (future)
4. Separate technical (sysadmin) from business (ketua) authority
5. Require consent for sensitive data access (Bank → Member data)

### **For Users**
1. Only request access to data you need for your role
2. Report suspicious permission grants
3. Logout when finished (especially on shared devices)
4. Don't share credentials across roles

---

**Last Updated:** March 12, 2026  
**Version:** 1.0  
**Total Roles:** 9  
**Total Permissions:** 50+  
**Total Routes Protected:** 15+
