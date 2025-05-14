
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LoginForm } from '@/components/login/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Helmet>
        <title>Вход в систему | Финансовый менеджмент</title>
      </Helmet>
      
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Вход в систему</h1>
          <p className="text-muted-foreground mt-2">
            Введите ваши учетные данные для доступа к системе
          </p>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm">
          <LoginForm />
        </div>
        
        <div className="text-center text-sm">
          <button 
            onClick={() => navigate('/register')} 
            className="text-primary hover:underline"
          >
            Нет учетной записи? Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
