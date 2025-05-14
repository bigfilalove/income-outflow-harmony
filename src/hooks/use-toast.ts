
// Import types from UI components
import type { Toast, ToastActionElement } from "@/components/ui/use-toast";

// Re-export the types for other components to use
export type { Toast, ToastActionElement };

// Re-export the Sonner toaster
export { Toaster as SonnerToaster } from "sonner";

// Create a function for the toast hook
export function useToast() {
  return {
    toast: (props: Toast) => {
      // Implementation here
      console.log("Toast:", props);
    }
  };
}

/**
 * Display a toast message directly
 */
export const toast = (props: Toast) => {
  return useToast().toast(props);
};
