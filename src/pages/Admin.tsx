
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAdmin } from '@/context/AdminContext';
import AdminTabs from '@/components/admin/AdminTabs';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { 
    demoUsersList, 
    addDemoUser, 
    removeDemoUser, 
    adminPassword, 
    updateAdminPassword 
  } = useAdmin();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Административная панель | Финансовый трекер</title>
      </Helmet>
      
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Административная панель</h1>
        
        <AdminTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          demoUsersList={demoUsersList}
          addDemoUser={addDemoUser}
          removeDemoUser={removeDemoUser}
          adminPassword={adminPassword}
          updateAdminPassword={updateAdminPassword}
        />
      </div>
    </div>
  );
};

export default Admin;
