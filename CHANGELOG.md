# Changelog

## 31-03-2026

### RBAC and Route Security
- Reworked role-based access control in `lib/rbac/access-control.ts` to use the app's real routes instead of placeholder mappings.
- Locked sensitive member-management flows such as `/anggota/tambah`, `/anggota/onboarding`, and `/anggota/verifikasi` so regular `petani` users cannot access them.
- Made protected route matching fail closed for unknown protected pages.
- Kept dashboard route guards active so direct URL access still respects role permissions.

### Role-Based Navigation and Access UX
- Updated `components/kopdes-sidebar-custom.tsx` so the sidebar only shows links the current role can actually open.
- Added role-aware label changes for `petani`, including labels like `Profil Saya`, `Panen Saya`, `Pinjaman Saya`, and `AI Tani`.
- Improved `components/auth/access-denied.tsx` so blocked users see recovery links to valid pages for their role.
- Added the missing `isLoading` field to `lib/auth/auth-context.tsx` so auth guards and context usage are aligned.

### Dashboard Experience by Role
- Rebuilt `app/(dashboard)/dashboard/page.tsx` into a role-aware dashboard that shows relevant summaries, priorities, and actions instead of raw routes or generic admin content.
- Replaced the plain red hero with a richer editorial command-card layout inspired by the Stitch references.
- Added role-specific hero artwork and mini-panels for all roles.
- Removed fake decorative chips and converted hero controls into real working links backed by role-valid routes only.
- Ensured hero actions are dynamic across all roles: if an action is shown, it is pressable and navigates to a valid destination.

### Persona-Specific Pages
- Converted shared production views into self-service experiences for `petani` in:
  - `app/(dashboard)/produksi/page.tsx`
  - `app/(dashboard)/produksi/rencana/page.tsx`
  - `app/(dashboard)/produksi/jadwal/page.tsx`
  - `app/(dashboard)/produksi/komoditas/page.tsx`
  - `app/(dashboard)/pasar/harga/page.tsx`
- Added role-aware behavior to shared pages including:
  - `app/(dashboard)/anggota/profil/page.tsx`
  - `app/(dashboard)/keuangan/pinjaman/page.tsx`
  - `app/(dashboard)/keuangan/shu/page.tsx`
  - `app/(dashboard)/ai/page.tsx`
  - `app/(dashboard)/assistant/page.tsx`
  - `app/(dashboard)/assistant/konsultasi/page.tsx`
  - `app/(dashboard)/assistant/laporan/page.tsx`
  - `app/(dashboard)/assistant/notifikasi/page.tsx`

### Visual Refresh
- Switched the application theme to a red and off-white palette in `app/globals.css`.
- Restyled `app/login/page.tsx` to follow the newer Stitch-inspired direction with a cleaner card layout, stronger red CTA, softer surfaces, and integrated role selection.
- Updated the dashboard loading state in `app/(dashboard)/layout.tsx` to match the new theme.

### Landing Flow and Navigation
- Removed the old marketing-style landing page from the user flow.
- Changed `app/page.tsx` so `/` redirects directly to `/login`.
- Changed `app/landing/page.tsx` so `/landing` also redirects directly to `/login`.
- Updated the dashboard sidebar logo in `components/kopdes-sidebar-custom.tsx` so the KOPDES logo returns users to the RBAC role-selection page (`/login`).

### Mobile and Responsiveness
- Improved the dashboard and role-specific pages for mobile by using more card-based layouts and safer overflow handling.
- Fixed the notifications dropdown in `components/kopdes-header.tsx` so it no longer overflows on narrow screens.

### Verification
- Ran `npm run build` successfully after the major update passes.
- Remaining known non-blocking warning: Next.js still reports multiple lockfiles / inferred Turbopack root.
