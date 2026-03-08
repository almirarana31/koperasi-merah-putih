"use client"

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Send to error tracking service (Sentry, etc.)
    if (typeof window !== 'undefined') {
      // window.Sentry?.captureException(error)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-card rounded-lg border border-border">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Terjadi Kesalahan
          </h2>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
          </p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            variant="default"
          >
            Coba Lagi
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
