import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '@/components/i18n/LanguageContext';
import { SidebarProvider, useSidebar } from '@/lib/SidebarContext';
import { useAuth } from '@/lib/AuthContext';
import { 
  Building2, 
  MessageSquare, 
  Heart, 
  Users, 
  Menu, 
  X, 
  LogOut, 
  User,
  Globe,
  Plus,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

function LayoutContent({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, changeLanguage } = useLanguage();
  const { toggleMobile } = useSidebar();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(false);
  };

  const isActive = (page) => currentPageName === page;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        :root {
          --background: 28 20% 98%;
          --foreground: 220 13% 28%;
          --primary: 17 88% 60%;
          --coral: 17 88% 60%;
          --violet: 258 90% 66%;
          --gray-dark: 220 13% 28%;
          --gray-medium: 220 9% 46%;
        }
        
        body {
          color: hsl(var(--gray-dark));
        }
        
        .font-display {
          font-family: 'Sora', sans-serif;
        }
        
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        h1, h2, h3, h4 {
          font-family: 'Sora', sans-serif;
        }
      `}</style>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {user && currentPageName !== 'Home' && <Sidebar user={user} />}
        <main className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-[#3B4759] text-[#8A98AD] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-lg shadow-[#FF6B4A]/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">
                  CessionPro
                </span>
              </div>
              <p className="text-[#6B7A94] max-w-sm">
                {language === 'fr' 
                  ? "La plateforme de référence pour la cession et reprise d'entreprises."
                  : "The leading platform for business acquisitions and sales."}
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">
                {language === 'fr' ? 'Plateforme' : 'Platform'}
              </h4>
              <ul className="space-y-2">
                <li><Link to={createPageUrl('Annonces')} className="hover:text-white transition-colors">{t('businesses')}</Link></li>
                <li><Link to={createPageUrl('BuyersDirectory')} className="hover:text-white transition-colors">{t('buyers_directory')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">
                {language === 'fr' ? 'Contact' : 'Contact'}
              </h4>
              <p className="text-[#6B7A94]">contact@cessionpro.com</p>
            </div>
          </div>
          <div className="border-t border-[#4A5668] mt-12 pt-8 text-center text-sm">
            © {new Date().getFullYear()} CessionPro. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <SidebarProvider>
      <LanguageProvider>
        <LayoutContent currentPageName={currentPageName}>{children}</LayoutContent>
      </LanguageProvider>
    </SidebarProvider>
  );
}
