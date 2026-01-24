import { useNavigate } from 'react-router-dom';
import { Home, Search, Video, Calendar, User } from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
  onNavigate?: (page: string) => void;
}

export function MobileNavigation({ currentPage, onNavigate }: MobileNavigationProps) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'search', icon: Search, label: 'Search', path: '/search' },
    { id: 'reels', icon: Video, label: 'Reels', path: '/reels' },
    { id: 'planner', icon: Calendar, label: 'Planner', path: '/meal-planner' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive ? 'text-[#FF6B35]' : 'text-gray-500'
                }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
