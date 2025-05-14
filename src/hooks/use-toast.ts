
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// This is a wrapper around sonner's toast that follows the shadcn pattern
export function toast({
  title,
  description,
  variant = "default",
  duration,
  action,
  ...props
}: ToastProps) {
  return sonnerToast(title, {
    description,
    duration,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
    // Map variant to sonner's style
    className: variant === "destructive" ? "destructive" : undefined,
    ...props,
  })
}

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}

// Preserve older type definitions for backward compatibility
export type {
  ToastActionElement,
  ToastProps as ShadcnToastProps,
} from "@/components/ui/toast"
