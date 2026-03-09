"use client"

import { useState } from "react"
import { KopdesSidebarCustom } from "./kopdes-sidebar-custom"
import { KopdesHeader } from "./kopdes-header"

interface KopdesLayoutProps {
  children: React.ReactNode
}

export function KopdesLayout({ children }: KopdesLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <KopdesSidebarCustom open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <KopdesHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 sm:p-6">
          {children}
        </main>

        <footer className="border-t border-border px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <p>© 2026 Koperasi Merah Putih. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
