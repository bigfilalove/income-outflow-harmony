
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from '@/types/user';

/**
 * Sets admin role for a user by email or username
 */
export const setAdminRoleForUser = async (emailOrUsername: string): Promise<boolean> => {
  try {
    console.log('[Supabase Users] Attempting to assign admin role for:', emailOrUsername);
    
    // First check if user exists by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(emailOrUsername);
    
    // If not found by email, try with constructed email
    let userId = userData?.user?.id;
    
    if (!userId && !emailOrUsername.includes('@')) {
      // Try with constructed email
      const constructedEmail = `${emailOrUsername}@example.com`;
      const { data: constructedData, error: constructedError } = await supabase.auth.admin.getUserByEmail(constructedEmail);
      
      if (constructedError) {
        console.error(`[Supabase Users] User not found with constructed email ${constructedEmail}:`, constructedError);
      } else {
        userId = constructedData?.user?.id;
      }
    }
    
    if (!userId) {
      console.error(`[Supabase Users] User with email/login ${emailOrUsername} not found`);
      return false;
    }
    
    console.log(`[Supabase Users] Found user for update: ${userId}`);
    
    // Get the current user's metadata
    const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (getUserError || !user) {
      console.error('[Supabase Users] Error getting user details:', getUserError);
      return false;
    }
    
    // Update user's metadata to include admin role
    const currentMetadata = user.user_metadata || {};
    const updatedMetadata = { ...currentMetadata, role: 'admin' };
    
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
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
    return data.users.map(user => ({
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
