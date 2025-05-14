
// Define Toast types here (no circular dependency)
export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement<{
  altText: string;
}>;

export type ToastProps = Toast;

// Re-export toast functions from the hooks implementation
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
