
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  ListOrdered, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Панель', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { path: '/transactions', label: 'Транзакции', icon: <ListOrdered className="h-5 w-5 mr-2" /> },
    { path: '/analytics', label: 'Аналитика', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <div className="font-bold text-xl mr-6">Finance Tracker</div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex space-x-4">
              <NavItems />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <div className="flex flex-1 justify-end">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        )}
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
