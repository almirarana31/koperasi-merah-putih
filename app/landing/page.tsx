'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sprout,
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Package,
  Truck,
  DollarSign,
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Manage Members',
      description: 'Keep track of all your members, their finances, and production activities',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: Sprout,
      title: 'Track Production',
      description: 'Monitor planting schedules, harvests, and collect produce from farmers',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: Package,
      title: 'Smart Storage',
      description: 'Check product quality with AI and track inventory with QR codes',
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: BarChart3,
      title: 'Online Store',
      description: 'Sell directly to customers with an easy-to-use online marketplace',
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      icon: Truck,
      title: 'Delivery Management',
      description: 'Plan routes, track vehicles, and schedule deliveries efficiently',
      color: 'text-cyan-600',
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    },
    {
      icon: DollarSign,
      title: 'Money Management',
      description: 'Handle invoices, loans, payments, and financial reports in one place',
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
  ]

  const stats = [
    { label: 'Active Members', value: '1,247', icon: Users },
    { label: 'Total Production', value: '2,450 ton', icon: Sprout },
    { label: 'Monthly Revenue', value: 'Rp 1.2B', icon: TrendingUp },
    { label: 'Villages Served', value: '45', icon: Leaf },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-4 py-1">
            <Leaf className="h-3 w-3 mr-1" />
            Digital Cooperative Operating System
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Koperasi Merah Putih
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Helping rural farmers grow their business with smart technology. 
            From planting to selling, everything you need in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://dna-desa.example.com">
              <Button size="lg" variant="outline" className="px-8">
                <BarChart3 className="mr-2 h-4 w-4" />
                DNA Desa AI
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything Your Cooperative Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All the tools to run a successful farming cooperative, made simple and easy to use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Koperasi Merah Putih?</h2>
            <p className="text-muted-foreground">Built specifically for Indonesian agricultural cooperatives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                'Check product quality automatically with smart technology',
                'Track your inventory instantly with QR code scanning',
                'Sell directly to customers through your online store',
                'Generate financial reports and manage loans easily',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                'Works on your phone, perfect for use in the field',
                'Keep working even without internet connection',
                'Available in Indonesian and local languages',
                'Easy government reporting and compliance',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Cooperative?</h2>
          <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join hundreds of cooperatives already using our platform to increase efficiency and farmer income
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © 2026 Koperasi Merah Putih. Empowering Indonesian Farmers.
          </p>
        </div>
      </div>
    </div>
  )
}
  </div>
    </div>
  )
}
/div>
  )
}
