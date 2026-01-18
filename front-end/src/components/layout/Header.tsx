import { useState } from 'react';
import { ChefHat, Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  cartCount?: number;
}

export function Header({ onNavigate, cartCount = 3 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: 'home' },
    { label: 'Recipes', href: 'search' },
    { label: 'Community', href: 'community' },
    { label: 'About Us', href: 'about' },
  ];

  const handleNavClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Header - Sticky with Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Left: Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#FF6B35] hidden sm:block">
                Tastepedia
              </span>
            </button>

            {/* Center: Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-gray-600 font-medium hover:text-[#FF6B35] transition-all relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              
              {/* Search Button */}
              <button
                onClick={() => handleNavClick('search')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Cart Button with Badge */}
              <button
                onClick={() => handleNavClick('cart')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B35] text-white text-xs border-2 border-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </Badge>
                )}
              </button>

              {/* Login/Sign Up Button (Desktop) */}
              <Button
                onClick={() => handleNavClick('auth')}
                className="hidden md:flex bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full px-6 h-10 shadow-md hover:shadow-lg transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                Login / Sign Up
              </Button>

              {/* Hamburger Menu (Mobile) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <nav className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] rounded-xl transition-all"
                >
                  {link.label}
                </button>
              ))}
              
              {/* Mobile Login Button */}
              <Button
                onClick={() => handleNavClick('auth')}
                className="w-full bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-xl h-12 shadow-md"
              >
                <User className="w-4 h-4 mr-2" />
                Login / Sign Up
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
