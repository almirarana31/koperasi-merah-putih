"use client"

import Link from "next/link"
import { ArrowRight, Leaf, ShieldCheck, Zap, Globe, Users, BarChart3, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">KOPDES</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Fitur</Link>
            <Link href="#impact" className="text-sm font-medium hover:text-primary transition-colors">Dampak</Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">Tentang Kami</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button className="rounded-full px-6" asChild>
              <Link href="/login">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(190,8,23,0.05),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(190,8,23,0.03),transparent_50%)]" />
          <div className="absolute top-1/4 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Zap className="h-4 w-4" />
                  <span>The Future of Rural Economy</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
                  Digital & AI <span className="text-primary italic">Operating System</span> untuk Koperasi Desa
                </h1>
                <p className="mx-auto lg:mx-0 max-w-xl text-lg text-muted-foreground sm:text-xl">
                  Transformasikan ekonomi pedesaan dengan platform manajemen terintegrasi yang didukung oleh kecerdasan buatan. Dari ladang hingga ke meja konsumen.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                  <Button size="lg" className="h-14 rounded-2xl px-8 text-lg font-bold shadow-xl shadow-primary/20" asChild>
                    <Link href="/login">
                      Masuk ke Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 rounded-2xl px-8 text-lg font-bold" asChild>
                    <Link href="#features">Pelajari Fitur</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-muted-foreground">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-secondary" />
                    ))}
                  </div>
                  <p className="text-sm font-medium">Dipercaya oleh 50+ Koperasi di Indonesia</p>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-border/50 bg-secondary/30 shadow-2xl backdrop-blur-sm">
                  {/* Dashboard Preview Simulation */}
                  <div className="absolute inset-0 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-32 rounded-lg bg-primary/20" />
                      <div className="h-8 w-8 rounded-full bg-primary/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-2xl bg-background shadow-sm p-4 space-y-2">
                          <div className="h-3 w-12 rounded bg-muted" />
                          <div className="h-6 w-16 rounded bg-primary/10" />
                        </div>
                      ))}
                    </div>
                    <div className="h-48 rounded-3xl bg-background shadow-sm p-6">
                      <div className="flex justify-between items-end h-full gap-2">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/10 rounded-t-lg transition-all hover:bg-primary/30" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Overlay for a more realistic look */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-white/10" />
                </div>
                {/* Floating Elements */}
                <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-white p-4 shadow-xl border border-border/50 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Profit Naik</p>
                      <p className="text-lg font-bold text-emerald-600">+24%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Satu Platform, Semua Kebutuhan</h2>
              <p className="text-muted-foreground text-lg">
                Modul lengkap yang dirancang khusus untuk operasional koperasi modern dengan alur kerja yang intuitif.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Manajemen Anggota",
                  desc: "Database digital lengkap dengan profil behavior, onboarding KTP otomatis, dan verifikasi KYC.",
                  icon: Users,
                  color: "bg-blue-500"
                },
                {
                  title: "Produksi & Panen",
                  desc: "Pencatatan hasil panen, rencana tanam, hingga jadwal agregasi komoditas secara real-time.",
                  icon: Leaf,
                  color: "bg-emerald-500"
                },
                {
                  title: "Inventory & Gudang",
                  desc: "Kontrol stok cerdas dengan fitur grading otomatis dan monitoring suhu cold storage.",
                  icon: ShieldCheck,
                  color: "bg-primary"
                },
                {
                  title: "Pasar & B2B",
                  desc: "Katalog digital untuk pembeli korporat, manajemen kontrak, dan monitoring harga pasar.",
                  icon: Globe,
                  color: "bg-purple-500"
                },
                {
                  title: "Keuangan Digital",
                  desc: "Pembukuan otomatis, credit scoring untuk pinjaman anggota, hingga pembagian SHU.",
                  icon: BarChart3,
                  color: "bg-amber-500"
                },
                {
                  title: "AI Intelligence",
                  desc: "Asisten AI yang memberikan prediksi harga dan optimasi rute logistik setiap hari.",
                  icon: Zap,
                  color: "bg-cyan-500"
                }
              ].map((feature, idx) => (
                <Card key={idx} className="group border-none shadow-none bg-white transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  <CardContent className="p-8 space-y-4">
                    <div className={`h-12 w-12 rounded-2xl ${feature.color}/10 flex items-center justify-center transition-colors group-hover:${feature.color}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')} group-hover:text-white transition-colors`} />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                    <Link href="/login" className="inline-flex items-center text-sm font-bold text-primary hover:underline">
                      Akses fitur <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
          
          <div className="container mx-auto px-4 sm:px-6 text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white max-w-3xl mx-auto">
              Siap Memodernisasi Koperasi Anda Hari Ini?
            </h2>
            <p className="text-primary-foreground/80 text-lg sm:text-xl max-w-xl mx-auto">
              Gabung dengan ribuan pengelola koperasi yang telah beralih ke sistem operasi digital masa depan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-14 rounded-2xl px-10 text-lg font-bold" asChild>
                <Link href="/login">Mulai Sekarang</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 rounded-2xl px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="#">Hubungi Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-primary">KOPDES</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Koperasi Merah Putih. Digital Rural Empowerment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
