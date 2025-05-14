
import { useToast as useToastOriginal } from "@/components/ui/use-toast"
import type { Toast } from "@/components/ui/use-toast"

/**
 * Use the toast hook with additional functionality
 */
export const useToast = () => {
  return useToastOriginal()
}

// Store toasts that have been shown to prevent duplicates
const shownToasts = new Set<string>();

/**
 * Expose toast function directly for use outside of React components
 */
export const toast = (props: Toast) => {
  // Create a key from the toast to prevent duplicates
  const toastKey = `${props.title}-${props.description}`;
  
  // For destructive/error toasts, prevent duplicates within 5 seconds
  if (props.variant === 'destructive' && shownToasts.has(toastKey)) {
    return;
  }
  
  // Add to shown toasts
  if (props.variant === 'destructive') {
    shownToasts.add(toastKey);
    setTimeout(() => {
      shownToasts.delete(toastKey);
    }, 5000);
  }
  
  // Use the toast implementation from the toast context
  const { toast: contextToast } = useToastOriginal();
  return contextToast(props);
};
