
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import UsersManagement from '@/components/admin/UsersManagement';
import PasswordManagement from '@/components/admin/PasswordManagement';
import CompaniesManagement from '@/components/admin/CompaniesManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import ProjectsManagement from '@/components/admin/ProjectsManagement';
import { getCompanies, saveCompanies, getProjects, saveProjects } from '@/types/transaction';

const Admin = () => {
  const { users, addUser, removeUser, updateAdminPassword, adminPassword } = useAuth();
  const [companies, setCompanies] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    setCompanies(getCompanies());
    setProjects(getProjects());
  }, []);

  const handleUpdateCompanies = () => {
    // This function no longer needs parameters as we're using the API now
    // The API will handle storing and retrieving companies
    // We'll just trigger a refresh if needed
    console.log("Companies updated through API");
  };

  const handleUpdateProjects = (updatedProjects: string[]) => {
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
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
        
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <CompaniesManagement 
            updateCompanies={handleUpdateCompanies} 
          />
          <ProjectsManagement
            projects={projects}
            updateProjects={handleUpdateProjects}
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
