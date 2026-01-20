'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Bell, User, LogOut } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';

interface HeaderProps {
  onNavigate: (page: string, recipeId?: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage or auth service)
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  if (loading) return null;

  return (
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-[#FF6B35] hidden md:block cursor-pointer" onClick={() => onNavigate('home')}>
              Tastepedia
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                  placeholder="Ingredient or Dish name..."
                  className="pl-10 pr-4 h-11 rounded-full bg-[#F9F9F9] border-0"
              />
            </div>

            {/* Icons & Auth */}
            <div className="flex items-center gap-2 md:gap-3">
              {!isLoggedIn ? (
                  <>
                    <Button
                        onClick={() => onNavigate('login')}
                        variant="outline"
                        className="hidden sm:inline-flex rounded-full px-6 h-10"
                    >
                      Login
                    </Button>
                    <Button
                        onClick={() => onNavigate('signup')}
                        className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full px-6 h-10"
                    >
                      Sign Up
                    </Button>
                  </>
              ) : (
                  <>
                    <button
                        onClick={() => onNavigate('cart')}
                        className="relative p-2 hover:bg-muted rounded-full transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6 text-foreground" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B35] text-white text-xs border-2 border-background">
                        3
                      </Badge>
                    </button>
                    <button
                        onClick={() => onNavigate('notifications')}
                        className="relative p-2 hover:bg-muted rounded-full transition-colors hidden md:block"
                    >
                      <Bell className="w-6 h-6 text-foreground" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B35] text-white text-xs border-2 border-background">
                        2
                      </Badge>
                    </button>
                    <button onClick={() => onNavigate('profile')} className="hidden md:block">
                      <Avatar className="h-9 w-9 border-2 border-border hover:border-[#FF6B35] transition-colors">
                        <div className="bg-[#FF6B35] text-white flex items-center justify-center h-full w-full">
                          <User className="w-5 h-5" />
                        </div>
                      </Avatar>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-muted rounded-full transition-colors hidden md:flex"
                        title="Logout"
                    >
                      <LogOut className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>
      </header>
  );
}
