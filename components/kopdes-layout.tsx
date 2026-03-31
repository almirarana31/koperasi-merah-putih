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
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(190,8,23,0.08),transparent_52%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_40%)]" />
      <KopdesSidebarCustom open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative lg:ml-64">
        <KopdesHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="px-4 pb-28 pt-5 sm:px-6 sm:pb-32 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      <KopdesBottomNav />
      <FloatingAIChatbot />
    </div>
  )
}
