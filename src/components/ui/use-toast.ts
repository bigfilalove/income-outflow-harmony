
// Re-export toast functions from the hooks implementation
import { useToast, toast } from "@/hooks/use-toast"

export { useToast, toast }

// Define Toast types here (no circular dependency)
export interface Toast {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement

export type ToastProps = Toast
