
// Import from components
import { useToast as useToastOriginal } from "@/components/ui/use-toast"
import type { Toast, ToastActionElement } from "@/components/ui/use-toast"

// Re-export the Sonner toaster
export { Toaster as SonnerToaster } from "sonner";

// Export the types for other components to use
export type { Toast, ToastActionElement };

/**
 * Use the toast hook with additional functionality
 */
export const useToast = useToastOriginal

/**
 * Display a toast message directly
 */
export const toast = useToastOriginal().toast
