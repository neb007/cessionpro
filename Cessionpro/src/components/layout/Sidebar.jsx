import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  FileText,
  Heart,
  MessageSquare,
  CreditCard,
  User,
  LogOut,
  X,
  Globe,
  Zap,
  Lock,
  Bell
} from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { useSidebar } from '@/lib/SidebarContext';
import SidebarMenuItem from './SidebarMenuItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Sidebar({ user }) {
  const { language, changeLanguage } = useLanguage();
  const { logout } = useAuth();
  const { isMobileOpen, closeMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page name from path
  const getCurrentPage = () => {
    const path = location.pathname.replace('/', '');
    return path || 'Annonces';
  };

  const currentPage = getCurrentPage();

  // Navigation items
  const navigationItems = [
    {
      label: language === 'fr' ? 'Annonces' : 'Listings',
      page: 'Annonces',
      icon: Building2
    },
    {
      label: language === 'fr' ? 'Mes publications' : 'My Listings',
      page: 'MyListings',
      icon: FileText
    },
    {
      label: language === 'fr' ? 'Mes favoris' : 'My Favorites',
      page: 'Favorites',
      icon: Heart
    },
    {
      label: language === 'fr' ? 'Messages' : 'Messages',
      page: 'Messages',
      icon: MessageSquare
    }
  ];

  const handleLogout = async () => {
    await logout(true);
  };

  const handleMenuItemClick = () => {
    closeMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 transition-transform duration-300 z-40 lg:relative lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          aside::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Mobile Close Button */}
        <div className="lg:hidden sticky top-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <span className="font-display font-bold text-lg text-[#3B4759]">Menu</span>
          <button
            className="inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-2"
            onClick={closeMobile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 flex flex-col h-full">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-lg shadow-[#FF6B4A]/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-[#3B4759]">
              CessionPro
            </span>
          </Link>

          <div className="space-y-6 flex-1">
          {/* Navigation Principale - без заголовка */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarMenuItem
                key={item.page}
                icon={item.icon}
                label={item.label}
                page={item.page}
                isActive={currentPage === item.page}
                onClick={handleMenuItemClick}
              />
            ))}
          </div>

          {/* Services Section */}
          <div className="space-y-1">
            <SidebarMenuItem
              icon={Zap}
              label={language === 'fr' ? 'Smart Matching' : 'Smart Matching'}
              page="SmartMatching"
              isActive={currentPage === 'SmartMatching'}
              onClick={handleMenuItemClick}
            />
            <SidebarMenuItem
              icon={Lock}
              label={language === 'fr' ? 'Dataroom' : 'Dataroom'}
              page="Dataroom"
              isActive={currentPage === 'Dataroom'}
              onClick={handleMenuItemClick}
            />
            <SidebarMenuItem
              icon={Bell}
              label={language === 'fr' ? 'Mes alertes' : 'My Alerts'}
              page="Alerts"
              isActive={currentPage === 'Alerts'}
              onClick={handleMenuItemClick}
            />
          </div>

          {/* Account Management Section */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 px-4 mb-4">
              <CreditCard className="w-5 h-5 text-[#FF6B4A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B4759]">
                {language === 'fr' ? 'Gestion du compte' : 'Account Management'}
              </span>
            </h3>

            <div className="space-y-1">
              {/* Subscription */}
              <button 
                onClick={() => {
                  navigate('/Pricing');
                  handleMenuItemClick();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#6B7A94] hover:bg-gray-50 hover:text-[#3B4759] transition-all duration-200 text-sm font-medium">
                <CreditCard className="w-5 h-5" />
                <span>{language === 'fr' ? 'Mon abonnement' : 'My Subscription'}</span>
              </button>

              {/* Profile */}
              <SidebarMenuItem
                icon={User}
                label={language === 'fr' ? 'Mon profil' : 'My Profile'}
                page="Profile"
                isActive={currentPage === 'Profile'}
                onClick={handleMenuItemClick}
              />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group text-sm font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>{language === 'fr' ? 'Déconnexion' : 'Logout'}</span>
              </button>
            </div>
          </div>
          </div>

          {/* Bottom Section - Language & Avatar */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#6B7A94] hover:bg-gray-50 hover:text-[#3B4759] transition-all duration-200 text-sm font-medium">
                  <Globe className="w-5 h-5" />
                  <span className="uppercase font-mono text-xs">{language}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                  🇫🇷 Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                  🇬🇧 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#3B4759] truncate">
                  {user?.full_name || user?.email}
                </p>
                <p className="text-xs text-[#6B7A94] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
