
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const handleNavigateToApp = () => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else if (currentUser.role === 'user') {
        navigate('/transactions');
      } else if (currentUser.role === 'basic') {
        navigate('/basic-transactions');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold">Finance App</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Button onClick={handleNavigateToApp}>
                Перейти в приложение
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="space-y-4 text-center">
            <h2 className="text-4xl font-bold">Управляйте финансами просто и эффективно</h2>
            <p className="text-xl text-muted-foreground">
              Отслеживайте доходы и расходы, анализируйте свои финансы и планируйте бюджет с нашим удобным приложением
            </p>
            {!isAuthenticated && (
              <Button size="lg" onClick={() => navigate('/register')}>
                Начать бесплатно
              </Button>
            )}
          </section>

          <div className="grid md:grid-cols-3 gap-8 py-12">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Учет транзакций</h3>
              <p className="text-muted-foreground">Записывайте все доходы и расходы в одном месте</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
              <p className="text-muted-foreground">Анализируйте свои финансовые привычки с помощью наглядных графиков</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Бюджетирование</h3>
              <p className="text-muted-foreground">Создавайте бюджеты и следите за их выполнением</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Finance App. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
