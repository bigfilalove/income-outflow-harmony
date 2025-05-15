
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersManagement from './UsersManagement';
import CompaniesManagement from './CompaniesManagement';
import CategoriesManagement from './CategoriesManagement';
import ProjectsManagement from './ProjectsManagement';
import SystemTab from './SystemTab';
import { User } from '@/types/user';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  demoUsersList: User[];
  addDemoUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  removeDemoUser: (userId: string) => void;
  adminPassword: string;
  updateAdminPassword: (newPassword: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  setActiveTab,
  demoUsersList,
  addDemoUser,
  removeDemoUser,
  adminPassword,
  updateAdminPassword
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-8">
        <TabsTrigger value="users">Пользователи</TabsTrigger>
        <TabsTrigger value="categories">Категории</TabsTrigger>
        <TabsTrigger value="companies">Компании</TabsTrigger>
        <TabsTrigger value="projects">Проекты</TabsTrigger>
        <TabsTrigger value="system">Система</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users" className="space-y-6">
        <UsersManagement 
          users={demoUsersList} 
          addUser={addDemoUser} 
          removeUser={removeDemoUser} 
        />
      </TabsContent>
      
      <TabsContent value="categories" className="space-y-6">
        <CategoriesManagement />
      </TabsContent>
      
      <TabsContent value="companies" className="space-y-6">
        <CompaniesManagement />
      </TabsContent>
      
      <TabsContent value="projects" className="space-y-6">
        <ProjectsManagement />
      </TabsContent>
      
      <TabsContent value="system" className="space-y-6">
        <SystemTab 
          adminPassword={adminPassword} 
          updateAdminPassword={updateAdminPassword} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
