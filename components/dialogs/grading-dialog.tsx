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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Droplets,
  Bug,
  Ruler,
  Eye
} from 'lucide-react'

export function GradingDialog({ open, onOpenChange, item, onGrade }) {
  const [isScanning, setIsScanning] = useState(false)
  const [gradingResult, setGradingResult] = useState(null)

  const handleAIGrading = () => {
    setIsScanning(true)
    
    // Simulate AI grading process
    setTimeout(() => {
      const result = {
        grade: 'A',
        confidence: 94,
        metrics: {
          size: { score: 95, status: 'Excellent', value: '8-10 cm' },
          color: { score: 92, status: 'Good', value: 'Bright red' },
          freshness: { score: 96, status: 'Excellent', value: 'Very fresh' },
          defects: { score: 90, status: 'Minimal', value: '< 2%' },
        },
        recommendations: [
          'Product meets Grade A standards',
          'Suitable for premium market',
          'Store at 4-8°C to maintain quality',
        ]
      }
      setGradingResult(result)
      setIsScanning(false)
    }, 2500)
  }

  const handleConfirmGrade = () => {
    if (!gradingResult) return
    
    onGrade?.({
      itemId: item?.id,
      grade: gradingResult.grade,
      confidence: gradingResult.confidence,
      metrics: gradingResult.metrics,
      gradedAt: new Date().toISOString(),
    })
    
    toast.success(`Product graded as Grade ${gradingResult.grade}`)
    onOpenChange(false)
    setGradingResult(null)
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500'
      case 'B': return 'bg-amber-500'
      case 'C': return 'bg-orange-500'
      default: return 'bg-slate-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Quality Grading
          </DialogTitle>
          <DialogDescription>
            Automated quality assessment using computer vision
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Product Info */}
          <Card className="border-2 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item?.name || 'Tomat Segar'}</p>
                  <p className="text-sm text-muted-foreground">{item?.quantity || '250'} kg • Batch #{item?.batch || 'B2026030801'}</p>
                </div>
                <Badge variant="outline">Pending Grading</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Scanning Interface */}
          {!gradingResult && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className={`relative ${isScanning ? 'animate-pulse' : ''}`}>
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-white" />
                </div>
                {isScanning && (
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping" />
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">
                  {isScanning ? 'Analyzing Product Quality...' : 'Ready to Scan'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {isScanning 
                    ? 'AI is analyzing size, color, freshness, and defects'
                    : 'Click the button below to start AI-powered quality assessment'
                  }
                </p>
              </div>

              {isScanning && (
                <div className="w-full max-w-md space-y-2">
                  <Progress value={66} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">Processing image data...</p>
                </div>
              )}

              <Button 
                onClick={handleAIGrading}
                disabled={isScanning}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Start AI Grading'}
              </Button>
            </div>
          )}

          {/* Grading Results */}
          {gradingResult && (
            <div className="space-y-4">
              <Card className={`border-2 ${getGradeColor(gradingResult.grade)} bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Quality Grade</p>
                      <div className="flex items-center gap-3">
                        <span className="text-5xl font-bold">Grade {gradingResult.grade}</span>
                        <CheckCircle2 className={`h-8 w-8 ${getGradeColor(gradingResult.grade).replace('bg-', 'text-')}`} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                      <p className="text-3xl font-bold">{gradingResult.confidence}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(gradingResult.metrics).map(([key, metric]: [string, any]) => {
                  const icons = {
                    size: Ruler,
                    color: Eye,
                    freshness: Droplets,
                    defects: Bug,
                  }
                  const Icon = icons[key] || TrendingUp
                  
                  return (
                    <Card key={key}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground capitalize">{key}</p>
                            <p className="font-semibold text-sm mt-0.5">{metric.value}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Progress value={metric.score} className="h-1.5 flex-1" />
                              <span className="text-xs font-medium">{metric.score}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1.5">
                    {gradingResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              onOpenChange(false)
              setGradingResult(null)
            }}
          >
            Cancel
          </Button>
          {gradingResult && (
            <Button 
              onClick={handleConfirmGrade}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Confirm Grade
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
