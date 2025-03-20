
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import UsersManagement from '@/components/admin/UsersManagement';
import PasswordManagement from '@/components/admin/PasswordManagement';

const Admin = () => {
  const { users, addUser, removeUser, updateAdminPassword, adminPassword } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <UsersManagement 
            users={users} 
            addUser={addUser} 
            removeUser={removeUser} 
          />
          <PasswordManagement 
            adminPassword={adminPassword} 
            updateAdminPassword={updateAdminPassword} 
          />
        </div>
      </main>
    </div>
  );
};

export default Admin;
