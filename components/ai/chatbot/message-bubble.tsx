import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant"

  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        !isAssistant ? "justify-end" : "justify-start"
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs font-bold">
            AI
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-2xl px-4 py-2 max-w-[80%] break-words overflow-hidden",
          !isAssistant
            ? "bg-emerald-500 text-white"
            : "bg-secondary text-foreground"
        )}
      >
        <div 
          className="text-sm whitespace-pre-wrap break-words" 
          style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
        >
          {message.content}
        </div>
        <div
          className={cn(
            "text-xs mt-1",
            !isAssistant ? "text-emerald-100" : "text-muted-foreground"
          )}
        >
          {message.timestamp.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {!isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
