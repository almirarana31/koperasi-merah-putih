# UI Improvement Todo

## Completed Pass
- [x] Reduce overall UI scale slightly by lowering the base font sizing so dense pages fit more naturally.
- [x] Standardize logo lockups to `KOPDES` with subtitle `Koperasi Digital` across header, sidebar, landing, and login.
- [x] Make selected sidebar navigation items less pill-shaped and more square.
- [x] Enforce rounded surfaces more consistently and clean up remaining square chart corners.
- [x] Rebuild the kementerian filter bar so fields wrap and fit cleanly on narrower widths.
- [x] Move `Live Audit Feed` to the bottom of `Pusat Kendali Eksekutif` and stretch it horizontally.
- [x] Update key page headings touched in this pass to clearer Titlecase styling.

## Anggota
- [x] `Daftar Anggota`: clean subheading copy, rename `NODES` to `WILAYAH`, improve row separators, add hoverable wilayah detail, clarify dual-role labeling, remove harsh red highlight, and add pagination controls.
- [x] `Profil & Behavior`: rename `Detail Entitas Terpilih` to `Detail Profil Terpilih` and add an available-profile table under the selected profile.
- [x] `Direktori Produsen`: replace the commodity chart with a colored pie chart, add hover interaction, restore type filtering, and make producer detail views open properly.
- [x] `Kelompok Produsen`: Titlecase status labels and add working detail pages for `/anggota/kelompok/[id]`.
- [x] `Verifikasi KYC`: tidy and round the floating review popup.

## Produksi
- [x] `Catatan Panen`: add harvest trend and total-harvest summary blocks.
- [x] `Komoditas`: add a spread map-style visualization plus a pie chart mix view.
- [x] `Jadwal Panen`: rebuild into day, week, month, and year calendar views with a shorter manifest list.

## Remaining Polish
- [ ] Continue the Titlecase cleanup on untouched dashboard pages that still use legacy all-caps page headings.
- [ ] Do a final responsive sweep on remaining secondary pages, especially dense tables and metric cards.
- [ ] Expand more empty/detail states so every clickable entity pattern has a visible next step.
- [ ] Run one more visual QA pass for spacing consistency after the global zoom adjustment.
