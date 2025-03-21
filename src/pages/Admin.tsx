
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import UsersManagement from '@/components/admin/UsersManagement';
import PasswordManagement from '@/components/admin/PasswordManagement';
import CompaniesManagement from '@/components/admin/CompaniesManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import { getCompanies, saveCompanies } from '@/types/transaction';

const Admin = () => {
  const { users, addUser, removeUser, updateAdminPassword, adminPassword } = useAuth();
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    setCompanies(getCompanies());
  }, []);

  const handleUpdateCompanies = (updatedCompanies: string[]) => {
    setCompanies(updatedCompanies);
    saveCompanies(updatedCompanies);
  };

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
        
        <div className="mt-8">
          <CompaniesManagement 
            companies={companies} 
            updateCompanies={handleUpdateCompanies} 
          />
        </div>

        <div className="mt-8">
          <CategoriesManagement />
        </div>
      </main>
    </div>
  );
};

export default Admin;
