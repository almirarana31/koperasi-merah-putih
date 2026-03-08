"use client"

import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  placeholder?: string
}

export function VoiceInput({ onTranscript, placeholder = "Contoh: Panen padi 500 kilogram" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.lang = 'id-ID' // Indonesian
        recognitionInstance.interimResults = false
        recognitionInstance.maxAlternatives = 1
        
        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          onTranscript(transcript)
          setIsListening(false)
        }
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }
        
        setRecognition(recognitionInstance)
      } else {
        setIsSupported(false)
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognition) {
      alert('Browser Anda tidak mendukung voice input. Silakan gunakan Chrome atau Edge.')
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-lg">
        Voice input tidak didukung di browser ini. Gunakan Chrome atau Edge.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant={isListening ? "destructive" : "default"}
        size="lg"
        onClick={toggleListening}
        className="w-full min-h-[56px]"
      >
        {isListening ? (
          <>
            <MicOff className="mr-2 h-5 w-5" />
            Berhenti Merekam
          </>
        ) : (
          <>
            <Mic className="mr-2 h-5 w-5" />
            Rekam Suara
          </>
        )}
      </Button>
      
      {isListening && (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Mendengarkan... Silakan bicara
            </p>
          </div>
          <Progress value={100} className="h-1" />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground text-center">
        {placeholder}
      </p>
    </div>
  )
}

// Helper function to parse voice transcript
export function parseHarvestTranscript(transcript: string) {
  const text = transcript.toLowerCase()
  
  // Extract commodity
  const commodities = ['padi', 'jagung', 'cabai', 'tomat', 'ikan', 'udang', 'sayur']
  const commodity = commodities.find(c => text.includes(c)) || ''
  
  // Extract quantity
  const quantityMatch = text.match(/(\d+)\s*(kilogram|kg|ton|kilo)/i)
  const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0
  const unit = quantityMatch?.[2]?.toLowerCase().replace('kilo', 'kg') || 'kg'
  
  return {
    commodity,
    quantity,
    unit,
    date: new Date().toISOString(),
    rawTranscript: transcript
  }
}
