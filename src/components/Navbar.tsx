import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  ListOrdered, 
  Menu, 
  X,
  LogOut,
  LogIn,
  Shield,
  User,
  FileBarChart
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const getNavItems = () => {
    const navItems = [
      { label: 'Главная', path: '/' },
      { label: 'Транзакции', path: '/transactions' },
      { label: 'Аналитика', path: '/analytics' },
      { label: 'Бюджетирование', path: '/budgeting', icon: <FileBarChart className="h-4 w-4 mr-2" /> },
    ];
    
    return navItems;
  };

  const navItems = getNavItems();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center px-4 py-2 rounded-md transition-all duration-200 ease-in-out",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-secondary"
          )}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="font-bold text-xl mr-6">Finance Tracker</div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex space-x-4">
              <NavItems />
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">
                    {currentUser?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser?.role === 'admin' && (
                  <DropdownMenuItem onClick={handleAdminPanel}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Панель администратора</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={handleLogin}>
              <LogIn className="h-4 w-4 mr-2" />
              <span>Войти</span>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="ml-2">
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-2/3 bg-background p-6 shadow-lg animate-slideDown">
            <div className="flex flex-col space-y-4">
              <NavItems />
              {isAuthenticated && currentUser?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className="flex items-center px-4 py-2 rounded-md hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Панель администратора</span>
                </NavLink>
              )}
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Выйти</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    <span>Войти</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
