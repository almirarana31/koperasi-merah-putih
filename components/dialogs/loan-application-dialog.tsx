import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Banknote, Calculator, TrendingUp } from 'lucide-react'

export function LoanApplicationDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    purpose: '',
    term: '12',
    interestRate: '12',
    collateral: '',
    monthlyIncome: '',
    notes: '',
  })

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.amount) || 0
    const rate = (parseFloat(formData.interestRate) || 0) / 100 / 12
    const term = parseInt(formData.term) || 1
    
    if (principal && rate && term) {
      const payment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
      return payment
    }
    return 0
  }

  const monthlyPayment = calculateMonthlyPayment()
  const totalPayment = monthlyPayment * parseInt(formData.term || '0')
  const totalInterest = totalPayment - parseFloat(formData.amount || '0')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.memberId || !formData.amount || !formData.purpose) {
      toast.error('Please fill in all required fields')
      return
    }

    const loanData = {
      ...formData,
      monthlyPayment,
      totalPayment,
      totalInterest,
      id: `LOAN${Date.now().toString().slice(-8)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }

    onSave?.(loanData)
    toast.success('Loan application submitted successfully!')
    onOpenChange(false)
    
    setFormData({
      memberId: '',
      amount: '',
      purpose: '',
      term: '12',
      interestRate: '12',
      collateral: '',
      monthlyIncome: '',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Banknote className="h-5 w-5 text-blue-600" />
            Loan Application
          </DialogTitle>
          <DialogDescription>
            Submit a loan application for cooperative members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberId">Member *</Label>
              <Select value={formData.memberId} onValueChange={(value) => setFormData({ ...formData, memberId: value })}>
                <SelectTrigger id="memberId">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M001">M001 - Pak Slamet Widodo</SelectItem>
                  <SelectItem value="M002">M002 - Bu Sri Wahyuni</SelectItem>
                  <SelectItem value="M003">M003 - Pak Ahmad Sudirman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 10000000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="purpose">Loan Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="e.g., Purchase farming equipment, expand production, etc."
                rows={2}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Loan Term (months)</Label>
              <Select value={formData.term} onValueChange={(value) => setFormData({ ...formData, term: value })}>
                <SelectTrigger id="term">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (% per year)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income (Rp)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="e.g., 5000000"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collateral">Collateral</Label>
              <Input
                id="collateral"
                placeholder="e.g., Land certificate, vehicle, etc."
                value={formData.collateral}
                onChange={(e) => setFormData({ ...formData, collateral: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information..."
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {formData.amount && formData.term && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  Loan Calculation
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Monthly Payment</p>
                    <p className="text-lg font-bold text-blue-600">
                      Rp {monthlyPayment.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Payment</p>
                    <p className="text-lg font-bold">
                      Rp {totalPayment.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Interest</p>
                    <p className="font-semibold text-orange-600">
                      Rp {totalInterest.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Loan Term</p>
                    <p className="font-semibold">{formData.term} months</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Banknote className="h-4 w-4 mr-1" />
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
