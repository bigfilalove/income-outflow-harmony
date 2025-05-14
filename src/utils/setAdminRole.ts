
import { setAdminRoleForUser } from '@/services/api/supabase/users';
import { toast } from 'sonner';

/**
 * Grants admin role to a user by email or username
 */
export const grantAdminRole = async (emailOrUsername: string): Promise<void> => {
  try {
    toast.info(`Assigning admin rights to ${emailOrUsername}...`);
    const success = await setAdminRoleForUser(emailOrUsername);
    
    if (success) {
      toast.success(`User ${emailOrUsername} is now an admin`);
      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error(`Failed to assign admin rights to ${emailOrUsername}`);
    }
  } catch (error) {
    console.error('Error granting admin role:', error);
    toast.error(`Error assigning admin rights: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Also export as grantAdminRights for backward compatibility
export const grantAdminRights = grantAdminRole;
