import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  FileText,
  Heart,
  MessageSquare,
  X,
  Zap,
  Lock,
  Settings,
  Globe,
  ChevronDown,
  LogOut,
  ShieldCheck,
  LayoutGrid,
  Users
} from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useSidebar } from '@/lib/SidebarContext';
import { supabase } from '@/api/supabaseClient';
import SidebarMenuItem from './SidebarMenuItem';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/AuthContext';
import { conversationService } from '@/services/conversationService';
import Logo from '@/components/Logo';

export default function Sidebar({ user }) {
  const { language, changeLanguage } = useLanguage();
  const { isMobileOpen, closeMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const isAdmin = user?.email?.toLowerCase() === (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

  // Get current page name from path AND query params
  const getCurrentPage = () => {
    const path = location.pathname.replace('/', '').toLowerCase();
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    // Return combined identifier
    if (path.startsWith('admin')) {
      return path.replace('admin/', 'admin-') || 'admin-dashboard';
    }
    if (path === 'annonces' || path === '') {
      if (typeParam === 'cession') return 'annonces-cession';
      if (typeParam === 'acquisition') return 'annonces-acquisition';
      return 'annonces';
    }
    return path || 'annonces';
  };

  const currentPage = getCurrentPage();

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      const myConvs = conversations || [];

      // Calculate total unread (robust numeric parsing)
      const total = myConvs.reduce((sum, conv) => {
        const rawUnread = conv?.unread_count?.[user.id];
        const unread = Number(rawUnread ?? 0);
        return sum + (Number.isFinite(unread) ? unread : 0);
      }, 0);

      setUnreadCount(total);
      localStorage.setItem(`unread_messages_${user.id}`, total.toString());
    } catch (error) {
      console.error('Error calculating unread count:', error);
    }
  }, [user?.id]);

  // Load unread message count with real-time updates
  useEffect(() => {
    if (!user?.id) return;

    // Initial load
    fetchUnreadCount();

    const realtimeSubscription = conversationService.subscribeToUserConversations(
      user.id,
      () => fetchUnreadCount()
    );
    
    return () => {
      if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
      }
    };
  }, [user?.id, fetchUnreadCount]);

  // Ensure badge refreshes when opening/messages navigation changes.
  useEffect(() => {
    if (!user?.id) return;
    if (location.pathname.toLowerCase() !== '/messages') return;

    const timeoutId = setTimeout(() => {
      fetchUnreadCount();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, user?.id, fetchUnreadCount]);

  // Navigation items - EXPLORER section
  const explorerItems = [
    {
      label: language === 'fr' ? 'Toutes les annonces' : 'All Listings',
      path: '/Annonces',
      icon: Briefcase,
      pageKey: 'annonces'
    },
    {
      label: language === 'fr' ? 'Cessions' : 'Sales',
      path: '/Annonces?type=cession',
      icon: ArrowRightFromLine,
      pageKey: 'annonces-cession'
    },
    {
      label: language === 'fr' ? 'Acquisitions' : 'Acquisitions',
      path: '/Annonces?type=acquisition',
      icon: ArrowLeftFromLine,
      pageKey: 'annonces-acquisition'
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

  const adminTools = [
    {
      label: language === 'fr' ? 'Dashboard' : 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutGrid,
      pageKey: 'admin-dashboard'
    },
    {
      label: language === 'fr' ? 'Admin Annonces' : 'Admin Listings',
      path: '/admin/annonces',
      icon: ShieldCheck,
      pageKey: 'admin-annonces'
    },
    {
      label: language === 'fr' ? 'Admin Utilisateurs' : 'Admin Users',
      path: '/admin/users',
      icon: Users,
      pageKey: 'admin-users'
    },
    {
      label: language === 'fr' ? 'Outils' : 'Tools',
      path: '/Outils',
      icon: Zap,
      pageKey: 'outils'
    }
  ];

  const handleMenuItemClick = () => {
    closeMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-56 border-r border-gray-200 transition-transform duration-300 z-50 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: '#FBFBF9', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          aside::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Mobile Close Button */}
        <div className="md:hidden sticky top-0 flex items-center justify-between p-4 border-b border-gray-100" style={{ backgroundColor: '#FBFBF9' }}>
          <span className="font-display font-bold text-lg text-[#3B4759]">Menu</span>
          <button
            className="inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors p-2"
            onClick={closeMobile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-0 flex flex-col h-full font-sans text-sm font-medium">
          {/* Logo Section */}
          <div className="flex items-center justify-between px-4 py-4">
            <Link to="/" className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
            </Link>
          </div>

          <div className="flex-1">
          {/* EXPLORER Section */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 px-4 pt-2 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9AA3B2]">
                {language === 'fr' ? 'Explorer' : 'Explorer'}
              </span>
            </h3>
            <div className="space-y-1">
              {explorerItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    handleMenuItemClick();
                  }}
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                    currentPage === item.pageKey
                      ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] font-medium'
                      : 'text-[#111827] hover:bg-white/80 hover:text-[#3B4759]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {!isAdmin && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 px-4 pt-2 pb-3">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9AA3B2]">
                  {language === 'fr' ? 'Mon espace' : 'My Space'}
                </span>
              </h3>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <div key={item.page} className="relative">
                    <SidebarMenuItem
                      icon={item.icon}
                      label={item.label}
                      page={item.page}
                      isActive={currentPage === item.page.toLowerCase()}
                      onClick={handleMenuItemClick}
                    />
                    {item.page.toLowerCase() === 'messages' && unreadCount > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute top-2 right-3 bg-[#FF6B4A] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center cursor-help hover:bg-[#FF5530] transition-colors"
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
            </div>
          )}

          {/* Tools Section */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 px-4 pt-2 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9AA3B2]">
                {language === 'fr' ? 'Outils' : 'Tools'}
              </span>
            </h3>
            <div className="space-y-1">
              {isAdmin ? (
                adminTools.map((tool) => (
                  <button
                    key={tool.pageKey}
                    onClick={() => {
                      navigate(tool.path);
                      handleMenuItemClick();
                    }}
                    style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                      currentPage === tool.pageKey
                        ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] font-medium'
                        : 'text-[#111827] hover:bg-white/80 hover:text-[#3B4759]'
                    }`}
                  >
                    <tool.icon className="w-5 h-5" />
                    <span>{tool.label}</span>
                  </button>
                ))
              ) : (
                <>
                  <SidebarMenuItem
                    icon={Zap}
                    label={language === 'fr' ? 'Smart Matching' : 'Smart Matching'}
                    page="SmartMatching"
                    isActive={currentPage === 'smartmatching'}
                    onClick={handleMenuItemClick}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          disabled
                          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#C0C5D4] cursor-not-allowed transition-all duration-200 text-sm"
                        >
                          <Lock className="w-5 h-5" />
                          <span>{language === 'fr' ? 'Dataroom' : 'Dataroom'}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-900 text-white text-xs px-3 py-2 rounded-md">
                        <p>
                          {language === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="pb-4">
            <div className="px-4 pt-2 pb-3">
              <div className="h-px bg-gray-200" />
            </div>
            <div className="space-y-1">
              <SidebarMenuItem
                icon={Settings}
                label={language === 'fr' ? 'Paramètres' : 'Settings'}
                page="Settings"
                isActive={currentPage === 'settings'}
                onClick={handleMenuItemClick}
              />
            </div>
          </div>

          <div className="px-4 pt-2 pb-6 mt-auto">
            <div className="h-px bg-gray-200 mb-3" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-[#111827] hover:bg-white/80 hover:text-[#3B4759] transition-colors"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language === 'fr' ? 'Langue' : 'Language'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono uppercase">
                    {language}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr')} className="text-sm font-medium" style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                  🇫🇷 Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="text-sm font-medium" style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                  🇬🇧 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={async () => {
                await logout(false);
                navigate('/');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-xl text-sm text-[#111827] hover:bg-white/80 hover:text-[#3B4759] transition-colors"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
            >
              <LogOut className="w-4 h-4" />
              {language === 'fr' ? 'Déconnexion' : 'Logout'}
            </button>
          </div>
          </div>
        </div>
      </aside>
    </>
  );
}
