// src/context/employee.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Employee {
  id: string;
  fullName: string;
}

interface EmployeeContextType {
  employees: Employee[];
  fetchEmployees: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/employees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('finance-tracker-token')}`, // Предполагаем, что токен хранится в localStorage
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Ошибка при загрузке сотрудников:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <EmployeeContext.Provider value={{ employees, fetchEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};