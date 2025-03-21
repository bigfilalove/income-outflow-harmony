import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from "@/components/ui/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const activeClass = "text-primary";
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  
  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Finance App</span>
          </Link>
          
          {currentUser && (
            <div className="hidden md:flex gap-6">
              <Link to="/" className={`${isActive('/') ? activeClass : ''} flex items-center text-lg font-medium`}>
                Обзор
              </Link>
              
              {currentUser.role === 'admin' && (
                <>
                  <Link to="/transactions" className={`${isActive('/transactions') ? activeClass : ''} flex items-center text-lg font-medium`}>
                    Транзакции
                  </Link>
                  <Link to="/analytics" className={`${isActive('/analytics') ? activeClass : ''} flex items-center text-lg font-medium`}>
                    Аналитика
                  </Link>
                  <Link to="/budgeting" className={`${isActive('/budgeting') ? activeClass : ''} flex items-center text-lg font-medium`}>
                    Бюджеты
                  </Link>
                  <Link to="/financial-reports" className={`${isActive('/financial-reports') ? activeClass : ''} flex items-center text-lg font-medium`}>
                    Отчеты
                  </Link>
                  <Link to="/admin" className={`${isActive('/admin') ? activeClass : ''} flex items-center text-lg font-medium`}>
                    Управление
                  </Link>
                </>
              )}
              
              {currentUser.role === 'user' && (
                <>
                  <Link to="/basic-transactions" className={`${isActive('/basic-transactions') ? activeClass : ''} flex items-center text-lg font-medium`}>
                    Транзакции
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setTheme((theme) => theme === "light" ? "dark" : "light")}>
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.image} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Мой профиль</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:underline">Войти</Link>
              <Link to="/register" className="ml-4 text-sm font-medium hover:underline">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
