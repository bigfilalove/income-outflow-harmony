
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { AdminUserAttributes } from '@supabase/supabase-js';

/**
 * Sets admin role for a user by email or username
 */
export const setAdminRoleForUser = async (emailOrUsername: string): Promise<boolean> => {
  try {
    console.log('[Supabase Users] Attempting to assign admin role for:', emailOrUsername);
    
    // First try to find the user by listing users and filtering
    const { data, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('[Supabase Users] Error listing users:', listError);
      return false;
    }
    
    // Find user by email or username (constructed email)
    const users = data?.users || [];
    let user = users.find(u => 
      u.email === emailOrUsername || 
      (u.email && u.email.startsWith(emailOrUsername + '@'))
    );
    
    if (!user) {
      console.error(`[Supabase Users] User with email/login ${emailOrUsername} not found`);
      return false;
    }
    
    console.log(`[Supabase Users] Found user for update: ${user.id}`);
    
    // Update user's metadata to include admin role
    const currentMetadata = user.user_metadata || {};
    const updatedMetadata = { ...currentMetadata, role: 'admin' };
    
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: updatedMetadata }
    );
    
    if (updateError) {
      console.error('[Supabase Users] Error updating user role:', updateError);
      return false;
    }
    
    console.log(`[Supabase Users] Successfully assigned admin role to ${emailOrUsername}`);
    return true;
  } catch (error) {
    console.error('[Supabase Users] Error assigning admin role:', error);
    return false;
  }
};

/**
 * Gets all users from Supabase
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('[Supabase Users] Error fetching users:', error);
      return [];
    }
    
    // Map Supabase users to our app's User type
    const users = data?.users || [];
    return users.map(user => ({
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      password: '', // Don't store passwords
      role: user.user_metadata?.role || 'user',
      createdAt: new Date(user.created_at)
    }));
  } catch (error) {
    console.error('[Supabase Users] Error fetching users:', error);
    return [];
  }
};
