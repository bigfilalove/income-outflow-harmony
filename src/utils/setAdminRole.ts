
import { setAdminRoleForUser } from '@/services/api/supabase/users';
import { toast } from 'sonner';

export const grantAdminRole = async (emailOrUsername: string): Promise<void> => {
  toast.info(`Присвоение прав администратора для ${emailOrUsername}...`);
  const success = await setAdminRoleForUser(emailOrUsername);
  
  if (success) {
    toast.success(`Пользователь ${emailOrUsername} теперь администратор`);
    // Обновляем страницу, чтобы применить изменения
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } else {
    toast.error(`Не удалось присвоить права администратора для ${emailOrUsername}`);
  }
};

// Also export as grantAdminRights for backward compatibility
export const grantAdminRights = grantAdminRole;
