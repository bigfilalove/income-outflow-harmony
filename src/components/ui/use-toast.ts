
// Re-export toast functions from the hooks implementation
import { useToast, toast, Toast, ToastActionElement } from "@/hooks/use-toast"

export { useToast, toast }
export type { Toast, ToastActionElement }

export type ToastProps = Toast
