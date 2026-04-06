"use client"

import { useState } from "react"
import { KopdesBottomNav } from "./kopdes-bottom-nav"
import { KopdesHeader } from "./kopdes-header"
import { KopdesSidebarCustom } from "./kopdes-sidebar-custom"
import { FloatingAIChatbot } from "./floating-ai-chatbot"

interface KopdesLayoutProps {
  children: React.ReactNode
}

export function KopdesLayout({ children }: KopdesLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,rgba(190,8,23,0.06),transparent_48%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_34%)]" />
      <KopdesSidebarCustom open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative lg:ml-64">
        <KopdesHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="px-3.5 pb-24 pt-4 sm:px-5 sm:pb-28 lg:px-6 lg:pb-6">
          {children}
        </main>
      </div>

      <KopdesBottomNav />
      <FloatingAIChatbot />
    </div>
  )
}
