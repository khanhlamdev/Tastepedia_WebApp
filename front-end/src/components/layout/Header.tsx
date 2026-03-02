'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart, Bell, User, LogOut } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { useNotifications } from '../../hooks/useNotifications';

export function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Notification bell badge ---
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  if (loading) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-[#FF6B35] hidden md:block cursor-pointer" onClick={() => navigate('/')}>
            Tastepedia
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Ingredient or Dish name..."
              className="pl-10 pr-4 h-11 rounded-full bg-[#F9F9F9] border-0 focus-visible:ring-1 focus-visible:ring-[#FF6B35]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Icons & Auth */}
          <div className="flex items-center gap-2 md:gap-3">
            {!isLoggedIn ? (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="hidden sm:inline-flex rounded-full px-6 h-10"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full px-6 h-10"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-foreground" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B35] text-white text-xs border-2 border-background">
                    3
                  </Badge>
                </button>

                {/* Bell Icon — Live Unread Badge */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 hover:bg-muted rounded-full transition-colors hidden md:block"
                >
                  <Bell className="w-6 h-6 text-foreground" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 bg-[#FF6B35] text-white text-xs border-2 border-background px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </button>

                <button onClick={() => navigate('/profile')} className="hidden md:block">
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
