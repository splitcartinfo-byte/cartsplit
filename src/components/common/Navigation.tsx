import React from 'react';
import { useExperience } from '../../context/ExperienceContext';
import { Home, Compass, Heart, User } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'explore' | 'wishlist' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'wishlist' | 'profile') => void;
  openWishlist: () => void;
  openAuth: () => void;
  openExplore: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  openWishlist,
  openAuth,
  openExplore,
}) => {
  const { gender } = useExperience();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home, onClick: () => setActiveTab('home') },
    { id: 'explore' as const, label: 'Explore', icon: Compass, onClick: openExplore },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart, onClick: openWishlist },
    { id: 'profile' as const, label: 'Account', icon: User, onClick: openAuth },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg px-2 py-2 safe-bottom shadow-2xl max-w-full">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? `${gender === 'women' ? 'bg-rose-600' : 'bg-slate-900'} text-white font-bold`
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
