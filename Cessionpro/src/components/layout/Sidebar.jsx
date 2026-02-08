import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  ArrowRightFromLine,
  ArrowLeftFromLine,
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
import { base44 } from '@/api/base44Client';
import SidebarMenuItem from './SidebarMenuItem';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Sidebar({ user }) {
  const { language, changeLanguage } = useLanguage();
  const { logout } = useAuth();
  const { isMobileOpen, closeMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Get current page name from path
  const getCurrentPage = () => {
    const path = location.pathname.replace('/', '');
    return path || 'Annonces';
  };

  const currentPage = getCurrentPage();

  // Load unread message count with real-time updates
  useEffect(() => {
    if (!user?.email) return;

    const fetchUnreadCount = async () => {
      try {
        // Get all conversations
        const conversations = await base44.entities.Conversation.list('updated_at');
        const myConvs = conversations.filter(c => c.participant_emails?.includes(user.email));
        
        // Calculate total unread
        const total = myConvs.reduce((sum, conv) => {
          const unread = conv.unread_count?.[user.email] || 0;
          return sum + unread;
        }, 0);
        
        setUnreadCount(total);
        // Store in localStorage for persistence
        localStorage.setItem(`unread_messages_${user.email}`, total.toString());
      } catch (error) {
        console.error('Error calculating unread count:', error);
      }
    };

    // Initial load
    fetchUnreadCount();

    // Poll every 3 seconds for real-time updates
    const interval = setInterval(fetchUnreadCount, 3000);

    // Also update on storage change events
    window.addEventListener('storage', fetchUnreadCount);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', fetchUnreadCount);
    };
  }, [user?.email]);

  // Navigation items - EXPLORER section
  const explorerItems = [
    {
      label: language === 'fr' ? 'Toutes les annonces' : 'All Listings',
      page: 'Annonces',
      icon: Briefcase
    },
    {
      label: language === 'fr' ? 'Cessions' : 'Sales',
      page: 'Annonces',
      queryParams: '?type=cession',
      icon: ArrowRightFromLine
    },
    {
      label: language === 'fr' ? 'Acquisitions' : 'Acquisitions',
      page: 'Annonces',
      queryParams: '?type=acquisition',
      icon: ArrowLeftFromLine
    }
  ];

  // Navigation items - OTHER SECTIONS
  const navigationItems = [
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
        className={`fixed inset-y-0 left-0 w-48 transition-transform duration-300 z-50 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#FBFBF9', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          aside::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Mobile Close Button */}
        <div className="lg:hidden sticky top-0 flex items-center justify-between p-4 border-b border-gray-100" style={{ backgroundColor: '#FBFBF9' }}>
          <span className="font-display font-bold text-lg text-[#3B4759]">Menu</span>
          <button
            className="inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-2"
            onClick={closeMobile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-0 flex flex-col h-full font-sans font-normal">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 px-3 py-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-lg shadow-[#FF6B4A]/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-[#3B4759]">
              CessionPro
            </span>
          </Link>

          <div className="flex-1">
          {/* EXPLORER Section */}
          <div>
            <h3 className="flex items-center gap-2 px-3 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B4759]">
                {language === 'fr' ? 'Explorer' : 'Explorer'}
              </span>
            </h3>
            {explorerItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.queryParams ? `/Annonces${item.queryParams}` : `/${item.page}`);
                  handleMenuItemClick();
                }}
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400 }}
                className={`w-full flex items-center gap-3 px-3 py-3 transition-all duration-200 text-sm ${
                  currentPage === item.page
                    ? 'text-[#3B4759]'
                    : 'text-[#6B7A94] hover:text-[#3B4759]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation Principale */}
          <div>
            {navigationItems.map((item) => (
              <div key={item.page} className="relative">
                <SidebarMenuItem
                  icon={item.icon}
                  label={item.label}
                  page={item.page}
                  isActive={currentPage === item.page}
                  onClick={handleMenuItemClick}
                />
                {/* Unread Message Badge with Tooltip */}
                {item.page === 'Messages' && unreadCount > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-2 right-2 bg-[#FF6B4A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center cursor-help hover:bg-[#FF5530] transition-colors"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-900 text-white text-xs px-3 py-2 rounded-md">
                        <p>
                          {language === 'fr' 
                            ? `📧 Vous avez ${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`
                            : `📧 You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>

          {/* Services Section */}
          <div>
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
          <div>
            <h3 className="flex items-center gap-2 px-3 py-3">
              <CreditCard className="w-5 h-5 text-[#FF6B4A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B4759]">
                {language === 'fr' ? 'Gestion du compte' : 'Account Management'}
              </span>
            </h3>

            <div>
              {/* Subscription */}
              <button 
                onClick={() => {
                  navigate('/Pricing');
                  handleMenuItemClick();
                }}
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400 }}
                className="w-full flex items-center gap-3 px-3 py-3 text-[#6B7A94] hover:bg-gray-50 hover:text-[#3B4759] transition-all duration-200 text-sm">
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
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400 }}
                className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>{language === 'fr' ? 'Déconnexion' : 'Logout'}</span>
              </button>
            </div>
          </div>
          </div>

          {/* Bottom Section - Language & Avatar */}
          <div>
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400 }} className="w-full flex items-center gap-3 px-3 py-3 text-[#6B7A94] hover:bg-gray-50 hover:text-[#3B4759] transition-all duration-200 text-sm">
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
            <div className="flex items-center gap-3 px-3 py-3">
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
