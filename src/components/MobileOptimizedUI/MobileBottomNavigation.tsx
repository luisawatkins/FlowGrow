'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Plus,
  TrendingUp,
  Settings
} from 'lucide-react';

interface MobileBottomNavigationProps {
  className?: string;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({ 
  className = '' 
}) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/'
    },
    {
      href: '/search',
      icon: Search,
      label: 'Search',
      active: pathname.startsWith('/search')
    },
    {
      href: '/favorites',
      icon: Heart,
      label: 'Favorites',
      active: pathname.startsWith('/favorites')
    },
    {
      href: '/portfolio',
      icon: TrendingUp,
      label: 'Portfolio',
      active: pathname.startsWith('/portfolio')
    },
    {
      href: '/dashboard',
      icon: User,
      label: 'Profile',
      active: pathname.startsWith('/dashboard')
    }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 ${className}`}>
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }
              `}
            >
              <Icon 
                size={20} 
                className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
};

export default MobileBottomNavigation;
